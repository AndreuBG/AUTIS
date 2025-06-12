import {ShowMyAlert} from "../js/my_alert.js";

class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.expanded = false;
        this.onExternalExpand = this.onExternalExpand.bind(this);
        this.availableUsers = [];
        this.projectMembers = new Set();
    }

    connectedCallback() {
        this.render();
        document.addEventListener('project-expanded', this.onExternalExpand);
    }

    disconnectedCallback() {
        document.removeEventListener('project-expanded', this.onExternalExpand);
    }

    onExternalExpand(event) {
        const card = this.shadowRoot.querySelector('.card');
        if (event.detail === null) {
            // Cuando se cierra cualquier tarjeta, todas vuelven a ser visibles
            card.classList.remove('hidden');
            card.style.zIndex = '0';
        } else if (event.detail !== this) {
            // Cuando se expande otra tarjeta, esta se oculta
            card.classList.add('hidden');
            card.style.zIndex = '0';
            if (this.expanded) {
                this.expanded = false;
                document.body.classList.remove('no-scroll');
                this.render();
            }
        } else {
            // Cuando esta tarjeta se expande
            card.classList.remove('hidden');
            card.style.zIndex = '9999';
        }
    }

    toggleDescription() {
        this.expanded = !this.expanded;

        if (this.expanded) {
            document.body.classList.add('no-scroll');
            document.dispatchEvent(new CustomEvent('project-expanded', {
                detail: this,
                bubbles: true,
                composed: true
            }));
        } else {
            document.body.classList.remove('no-scroll');
            document.dispatchEvent(new CustomEvent('project-expanded', {
                detail: null,
                bubbles: true,
                composed: true
            }));
        }
        this.render();
    }

    async fetchAvailableUsers() {
        try {
            const response = await fetch('/getUsers');
            const users = await response.json();
            // Remove this filter to show all users
            this.availableUsers = users;
            return this.availableUsers;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    async addMember(userId, roleId = 3) {
        try {
            const projectId = this.getAttribute('id');
            const numericUserId = parseInt(userId, 10);
            
            if (isNaN(numericUserId)) {
                throw new Error('ID de usuario inválido');
            }

            const response = await fetch('/addMemberToProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    projectId: projectId,
                    numericUserId: numericUserId,
                    roleId: roleId
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al añadir miembro');
            }

            this.projectMembers.add(userId);
            const currentMembers = parseInt(this.getAttribute('members') || '0');
            this.setAttribute('members', currentMembers + 1);
            
            // En lugar de hacer render() aquí, actualizamos solo la lista de miembros
            const membersGrid = this.shadowRoot.querySelector('.members-grid');
            if (membersGrid) {
                this.getCurrentMembers().then(members => {
                    membersGrid.innerHTML = members.map(member => `
                        <div class="member-entry">
                            <div class="member-details">
                                <div class="member-name">
                                    ${member.userDetails.firstName} ${member.userDetails.lastName}
                                </div>
                                <div class="member-login">@${member.userDetails.login}</div>
                            </div>
                            <button class="delete-member-btn" data-user-id="${member._links.principal.href.split('/').pop()}">×</button>
                        </div>
                    `).join('');

                    // Añadir listeners para los botones de eliminar
                    membersGrid.querySelectorAll('.delete-member-btn').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            if (confirm('¿Seguro que quieres eliminar este miembro del proyecto?')) {
                                await this.deleteMember(btn.dataset.userId);
                            }
                        });
                    });
                });
            }

            // Actualizar el contador de miembros en la tarjeta
            const memberCount = this.shadowRoot.querySelector('.member-count span');
            if (memberCount) {
                memberCount.textContent = currentMembers + 1;
            }
            ShowMyAlert('success', 'Miembro añadido exitosamente');
            return true;

        } catch (error) {
            console.error('Error:', error);
            ShowMyAlert('error', error.message);
            return false;
        }
    }

    async showMembersModal() {
        const users = await this.fetchAvailableUsers();
        const currentMembers = await this.getCurrentMembers();
        const currentMemberIds = currentMembers.map(member => 
            member._links.principal.href.split('/').pop()
        );

        const modal = document.createElement('div');
        modal.className = 'members-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Añadir Miembros</h3>
                <div class="users-list">
                    ${users.map(user => {
                        const isLocked = user.status === 'locked';
                        const isMember = currentMemberIds.includes(user.id.toString());
                        const statusClass = user.status === 'active' ? 'active' : 
                                          user.status === 'locked' ? 'locked' : 'registered';
                        
                        return `
                            <div class="user-item ${isLocked ? 'locked' : ''} ${isMember ? 'existing-member' : ''}" data-user-id="${user.id}">
                                <div class="user-info">
                                    <span class="user-name">${user.name}</span>
                                    <span class="user-status ${statusClass}">
                                        ${user.status === 'active' ? '✓ Activo' : 
                                          user.status === 'locked' ? '✕ Bloqueado' : 
                                          '○ Registrado'}
                                    </span>
                                </div>
                                ${isMember ? 
                                    `<span class="status-badge member">Ya es miembro</span>` : 
                                    `<button class="add-user-btn ${statusClass}" ${isLocked ? 'disabled' : ''}>
                                        ${isLocked ? '✕ Bloqueado' : '+ Añadir'}
                                    </button>`
                                }
                            </div>
                        `;
                    }).join('')}
                </div>
                <button class="close-modal-btn">Cerrar</button>
            </div>
        `;

        // Actualizar estilos para mantener consistencia
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .user-item {
                padding: 12px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .user-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .user-status {
                font-size: 0.85em;
                padding: 2px 6px;
                border-radius: 3px;
            }
            .user-status.active { 
                background: #e6ffe6; 
                color: #029302;
            }
            .user-status.locked { 
                background: #ffe6e6; 
                color: #c60009;
            }
            .user-status.registered { 
                background: #f0f0f0; 
                color: #666;
            }
            .add-user-btn.active {
                background: #029302;
            }
            .add-user-btn.locked {
                background: #c60009;
            }
            .add-user-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            .status-badge.member {
                background: #f0f0f0;
                color: #666;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 0.9em;
            }
            .existing-member {
                background: #f8f8f8;
            }
        `;

        modal.appendChild(styleEl);
        this.shadowRoot.appendChild(modal);

        modal.querySelector('.close-modal-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelectorAll('.add-user-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userItem = e.target.closest('.user-item');
                const userId = userItem.dataset.userId;
                const success = await this.addMember(userId);
                
                if (success) {
                    // Solo actualizamos el estado visual del usuario en el modal
                    userItem.classList.add('existing-member');
                    userItem.innerHTML = `
                        <div class="user-info">
                            <span class="user-name">${userItem.querySelector('.user-name').textContent}</span>
                            <span class="user-status ${userItem.querySelector('.user-status').classList[1]}">
                                ${userItem.querySelector('.user-status').textContent}
                            </span>
                        </div>
                        <span class="status-badge member">Ya es miembro</span>
                    `;
                }
            });
        });
    }

    async getCurrentMembers() {
        try {
            const projectId = this.getAttribute('id');
            const response = await fetch(`/getCurrentMembers/${projectId}`);

            if (!response.ok) return [];
            
            const data = await response.json();

            const members = data._embedded?.elements || [];

            // Obtener detalles de cada usuario
            const membersWithDetails = await Promise.all(members.map(async (member) => {
                if (!member._links?.principal?.href) return null;
                const userId = member._links.principal.href.split('/').pop();
                
                try {
                    const userResponse = await fetch(`/getUserData/${userId}`, {
                        headers: {
                            'Authorization': 'Basic ' + btoa(`apikey:${localStorage.getItem('token')}`),
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!userResponse.ok) return null;
                    
                    const userData = await userResponse.json();
                    return {
                        ...member,
                        userDetails: {
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            login: userData.login
                        }
                    };
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    return null;
                }
            }));

            return membersWithDetails.filter(m => m !== null);
        } catch (error) {
            console.error('Error fetching members:', error);
            return [];
        }
    }

    async renderMembersList() {
        const members = await this.getCurrentMembers();
        const membersList = this.shadowRoot.querySelector('.current-members-list');
        
        if (!membersList) return;

        membersList.innerHTML = members.length ? members.map(member => `
            <div class="member-item">
                <img src="/img/user.png" alt="Usuario" class="member-avatar">
                <div class="member-info">
                    <span class="member-name">${member._links.principal.title}</span>
                    <span class="member-role">${member._links.roles[0]?.title || 'Sin rol'}</span>
                </div>
            </div>
        `).join('') : '<p class="no-members">No hay miembros en este proyecto</p>';
    }

    getRelatedTasksHtml(projectName) {
        // Usar las tareas globales almacenadas en window.todasLasTareas
        return window.todasLasTareas
            .filter(task => task.project === projectName)
            .map(task => {
                const taskElement = document.createElement('task-card');
                taskElement.setAttribute('id', task.id);
                taskElement.setAttribute('type', task.type);
                taskElement.setAttribute('subject', task.subject);
                taskElement.setAttribute('description', task.description);
                taskElement.setAttribute('startDate', task.startDate);
                taskElement.setAttribute('dueDate', task.dueDate);
                taskElement.setAttribute('project', task.project);
                return taskElement.outerHTML;
            })
            .join('');
    }

    async deleteMember(userId) {
        try {
            const projectId = this.getAttribute('id');
            
            // Primero obtener el ID de la membresía usando el ID del usuario
            const membershipsResponse = await fetch(`/getCurrentMembers/${projectId}`)

            if (!membershipsResponse.ok) throw new Error('Error al buscar la membresía');
            
            const data = await membershipsResponse.json();
            const membership = data._embedded?.elements?.find(m => 
                m._links?.principal?.href.split('/').pop() === userId
            );

            if (!membership) throw new Error('No se encontró la membresía');

            // Ahora sí eliminar usando el ID de la membresía
            const membershipId = membership.id;
            const deleteResponse = await fetch(`/removeMemberFromProject/${membershipId}`, {
                method: 'DELETE'
            });

            if (!deleteResponse.ok) {
                throw new Error('Error al eliminar miembro');
            }

            this.projectMembers.delete(userId);
            const currentMembers = parseInt(this.getAttribute('members') || '0');
            this.setAttribute('members', currentMembers - 1);

            // Actualizar el contador de miembros en la tarjeta
            const memberCount = this.shadowRoot.querySelector('.member-count span');
            if (memberCount) {
                memberCount.textContent = currentMembers - 1;
            }

            // Actualizar la lista de miembros
            const membersGrid = this.shadowRoot.querySelector('.members-grid');
            if (membersGrid) {
                this.getCurrentMembers().then(members => {
                    membersGrid.innerHTML = members.map(member => `
                        <div class="member-entry">
                            <div class="member-details">
                                <div class="member-name">
                                    ${member.userDetails.firstName} ${member.userDetails.lastName}
                                </div>
                                <div class="member-login">@${member.userDetails.login}</div>
                            </div>
                            <button class="delete-member-btn" data-user-id="${member._links.principal.href.split('/').pop()}">×</button>
                        </div>
                    `).join('');

                    // Añadir listeners para los botones de eliminar
                    membersGrid.querySelectorAll('.delete-member-btn').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            if (confirm('¿Seguro que quieres eliminar este miembro del proyecto?')) {
                                await this.deleteMember(btn.dataset.userId);
                            }
                        });
                    });
                });
            }
            ShowMyAlert('success', 'Miembro eliminado exitosamente');
            return true;
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
            return false;
        }
    }

    render() {
        const active = this.getAttribute('active') === 'true';
        const name = this.getAttribute('name');
        const fullDescription = this.getAttribute('description') || '';
        const members = this.getAttribute('members') || '0';

        const maxLength = 100;
        const shortDescription = fullDescription.length > maxLength
            ? fullDescription.slice(0, maxLength) + '...'
            : fullDescription;

        const descriptionToShow = this.expanded ? fullDescription : shortDescription;
        const descriptionClass = this.expanded ? 'descripcion expanded' : 'descripcion collapsed';
        const cardClass = this.expanded ? 'card expanded' : 'card collapsed';

        const relatedTasksHtml = this.expanded
            ? `<div class="related-tasks">${this.getRelatedTasksHtml(name)}</div>`
            : '';

        this.shadowRoot.innerHTML = `
            <style>
            .related-tasks {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
            }

            .related-tasks task-card {
                flex: 1 1 calc(50% - 60px); 
                max-width: calc(50% - 40px);
            }

            @media (max-width: 700px) {
                .card.expanded {
                    position: fixed;
                    top: 90px;
                    left: 0;
                    transform: none;
                    width: 100vw;
                    min-width: 0;
                    max-width: 100vw;
                    height: 100vw;         /* Hace el contenedor cuadrado */
                    max-height: 100vw;     /* Limita el alto igual al ancho */
                    overflow-y: auto;
                    border-radius: 0;
                    border-bottom: 20px;
                    padding: 10px 4vw 20px 4vw;
                    margin-bottom: 0 !important;
                    box-sizing: border-box;
                    background: white;
                    z-index: 9999;
                }
                .related-tasks {
                    flex-direction: column;
                    padding-bottom: 20px;
                    gap: 8px;
                }
                .related-tasks task-card {
                    min-width: 90%;
                    max-width: 90%;
                    flex-basis: 90%;
                    font-size: 0.85em;
                    padding: 6px !important;
                    margin-bottom: 6px !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
                }
            }
    
            
            body.no-scroll {
                overflow: hidden;
            }

            :host {
                display: block;
                position: relative;
                z-index: 0;
            }

            .card {
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 15px;
                margin: 10px auto;
                width: 300px;
                background-color: #ececec;
                box-sizing: border-box;
                font-family: Arial, sans-serif;
                cursor: pointer;
                overflow: hidden;
                position: relative;
                z-index: 0;
                user-select: none;
                transition: 
                    transform 0.3s cubic-bezier(.4,0,.2,1),
                    box-shadow 0.3s cubic-bezier(.4,0,.2,1),
                    z-index 0.1s linear;
            }

            .card.hidden {
                display: none;
            }

            .card:hover:not(.expanded):not(.hidden) {
                transform: scale(1.05);
                box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                z-index: 1;
            }

            .card.collapsed {
                height: 200px;
                width: 300px;
                overflow: hidden;
                position: relative;  // Asegurar posicionamiento relativo
                display: flex;
                flex-direction: column;
            }

            .card.expanded {
                position: fixed;
                top: 100px;
                bottom: 10px;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                width: 95vw;
                min-width: 0;
                max-width: 1100px; /* <-- Cambiado de 700px a 1100px */
                height: auto;
                max-height: calc(100vh - 40px); /* Deja margen inferior */
                overflow-y: auto;
                border-radius: 12px;
                border: 2px solid #ccc;
                padding: 10px 4vw 20px 4vw;
                margin-bottom: 20px !important;
                box-sizing: border-box;
                background: white;
                z-index: 9999;
                box-shadow: 0 4px 24px rgba(0,0,0,0.10);
            }

            .overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9998;
            }

            .card.expanded + .overlay {
                display: block;
            }

            task-card {
                display: block;
                margin-bottom: 50px;
                margin-top: 10px;
            }

            .card h2 {
                font-size: 1.5em;
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .estado {
                font-size: 1em;
                margin: 10px 0;
            }

            .descripcion {
                font-size: 1em;
                margin: 10px 0;
                white-space: normal;
                flex-grow: 1;
                overflow-wrap: break-word;
            }

            .descripcion.collapsed {
                max-height: 100px;
                overflow-y: auto;
            }

            .descripcion.expanded {
                max-height: none;
            }

            .card b {
                color: ${active ? '#029302' : '#c60009'};
            }

            .toggle-arrow {
                position: absolute;
                left: 10px;      
                bottom: 5px;
                font-size: 1.8em;
                color: rgba(85, 84, 84, 0.3);
                user-select: none;
                pointer-events: none;
                transition: color 0.3s ease;
            }
            .card.collapsed:hover .toggle-arrow {
                color: rgba(0,0,0,0.6);
            }

            .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 1.5em;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 3px;
                width: 28px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                font-weight: bold;
                color: rgba(0, 0, 0, 0.5);
                cursor: pointer;
                user-select: none;
                transition: 
                    background-color 0.2s ease, 
                    color 0.2s ease,
                    box-shadow 0.2s ease;
                box-shadow: none;
                z-index: 10000;
            }
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.8);
                color: #c60009;
                box-shadow: 0 0 5px rgba(198, 0, 9, 0.6);
            }

            .trash-icon {
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 25px;
                height: 25px;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: auto; 
                z-index: 10;
                color: rgba(0,0,0,0.3);
            }
            .card.collapsed:hover .trash-icon {
                opacity: 1;
            }

            .member-count {
                font-size: 0.9em;
                color: #333;
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 20px;
                margin-bottom: 10px;
            }

            .card.collapsed .member-count {
                position: absolute;
                bottom: 10px;
                left: 10px;
                padding: 6px 10px;
                z-index: 10;
                margin: 0;
            }


            .members-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
            }

            .modal-content {
                background: white;
                padding: 20px;
                border-radius: 8px;
                width: 80%;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
            }

            .users-list {
                margin: 20px 0;
            }

            .user-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border-bottom: 1px solid #eee;
            }

            .add-user-btn {
                padding: 5px 10px;
                background: #0a28d1;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .add-user-btn:hover {
                background: #081d94;
            }

            .add-members-btn {
                margin-top: 10px;
                padding: 8px 16px;
                background: #0a28d1;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .add-members-btn:hover {
                background: #081d94;
            }

            .close-modal-btn {
                margin-top: 10px;
                padding: 8px 16px;
                background: #666;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .current-members {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }
            .current-members h3 {
                color: #333;
                margin-bottom: 15px;
            }
            .current-members-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
            }
            .member-item {
                display: flex;
                align-items: center;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 8px;
                gap: 10px;
            }
            .member-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
            }
            .member-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .member-name {
                font-weight: bold;
                color: #0a28d1;
            }
            .member-role {
                font-size: 0.85em;
                color: #666;
            }
            .no-members {
                color: #666;
                font-style: italic;
                text-align: center;
                grid-column: 1/-1;
                padding: 20px;
            }

            .members-list {
                margin-top: 20px;
                padding: 6px 8px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .members-list h3 {
                color: #333;
                margin-bottom: 15px;
                font-size: 1.1em;
            }
            .members-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 10px;
            }
            .member-entry {
                padding: 10px;
                background: white;
                border-radius: 6px;
                border: 1px solid #eee;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .member-details {
                font-size: 0.9em;
            }
            .member-name {
                font-weight: bold;
                color: #0a28d1;
            }
            .member-login {
                color: #666;
                font-style: italic;
            }
            .delete-member-btn {
                background: none;
                border: none;
                color: #c60009;
                font-size: 1.2em;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                opacity: 0.6;
                transition: all 0.2s ease;
            }
            
            .delete-member-btn:hover {
                opacity: 1;
                background: #ffe6e6;
            }
            
            .member-entry {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            </style>

            <div class="${cardClass}" tabindex="0" role="button" aria-expanded="${this.expanded}">
                <img class="trash-icon" src="/img/papelera.png" alt="Eliminar proyecto" />
                <h2 title="${name}">${name}</h2>
                <hr>
                <p class="estado">Estado: <b>${active ? "Activo" : "Inactivo"}</b></p>
                <p class="${descriptionClass}" title="${fullDescription}">
                    <div class="descripcion-inner">${descriptionToShow}</div>
                </p>

                ${!this.expanded && fullDescription.length > maxLength
            ? `<span class="toggle-arrow" aria-hidden="true">▼</span>`
            : ''}

                ${this.expanded
            ? `<span class="close-btn" role="button" aria-label="Cerrar descripción">×</span>`
            : ''}

                ${relatedTasksHtml}

                <div class="member-count">
                    👥 Miembros: <span>${members}</span>
                </div>
                ${this.expanded ? `
                    <div class="members-list">
                        <h3>Lista de Miembros</h3>
                        <div class="members-grid"></div>
                    </div>
                    <button class="add-members-btn">Añadir Miembros</button>
                ` : ''}
            </div>
            ${this.expanded ? '<div class="overlay"></div>' : ''}
        `;

        // Añadir estilos para la lista de miembros
        this.shadowRoot.querySelector('style').textContent += `
            .members-list {
                margin-top: 20px;
                padding: 6px 8px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .members-list h3 {
                color: #333;
                margin-bottom: 15px;
                font-size: 1.1em;
            }
            .members-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 10px;
            }
            .member-entry {
                padding: 10px;
                background: white;
                border-radius: 6px;
                border: 1px solid #eee;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .member-details {
                font-size: 0.9em;
            }
            .member-name {
                font-weight: bold;
                color: #0a28d1;
            }
            .member-login {
                color: #666;
                font-style: italic;
            }
        `;

        // Cargar y mostrar los miembros si está expandido
        if (this.expanded) {
            const membersGrid = this.shadowRoot.querySelector('.members-grid');
            this.getCurrentMembers().then(members => {
                membersGrid.innerHTML = members.map(member => `
                    <div class="member-entry">
                        <div class="member-details">
                            <div class="member-name">
                                ${member.userDetails.firstName} ${member.userDetails.lastName}
                            </div>
                            <div class="member-login">@${member.userDetails.login}</div>
                        </div>
                        <button class="delete-member-btn" data-user-id="${member._links.principal.href.split('/').pop()}">×</button>
                    </div>
                `).join('');

                // Añadir listeners para los botones de eliminar
                membersGrid.querySelectorAll('.delete-member-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        if (confirm('¿Seguro que quieres eliminar este miembro del proyecto?')) {
                            await this.deleteMember(btn.dataset.userId);
                        }
                    });
                });
            });
        }

        const cardEl = this.shadowRoot.querySelector('.card');
        cardEl.addEventListener('click', () => {
            if (!this.expanded) this.toggleDescription();
        });

        const closeBtn = this.shadowRoot.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDescription();
            });
        }

        if (this.expanded) {
            this.shadowRoot.querySelector('.add-members-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showMembersModal();
            });
        }

        const trashIcon = this.shadowRoot.querySelector('.trash-icon');
        if (trashIcon) {
            trashIcon.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!confirm('¿Seguro que quieres eliminar este proyecto?')) return;
                const projectId = this.getAttribute('id');
                try {
                    const res = await fetch(`/projects/${projectId}`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        ShowMyAlert('success', 'Proyecto eliminado exitosamente');
                        this.remove();
                    } else {
                        ShowMyAlert('error', 'No se pudo eliminar el proyecto');
                    }
                } catch (err) {
                    ShowMyAlert('error', 'Error de red al eliminar el proyecto');
                }
            });
        }

        // Renderizar la lista de miembros actuales si está expandido
        if (this.expanded) {
            this.renderMembersList();
        }
    }
}

customElements.define('project-card', ProjectCard);
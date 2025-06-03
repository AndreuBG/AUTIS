class TabButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    connectedCallback() {
        if (this.hasAttribute('active')) {
            // Ocultar todos los grupos primero
            const groups = document.querySelectorAll('[id$="-group"]');
            groups.forEach(group => group.style.display = 'none');

            // Ocultar todos los filtros
            const filtros = document.querySelectorAll('.filtro-container');
            filtros.forEach(filtro => filtro.style.display = 'none');

            // Mostrar el grupo activo
            const targetId = this.getAttribute('target');
            const targetGroup = document.getElementById(targetId);
            const filtroId = 'filtro-' + targetId.split('-')[0];
            const filtroContainer = document.getElementById(filtroId);
            
            if (targetGroup) targetGroup.style.display = 'block';
            if (filtroContainer) filtroContainer.style.display = 'block';
        }
    }

    handleClick() {
        // Ocultar todos los grupos
        const groups = document.querySelectorAll('[id$="-group"]');
        groups.forEach(group => group.style.display = 'none');

        // Ocultar todos los filtros
        const filtros = document.querySelectorAll('.filtro-container');
        filtros.forEach(filtro => filtro.style.display = 'none');

        // Mostrar el grupo seleccionado
        const targetId = this.getAttribute('target');
        const targetGroup = document.getElementById(targetId);
        if (targetGroup) {
            targetGroup.style.display = 'block';
        }

        // Mostrar el filtro correspondiente si existe
        const filtroId = 'filtro-' + targetId.split('-')[0];
        const filtroContainer = document.getElementById(filtroId);
        if (filtroContainer) {
            filtroContainer.style.display = 'block';
        }

        // Actualizar estado activo del botón
        document.querySelectorAll('tab-button').forEach(button => {
            button.removeAttribute('active');
        });
        this.setAttribute('active', 'true');
    }

    render() {
        this.textContent = this.innerHTML;
    }
}

customElements.define('tab-button', TabButton);
export default TabButton;
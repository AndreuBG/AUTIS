class TimeEntriesTable extends HTMLElement {
    async connectedCallback() {
        const response = await fetch('/getTimeEntries');

        const timeEntries = await response.json();

        const grouped = {};
        for (const entry of timeEntries) {
            // Usa el título del usuario si existe
            const user = entry._links && entry._links.user && entry._links.user.title
                ? entry._links.user.title
                : 'Sin usuario';
            if (!grouped[user]) grouped[user] = [];
            grouped[user].push(entry);
        }

        const maxEntries = Math.max(...Object.values(grouped).map(arr => arr.length));

        let tableHeader = `
            <tr>
                <th style="min-width:120px;">Usuario</th>
                <th>Tareas</th>
                <th style="text-align:right;min-width:90px;"></th>
            </tr>
        `;

        let tableBody = '';
        for (const [user, entries] of Object.entries(grouped)) {
            // Suma total de horas
            let totalHoras = entries.reduce((sum, entry) => {
                let h = entry.hours ? parseFloat(entry.hours.replace(",", ".").replace(/^pt/i, "")) : 0;
                return sum + (isNaN(h) ? 0 : h);
            }, 0);

            tableBody += `
                <tr>
                    <td data-label="Usuario" style="display:flex;align-items:center;gap:10px;">
                        <img src="/img/user.png" alt="user" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:1.5px solid #e2dcde;background:#fff;margin-right:8px;">
                        <span>${user}</span>
                    </td>
                    <td data-label="Tareas">
                        <div>
            `;
            for (const entry of entries) {
                tableBody += `
                    <div class="tarea-card" style="min-width:140px; background:#fff; border-radius:6px; box-shadow:0 1px 4px #e2dcde; padding:8px 12px; margin-bottom:0; transition: box-shadow 0.2s, transform 0.2s; display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                        <div>
                            ${entry.comment && entry.comment.raw ? '<strong style="color:#09348b;">' + entry.comment.raw + '</strong><br>' : ''}
                            <span style="color:#FF9800;">${entry._links.project && entry._links.project.title ? entry._links.project.title : ''}</span>
                        </div>
                        <div style="white-space:nowrap; font-weight:bold; color:#09348b; margin-left:8px;">
                            ${entry.hours ? entry.hours.replace(/^pt/i, '') : ''}
                        </div>
                    </div>
                `;
                }
                tableBody += `</div></td>
                <td style="text-align:right; font-weight:bold; color:#09348b;">
                <div style="
                    display: inline-flex;
                    align-items: center;
                    background: #fff;
                    border-radius: 6px;
                    box-shadow: 0 1px 4px #e2dcde;
                    padding: 8px 14px;
                    margin-left: 8px;
                    font-weight: bold;
                    color: #09348b;
                    gap: 6px;
                ">
                <img src="/img/reloj.png" alt="reloj" style="width:18px;height:18px;vertical-align:middle;margin-right:4px;">
                ${
                    Number.isInteger(totalHoras)
                        ? totalHoras + 'H'
                        : totalHoras.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 2}) + 'H'
                }
                </div>
                </td>
            </tr>`;
        }

        let usersCards = '';
        for (const [user, entries] of Object.entries(grouped)) {
            let totalHoras = entries.reduce((sum, entry) => {
                let h = entry.hours ? parseFloat(entry.hours.replace(",", ".").replace(/^pt/i, "")) : 0;
                return sum + (isNaN(h) ? 0 : h);
            }, 0);

            usersCards += `
                <div class="user-card">
                    <div class="user-main">
                        <div class="user-header">
                            <img src="/img/user.png" alt="user" class="user-avatar">
                            <span class="user-name">${user}</span>
                        </div>
                        <div class="user-tasks">
                            ${entries.map(entry => `
                                <div class="tarea-card">
                                    <div>
                                        ${entry.comment && entry.comment.raw ? '<strong style="color:#09348b;">' + entry.comment.raw + '</strong><br>' : ''}
                                        <span style="color:#FF9800;">${entry._links.project && entry._links.project.title ? entry._links.project.title : ''}</span>
                                    </div>
                                    <div style="white-space:nowrap; font-weight:bold; color:#09348b; margin-left:8px;">
                                        ${entry.hours ? entry.hours.replace(/^pt/i, '') : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="user-total">
                        <img src="/img/reloj.png" alt="reloj" style="width:18px;height:18px;vertical-align:middle;margin-right:4px;">
                        ${
                            Number.isInteger(totalHoras)
                                ? totalHoras + 'H'
                                : totalHoras.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 2}) + 'H'
                        }
                    </div>
                </div>
            `;
        }

        this.innerHTML = `
            <style>
                .users-grid {
                    display: flex;
                    flex-direction: column; 
                    gap: 28px;
                    justify-content: center;
                    margin: 24px auto 20px auto;
                    max-width: 1400px;
                    width: 100%;
                }
                .user-card {
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px #e2dcde;
                    padding: 24px 20px 18px 20px;
                    width: 100%;
                    max-width: 100%;
                    display: flex;
                    flex-direction: row; 
                    align-items: flex-start;
                    gap: 18px;
                    box-sizing: border-box;
                    justify-content: space-between;
                }
                .user-main {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 18px;
                    flex: 1;
                    min-width: 0;
                }
                .user-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 0; 
                    white-space: nowrap;
                }
                .user-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #e2dcde;
                    background: #fff;
                }
                .user-name {
                    font-weight: bold;
                    color: #09348b;
                    font-size: 1.1em;
                }
                .user-tasks {
                    display: flex;
                    flex-direction: row;
                    gap: 10px;
                    overflow-x: auto;
                    padding-bottom: 4px;
                    flex: 1;
                    min-width: 0;
                }
                .tarea-card {
                    min-width: 140px;
                    background: #e9e9e9; 
                    border-radius: 6px;
                    box-shadow: 0 1px 4px #e2dcde;
                    padding: 8px 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 8px;
                }
                .tarea-card:hover {
                    box-shadow: 0 4px 16px #c7b7b7;
                    transform: translateY(-3px) scale(1.03);
                    background: #d6d6d6; 
                    cursor: pointer;
                }
                .user-total {
                    margin-top: 0;
                    margin-left: 12px;
                    font-weight: bold;
                    color: #09348b;
                    background: #e9e9e9; 
                    border-radius: 6px;
                    box-shadow: 0 1px 4px #e2dcde;
                    padding: 8px 14px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    align-self: center;
                    white-space: nowrap;
                }
                .time-entries-title {
                    text-align: center;
                    color: #09348b;
                    margin-bottom: 24px;
                    font-weight: bold;
                    font-size: 20px;
                }
                @media (max-width: 900px) {
                    .users-grid {
                        padding-left: 12px;
                        padding-right: 12px;
                    }
                    .user-card, .user-main {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                    .user-tasks {
                        flex-direction: column;
                        width: 100%;
                        gap: 10px;
                        overflow-x: unset; /* Quita el scroll horizontal */
                    }
                    .tarea-card {
                        min-width: 0;
                        width: 100%;
                    }
                    .user-total {
                        margin-left: 0;
                        margin-top: 10px;
                        align-self: flex-end;
                    }
                }
            </style>
            <h2 class="time-entries-title">Tareas de hoy</h2>
            <div class="users-grid">
                ${usersCards}
            </div>
        `;
    }
}
customElements.define('time-entries-table', TimeEntriesTable);
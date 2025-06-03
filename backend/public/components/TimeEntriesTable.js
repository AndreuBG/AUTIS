class TimeEntriesTable extends HTMLElement {
    async connectedCallback() {
        const response = await fetch('/getTimeEntries');
        const timeEntries = await response.json();

        this.innerHTML = `
            <style>
                .time-entries-wrapper {
                    width: 100%;
                    overflow-x: auto;
                    margin: 24px 0 32px 0;
                    padding-right: 16px;
                    box-sizing: border-box;
                }
                .time-entries-table {
                    width: 100%;
                    min-width: 600px;
                    border-collapse: collapse;
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    border-radius: 8px;
                    overflow: hidden;
                    font-size: 1em;
                }
                .time-entries-table th, .time-entries-table td {
                    padding: 10px 14px;
                    text-align: left;
                    white-space: nowrap;
                }
                .time-entries-table th {
                    background: #0a28d1;
                    color: #fff;
                    font-weight: bold;
                    border-bottom: 2px solid #0a28d1;
                }
                .time-entries-table tr:nth-child(even) {
                    background: #f4f6fa;
                }
                .time-entries-table tr:hover {
                    background: #e2e8f0;
                }
                .time-entries-table td {
                    border-bottom: 1px solid #e0e0e0;
                }
                .time-entries-title {
                    color: #0a28d1;
                    margin: 24px 8px 16px 10px;
                    font-size: 1.4em;
                    font-weight: bold;
                }
                @media (max-width: 700px) {
                    .time-entries-table, .time-entries-table thead, .time-entries-table tbody, .time-entries-table tr, .time-entries-table th, .time-entries-table td {
                        display: block;
                        width: 100%;
                    }
                    .time-entries-table thead {
                        display: none;
                    }
                    .time-entries-table tr {
                        margin-bottom: 16px;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.07);
                        border-radius: 6px;
                        background: #fff;
                        padding: 10px 0;
                    }
                    .time-entries-table td {
                        border: none;
                        position: relative;
                        padding-left: 50%;
                        white-space: normal;
                        min-height: 32px;
                    }
                    .time-entries-table td:before {
                        position: absolute;
                        left: 16px;
                        top: 10px;
                        width: 45%;
                        white-space: normal;
                        font-weight: bold;
                        color: #0a28d1;
                        content: attr(data-label);
                    }
                }
            </style>
            <h2 class="time-entries-title">Entradas de Tiempo</h2>
            <div class="time-entries-wrapper">
                <table class="time-entries-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Proyecto</th>
                            <th>Usuario</th>
                            <th>Horas</th>
                            <th>Comentarios</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${timeEntries.map(entry => `
                            <tr>
                                <td data-label="ID">${entry.id}</td>
                                <td data-label="Proyecto">${entry._links.project && entry._links.project.title ? entry._links.project.title : ''}</td>
                                <td data-label="Usuario">${entry._links.user && entry._links.user.title ? entry._links.user.title : ''}</td>
                                <td data-label="Horas">${entry.hours}</td>
                                <td data-label="Comentarios">${entry.comment && entry.comment.raw ? entry.comment.raw : ''}</td>
                                <td data-label="Fecha">${entry.spentOn || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}
customElements.define('time-entries-table', TimeEntriesTable);
import { BaseComponent } from './base_component.js';

export class TabComponent extends BaseComponent {
    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    handleClick = () => {
        // Ocultar todos los grupos
        document.querySelectorAll('[id$="-group"]').forEach(group => {
            group.style.display = 'none';
        });

        const targetId = this.getAttribute('target');
        const targetGroup = document.getElementById(targetId);
        if (targetGroup) {
            targetGroup.style.display = 'block';
        }

        // Actualizar estado activo de los botones
        document.querySelectorAll('tab-component').forEach(tab => {
            tab.removeAttribute('active');
        });
        this.setAttribute('active', 'true');
    }

    connectedCallback() {
        this.render();
        if (this.getAttribute('active') === 'true') {
            this.handleClick();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${BaseComponent.styles}
                :host {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 20px;
                    border: 2px solid #CC6204;
                    background-color: #E2DCDE;
                    color: #330F0A;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1.4em;
                    transition: all 0.3s ease;
                    min-width: 150px;
                    min-height: 55px; /* aquí controlas la altura */
                    text-align: center;
                    font-weight: 500;
                }

                :host(:hover) {
                    background-color: #F1DAC4;
                    transform: translateY(-2px);
                }

                :host([active]) {
                    background-color: #CC6204;
                    color: white;
                }
            </style>
            <slot></slot>
        `;
    }
}

customElements.define('tab-component', TabComponent);
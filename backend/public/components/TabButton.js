class TabButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    connectedCallback() {
        if (this.hasAttribute('active')) {
            const groups = document.querySelectorAll('[id$="-group"]');
            groups.forEach(group => group.style.display = 'none');

            const filtros = document.querySelectorAll('.filtro-container');
            filtros.forEach(filtro => filtro.style.display = 'none');

            const targetId = this.getAttribute('target');
            const targetGroup = document.getElementById(targetId);
            const filtroId = 'filtro-' + targetId.split('-')[0];
            const filtroContainer = document.getElementById(filtroId);
            
            if (targetGroup) targetGroup.style.display = 'block';
            if (filtroContainer) filtroContainer.style.display = 'block';
        }
    }

    handleClick() {
        const groups = document.querySelectorAll('[id$="-group"]');
        groups.forEach(group => group.style.display = 'none');

        const filtros = document.querySelectorAll('.filtro-container');
        filtros.forEach(filtro => filtro.style.display = 'none');

        const targetId = this.getAttribute('target');
        const targetGroup = document.getElementById(targetId);
        if (targetGroup) {
            targetGroup.style.display = 'block';
        }

        const filtroId = 'filtro-' + targetId.split('-')[0];
        const filtroContainer = document.getElementById(filtroId);
        if (filtroContainer) {
            filtroContainer.style.display = 'block';
        }

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
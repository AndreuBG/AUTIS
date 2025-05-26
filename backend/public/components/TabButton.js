class TabButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', this.handleClick);
    }

    handleClick() {
        const groups = document.querySelectorAll('[id$="-group"]');
        groups.forEach(group => group.style.display = 'none');

        const targetId = this.getAttribute('target');
        const targetGroup = document.getElementById(targetId);
        if (targetGroup) {
            targetGroup.style.display = 'block';
        }

        document.querySelectorAll('tab-button').forEach(button => {
            button.removeAttribute('active');
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
        this.textContent = this.innerHTML;
    }
}

customElements.define('tab-button', TabButton);
export default TabButton;
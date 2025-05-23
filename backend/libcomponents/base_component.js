export class BaseComponent extends HTMLElement { 
    constructor() { 
        super();    
        this.attachShadow({ mode: 'open' });   
        this.render();  
    }

    static get styles() {

        return `
            :host {
                font-family: 'Arial', sans-serif;
                --primary-color: #6200ea;
                --secondary-color: #03dac6;
                --on-primary-color: #4500b5;
                --text-color: #333;
                --background-color: #fff;
            }

            * {
                box-sizing: border-box;
            }
        `;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${BaseComponent.styles}</style>
            <slot></slot>
        `;
    }
}

customElements.define('base-component', BaseComponent);
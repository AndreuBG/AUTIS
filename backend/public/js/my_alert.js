class MyAlert extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        
        // Establir valors per defecte
        this.type = "info"; // success, error, warning, info
        this.message = "Missatge per defecte";
        this.timeout = 5000; // 5 segons abans de desaparèixer
    }

    static get observedAttributes() {
        return ["type", "message", "timeout"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "type") this.type = newValue;
        if (name === "message") this.message = newValue;
        if (name === "timeout") this.timeout = parseInt(newValue);
        this.render();
    }

    connectedCallback() {
        this.render();

        // Tancar el missatge automàticament després d'un temps
        setTimeout(() => this.remove(), this.timeout);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 120px;
                    right: 20px;
                    min-width: 320px;
                    min-height: 50px;
                    background: ${this.getBackgroundColor()};
                    color: white;
                    padding: 32px 32px;
                    border-radius: 12px;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
                    font-family: Arial, sans-serif;
                    font-size: 1.1em;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    animation: fadeIn 0.3s ease-out;
                    z-index: 9999;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .icon {
                    font-size: 24px;
                    padding-left: 15px;
                }

                .close-btn {
                    margin-left: auto;
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                }
            </style>

            <span class="icon">${this.getIcon()}</span>
            <span>${this.message}</span>
            <button class="close-btn">&times;</button>
        `;

        this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => this.remove());
    }

    getBackgroundColor() {
        switch (this.type) {
            case "success": return "#2ecc71";
            case "error": return "#e74c3c";
            case "warning": return "#f39c12";
            case "info": return "#3498db";
            default: return "#95a5a6";
        }
    }

    getIcon() {
        switch (this.type) {
            case "success": return " ✔";
            case "error": return " ❌";
            case "warning": return " ⚠️";
            case "info": return " ℹ️";
            default: return " 💬";
        }
    }
}

// Registrem el component personalitzat
customElements.define("my-alert", MyAlert);

// Funció global per cridar el missatge com un alert
export function ShowMyAlert(type, message, options = {}) {
    const alertBox = document.createElement("my-alert");
    alertBox.setAttribute("type", type);
    alertBox.setAttribute("message", message);
    if (options.timeout) alertBox.setAttribute("timeout", options.timeout);

    document.body.appendChild(alertBox);
}

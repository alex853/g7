class CASMessagesPanel {
    constructor(display) {
        this.display = display;
    }

    showPanel() {
        const layout = this.display.layoutName;
        const destination = this.display.querySelector(`#${layout}-top-one-sixth`);
        const panel = this.display.querySelector("#cas-messages-panel");
        destination.appendChild(panel);
    }

    updateState() {

    }

    updateUI() {

    }
}

class ChartsPanel {
    constructor(display) {
        this.display = display;
    }

    showPanel() {
        const layout = this.display.layoutName;
        const destination = this.display.querySelector(`#${layout}-two-thirds`);
        const panel = this.display.querySelector("#charts-panel");
        destination.appendChild(panel);
    }

    updateState() {

    }

    updateUI() {

    }
}

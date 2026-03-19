class FlightPlanPanel {
    constructor(display) {
        this.display = display;
    }

    showPanel() {
        const layout = this.display.layoutName;
        const destination = this.display.querySelector(`#${layout}-bottom-one-sixth`);
        const panel = this.display.querySelector("#flight-plan-panel");
        destination.appendChild(panel);
    }

    updateState() {

    }

    updateUI() {

    }
}

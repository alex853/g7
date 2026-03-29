class CasMessagesPanel {
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
        const fuelTankTemp = ULRBJ.getFuelTankTempCas();

        // todo ak0 implement it!
        this.display.querySelector('#cas-messages-test').innerHTML = fuelTankTemp;
    }
}

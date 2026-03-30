class CasMessagesPanel {
    constructor(display) {
        this.display = display;
        this.styles = ["", "white", "cyan", "amber", "red"];
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
        const messages = [
        ];

        const fuelTankTemp = ULRBJ.getFuelTankTempCas();
        if (fuelTankTemp === ULRBJ.CAS_LEVEL_2_CYAN || fuelTankTemp === ULRBJ.CAS_LEVEL_3_AMBER) {
            messages.push({ level: fuelTankTemp, message: "Fuel Tank Temperature" });
        }

        for (let i = 1; i <= 12; i++) {
            let color = "white";
            let text = "&nbsp;";

            const message = messages[i-1];
            if (message) {
                color = this.styles[message.level];
                text = message.message;
            }

            let rowElement = this.display.querySelector(`#cas-messages-panel-row-${i}`);
            rowElement.innerHTML = text;
            rowElement.classList.remove("white");
            rowElement.classList.remove("cyan");
            rowElement.classList.remove("amber");
            rowElement.classList.remove("red");
            rowElement.classList.add(color);
        }
    }
}

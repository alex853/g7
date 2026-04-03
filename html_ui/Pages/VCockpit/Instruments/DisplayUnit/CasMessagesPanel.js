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
        // todo ak2 const messageCodes = ULRBJ.CAS.getMessageCodes();
        // todo ak2 it reads and parses into suitable data
        // todo ak2 updateUI iterates and updates dom elements
    }

    updateUI() {
        const messages = [];

        // todo ak1: (A) Fuel Imbalance
        // todo ak1: (A) L-R Fuel Level Low
        // todo ak1: (A) Fuel Tank Temperature
        // todo ak1: (C) Fuel Crossflow Valve Open
        // todo ak1: (C) Fuel Imbalance
        // todo ak1: (C) Fuel Intertank Valve Open
        // todo ak1: (C) Fuel Tank Temperature
        // todo ak1: (W) Fuel Crossflow Valve Open
        // todo ak1: (W) Fuel Intertank Valve Open

        const fuelTankTemp = ULRBJ.FuelSystem.getFuelTankTempCas();
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

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
        // noop
    }

    updateUI() {
        const messages = [];

        addIfAmber(ULRBJ.FuelSystem.CAS.FuelImbalance.get(), "Fuel Imbalance");
        addIfAmber(ULRBJ.FuelSystem.CAS.LRFuelLevelLow.get(), "L-R Fuel Level Low");
        addIfAmber(ULRBJ.FuelSystem.CAS.FuelTankTemp.get(), "Fuel Tank Temperature");
        // todo ak1: (C) Fuel Crossflow Valve Open
        addIfCyan(ULRBJ.FuelSystem.CAS.FuelImbalance.get(), "Fuel Imbalance");
        // todo ak1: (C) Fuel Intertank Valve Open
        addIfCyan(ULRBJ.FuelSystem.CAS.FuelTankTemp.get(), "Fuel Tank Temperature");
        // todo ak1: (W) Fuel Crossflow Valve Open
        // todo ak1: (W) Fuel Intertank Valve Open

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

        function addIfAmber(level, message) {
            if (level === ULRBJ.CAS_LEVEL_3_AMBER) {
                messages.push({ level: level, message: message });
            }
        }

        function addIfCyan(level, message) {
            if (level === ULRBJ.CAS_LEVEL_2_CYAN) {
                messages.push({ level: level, message: message });
            }
        }
    }
}

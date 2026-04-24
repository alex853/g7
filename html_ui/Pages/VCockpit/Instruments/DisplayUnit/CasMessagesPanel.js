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

        amber(ULRBJ.FuelSystem.CAS.FuelImbalance.get(), "Fuel Imbalance");
        amberLR(ULRBJ.FuelSystem.CAS.LRFuelLevelLow.getLR(), "Fuel Level Low");
        amber(ULRBJ.FuelSystem.CAS.FuelTankTemp.get(), "Fuel Tank Temperature");
        // todo ak1: (C) Fuel Crossflow Valve Open
        cyan(ULRBJ.FuelSystem.CAS.FuelImbalance.get(), "Fuel Imbalance");
        // todo ak1: (C) Fuel Intertank Valve Open
        cyan(ULRBJ.FuelSystem.CAS.FuelTankTemp.get(), "Fuel Tank Temperature");
        // todo ak1: (W) L-R Alt Fuel Pump Off
        // todo ak1: (W) Fuel Crossflow Valve Open
        // todo ak1: (W) Fuel Intertank Valve Open
        // todo ak1: (W) L-R Main Fuel Pump Off

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

        function amber(level, message) {
            if (level === ULRBJ.CAS_LEVEL_3_AMBER) {
                messages.push({ level: level, message: message });
            }
        }

        function amberLR(levelLR, message) {
            let prefix = null;
            if (levelLR[0] === ULRBJ.CAS_LEVEL_3_AMBER) {
                prefix = "L";
            }
            if (levelLR[1] === ULRBJ.CAS_LEVEL_3_AMBER) {
                prefix = prefix != null ? "L-R" : "R";
            }
            if (prefix == null) {
                return;
            }
            messages.push({ level: ULRBJ.CAS_LEVEL_3_AMBER, message: prefix + " " + message });
        }

        function cyan(level, message) {
            if (level === ULRBJ.CAS_LEVEL_2_CYAN) {
                messages.push({ level: level, message: message });
            }
        }
    }
}

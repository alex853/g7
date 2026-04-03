class FlightPlanPanel {
    constructor(display) {
        this.display = display;
        this.counter = 0;
        this.flightplan = this.emptyFlightplan();
    }

    showPanel() {
        const layout = this.display.layoutName;
        const destination = this.display.querySelector(`#${layout}-bottom-one-sixth`);
        const panel = this.display.querySelector("#flight-plan-panel");
        destination.appendChild(panel);
    }

    updateState() {
        if (this.counter === 0) {
            this.loadFlightPlan();
            this.counter = 25;
        } else {
            this.counter--;
        }
    }

    loadFlightPlan() {
        const fp = this.emptyFlightplan();

        for (let i = 1; i <= 12; i++) {
            const iStr = i.toString().padStart(2, "0");
            const code = SimVar.GetSimVarValue(`L:ULRBJ_FLIGHTPLAN_WP${iStr}_CODE`, "number");
            if (code === 0) {
                break;
            }
            const icao = Tools.waypointCodeToString(code);
            fp.waypoints.push({
                icao: icao,
                eta: SimVar.GetSimVarValue(`L:ULRBJ_FLIGHTPLAN_WP${iStr}_ETA`, "number"),
                fuel: SimVar.GetSimVarValue(`L:ULRBJ_FLIGHTPLAN_WP${iStr}_FUEL`, "number") * Tools.GALLONS_TO_LB,
            });
        }

        const destCode = SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_DEST_CODE", "number");
        const destEta = SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_DEST_ETA", "number");
        const destFuel = SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_DEST_FUEL", "number") * Tools.GALLONS_TO_LB;
        if (destCode !== 0) {
            fp.dest = {
                icao: Tools.waypointCodeToString(destCode),
                eta: destEta,
                fuel: destFuel,
            }
        }

        this.flightplan = fp;
    }

    updateUI() {
        const fp = this.flightplan;
        for (let i = 1; i <= 12; i++) {
            const noWaypoint = fp.waypoints.length < i;
            const waypoint = !noWaypoint ? fp.waypoints[i-1] : undefined;
            diffAndSetText(this.display.querySelector(`#flight-plan-waypoint${i}-name`), waypoint ? waypoint.icao : "");
            diffAndSetText(this.display.querySelector(`#flight-plan-waypoint${i}-column1`), waypoint ? this.formatZuluTime(waypoint.eta) : ""); //
            diffAndSetText(this.display.querySelector(`#flight-plan-waypoint${i}-column2`), waypoint ? "---" : "");
            diffAndSetText(this.display.querySelector(`#flight-plan-waypoint${i}-column3`), waypoint ? Tools.toFixed1(waypoint.fuel / 1000) : "");
        }

        diffAndSetText(this.display.querySelector("#flight-plan-panel-footer-dest"), fp.dest !== 0 ? fp.dest.icao : "");
        diffAndSetText(this.display.querySelector("#flight-plan-panel-footer-eta"), fp.dest !== 0 ? this.formatZuluTime(fp.dest.eta) : "");
        diffAndSetText(this.display.querySelector("#flight-plan-panel-footer-fuel"), fp.dest !== 0 ? Tools.toFixed1(fp.dest.fuel / 1000) : "");
    }

    emptyFlightplan() {
        return {
            waypoints: []
        };
    }

    formatZuluTime(time) {
        const totalSeconds = Math.floor(time);

        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}Z`;
    }
}

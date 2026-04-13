class FlightPlanPanel {
    constructor(display) {
        this.display = display;

        this.flightplan = FlightPlanHelper.emptyFlightplan();
        this.flightplanCounter = 0;

        this.flightPlanManager = new FlightPlanManager(this.display);
        this.flightPlanManager.registerListener();
    }

    showPanel() {
        const layout = this.display.layoutName;
        const destination = this.display.querySelector(`#${layout}-bottom-one-sixth`);
        const panel = this.display.querySelector("#flight-plan-panel");
        destination.appendChild(panel);
    }

    updateState() {
        const FLIGHTPLAN_REQUEST_IS_RUNNING = 11;

        if (this.flightplanCounter === FLIGHTPLAN_REQUEST_IS_RUNNING) {
            return;
        }

        if (this.flightplanCounter > 0) {
            this.flightplanCounter--;
        }

        this.flightplanCounter = FLIGHTPLAN_REQUEST_IS_RUNNING
        Coherent.call("GET_FLIGHTPLAN").then(r => {
            const fp = FlightPlanHelper.parseSnapshot(r);
            this.flightplan = FlightPlanHelper.toActivePlan(fp);

            this.flightplanCounter = 10;
        });
    }

    updateUI() {
        const fp = this.flightplan;
        for (let i = 1; i <= 12; i++) {
            const wp = i < fp.waypoints.length ? fp.waypoints[i] : undefined;

            diffAndSetText(this.display.querySelector(`#flight-plan-waypoint${i}-name`), wp ? wp.icao : "");
            diffAndSetText(this.display.querySelector(`#flight-plan-waypoint${i}-column1`), wp ? this.formatZuluTime(wp.eta) : ""); //
            diffAndSetText(this.display.querySelector(`#flight-plan-waypoint${i}-column2`), wp ? this.formatFlightLevel(wp.altitude) : "");
            diffAndSetText(this.display.querySelector(`#flight-plan-waypoint${i}-column3`), wp ? Tools.toFixed1(wp.fuelRemaining * Tools.GALLONS_TO_LB / 1000) : "");
        }

        diffAndSetText(this.display.querySelector("#flight-plan-panel-footer-dest"), fp.dest ? fp.dest.icao : "");
        diffAndSetText(this.display.querySelector("#flight-plan-panel-footer-dtg"), fp.dest ? Tools.toFixed0(fp.dest.cumDistance) : "");
        diffAndSetText(this.display.querySelector("#flight-plan-panel-footer-eta"), fp.dest ? this.formatZuluTime(fp.dest.eta) : "");
        diffAndSetText(this.display.querySelector("#flight-plan-panel-footer-fuel"), fp.dest ? Tools.toFixed1(fp.dest.fuelRemaining * Tools.GALLONS_TO_LB / 1000) : "");
    }

    formatZuluTime(time) {
        const totalSeconds = Math.floor(time);

        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}Z`;
    }

    formatFlightLevel(altitude) {
        if (altitude < 7000) {
            return Tools.toFixed0(altitude);
        } else {
            return "FL" + Tools.toFixed0(altitude / 100).padStart(3, "0");
        }
    }
}

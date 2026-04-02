class FlightPlanPanel {
    constructor(display) {
        this.display = display;
        this.counter = 0;
        this.flightplan = this.emptyFlightplan();

        this.map = display.querySelector('#flight-plan-panel-fictitious-map');
        if (this.map.init) {
            this.map.init(this);
        }
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
/*        Coherent.call("RECOMPUTE_ACTIVE_WAYPOINT_INDEX", 1).then(t => {
            Coherent.call("GET_FLIGHTPLAN").then(r => {
                console.log("GET_FLIGHTPLAN", r);

                const fp = this.emptyFlightplan();
                fp.waypoints = r.waypoints.map(w => {
                    return {
                        ident: w.ident,
                        eta: w.estimatedTimeOfArrival
                    };
                })
                this.flightplan = fp;

                console.log("our flightplan", this.flightplan);
            });
        });*/
    }

    updateUI() {
        const fp = this.flightplan;
        for (let i = 1; i <= 12; i++) {
            const noWaypoint = fp.waypoints.length < i;
            if (noWaypoint) {
                this.display.querySelector(`#flight-plan-waypoint${i}-name`).innerHTML = "";
                this.display.querySelector(`#flight-plan-waypoint${i}-column1`).innerHTML = "";
                this.display.querySelector(`#flight-plan-waypoint${i}-column2`).innerHTML = "";
                this.display.querySelector(`#flight-plan-waypoint${i}-column3`).innerHTML = "";
            } else {
                const waypoint = fp.waypoints[i-1];
                this.display.querySelector(`#flight-plan-waypoint${i}-name`).innerHTML = waypoint.ident;
                this.display.querySelector(`#flight-plan-waypoint${i}-column1`).innerHTML = this.formatZuluTime(waypoint.eta);
                this.display.querySelector(`#flight-plan-waypoint${i}-column2`).innerHTML = "---";
                this.display.querySelector(`#flight-plan-waypoint${i}-column3`).innerHTML = "---";
            }
        }

        const destCode = SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_DEST_CODE", "number");
        const destIdent = Tools.waypointCodeToString(destCode);
        diffAndSetText(this.display.querySelector("#flight-plan-panel-footer-dest"), destIdent);
        // this.display.querySelector(`#custom-simvar-test`).innerHTML = SimVar.GetSimVarValue("L:ULRBJ_TEST", "number");
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

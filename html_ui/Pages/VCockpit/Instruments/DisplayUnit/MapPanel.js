class MapPanel {
    constructor(display) {
        this.id = "map";

        this.display = display;

        this.map = display.querySelector('#MapInstrument');
        if (this.map.init) {
            this.map.init(this);
            this.map.flightPlanManager.registerListener();
            // this.map.setContinuousUpdate(true);
            // this.map.setSmoothRotation(true);
        } else {
            this.map = StubMap; // to allow the gauge working outside the sim
        }
        // this.map.setCenteredOnPlane();
        // this.map.setZoom(10);
        // this.map.setRotationMode(EMapRotationMode.TRACK_UP);

        this.state = {
            tat: 0,
            sat: 0,
            tas: 0,
            gs: 0
        }
    }

    showPanel() {
        const layout = this.display.layoutName;
        const destination = this.display.querySelector(`#${layout}-two-thirds`);
        const panel = this.display.querySelector("#map-panel");
        destination.appendChild(panel);
    }

    onUpdate() {
        this.map.setCenteredOnPlane();
        this.map.update();
    }

    updateState() {
        const state = this.state;

        state.tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "celsius");
        state.sat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        state.tas = SimVar.GetSimVarValue("AIRSPEED TRUE", "knots");
        state.gs = SimVar.GetSimVarValue("GROUND VELOCITY", "knots");

        state.prevWaypoint = Tools.codeToString(SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_PREV_CODE", "number"));
        state.nextWaypoint = Tools.codeToString(SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_NEXT_CODE", "number"));
    }

    updateUI() {
        const state = this.state;

        this.display.querySelector('#map-tat-label').innerHTML = "TAT" + Tools.alignWithNbsp((state.tat).toFixed(0), 4);
        this.display.querySelector('#map-sat-label').innerHTML = "SAT" + Tools.alignWithNbsp((state.sat).toFixed(0), 4);
        this.display.querySelector('#map-tas-label').innerHTML = "TAS" + Tools.alignWithNbsp((state.tas).toFixed(0), 4);
        this.display.querySelector('#map-gs-label').innerHTML = "GS" + Tools.alignWithNbsp((state.gs).toFixed(0), 5);

        const rotationMode = this.map.getRotationMode();
        this.display.querySelector('#map-header-rotation-label').innerHTML = rotationMode === EMapRotationMode.NorthUp ? "North" : "Hdg";

        diffAndSetText(this.display.querySelector('#map-header-prev-waypoint'), state.prevWaypoint);
        diffAndSetText(this.display.querySelector('#map-header-next-waypoint'), state.nextWaypoint);
    }

    onAction(action) {
        if (action === "zoom-plus") {
            this.map.zoomOut();
        } else if (action === 'zoom-minus') {
            this.map.zoomIn();
        } else if (action === 'rotation') {
            let rotationMode = this.map.getRotationMode();
            if (rotationMode === EMapRotationMode.NorthUp) {
                rotationMode = EMapRotationMode.HDGUp;
            } else {
                rotationMode = EMapRotationMode.NorthUp;
            }
            this.map.setRotationMode(rotationMode);
        } else if (action === 'test') {
            [
                "GET_FLIGHTPLAN",
                // "GET_FLIGHTPLAN_FULL",
                // "GET_APPROACH_FLIGHTPLAN",
                // "GET_FLIGHTPLAN_GEOMETRY",
                "GET_ACTIVE_WAYPOINT_INDEX",
                // "GET_CURRENT_FLIGHTPLAN_INDEX"
            ].forEach(cmd => {
                Coherent.call(cmd).then(r => {
                    console.log(cmd, r);
                    console.log(JSON.stringify(r));
                });
            });
        }
    }
}

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
            gs: 0,

            prevWaypoint: "",
            nextWaypoint: "",
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

        state.prevWaypoint = Tools.waypointCodeToString(SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_WP00_CODE", "number"), '&nbsp;');
        state.nextWaypoint = Tools.waypointCodeToString(SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_WP01_CODE", "number"), '&nbsp;');
    }

    updateUI() {
        const state = this.state;

        diffAndSetHTML(this.display.querySelector('#map-tat-label'), "TAT" + Tools.alignWithNbsp(Tools.toFixed0(state.tat), 4));
        diffAndSetHTML(this.display.querySelector('#map-sat-label'), "SAT" + Tools.alignWithNbsp(Tools.toFixed0(state.sat), 4));
        diffAndSetHTML(this.display.querySelector('#map-tas-label'), "TAS" + Tools.alignWithNbsp(Tools.toFixed0(state.tas), 4));
        diffAndSetHTML(this.display.querySelector('#map-gs-label'), "GS" + Tools.alignWithNbsp(Tools.toFixed0(state.gs), 5));

        const rotationMode = this.map.getRotationMode();
        const rotationText = rotationMode === EMapRotationMode.NorthUp ? "North" : "Hdg";
        diffAndSetText(this.display.querySelector('#map-header-rotation-label'), rotationText);

        diffAndSetHTML(this.display.querySelector('#map-header-prev-waypoint'), state.prevWaypoint);
        diffAndSetHTML(this.display.querySelector('#map-header-next-waypoint'), state.nextWaypoint);
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

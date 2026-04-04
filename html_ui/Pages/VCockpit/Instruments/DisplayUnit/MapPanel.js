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

        this.needToLoadSettings = true;

        this.flightplanCounter = 0;

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
        this.updateMapCenter();

        this.map.update();
    }

    updateMapCenter() {
        const rotationMode = this.map.getRotationMode();
        if (rotationMode === EMapRotationMode.NorthUp) {
            this.map.setCenteredOnPlane();
        } else {
            const planeLat = SimVar.GetSimVarValue("PLANE LATITUDE", "degrees");
            const planeLon = SimVar.GetSimVarValue("PLANE LONGITUDE", "degrees");
            const planeHeadingDeg = SimVar.GetSimVarValue("PLANE HEADING DEGREES TRUE", "degrees");

            const yOffset = 0.1;

            const displayRange = this.map.getDisplayRange();
            const yOffsetNm = displayRange * yOffset;

            const p = Tools.offsetLatLon(planeLat, planeLon, planeHeadingDeg, yOffsetNm);

            const center = new LatLongAlt(p.lat, p.lon);
            this.map.setCenter(center);
        }
    }

    updateState() {
        const state = this.state;

        state.tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "celsius");
        state.sat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        state.tas = SimVar.GetSimVarValue("AIRSPEED TRUE", "knots");
        state.gs = SimVar.GetSimVarValue("GROUND VELOCITY", "knots");

        if (this.flightplanCounter === 0) {
            Coherent.call("GET_FLIGHTPLAN").then(r => {
                const fp = FlightPlanHelper.parseSnapshot(r);
                const activePlan = FlightPlanHelper.toActivePlan(fp);
                state.prevWaypoint = activePlan.waypoints.length > 0 ? activePlan.waypoints[0].icao : "&nbsp;";
                state.nextWaypoint = activePlan.waypoints.length > 1 ? activePlan.waypoints[1].icao : "&nbsp;";
            });

            this.flightplanCounter = 10;
        } else {
            this.flightplanCounter--;
        }
    }

    updateUI() {
        if (this.needToLoadSettings) {
            this.loadMapSettings();
            this.needToLoadSettings = false;
        }

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


    loadMapSettings() {
        const rotationMode = GetStoredData("DU2.Map.Rotation");
        if (rotationMode === "HDGUp") {
            this.map.setRotationMode(EMapRotationMode.HDGUp);
        } else {
            this.map.setRotationMode(EMapRotationMode.NorthUp);
        }

        const zoom = GetStoredData("DU2.Map.Zoom");
        if (zoom !== undefined) {
            const zoomNumber = Number(zoom);
            if (!isNaN(zoomNumber)) {
                this.map.setZoom(zoomNumber);
            }
        }

        this.updateMapCenter();
    }

    onAction(action) {
        if (action === "zoom-plus") {
            this.map.zoomOut();
            SetStoredData("DU2.Map.Zoom", this.map.getZoom().toString());
            this.updateMapCenter();
        } else if (action === 'zoom-minus') {
            this.map.zoomIn();
            SetStoredData("DU2.Map.Zoom", this.map.getZoom().toString());
            this.updateMapCenter();
        } else if (action === 'rotation') {
            let rotationMode = this.map.getRotationMode();
            if (rotationMode === EMapRotationMode.NorthUp) {
                rotationMode = EMapRotationMode.HDGUp;
                SetStoredData("DU2.Map.Rotation", "HDGUp");
            } else {
                rotationMode = EMapRotationMode.NorthUp;
                SetStoredData("DU2.Map.Rotation", "NorthUp");
            }
            this.map.setRotationMode(rotationMode);
            this.updateMapCenter();
        } else if (action === 'test') {
            // this.yOffset = this.yOffset - 0.01;
/*            let counter = 0;
            for (let i = 0; i < 10000000; i++) {
                SimVar.SetSimVarValue('L:ULRBJ_TEST_TEST', 'number', i);
                const read = SimVar.GetSimVarValue('L:ULRBJ_TEST_TEST', 'number');
                if (i !== read) {
                    counter++;
                }
            }
            console.log('counter = ' + counter);*/


/*            [
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
            });*/
        }
    }
}

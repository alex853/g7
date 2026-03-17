class MapPanel {
    constructor(display) {
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
    }

    updateUI() {
        const state = this.state;

        this.display.querySelector('#map-tat-label').innerHTML = "TAT" + Tools.alignWithNbsp((state.tat).toFixed(0), 4);
        this.display.querySelector('#map-sat-label').innerHTML = "SAT" + Tools.alignWithNbsp((state.sat).toFixed(0), 4);
        this.display.querySelector('#map-tas-label').innerHTML = "TAS" + Tools.alignWithNbsp((state.tas).toFixed(0), 4);
        this.display.querySelector('#map-gs-label').innerHTML = "GS" + Tools.alignWithNbsp((state.gs).toFixed(0), 5);

        const rotationMode = this.map.getRotationMode();
        this.display.querySelector('#map-header-rotation-label').innerHTML = rotationMode === EMapRotationMode.NorthUp ? "North" : "Hdg";
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
        }
    }
}

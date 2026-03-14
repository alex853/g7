class MapPanel {
    constructor(display) {
        this.display = display;

        this.map = display.querySelector('#MapInstrument');
        if (this.map.init) {
            this.map.init(this);
        } else {
            this.map = null; // to allow the gauge working outside the sim
        }
        // this.map.setCenteredOnPlane();
        // this.map.setZoom(10);
        // this.map.setRotationMode(EMapRotationMode.TRACK_UP);

    }

    onUpdate() {
        if (this.map) {
            this.map.setCenteredOnPlane();
            this.map.update();
        }
    }
}

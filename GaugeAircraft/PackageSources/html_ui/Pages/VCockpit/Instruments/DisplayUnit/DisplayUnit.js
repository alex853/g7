class DisplayUnit extends BaseInstrument {
    constructor() {
        super();
    }

    get templateID() {
        return "DisplayUnit";
    }

    get isInteractive() { 
        return false;
    }

    connectedCallback() {
        super.connectedCallback();

        console.log("connected callback");

        this.mapPanel = new MapPanel(this);
        this.primaryEnginePanel = new PrimaryEnginePanel(this);
        this.secondaryEnginePanel = new SecondaryEnginePanel(this);

        this.startUpdateStateCycle();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this._simUpdateInterval) {
            clearInterval(this._simUpdateInterval);
        }
    }

    parseXMLConfig() {
        super.parseXMLConfig();
    }

    Update() {
        super.Update();

        this.mapPanel.onUpdate();
        // this.primaryEnginePanel does not have onUpdate .onUpdate();
        // this.secondaryEnginePanel does not have onUpdate .onUpdate();
    }

    startUpdateStateCycle() {
        this._simUpdateInterval = setInterval(() => {
            this.updateState();
            this.updateUI();
        }, 100);
    }

    updateState() {
        this.primaryEnginePanel.updateState();
        this.secondaryEnginePanel.updateState();
    }

    updateUI() {
        this.primaryEnginePanel.updateUI();
        this.secondaryEnginePanel.updateUI();
    }
}

registerInstrument("display-unit-element", DisplayUnit);

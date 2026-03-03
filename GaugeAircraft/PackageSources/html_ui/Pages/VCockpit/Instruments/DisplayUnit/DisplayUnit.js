class DisplayUnit extends BaseInstrument {
    constructor() {
        super();
    }

    get templateID() {
        return "DisplayUnit";
    }

    get isInteractive() { 
        return true; 
    }

    connectedCallback() {
        super.connectedCallback();

        console.log("connected callback");

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
    }

    startUpdateStateCycle() {
        this._simUpdateInterval = setInterval(() => {
            // const page = Pages[this.currentPageIndex];
            // if (page.updateState)
            //     page.updateState();
            //
            // if (page.updateUI) {
            //     page.updateUI(this);
            // }
        }, 100);
    }
}

registerInstrument("display-unit-element", DisplayUnit);

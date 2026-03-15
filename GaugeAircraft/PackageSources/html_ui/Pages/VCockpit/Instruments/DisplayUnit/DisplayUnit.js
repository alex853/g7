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

        this.initButtons();

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
        this.mapPanel.updateState();
        this.primaryEnginePanel.updateState();
        this.secondaryEnginePanel.updateState();
    }

    updateUI() {
        this.mapPanel.updateUI();
        this.primaryEnginePanel.updateUI();
        this.secondaryEnginePanel.updateUI();
    }

    initButtons() {
        this.querySelectorAll(".onclick").forEach((btn) => {
            btn.addEventListener("click", () => {
                this.onButtonClick(btn, this);
            });
        });
    }

    onButtonClick(button, display) {
        const action = button.dataset.action;
        console.log("Pressed button:", action);

        if (!action) {
            return;
        }

        const panelId = action.split(':')[0];
        const actionId = action.split(':')[1];

        const panel = panelId === 'map' ? this.mapPanel : undefined;
        if (!panel) {
            return;
        }

        if (panel.onAction) {
            panel.onAction(actionId);
        }

        if (panel.updateUI) {
            panel.updateUI();
        }
    }
}

registerInstrument("display-unit-element", DisplayUnit);

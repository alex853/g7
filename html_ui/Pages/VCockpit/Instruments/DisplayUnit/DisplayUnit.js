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

        this.initButtons();

        const url = this.getAttribute("url");
        console.log("url: " + url);
        if (url.includes("?DU2")) {
            this.displayNumber = 2;
        } else if (url.includes("?DU3")) {
            this.displayNumber = 3;
        } else {
            this.displayNumber = 2; // default
        }
        console.log("DU number: " + this.displayNumber);

        if (this.displayNumber === 2) {
            this.layoutName = "du24";
            this.panels = [
                new MapPanel(this),
                new PrimaryEnginePanel(this),
                new SecondaryEnginePanel(this)
            ];
        } else if (this.displayNumber === 3) {
            this.layoutName = "du13";
            this.panels = [
                new ChartsPanel(this),
                new CasMessagesPanel(this),
                new FlightPlanPanel(this)
            ];
        } else {
            console.error("Unknown display number: ", this.displayNumber);
            return;
        }

        this.querySelector(`#${this.layoutName}`).classList.remove('hidden');

        this.panels.forEach(panel => {
            if (panel.showPanel) {
                panel.showPanel();
            }
        });

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

        this.panels.forEach(panel => {
            if (panel.onUpdate) {
                panel.onUpdate();
            }
        });
    }

    startUpdateStateCycle() {
        this._simUpdateInterval = setInterval(() => {
            this.updateState();
            this.updateUI();
        }, 100);
    }

    updateState() {
        this.panels.forEach(panel => {
            if (panel.updateState) {
                panel.updateState();
            }
        })
    }

    updateUI() {
        this.panels.forEach(panel => {
            if (panel.updateUI) {
                panel.updateUI();
            }
        })
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

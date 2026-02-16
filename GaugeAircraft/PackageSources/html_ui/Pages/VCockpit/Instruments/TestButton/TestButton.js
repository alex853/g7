class TestButton extends BaseInstrument {
    constructor() {
        super();
    }

    get templateID() {
        return "TestButton";
    }

    get isInteractive() { 
        return true; 
    }

    connectedCallback() {
        super.connectedCallback();

        console.log("connected callback");

        this.initButtons();

        this.currentPageIndex = 2;
        this.openTab(this.currentPageIndex);

        this.startUpdatesFromSim();
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

    startUpdatesFromSim() {
        this._simUpdateInterval = setInterval(() => {
            const page = Pages[this.currentPageIndex];
            if (page.updateFromSim)
                page.updateFromSim();

            if (this.currentPageIndex === 2) {
                this.updateExternalLightsButtons();
            }
        }, 100);
    }

    initButtons() {
        this.querySelectorAll(".menu-button").forEach((btn, index) => {
            btn.addEventListener("click", () => {
                this.onMenuPressed(index, btn);
            });
        });

        this.querySelectorAll(".external-lights-tab-button").forEach((btn) => {
            btn.addEventListener("click", () => {
                this.onExternalLightsButtonPressed(btn);
            });
        });
    }

    onMenuPressed(index, button) {
        console.log("Pressed button index:", index);
        this.openTab(index);
    }

    openTab(index) {
        this.currentPageIndex = index;
        const page = Pages[this.currentPageIndex];

        this.querySelectorAll('.menu-button')
            .forEach(b => b.classList.remove('active'));
        this.querySelectorAll('#' + page.id + '-btn')
            .forEach(b => b.classList.add('active'));

        this.querySelectorAll('.content-tab')
            .forEach(b => b.classList.add('hidden'));
        this.querySelectorAll('#' + page.id + '-tab')
            .forEach(b => b.classList.remove('hidden'));
    }

    onExternalLightsButtonPressed(button) {
        const action = button.dataset.action;
        console.log("Pressed external lights button:", action);
        const page = Pages[2];
        const state = page.state;

        state[action] = !state[action];
        // todo ak call simvar - depending on action
        SimVar.SetSimVarValue("LIGHT NAV", "Bool", state[action]);

        this.updateExternalLightsButtons();
    }

    updateExternalLightsButtons() {
        const page = Pages[2];
        const state = page.state;

        this.querySelectorAll('.external-lights-tab-button')
            .forEach(b => {
                const action = b.dataset.action;
                if (!action) return;

                if (state[action])
                    b.classList.add('active');
                else
                    b.classList.remove('active');
            });
    }

    // todo ak         let hour = SimVar.GetSimVarValue("GENERAL ENG ELAPSED TIME:1", "hour");
    // todo ak SimVar.SetSimVarValue(name, "Bool", value);

}

Pages = [
    {
        id: "irs-apu-batt",
    },
    {
        id: "ecs",
    },
    {
        id: "external-lights",
        state: {
            nav: false,
            beacon: false,
            strobe: false,
            taxi: false,
            landing: false,
            "seat-belt": false,
            "no-smoke": false
        },
        updateFromSim: function() {
            this.state["nav"] = SimVar.GetSimVarValue("LIGHT NAV", "Bool");
            this.state["beacon"] = SimVar.GetSimVarValue("LIGHT BEACON", "Bool");
            this.state["strobe"] = SimVar.GetSimVarValue("LIGHT STROBE", "Bool");
        }
    },
    {
        id: "fuel",
    },
    {
        id: "hyd-cpcs",
    },
    {
        id: "cockpit-lights",
    },
    {
        id: "anti-ice",
    },
    {
        id: "du-ctrl-test",
    }
];

registerInstrument("test-button-element", TestButton);

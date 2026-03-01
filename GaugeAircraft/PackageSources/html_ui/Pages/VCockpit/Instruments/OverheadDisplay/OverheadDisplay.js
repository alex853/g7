class OverheadDisplay extends BaseInstrument {
    constructor() {
        super();
    }

    get templateID() {
        return "OverheadDisplay";
    }

    get isInteractive() { 
        return true; 
    }

    connectedCallback() {
        super.connectedCallback();

        console.log("connected callback");

        this.initButtons();

        this.currentPageIndex = 3;
        this.openTab(this.currentPageIndex);

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
            const page = Pages[this.currentPageIndex];
            if (page.updateState)
                page.updateState();

            if (page.updateUI) {
                page.updateUI(this);
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
        if (page.actions && page.actions[action]) {
            page.actions[action](page);
            page.updateUI(this);
        }
    }
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
            logo: false,
            taxi: false,
            landing: false,
            "seat-belt": false,
            "no-smoke": false
        },
        updateState: function() {
            this.state["nav"] = SimVar.GetSimVarValue("LIGHT NAV", "Bool");
            this.state["beacon"] = SimVar.GetSimVarValue("LIGHT BEACON", "Bool");
            this.state["strobe"] = SimVar.GetSimVarValue("LIGHT STROBE", "Bool");
            this.state["logo"] = SimVar.GetSimVarValue("LIGHT LOGO", "Bool");
            this.state["taxi"] = SimVar.GetSimVarValue("LIGHT TAXI", "Bool");
            this.state["landing"] = SimVar.GetSimVarValue("LIGHT LANDING", "Bool");
            this.state["seat-belt"] = SimVar.GetSimVarValue("CABIN SEATBELTS ALERT SWITCH", "Bool");
            this.state["no-smoke"] = SimVar.GetSimVarValue("CABIN NO SMOKING ALERT SWITCH", "Bool");
        },
        updateUI: function(display) {
            const page = Pages[2];
            const state = page.state;

            display.querySelectorAll('.external-lights-tab-button')
                .forEach(b => {
                    const action = b.dataset.action;
                    if (!action) return;

                    if (state[action])
                        b.classList.add('active');
                    else
                        b.classList.remove('active');
                });
        },
        actions: {
            "nav": function (page) { page.actions.toggleBoolean(page, "nav", "LIGHT NAV"); },
            "beacon": function (page) { page.actions.toggleBoolean(page, "beacon", "LIGHT BEACON"); },
            "strobe": function (page) { page.actions.toggleBoolean(page, "strobe", "LIGHT STROBE"); },
            "logo": function (page) { page.actions.toggleBoolean(page, "logo", "LIGHT LOGO"); },
            "taxi": function (page) { page.actions.toggleBoolean(page, "taxi", "LIGHT TAXI"); },
            "landing": function (page) { page.actions.toggleBoolean(page, "landing", "LIGHT LANDING"); },
            "seat-belt": function (page) { page.actions.toggleEvent(page, "seat-belt", "K:CABIN_SEATBELTS_ALERT_SWITCH_TOGGLE"); },
            "no-smoke": function (page) { page.actions.toggleEvent(page, "no-smoke", "K:CABIN_NO_SMOKING_ALERT_SWITCH_TOGGLE"); },
            "toggleBoolean": function (page, stateName, simName) {
                page.state[stateName] = !page.state[stateName];
                SimVar.SetSimVarValue(simName, "Bool", page.state[stateName]);
            },
            "toggleEvent": function (page, stateName, simName) {
                page.state[stateName] = !page.state[stateName];
                SimVar.SetSimVarValue(simName, "Number", 0);
            }
        }
    },
    {
        id: "fuel",
        state: {
            leftFuel: 0,
            rightFuel: 0,

            leftMainPump: 0,
            leftAltPump: 0,
            rightMainPump: 0,
            rightAltPump: 0,

            apuRunning: 0,

            leftEngineRunning: 0,
            rightEngineRunning: 0
        },
        updateState: function () {
            this.state.leftFuel = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "Gallons");
            this.state.rightFuel = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "Gallons");

            // As Is: Main Pump and Alt Pump on the same side are controlled separately in UI only,
            // but in fact they control only one actual pump in the model.
            // Next steps: WASM keeping that state AND/OR migrating to new fuel system.
            this.state.leftMainPump = SimVar.GetSimVarValue("GENERAL ENG FUEL PUMP ON:1", "Bool");
            this.state.leftAltPump = SimVar.GetSimVarValue("GENERAL ENG FUEL PUMP ON:1", "Bool");
            this.state.rightMainPump = SimVar.GetSimVarValue("GENERAL ENG FUEL PUMP ON:2", "Bool");
            this.state.rightAltPump = SimVar.GetSimVarValue("GENERAL ENG FUEL PUMP ON:2", "Bool");

            this.state.apuRunning = SimVar.GetSimVarValue("APU SWITCH", "Bool");

            // Is it better to use ENG FUEL FLOW GPH:index ?
            this.state.leftEngineRunning = SimVar.GetSimVarValue("ENG COMBUSTION:1", "Bool");
            this.state.rightEngineRunning = SimVar.GetSimVarValue("ENG COMBUSTION:2", "Bool");
        },
        updateUI: function (display) {
            const gallonsToLb = 6.7;
            display.querySelector('#fuel-tab-left-fuel-label').textContent = (this.state.leftFuel * gallonsToLb).toFixed(0);
            display.querySelector('#fuel-tab-right-fuel-label').textContent = (this.state.rightFuel * gallonsToLb).toFixed(0);
            display.querySelector('#fuel-tab-total-fuel-label').textContent = ((this.state.leftFuel + this.state.rightFuel) * gallonsToLb).toFixed(0);
        },
        actions: {
            "bla-bla": function (page) { /* bla-bla */ }
        }
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

registerInstrument("overhead-display-element", OverheadDisplay);

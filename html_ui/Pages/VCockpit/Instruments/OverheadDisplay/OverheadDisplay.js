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

        this.querySelectorAll(".button-onclick").forEach((btn) => {
            btn.addEventListener("click", () => {
                this.onButtonClick(btn, this);
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

    onButtonClick(button, display) {
        const action = button.dataset.action;
        console.log("Pressed button:", action);

        if (!action) {
            return;
        }

        const pageId = action.split(':')[0];
        const actionId = action.split(':')[1];

        const page = Pages.find(p => p.id === pageId);
        if (!page) {
            return;
        }

        if (page.actions && page.actions[actionId]) {
            page.actions[actionId](page);
        }

        if (page.updateUI) {
            page.updateUI(display);
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
            "nav": function (page) { Tools.toggleBool(page, "nav", "LIGHT NAV"); },
            "beacon": function (page) { Tools.toggleBool(page, "beacon", "LIGHT BEACON"); },
            "strobe": function (page) { Tools.toggleBool(page, "strobe", "LIGHT STROBE"); },
            "logo": function (page) { Tools.toggleBool(page, "logo", "LIGHT LOGO"); },
            "taxi": function (page) { Tools.toggleBool(page, "taxi", "LIGHT TAXI"); },
            "landing": function (page) { Tools.toggleBool(page, "landing", "LIGHT LANDING"); },
            "seat-belt": function (page) { Tools.toggleEvent(page, "seat-belt", "K:CABIN_SEATBELTS_ALERT_SWITCH_TOGGLE"); },
            "no-smoke": function (page) { Tools.toggleEvent(page, "no-smoke", "K:CABIN_NO_SMOKING_ALERT_SWITCH_TOGGLE"); },
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
            rightEngineRunning: 0,

            crossflow: 0,
            intertank: 0
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

            // todo ak intertank
            // todo ak crossflow
        },
        updateUI: function (display) {
            const gallonsToLb = 6.7;
            display.querySelector('#fuel-tab-left-fuel-label').textContent = (this.state.leftFuel * gallonsToLb).toFixed(0);
            display.querySelector('#fuel-tab-right-fuel-label').textContent = (this.state.rightFuel * gallonsToLb).toFixed(0);
            display.querySelector('#fuel-tab-total-fuel-label').textContent = ((this.state.leftFuel + this.state.rightFuel) * gallonsToLb).toFixed(0);

            const inactiveColor = "#ccc";
            const activeColor = "#00ff66";

            updatePumpElements('l-alt-pump', this.state.leftAltPump);
            updatePumpElements('l-main-pump', this.state.leftMainPump);
            updatePumpElements('r-main-pump', this.state.rightMainPump);
            updatePumpElements('r-alt-pump', this.state.rightAltPump);

            updateConsumerElements('apu', this.state.apuRunning);
            updateConsumerElements('left-engine', this.state.leftEngineRunning);
            updateConsumerElements('right-engine', this.state.rightEngineRunning);

            updateLineColors(this.state);

            updateTransferButton('crossflow', this.state.crossflow);
            updateTransferButton('intertank', this.state.intertank);

            function updatePumpElements(name, state) {
                const enabled = state !== 0;
                updateButtonState(name, enabled);
                updateLineColor(`#fuel-tab-line-${name}-connection`, enabled);
            }

            function updateConsumerElements(name, state) {
                const enabled = state !== 0;
                updateLabelState(name, enabled);
                updateLineColor(`#fuel-tab-line-${name}-connection`, enabled);
            }

            function updateLineColors(state) {
                const leftSidePumps = state.leftMainPump !== 0 || state.leftAltPump !== 0;
                const rightSidePumps = state.rightMainPump !== 0 || state.rightAltPump !== 0;

                const leftSideConsumers = state.leftEngineRunning !== 0 || state.apuRunning !== 0;
                const rightSideConsumers = state.rightEngineRunning !== 0;

                const crossflow = state.crossflow !== 0;
                const crossflowCondition = crossflow && (leftSidePumps || rightSidePumps) && (leftSideConsumers || rightSideConsumers);

                const leftSideActive = (leftSidePumps && leftSideConsumers) || crossflowCondition;
                const rightSideActive = (rightSidePumps && rightSideConsumers) || crossflowCondition;

                updateLineColor('#fuel-tab-line-left-side', leftSideActive);
                updateLineColor('#fuel-tab-line-right-side', rightSideActive);
            }

            function updateTransferButton(name, state) {
                const enabled = state !== 0;
                updateButtonState(name, enabled);
                updateLabelState(name, enabled);
                display.querySelector(`#fuel-tab-${name}-label`).textContent = enabled ? 'Open' : 'Closed';
                display.querySelector(`#fuel-tab-line-${name}-open`).style.display = enabled ? 'inline' : 'none';
            }

            function updateButtonState(name, enabled) {
                updateElementState(`#fuel-tab-${name}-button`, enabled);
            }

            function updateLabelState(name, enabled) {
                updateElementState(`#fuel-tab-${name}-label`, enabled);
            }

            function updateElementState(elementName, enabled) {
                if (enabled) {
                    display.querySelector(elementName).classList.add('active');
                } else {
                    display.querySelector(elementName).classList.remove('active');
                }
            }

            function updateLineColor(name, enabled) {
                display.querySelector(name)
                    .setAttribute("stroke", enabled ? activeColor : inactiveColor);
            }
        },
        actions: {
            "l-alt-pump": function (page) { Tools.toggleEvent(page, "leftAltPump", "K:ELECT_FUEL_PUMP1_SET"); },
            "l-main-pump": function (page) { Tools.toggleEvent(page, "leftMainPump", "K:ELECT_FUEL_PUMP1_SET"); },
            "r-main-pump": function (page) { Tools.toggleEvent(page, "rightMainPump", "K:ELECT_FUEL_PUMP2_SET"); },
            "r-alt-pump": function (page) { Tools.toggleEvent(page, "rightAltPump", "K:ELECT_FUEL_PUMP2_SET"); },
            "intertank": function (page) { page.state.intertank = Tools.negateBool(page.state.intertank); }, // todo ak intertank
            "crossflow": function (page) { page.state.crossflow = Tools.negateBool(page.state.crossflow); }, // todo ak crossflow
            "bla-bla": function (page) { /* bla-bla */ },
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

Tools = {
    toggleBool: function (page, stateName, simName) {
        page.state[stateName] = this.negateBool(page.state[stateName]);
        SimVar.SetSimVarValue(simName, "Bool", page.state[stateName]);
    },
    toggleEvent: function (page, stateName, simName) {
        page.state[stateName] = this.negateBool(page.state[stateName]);
        SimVar.SetSimVarValue(simName, "Number", page.state[stateName]);
    },
    negateBool: function (v) {
        if (v === 0) {
            return 1;
        } else if (v === 1) {
            return 0;
        } else {
            return 0;
        }
    }
}

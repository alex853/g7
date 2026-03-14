class PrimaryEnginePanel {
    constructor(display) {
        this.display = display;

        const svg = display.querySelector("#primary-engine-panel-svg");

        this.leftEngineEprGauge = new EngineGauge(svg, 74, 80, "epr");
        this.rightEngineEprGauge = new EngineGauge(svg, 317, 80, "epr");

        this.leftEngineTgtGauge = new EngineGauge(svg, 74, 190, "tgt");
        this.rightEngineTgtGauge = new EngineGauge(svg, 317, 190, "tgt");

        this.leftEngineLpGauge = new EngineGauge(svg, 74, 302, "lp");
        this.rightEngineLpGauge = new EngineGauge(svg, 317, 302, "lp");

        this.state = {
            leftEngine: {
                index: 1,
                epr: 0,
                tgt: 0,
                egt: 0,
                n1: 0,
                n2: 0,
                fuelFlow: 0,
            },
            rightEngine: {
                index: 1,
                epr: 0,
                tgt: 0,
                egt: 0,
                n1: 0,
                n2: 0,
                fuelFlow: 0,
            }
        }
    }

    updateState() {
        const state = this.state;

        state.leftEngine.epr = SimVar.GetSimVarValue("TURB ENG PRESSURE RATIO:1", "ratio");
        state.leftEngine.tgt = ULRBJ.estimateTgt(state.leftEngine);
        state.leftEngine.egt = SimVar.GetSimVarValue("GENERAL ENG EXHAUST GAS TEMPERATURE:1", "celsius"); // it lies, same as "ENG EXHAUST GAS TEMPERATURE:1", "celsius"
        state.leftEngine.n1 = SimVar.GetSimVarValue("TURB ENG CORRECTED N1:1", "percent");
        state.leftEngine.n2 = SimVar.GetSimVarValue("TURB ENG CORRECTED N2:1", "percent");
        state.leftEngine.fuelFlow = SimVar.GetSimVarValue("ENG FUEL FLOW GPH:1", "gallons per hour");

        state.rightEngine.epr = SimVar.GetSimVarValue("TURB ENG PRESSURE RATIO:2", "ratio");
        state.rightEngine.tgt = ULRBJ.estimateTgt(state.rightEngine);
        state.rightEngine.egt = SimVar.GetSimVarValue("GENERAL ENG EXHAUST GAS TEMPERATURE:2", "celsius"); // it lies, same as "ENG EXHAUST GAS TEMPERATURE:2", "celsius"
        state.rightEngine.n1 = SimVar.GetSimVarValue("TURB ENG CORRECTED N1:2", "percent");
        state.rightEngine.n2 = SimVar.GetSimVarValue("TURB ENG CORRECTED N2:2", "percent");
        state.rightEngine.fuelFlow = SimVar.GetSimVarValue("ENG FUEL FLOW GPH:2", "gallons per hour");
    }

    updateUI() {
        const state = this.state;

        this.display.querySelector('#primary-engine-left-epr-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.epr).toFixed(2), 4);
        this.display.querySelector('#primary-engine-right-epr-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.epr).toFixed(2), 4);
        this.leftEngineEprGauge.setValue(state.leftEngine.epr);
        this.rightEngineEprGauge.setValue(state.rightEngine.epr);

        this.display.querySelector('#primary-engine-left-tgt-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.tgt).toFixed(0), 4);
        this.display.querySelector('#primary-engine-right-tgt-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.tgt).toFixed(0), 4);
        this.leftEngineTgtGauge.setValue(state.leftEngine.tgt);
        this.rightEngineTgtGauge.setValue(state.rightEngine.tgt);

        this.display.querySelector('#primary-engine-left-egt-label').innerHTML = (state.leftEngine.egt).toFixed(0);
        this.display.querySelector('#primary-engine-right-egt-label').innerHTML = (state.rightEngine.egt).toFixed(0);

        this.display.querySelector('#primary-engine-left-n1-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.n1).toFixed(1), 5);
        this.display.querySelector('#primary-engine-right-n1-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.n1).toFixed(1), 5);
        this.leftEngineLpGauge.setValue(state.leftEngine.n1);
        this.rightEngineLpGauge.setValue(state.rightEngine.n1);

        this.display.querySelector('#primary-engine-left-n2-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.n2).toFixed(1), 5);
        this.display.querySelector('#primary-engine-right-n2-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.n2).toFixed(1), 5);

        this.display.querySelector('#primary-engine-left-fuel-flow-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.fuelFlow * Tools.GALLONS_TO_LB).toFixed(0), 5);
        this.display.querySelector('#primary-engine-right-fuel-flow-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.fuelFlow * Tools.GALLONS_TO_LB).toFixed(0), 5);
    }
}

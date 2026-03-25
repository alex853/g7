class SecondaryEnginePanel {
    constructor(display) {
        this.display = display;

        this.state = {
            leftTank: {
                quantity: 0,
                temp: NaN
            },
            rightTank: {
                quantity: 0,
                temp: NaN
            },

            leftEngine: {
                index: 1,
                oilPressure: 0,
                oilTemperature: 0,
                engVibration: 0,
                lpEvm: 0,
                hpEvm: 0,
                bleedAirPressure: 0
            },
            rightEngine: {
                index: 2,
                oilPressure: 0,
                oilTemperature: 0,
                engVibration: 0,
                lpEvm: 0,
                hpEvm: 0,
                bleedAirPressure: 0
            },

            hydAuxPressure: 0,
            hydPtuPressure: 0
        }
    }

    showPanel() {
        const layout = this.display.layoutName;
        const destination = this.display.querySelector(`#${layout}-bottom-one-sixth`);
        const panel = this.display.querySelector("#secondary-engine-panel");
        destination.appendChild(panel);
    }

    updateState() {
        const state = this.state;

        state.leftTank.quantity = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "gallons");
        state.leftTank.temp = ULRBJ.estimateFuelTemp(state.leftTank);
        state.rightTank.quantity = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "gallons");
        state.rightTank.temp = ULRBJ.estimateFuelTemp(state.rightTank);

        state.leftEngine.oilPressure = SimVar.GetSimVarValue("GENERAL ENG OIL PRESSURE:1", "psf");
        state.leftEngine.oilTemperature = SimVar.GetSimVarValue("GENERAL ENG OIL TEMPERATURE:1", "celsius");
        state.leftEngine.engVibration = SimVar.GetSimVarValue("TURB ENG VIBRATION:1", "number");
        state.leftEngine.lpEvm = ULRBJ.estimateLpEvm(state.leftEngine);
        state.leftEngine.hpEvm = ULRBJ.estimateHpEvm(state.leftEngine);
        state.leftEngine.hydPressure = SimVar.GetSimVarValue("ENG HYDRAULIC PRESSURE:1", "psf");
        state.leftEngine.bleedAirPressure = ULRBJ.estimateBleedAirPressure(state.leftEngine);

        state.rightEngine.oilPressure = SimVar.GetSimVarValue("GENERAL ENG OIL PRESSURE:2", "psf");
        state.rightEngine.oilTemperature = SimVar.GetSimVarValue("GENERAL ENG OIL TEMPERATURE:2", "celsius");
        state.rightEngine.engVibration = SimVar.GetSimVarValue("TURB ENG VIBRATION:2", "number");
        state.rightEngine.lpEvm = ULRBJ.estimateLpEvm(state.rightEngine);
        state.rightEngine.hpEvm = ULRBJ.estimateHpEvm(state.rightEngine);
        state.rightEngine.hydPressure = SimVar.GetSimVarValue("ENG HYDRAULIC PRESSURE:2", "psf");
        state.rightEngine.bleedAirPressure = ULRBJ.estimateBleedAirPressure(state.rightEngine);

        ULRBJ.calcHydAuxAndPtuPressure(state);
    }

    updateUI() {
        const state = this.state;

        this.display.querySelector('#secondary-engine-left-fuel-label').innerHTML = Tools.alignWithNbsp((state.leftTank.quantity * Tools.GALLONS_TO_LB).toFixed(0), 5);
        this.display.querySelector('#secondary-engine-right-fuel-label').innerHTML = Tools.alignWithNbsp((state.rightTank.quantity * Tools.GALLONS_TO_LB).toFixed(0), 5);
        this.display.querySelector('#secondary-engine-total-fuel-label').innerHTML = Tools.alignWithNbsp(((state.leftTank.quantity + state.rightTank.quantity) * Tools.GALLONS_TO_LB).toFixed(0), 5);

        this.display.querySelector('#secondary-engine-left-oil-pressure-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.oilPressure * Tools.PSF_TO_PSI).toFixed(0), 4);
        this.display.querySelector('#secondary-engine-right-oil-pressure-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.oilPressure * Tools.PSF_TO_PSI).toFixed(0), 4);

        this.display.querySelector('#secondary-engine-left-oil-temperature-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.oilTemperature).toFixed(0), 4);
        this.display.querySelector('#secondary-engine-right-oil-temperature-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.oilTemperature).toFixed(0), 4);

        this.display.querySelector('#secondary-engine-left-lp-evm-label').innerHTML = state.leftEngine.lpEvm < 0.3 ? '<0.30'
            : Tools.alignWithNbsp((state.leftEngine.lpEvm).toFixed(2), 5);
        this.display.querySelector('#secondary-engine-right-lp-evm-label').innerHTML = state.rightEngine.lpEvm < 0.3 ? '<0.30'
            : Tools.alignWithNbsp((state.rightEngine.lpEvm).toFixed(2), 5);
        this.display.querySelector('#secondary-engine-left-hp-evm-label').innerHTML = state.leftEngine.hpEvm < 0.6 ? '<0.60'
            : Tools.alignWithNbsp((state.leftEngine.hpEvm).toFixed(2), 5);
        this.display.querySelector('#secondary-engine-right-hp-evm-label').innerHTML = state.rightEngine.hpEvm < 0.6 ? '<0.60'
            : Tools.alignWithNbsp((state.rightEngine.hpEvm).toFixed(2), 5);

        this.display.querySelector('#secondary-engine-left-hyd-pressure-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.hydPressure * Tools.PSF_TO_PSI).toFixed(0), 4);
        this.display.querySelector('#secondary-engine-aux-hyd-pressure-label').innerHTML = Tools.alignWithNbsp((state.hydAuxPressure * Tools.PSF_TO_PSI).toFixed(0), 4);
        this.display.querySelector('#secondary-engine-ptu-hyd-pressure-label').innerHTML = Tools.alignWithNbsp((state.hydPtuPressure * Tools.PSF_TO_PSI).toFixed(0), 4);
        this.display.querySelector('#secondary-engine-right-hyd-pressure-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.hydPressure * Tools.PSF_TO_PSI).toFixed(0), 4);

        this.display.querySelector('#secondary-engine-left-fuel-temperature-label').innerHTML = Tools.alignWithNbsp((state.leftTank.temp).toFixed(0), 4);
        this.display.querySelector('#secondary-engine-right-fuel-temperature-label').innerHTML = Tools.alignWithNbsp((state.rightTank.temp).toFixed(0), 4);

        this.display.querySelector('#secondary-engine-left-bleed-air-pressure-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.bleedAirPressure).toFixed(0), 4);
        this.display.querySelector('#secondary-engine-right-bleed-air-pressure-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.bleedAirPressure).toFixed(0), 4);
    }
}

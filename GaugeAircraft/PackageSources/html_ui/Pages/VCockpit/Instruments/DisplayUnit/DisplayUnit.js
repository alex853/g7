class DisplayUnit extends BaseInstrument {
    constructor() {
        super();
        this.primaryEngineState = {
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
        this.secondaryEngineState = {
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
                index: 1,
                oilPressure: 0,
                oilTemperature: 0,
                engVibration: 0,
                lpEvm: 0,
                hpEvm: 0,
                bleedAirPressure: 0
            },

            hydAuxPressure: 0,
            hydPtuPressure: 0
        };
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

        this.map = this.querySelector('#MapInstrument');
        if (this.map.init) {
            this.map.init(this);
        } else {
            this.map = null; // to allow the gauge working outside the sim
        }
        // this.map.setCenteredOnPlane();
        // this.map.setZoom(10);
        // this.map.setRotationMode(EMapRotationMode.TRACK_UP);

        const primaryEnginePanelSvg = this.querySelector("#primary-engine-panel-svg");

        this.leftEngineEprGauge = new EngineGauge(primaryEnginePanelSvg, 74, 80, "epr");
        this.rightEngineEprGauge = new EngineGauge(primaryEnginePanelSvg, 317, 80, "epr");

        this.leftEngineTgtGauge = new EngineGauge(primaryEnginePanelSvg, 74, 190, "tgt");
        this.rightEngineTgtGauge = new EngineGauge(primaryEnginePanelSvg, 317, 190, "tgt");

        this.leftEngineLpGauge = new EngineGauge(primaryEnginePanelSvg, 74, 302, "lp");
        this.rightEngineLpGauge = new EngineGauge(primaryEnginePanelSvg, 317, 302, "lp");

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

        if (this.map) {
            this.map.setCenteredOnPlane();
            this.map.update();
        }
    }

    startUpdateStateCycle() {
        this._simUpdateInterval = setInterval(() => {
            this.updateState();
            this.updateUI();
        }, 100);
    }

    updateState() {
        this.updatePrimaryEngineState();
        this.updateSecondaryEngineState();
    }

    updatePrimaryEngineState() {
        const state = this.primaryEngineState;

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

    updateSecondaryEngineState() {
        const state = this.secondaryEngineState;

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
        this.updatePrimaryEngineUI();
        this.updateSecondaryEngineUI();
    }

    updatePrimaryEngineUI() {
        const state = this.primaryEngineState;

        this.querySelector('#primary-engine-left-epr-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.epr).toFixed(2), 4);
        this.querySelector('#primary-engine-right-epr-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.epr).toFixed(2), 4);
        this.leftEngineEprGauge.setValue(state.leftEngine.epr);
        this.rightEngineEprGauge.setValue(state.rightEngine.epr);

        this.querySelector('#primary-engine-left-tgt-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.tgt).toFixed(0), 4);
        this.querySelector('#primary-engine-right-tgt-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.tgt).toFixed(0), 4);
        this.leftEngineTgtGauge.setValue(state.leftEngine.tgt);
        this.rightEngineTgtGauge.setValue(state.rightEngine.tgt);

        this.querySelector('#primary-engine-left-egt-label').innerHTML = (state.leftEngine.egt).toFixed(0);
        this.querySelector('#primary-engine-right-egt-label').innerHTML = (state.rightEngine.egt).toFixed(0);

        this.querySelector('#primary-engine-left-n1-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.n1).toFixed(1), 5);
        this.querySelector('#primary-engine-right-n1-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.n1).toFixed(1), 5);
        this.leftEngineLpGauge.setValue(state.leftEngine.n1);
        this.rightEngineLpGauge.setValue(state.rightEngine.n1);

        this.querySelector('#primary-engine-left-n2-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.n2).toFixed(1), 5);
        this.querySelector('#primary-engine-right-n2-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.n2).toFixed(1), 5);

        this.querySelector('#primary-engine-left-fuel-flow-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.fuelFlow * Tools.GALLONS_TO_LB).toFixed(0), 5);
        this.querySelector('#primary-engine-right-fuel-flow-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.fuelFlow * Tools.GALLONS_TO_LB).toFixed(0), 5);
    }

    updateSecondaryEngineUI() {
        const state = this.secondaryEngineState;

        this.querySelector('#secondary-engine-left-fuel-label').innerHTML = Tools.alignWithNbsp((state.leftTank.quantity * Tools.GALLONS_TO_LB).toFixed(0), 5);
        this.querySelector('#secondary-engine-right-fuel-label').innerHTML = Tools.alignWithNbsp((state.rightTank.quantity * Tools.GALLONS_TO_LB).toFixed(0), 5);
        this.querySelector('#secondary-engine-total-fuel-label').innerHTML = Tools.alignWithNbsp(((state.leftTank.quantity + state.rightTank.quantity) * Tools.GALLONS_TO_LB).toFixed(0), 5);

        this.querySelector('#secondary-engine-left-oil-pressure-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.oilPressure * Tools.PSF_TO_PSI).toFixed(0), 4);
        this.querySelector('#secondary-engine-right-oil-pressure-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.oilPressure * Tools.PSF_TO_PSI).toFixed(0), 4);

        this.querySelector('#secondary-engine-left-oil-temperature-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.oilTemperature).toFixed(0), 4);
        this.querySelector('#secondary-engine-right-oil-temperature-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.oilTemperature).toFixed(0), 4);

        this.querySelector('#secondary-engine-left-lp-evm-label').innerHTML = state.leftEngine.lpEvm < 0.3 ? '<0.30'
            : Tools.alignWithNbsp((state.leftEngine.lpEvm).toFixed(2), 5);
        this.querySelector('#secondary-engine-right-lp-evm-label').innerHTML = state.rightEngine.lpEvm < 0.3 ? '<0.30'
            : Tools.alignWithNbsp((state.rightEngine.lpEvm).toFixed(2), 5);
        this.querySelector('#secondary-engine-left-hp-evm-label').innerHTML = state.leftEngine.hpEvm < 0.6 ? '<0.60'
            : Tools.alignWithNbsp((state.leftEngine.hpEvm).toFixed(2), 5);
        this.querySelector('#secondary-engine-right-hp-evm-label').innerHTML = state.rightEngine.hpEvm < 0.6 ? '<0.60'
            : Tools.alignWithNbsp((state.rightEngine.hpEvm).toFixed(2), 5);

        this.querySelector('#secondary-engine-left-hyd-pressure-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.hydPressure * Tools.PSF_TO_PSI).toFixed(0), 4);
        this.querySelector('#secondary-engine-aux-hyd-pressure-label').innerHTML = Tools.alignWithNbsp((state.hydAuxPressure * Tools.PSF_TO_PSI).toFixed(0), 4);
        this.querySelector('#secondary-engine-ptu-hyd-pressure-label').innerHTML = Tools.alignWithNbsp((state.hydPtuPressure * Tools.PSF_TO_PSI).toFixed(0), 4);
        this.querySelector('#secondary-engine-right-hyd-pressure-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.hydPressure * Tools.PSF_TO_PSI).toFixed(0), 4);

        this.querySelector('#secondary-engine-left-fuel-temperature-label').innerHTML = Tools.alignWithNbsp((state.leftTank.temp).toFixed(0), 4);
        this.querySelector('#secondary-engine-right-fuel-temperature-label').innerHTML = Tools.alignWithNbsp((state.rightTank.temp).toFixed(0), 4);

        this.querySelector('#secondary-engine-left-bleed-air-pressure-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.bleedAirPressure).toFixed(0), 4);
        this.querySelector('#secondary-engine-right-bleed-air-pressure-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.bleedAirPressure).toFixed(0), 4);
    }
}

registerInstrument("display-unit-element", DisplayUnit);

class EngineGauge {
    constructor(svg, cx, cy, type) {
        this.svg = svg;

        this.cx = cx;
        this.cy = cy;
        this.arcLength = 225;

        const r = 52;
        const arcWidth = 3;

        const backgroundColor = "#000";
        const whiteColor = "#ddd";
        const yellowArcColor = "#e0c000";
        const redArcColor = "#d33";

        this.createSector(cx, cy, r, 0, this.arcLength, backgroundColor);

        if (type === "epr") {
            this.minValue = 1.00;
            this.maxValue = 1.80;

            this.createArc(cx, cy, r, 0, this.arcLength, whiteColor, arcWidth);
        } else {
            let yellowStart;
            let redStart;
            if (type === "tgt") {
                this.minValue = 0;
                this.maxValue = 950;

                yellowStart = this.calcNeedleAngle(850);
                redStart = this.calcNeedleAngle(900);
            } else {
                this.minValue = 0;
                this.maxValue = 110; // percent

                yellowStart = this.calcNeedleAngle(95); // percent
                redStart = this.calcNeedleAngle(100); // percent
            }

            this.createArc(cx, cy, r, 0, yellowStart, whiteColor, arcWidth);
            this.createArc(cx, cy, r, yellowStart, redStart, yellowArcColor, arcWidth);
            this.createArc(cx, cy, r, redStart, this.arcLength, redArcColor, arcWidth);
        }

        this.needle = this.createNeedle(cx, cy, r-arcWidth/2, whiteColor);
    }

    createSector(cx, cy, radius, startDeg, endDeg, color) {
        const startRad = startDeg * Math.PI / 180;
        const endRad = endDeg * Math.PI / 180;

        const x1 = cx + radius * Math.cos(startRad);
        const y1 = cy + radius * Math.sin(startRad);

        const x2 = cx + radius * Math.cos(endRad);
        const y2 = cy + radius * Math.sin(endRad);

        const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;
        const sweep = 1;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        const d = `M ${cx} ${cy}
                          L ${x1} ${y1}
                          A ${radius} ${radius} 0 ${largeArc} ${sweep} ${x2} ${y2}
                          Z`;

        path.setAttribute("d", d);
        path.setAttribute("fill", color);

        this.svg.appendChild(path);

        return path;
    }

    createArc(cx, cy, r, startDeg, endDeg, color, width) {
        const toRad = d => d * Math.PI / 180;

        const x1 = cx + r * Math.cos(toRad(startDeg));
        const y1 = cy + r * Math.sin(toRad(startDeg));

        const x2 = cx + r * Math.cos(toRad(endDeg));
        const y2 = cy + r * Math.sin(toRad(endDeg));

        const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;

        const path = document.createElementNS("http://www.w3.org/2000/svg","path");

        const d = `M ${x1} ${y1}
                          A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;

        path.setAttribute("d", d);
        path.setAttribute("fill","none");
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", width);

        this.svg.appendChild(path);

        return path;
    }

    createNeedle(cx, cy, r, color) {
        const needle = document.createElementNS("http://www.w3.org/2000/svg", "path");

        const needleBaseRadius = 5;
        const needleEndWidth = 0.5;

        const d = `M 0 -${needleBaseRadius}
                          A ${needleBaseRadius} ${needleBaseRadius} 0 0 0 0 ${needleBaseRadius}
                          L ${r} ${needleEndWidth}
                          L ${r} -${needleEndWidth}
                          Z`;

        needle.setAttribute("d", d);
        needle.setAttribute("fill", color);

        needle.setAttribute("transform", `translate(${cx},${cy}) rotate(0)`);

        this.svg.appendChild(needle);

        return needle;
    }

    setNeedleAngle(angleDeg) {
        this.needle.setAttribute(
            "transform",
            `translate(${this.cx},${this.cy}) rotate(${angleDeg})`
        );
    }

    setValue(value) {
        let angleDeg = this.calcNeedleAngle(value);
        this.setNeedleAngle(angleDeg);
    }

    calcNeedleAngle(value) {
        if (value <= this.minValue) {
            return 0;
        } else if (value >= this.maxValue) {
            return this.maxValue;
        } else {
            return (value - this.minValue) / (this.maxValue - this.minValue) * this.arcLength;
        }
    }
}

Tools = {
    GALLONS_TO_LB: 6.7,
    PSF_TO_PSI: 1/144,

    alignWithNbsp: function (str, len) {
        let actual = str.length;
        while (actual < len) {
            str = "&nbsp;" + str;
            actual++;
        }
        return str;
    }
}

ULRBJ = {
    // todo ak store timestamp and use it for calculations
    // todo ak build a bit more complex model
    // todo ak tgt can not be lower than egt
    estimateTgt: function (engineState) {
        const isRunning = SimVar.GetSimVarValue(`ENG COMBUSTION:${engineState.index}`, "bool");

        const oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        const alt = SimVar.GetSimVarValue("PRESSURE ALTITUDE", "feet");

        const targetTgtIfRunning =
            250 +
            engineState.n1 * 5.5 +
            engineState.fuelFlow * 0.02 +
            oat * 0.4 -
            alt * 0.0008;

        const targetTgt = isRunning ? targetTgtIfRunning : oat;

        return engineState.tgt + (targetTgt - engineState.tgt) * 0.04;
    },

    // todo ak store timestamp and use it for calculations
    // todo ak build a bit more complex model - sun heating? direction of flight and shadow from fuselage?
    // todo ak fuel return simulation?
    estimateFuelTemp: function (tankState) {
        const tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "celsius");

        if (isNaN(tankState.temp)) {
            return tat;
        }

        return tankState.temp + (tat - tankState.temp) * 0.0001;
    },

    // todo ak vibration spike at 40-50%
    estimateLpEvm: function (engineState) {
        const engVibration = engineState.engVibration;
        const n1 = SimVar.GetSimVarValue(`TURB ENG CORRECTED N1:${engineState.index}`, "percent");
        const noise = (Math.random() - 0.5) * 0.002;
        return engVibration * (0.6 + n1 / 400) + noise;
    },

    // todo ak vibration spike at 40-50%
    estimateHpEvm: function (engineState) {
        const engVibration = engineState.engVibration;
        const n2 = SimVar.GetSimVarValue(`TURB ENG CORRECTED N2:${engineState.index}`, "percent");
        const noise = (Math.random() - 0.5) * 0.002;
        return engVibration * (0.6 + n2 / 200) + noise;
    },

    estimateBleedAirPressure(engineState) {
        const n2 = SimVar.GetSimVarValue(`TURB ENG CORRECTED N2:${engineState.index}`, "percent");
        const alt = SimVar.GetSimVarValue("PRESSURE ALTITUDE", "feet");
        const mach = SimVar.GetSimVarValue("AIRSPEED MACH", "mach");

        let targetPressure;

        const bleedOn = SimVar.GetSimVarValue(`BLEED AIR ENGINE:${engineState.index}`, "bool");

        if (!bleedOn) {
            targetPressure = 0;
        } else {
            const densityFactor = Math.exp(-alt / 45000);
            const basePressure = (n2 - 20) * 0.7;
            const ramEffect = mach * 8;
            const pressure = basePressure * densityFactor + ramEffect;
            targetPressure = Math.max(0, pressure);
        }

        return engineState.bleedAirPressure + (targetPressure - engineState.bleedAirPressure) * 0.05;
    },

    calcHydAuxAndPtuPressure(state) {
        const auxPumpOn = SimVar.GetSimVarValue("CIRCUIT HYDRAULIC PUMP ON", "bool");
        state.hydAuxPressure = auxPumpOn ? 2800 : 0;

        const leftPsi = state.leftEngine.hydPressure * Tools.PSF_TO_PSI;
        const rightPsi = state.rightEngine.hydPressure * Tools.PSF_TO_PSI;

        if (leftPsi < 2000 && rightPsi > 2500) {
            state.rightEngine.hydPressure = state.rightEngine.hydPressure * 0.91;
            state.hydPtuPressure = state.rightEngine.hydPressure * 0.95;
            state.leftEngine.hydPressure = state.rightEngine.hydPressure * 0.97;
        } else if (rightPsi < 2000 && leftPsi > 2500) {
            state.leftEngine.hydPressure = state.leftEngine.hydPressure * 0.91;
            state.hydPtuPressure = state.leftEngine.hydPressure * 0.95;
            state.rightEngine.hydPressure = state.leftEngine.hydPressure * 0.97;
        } else {
            state.hydPtuPressure = 0;
        }
    }
}

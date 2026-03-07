class DisplayUnit extends BaseInstrument {
    constructor() {
        super();
        this.primaryEngineState = {
            leftEngine: {
                epr: 0,
                tgt: 0,
                n1: 0,
                n2: 0,
                fuelFlow: 0,
            },
            rightEngine: {
                epr: 0,
                tgt: 0,
                n1: 0,
                n2: 0,
                fuelFlow: 0,
            }
        }
        this.secondaryEngineState = {
            leftFuel: 0,
            rightFuel: 0,

            leftEngine: {
                oilPressure: 0,
                oilTemperature: 0,
            },
            rightEngine: {
                oilPressure: 0,
                oilTemperature: 0,
            }
        };
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
    }

    startUpdateStateCycle() {
        let angle = 0;
        this._simUpdateInterval = setInterval(() => {
            // const page = Pages[this.currentPageIndex];
            // if (page.updateState)
            //     page.updateState();
            //
            // if (page.updateUI) {
            //     page.updateUI(this);
            // }

            this.updateState();
            this.updateUI();

            angle += 1;
            if (angle >= 225) {
                angle = 0;
            }
            this.leftEngineTgtGauge.setNeedleAngle(angle)
        }, 100);
    }

    updateState() {
        this.updatePrimaryEngineState();
        this.updateSecondaryEngineState();
    }

    updatePrimaryEngineState() {
        const state = this.primaryEngineState;

        state.leftEngine.epr = SimVar.GetSimVarValue("TURB ENG PRESSURE RATIO:1", "ratio");
        state.leftEngine.n1 = SimVar.GetSimVarValue("TURB ENG CORRECTED N1:1", "percent");
        state.leftEngine.n2 = SimVar.GetSimVarValue("TURB ENG CORRECTED N2:1", "percent");
        state.leftEngine.fuelFlow = SimVar.GetSimVarValue("ENG FUEL FLOW GPH:1", "gallons per hour");

        state.rightEngine.epr = SimVar.GetSimVarValue("TURB ENG PRESSURE RATIO:2", "ratio");
        state.rightEngine.n1 = SimVar.GetSimVarValue("TURB ENG CORRECTED N1:2", "percent");
        state.rightEngine.n2 = SimVar.GetSimVarValue("TURB ENG CORRECTED N2:2", "percent");
        state.rightEngine.fuelFlow = SimVar.GetSimVarValue("ENG FUEL FLOW GPH:2", "gallons per hour");

        // ENG EXHAUST GAS TEMPERATURE:index Rankine // todo ak TGT instead of EGT

        /*
        SimVar.GetSimVarValue("GENERAL ENG EXHAUST GAS TEMPERATURE:1", "celsius");
        SimVar.GetSimVarValue("ENG EXHAUST GAS TEMPERATURE:1", "celsius");
        */

    }

    updateSecondaryEngineState() {
        const state = this.secondaryEngineState;

        state.leftFuel = SimVar.GetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "gallons");
        state.rightFuel = SimVar.GetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "gallons");

        state.leftEngine.oilPressure = SimVar.GetSimVarValue("GENERAL ENG OIL PRESSURE:1", "psf"); // 10104.487 ==== 70
        state.leftEngine.oilTemperature = SimVar.GetSimVarValue("GENERAL ENG OIL TEMPERATURE:1", "celsius");

        state.rightEngine.oilPressure = SimVar.GetSimVarValue("GENERAL ENG OIL PRESSURE:2", "psf");
        state.rightEngine.oilTemperature = SimVar.GetSimVarValue("GENERAL ENG OIL TEMPERATURE:2", "celsius");
    }

    updateUI() {
        this.updatePrimaryEngineUI();
        this.updateSecondaryEngineUI();
    }

    updatePrimaryEngineUI() {
        const state = this.primaryEngineState;

        this.querySelector('#primary-engine-left-epr-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.epr).toFixed(2), 4);
        this.querySelector('#primary-engine-right-epr-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.epr).toFixed(2), 4);

        this.querySelector('#primary-engine-left-n1-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.n1).toFixed(1), 5);
        this.querySelector('#primary-engine-right-n1-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.n1).toFixed(1), 5);

        this.querySelector('#primary-engine-left-n2-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.n2).toFixed(1), 5);
        this.querySelector('#primary-engine-right-n2-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.n2).toFixed(1), 5);

        this.querySelector('#primary-engine-left-fuel-flow-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.fuelFlow * Tools.GALLONS_TO_LB).toFixed(0), 5);
        this.querySelector('#primary-engine-right-fuel-flow-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.fuelFlow * Tools.GALLONS_TO_LB).toFixed(0), 5);
    }

    updateSecondaryEngineUI() {
        const state = this.secondaryEngineState;

        this.querySelector('#secondary-engine-left-fuel-label').innerHTML = Tools.alignWithNbsp((state.leftFuel * Tools.GALLONS_TO_LB).toFixed(0), 5);
        this.querySelector('#secondary-engine-right-fuel-label').innerHTML = Tools.alignWithNbsp((state.rightFuel * Tools.GALLONS_TO_LB).toFixed(0), 5);
        this.querySelector('#secondary-engine-total-fuel-label').innerHTML = Tools.alignWithNbsp(((state.leftFuel + state.rightFuel) * Tools.GALLONS_TO_LB).toFixed(0), 5);

        this.querySelector('#secondary-engine-panel-left-oil-pressure-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.oilPressure * Tools.PSF_TO_PSI).toFixed(0), 4);
        this.querySelector('#secondary-engine-panel-right-oil-pressure-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.oilPressure * Tools.PSF_TO_PSI).toFixed(0), 4);

        this.querySelector('#secondary-engine-panel-left-oil-temperature-label').innerHTML = Tools.alignWithNbsp((state.leftEngine.oilTemperature).toFixed(0), 4);
        this.querySelector('#secondary-engine-panel-right-oil-temperature-label').innerHTML = Tools.alignWithNbsp((state.rightEngine.oilTemperature).toFixed(0), 4);
    }
}

registerInstrument("display-unit-element", DisplayUnit);

class EngineGauge {
    constructor(svg, cx, cy, type) {
        this.svg = svg;

        this.cx = cx;
        this.cy = cy;

        const r = 52;
        const arcLength = 225;
        const arcWidth = 3;

        const backgroundColor = "black";
        const whiteColor = "#ddd";
        const yellowArcColor = "#e0c000";
        const redArcColor = "#d33";

        this.createSector(cx, cy, r, 0, arcLength, backgroundColor);

        if (type === "epr") {
            this.createArc(cx, cy, r, 0, arcLength, whiteColor, arcWidth);
        } else {
            const yellowStart = type === "tgt" ? 150 : 185;
            const redStart = type === "tgt" ? 190 : 205;

            this.createArc(cx, cy, r, 0, yellowStart, whiteColor, arcWidth);
            this.createArc(cx, cy, r, yellowStart, redStart, yellowArcColor, arcWidth);
            this.createArc(cx, cy, r, redStart, arcLength, redArcColor, arcWidth);
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
        path.setAttribute("opacity", "0.5");

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
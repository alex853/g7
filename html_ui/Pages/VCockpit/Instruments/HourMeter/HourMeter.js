class HourMeter extends BaseInstrument {
    constructor() {
        super();
        this.decimals = 1;
    }
    get templateID() { return "HourMeter"; }
    connectedCallback() {
        super.connectedCallback();
        this.digits = [];
        this.digitsBot = [];
        for (let i = 1; i <= 6; i++) {
            this.digits.push(this.getChildById("d" + i));
            this.digitsBot.push(this.getChildById("d" + i + "Bot"));
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    parseXMLConfig() {
        super.parseXMLConfig();
        if (this.instrumentXmlConfig) {
            let mode = this.instrumentXmlConfig.getElementsByTagName("Decimals");
            if (mode.length > 0) {
                this.decimals = parseInt(mode[0].textContent.toLowerCase());
            }
        }
        for (let i = this.digits.length - 1; i >= this.digits.length - this.decimals; i--) {
            diffAndSetAttribute(this.digits[i], "state", "decimal");
            diffAndSetAttribute(this.digitsBot[i], "state", "decimal");
        }
    }
    Update() {
        super.Update();
        let hour = SimVar.GetSimVarValue("GENERAL ENG ELAPSED TIME:1", "hour");
        for (let i = this.digits.length - 1; i >= 0; i--) {
            if (hour < 0) {
                hour = 0;
            }
            let power = this.digits.length - i - 1 - this.decimals;
            let digit = Math.floor((hour % Math.pow(10, power + 1)) / Math.pow(10, power));
            if (this.digits[i].textContent != digit + '') {
                diffAndSetText(this.digits[i], digit + '');
                diffAndSetText(this.digitsBot[i], ((digit + 1) % 10) + '');
            }
            if (Math.pow(10, power) * (digit + 1) < (hour % Math.pow(10, power + 1)) + 0.001) {
                diffAndSetStyle(this.digits[i], StyleProperty.transform, "translate(0vh,-" + ((100000 * hour) % 100) + '' + "vh)");
                diffAndSetStyle(this.digitsBot[i], StyleProperty.transform, "translate(0vh,-" + ((100000 * hour) % 100) + '' + "vh)");
            }
            else {
                diffAndSetStyle(this.digits[i], StyleProperty.transform, "");
                diffAndSetStyle(this.digitsBot[i], StyleProperty.transform, "");
            }
            hour -= 0.0001;
        }
    }
}
registerInstrument("hour-meter-element", HourMeter);
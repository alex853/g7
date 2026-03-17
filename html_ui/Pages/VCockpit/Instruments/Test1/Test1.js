class Test1 extends BaseInstrument {
    constructor() {
        super();
        this.curr = 1;
    }
    get templateID() { return "Test1"; }
    connectedCallback() {
        super.connectedCallback();
        this.digits = [];
        this.digits.push(this.getChildById("d1"));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    parseXMLConfig() {
        super.parseXMLConfig();
    }
    Update() {
        super.Update();
        let d = Math.round(Math.random() * 1000);
        diffAndSetText(this.digits[0], d + '');
        //let hour = SimVar.GetSimVarValue("GENERAL ENG ELAPSED TIME:1", "hour");
        /*for (let i = this.digits.length - 1; i >= 0; i--) {
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
        }*/
    }
}
registerInstrument("test1-element", Test1);
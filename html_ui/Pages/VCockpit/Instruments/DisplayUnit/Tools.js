Tools = {
    GALLONS_TO_LB: 6.7,
    GALLONS_TO_LITERS: 3.78541,
    JET_A_DENSITY: 0.8,
    PSF_TO_PSI: 1/144,

    alignWithNbsp: function (str, len) {
        let actual = str.length;
        while (actual < len) {
            str = "&nbsp;" + str;
            actual++;
        }
        return str;
    },

    toFixed0: function (num) {
        return Math.round(num).toString();
    },

    toFixed1: function (num) {
        return (Math.round(num*10)/10).toString();
    },

    toFixed2: function (num) {
        return (Math.round(num*100)/100).toString();
    },

    STRING_TO_CODE_CHARSET: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    STRING_TO_CODE_BASE: 36,

    waypointNameToCode: function (str) {
        str = str.toUpperCase();
        let num = 0;
        for (let i = 0; i < Math.min(str.length, 5); i++) {
            const idx = this.STRING_TO_CODE_CHARSET.indexOf(str[i]);
            if (idx === -1) throw new Error(`Invalid character: ${str[i]}`);
            num = num * this.STRING_TO_CODE_BASE + idx;
        }
        return num;
    },

    waypointCodeToString: function (num) {
        let str = "";
        while (num > 0) {
            const rem = num % this.STRING_TO_CODE_BASE;
            str = this.STRING_TO_CODE_CHARSET[rem] + str;
            num = Math.floor(num / this.STRING_TO_CODE_BASE);
        }
        return str;
    }
}

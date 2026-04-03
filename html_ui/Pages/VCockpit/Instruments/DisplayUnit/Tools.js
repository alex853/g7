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
        return (Math.round(num*10)/10).toFixed(1);
    },

    toFixed2: function (num) {
        return (Math.round(num*100)/100).toFixed(2);
    },
}

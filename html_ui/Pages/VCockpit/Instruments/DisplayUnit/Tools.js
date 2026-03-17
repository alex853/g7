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

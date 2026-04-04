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

    offsetLatLon: function (latDeg, lonDeg, headingDeg, distanceNm) {
        const R = 6378137;
        const distMeters = distanceNm * 1852;

        const latRad = latDeg * Math.PI / 180;
        const lonRad = lonDeg * Math.PI / 180;
        const headingRad = headingDeg * Math.PI / 180;

        const newLatRad = Math.asin(
            Math.sin(latRad) * Math.cos(distMeters / R) +
            Math.cos(latRad) * Math.sin(distMeters / R) * Math.cos(headingRad)
        );

        const newLonRad = lonRad + Math.atan2(
            Math.sin(headingRad) * Math.sin(distMeters / R) * Math.cos(latRad),
            Math.cos(distMeters / R) - Math.sin(latRad) * Math.sin(newLatRad)
        );

        return {
            lat: newLatRad * 180 / Math.PI,
            lon: newLonRad * 180 / Math.PI
        };
    }
}

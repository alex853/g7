
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

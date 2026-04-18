class MapPanel {
    constructor(display) {
        console.log("MapPanel init")

        this.id = "map";

        this.display = display;

        this.whiteColor = "#eee";
        this.magentaColor = "#ff00ff";

        this.baseRingRadiusPx = 217;
        this.yOffsetInHdgMode = 0.1;

        this.baseRanges = [this.feetToNm(1500), this.feetToNm(2000), this.feetToNm(3000), this.feetToNm(4500),
            1, 2, 3, 4, 5, 7, 10, 15,
            25, 50, 75, 100,
            150, 250, 500];
        this.baseRangeLabels = ["1500 FT", "2000 FT", "3000 FT", "4500 FT",
            "1", "2", "3", "4", "5", "7", "10", "15",
            "25", "50", "75", "100",
            "150", "250", "500"];

        this.map = display.querySelector('#MapInstrument');
        if (this.map.init) {
            this.map.init(this);
            this.map.flightPlanManager.registerListener();
            // this.map.setContinuousUpdate(true);
            // this.map.setSmoothRotation(true);
        } else {
            this.map = StubMap; // to allow the gauge working outside the sim
        }

        this.canvas = this.display.querySelector('#map-overlay');
        this.ctx = this.canvas.getContext("2d");

        this.flightplanCounter = 0;

        this.state = {
            tat: 0,
            sat: 0,
            tas: 0,
            gs: 0,
            hdg: 0,

            prevWaypoint: "",
            nextWaypoint: "",
            nextWaypointDist: 0
        }

        // this.frameCounter = 0;

        this.skipFrames = 0;

        this.centerDirty = false;
        this.targetCenter = undefined;

        this.zoomDirty = false;
        this.targetZoom = undefined;

        this.rotationDirty = false;
        this.targetRotation = undefined;

        this.rangesDirty = true; // mark them as dirty to force recalculation and initialization
    }

    showPanel() {
        console.log("MapPanel showPanel")

        const layout = this.display.layoutName;
        const destination = this.display.querySelector(`#${layout}-two-thirds`);
        const panel = this.display.querySelector("#map-panel");
        destination.appendChild(panel);

        this.loadMapSettings();
    }

    onUpdate() {
        // const mapIsReady = this.map !== undefined
        //     && this.map.roadNetwork !== undefined
        //     && this.map.roadNetwork._visibleCanvas !== undefined
        //     && this.map.roadNetwork._visibleCanvas.canvas !== undefined;
        const mapIsReady = true;

        // if (this.frameCounter % 25 === 0) {
        //     console.log("MapPanel onUpdate frameCounter " + this.frameCounter + " ready " + mapIsReady + " canvas ready " + this.isCanvasReady());
        // }
        // this.frameCounter++;

        if (mapIsReady && this.isCanvasReady()) {
            if (this.rangesDirty) {
                this.initMapRanges();
                this.map.zoomRanges = this.ranges;
                this.rangesDirty = false;
                this.skipFrames = 5;
                return;
            }

            if (this.rotationDirty) {
                this.map.setRotationMode(this.targetRotation);
                this.rotationDirty = false;
                this.skipFrames = 5;
                return;
            }

            if (this.zoomDirty) {
                this.map.setZoom(this.targetZoom);
                this.zoomDirty = false;
                this.skipFrames = 1;
                return;
            }
        }

        this.recalculateTargetMapCenter();

        if (this.centerDirty) {
            this.map.setCenter(this.targetCenter);
            this.centerDirty = false;
        }

        if (this.skipFrames === 0) {
            this.map.update();
        } else {
            this.skipFrames--;
        }

        this.drawCanvas();
    }

    drawCanvas() {
        if (this.canvas.width !== this.canvas.clientWidth
            || this.canvas.height !== this.canvas.clientHeight) {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
        }

        this.drawRings();
    }

    isCanvasReady() {
        return this.canvas !== undefined
            && this.canvas.width === this.canvas.clientWidth
            && this.canvas.height === this.canvas.clientHeight
            && this.canvas.width > 0
            && this.canvas.height > 0;
    }

    drawRings() {
        const baseRingRadiusPx = this.baseRingRadiusPx;
        const lineWidth = 3;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = this.whiteColor;
        this.ctx.lineWidth = lineWidth;

        const rotationMode = this.map.getRotationMode();
        if (rotationMode === EMapRotationMode.NorthUp) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;

            const center = vector(centerX, centerY);

            drawCircle(this.ctx, center, baseRingRadiusPx, this.whiteColor, lineWidth);
            drawRangeLabel(this.ctx, center, baseRingRadiusPx, this.whiteColor, this.getRangeLabel());
        } else {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2 + this.canvas.height * this.yOffsetInHdgMode;

            const center = vector(centerX, centerY);

            drawCircle(this.ctx, center, baseRingRadiusPx, this.whiteColor, lineWidth);
            drawRangeLabel(this.ctx, center, baseRingRadiusPx, this.whiteColor, this.getRangeLabel());

            drawSelectedHeadingBug(this.ctx, center, baseRingRadiusPx*2, this.magentaColor);

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, baseRingRadiusPx * 2, Math.PI * 1.1, Math.PI * 1.9);
            this.ctx.stroke();

            const triangleSize = 16;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY - baseRingRadiusPx * 2);
            this.ctx.lineTo(centerX - triangleSize/2, centerY - baseRingRadiusPx * 2 - triangleSize);   // левая
            this.ctx.lineTo(centerX + triangleSize/2, centerY - baseRingRadiusPx * 2 - triangleSize);   // левая
            this.ctx.closePath();
            this.ctx.fillStyle = this.whiteColor;
            this.ctx.fill();

            const planeHeadingDeg = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degrees");
            const roundedHeadingDeg = Math.round(planeHeadingDeg / 10) * 10;
            const fromHeadingDeg = roundedHeadingDeg - 90;
            const toHeadingDeg = roundedHeadingDeg + 90;
            for (let hdg = fromHeadingDeg; hdg <= toHeadingDeg; hdg += 5) {
                const longLine = hdg % 10 === 0;

                const relativeHdg = hdg - planeHeadingDeg;
                const angleRad = (relativeHdg - 90) * Math.PI / 180;

                const radiusOuter = baseRingRadiusPx * 2;
                const radiusInner = radiusOuter - (longLine ? 30 : 15);

                const x1 = centerX + radiusOuter * Math.cos(angleRad);
                const y1 = centerY + radiusOuter * Math.sin(angleRad);

                const x2 = centerX + radiusInner * Math.cos(angleRad);
                const y2 = centerY + radiusInner * Math.sin(angleRad);

                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();

                const label = this.getNavRoseHdgLabel(hdg);
                if (label) {
                    const radiusText = baseRingRadiusPx * 2 - 52;

                    const x = centerX + radiusText * Math.cos(angleRad);
                    const y = centerY + radiusText * Math.sin(angleRad);

                    this.ctx.font = "25px RobotoMono";
                    this.ctx.fillStyle = this.whiteColor;
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "middle";

                    this.ctx.fillText(label, x, y);
                }
            }

            drawTrackLine(this.ctx, center, baseRingRadiusPx * 2, this.magentaColor);
        }

        function drawCircle(ctx, center, radius, color, lineWidth) {
            ctx.save();

            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;

            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.restore();
        }

        function drawRangeLabel(ctx, center, radius, color, label) {
            ctx.save();

            ctx.font = "20px RobotoMono";
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const relativePosition = vector(radius, 0).rotateDeg(170);
            const position = center.translate(relativePosition);

            const metrics = ctx.measureText(label);
            const textWidth = Math.max(metrics.width, 30);
            const textHeight = 20;

            const x = position.x + textWidth * 0.25;
            const y = position.y;

            const paddingX = 6;
            const paddingY = 3;

            const rectX = x - textWidth / 2 - paddingX;
            const rectY = y - textHeight / 2 - paddingY;
            const rectW = textWidth + paddingX * 2;
            const rectH = textHeight + paddingY * 2;

            ctx.fillStyle = "black";
            ctx.fillRect(rectX, rectY, rectW, rectH);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(rectX, rectY, rectW, rectH);

            ctx.fillStyle = color;
            ctx.fillText(label, x, y);

            ctx.restore();
        }

        function drawSelectedHeadingBug(ctx, center, ringRadius, color) {
            const trackHdg = SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK DIR", "degrees");
            const planeHeadingDeg = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degrees");
            const relativeHdg = (720 + trackHdg - planeHeadingDeg) % 360;

            if (80 < relativeHdg && relativeHdg < 280) {
                // heading bug is out of screen
                return;
            }

            ctx.save();

            ctx.fillStyle = color;
            ctx.lineWidth = 0;

            const ringRadiusV = vector(0, -ringRadius);
            const ringRadiusVRotated = ringRadiusV.rotateDeg(relativeHdg);
            const basePoint = ringRadiusVRotated.translate(center);

            const angleVDeg = 30;

            const p1V = vector(0, -18);
            const p2V = vector(15, 0);
            const p3V = vector(0, 16);

            const leftP1V = p1V.rotateDeg(relativeHdg + angleVDeg);
            const leftP2V = p2V.rotateDeg(relativeHdg);
            const leftP3V = p3V.rotateDeg(relativeHdg);

            ctx.beginPath();
            moveTo(ctx, basePoint);
            lineTo(ctx, basePoint.translate(leftP1V));
            lineTo(ctx, basePoint.translate(leftP1V).translate(leftP2V));
            lineTo(ctx, basePoint.translate(leftP1V).translate(leftP2V).translate(leftP3V));
            ctx.closePath();
            ctx.fill();

            const rightP1V = p1V.rotateDeg(relativeHdg - angleVDeg);
            const rightP2V = p2V.negate().rotateDeg(relativeHdg);
            const rightP3V = p3V.rotateDeg(relativeHdg);

            ctx.beginPath();
            moveTo(ctx, basePoint);
            lineTo(ctx, basePoint.translate(rightP1V));
            lineTo(ctx, basePoint.translate(rightP1V).translate(rightP2V));
            lineTo(ctx, basePoint.translate(rightP1V).translate(rightP2V).translate(rightP3V));
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        function drawTrackLine(ctx, center, radius, color) {
            const gs = SimVar.GetSimVarValue("GROUND VELOCITY", "knots");
            if (gs < 30) {
                // no track information while speed is low
                return;
            }

            const segmentLen = radius / 20.0;

            const trackHdg = SimVar.GetSimVarValue("GPS GROUND MAGNETIC TRACK", "degrees");
            const planeHeadingDeg = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degrees");
            const relativeHdg = trackHdg - planeHeadingDeg;
            const angleRad = (relativeHdg - 90) * Math.PI / 180;

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.setLineDash([segmentLen, segmentLen]);
            ctx.moveTo(center.x + radius * Math.cos(angleRad), center.y + radius * Math.sin(angleRad));
            ctx.lineTo(center.x, center.y);
            ctx.stroke();
            ctx.restore();
        }

        function moveTo(ctx, p) {
            ctx.moveTo(p.x, p.y);
        }

        function lineTo(ctx, p) {
            ctx.lineTo(p.x, p.y);
        }
    }

    recalculateTargetMapCenter() {
        const planeLat = SimVar.GetSimVarValue("PLANE LATITUDE", "degrees");
        const planeLon = SimVar.GetSimVarValue("PLANE LONGITUDE", "degrees");

        if (!planeLat || !planeLon) {
            return;
        }

        const rotationMode = this.map.getRotationMode();
        if (rotationMode === EMapRotationMode.NorthUp) {
            // this.map.setCenteredOnPlane();
            this.targetCenter = new LatLongAlt(planeLat, planeLon);
        } else {
            const planeHeadingDeg = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degrees");

            const displayRange = this.map.getDisplayRange();
            const yOffsetNm = displayRange * this.yOffsetInHdgMode;

            const p = Tools.offsetLatLon(planeLat, planeLon, planeHeadingDeg, yOffsetNm);

            this.targetCenter = new LatLongAlt(p.lat, p.lon);
        }

        this.centerDirty = true;
    }

    updateState() {
        const state = this.state;

        state.tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "celsius");
        state.sat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        state.tas = SimVar.GetSimVarValue("AIRSPEED TRUE", "knots");
        state.gs = SimVar.GetSimVarValue("GROUND VELOCITY", "knots");
        state.hdg = SimVar.GetSimVarValue("PLANE HEADING DEGREES MAGNETIC", "degrees");

        const FLIGHTPLAN_REQUEST_IS_RUNNING = 11;

        if (this.flightplanCounter === FLIGHTPLAN_REQUEST_IS_RUNNING) {
            return;
        }

        if (this.flightplanCounter > 0) {
            this.flightplanCounter--;
            return;
        }

        Coherent.call("GET_FLIGHTPLAN").then(r => {
            const fp = FlightPlanHelper.parseSnapshot(r);
            const activePlan = FlightPlanHelper.toActivePlan(fp);
            state.prevWaypoint = activePlan.waypoints.length > 0 ? activePlan.waypoints[0].icao : null;
            state.nextWaypoint = activePlan.waypoints.length > 1 ? activePlan.waypoints[1].icao : null;
            state.nextWaypointDist = activePlan.waypoints.length > 1 ? activePlan.waypoints[1].legDistance : 0;

            this.flightplanCounter = 10;
        });
    }

    updateUI() {
        const state = this.state;

        diffAndSetHTML(this.display.querySelector('#map-panel-tat-label'), "TAT" + Tools.alignWithNbsp(Tools.toFixed0(state.tat), 4));
        diffAndSetHTML(this.display.querySelector('#map-panel-sat-label'), "SAT" + Tools.alignWithNbsp(Tools.toFixed0(state.sat), 4));
        diffAndSetHTML(this.display.querySelector('#map-panel-tas-label'), "TAS" + Tools.alignWithNbsp(Tools.toFixed0(state.tas), 4));
        diffAndSetHTML(this.display.querySelector('#map-panel-gs-label'), "GS" + Tools.alignWithNbsp(Tools.toFixed0(state.gs), 5));

        const rotationMode = this.map.getRotationMode();
        const rotationText = rotationMode === EMapRotationMode.NorthUp ? "North" : "Hdg";
        diffAndSetText(this.display.querySelector('#map-header-rotation-label'), rotationText);

        diffAndSetHTML(this.display.querySelector('#map-header-prev-waypoint'), state.prevWaypoint);
        diffAndSetHTML(this.display.querySelector('#map-header-next-waypoint'), state.nextWaypoint);

        diffAndSetHTML(this.display.querySelector('#map-panel-next-dist-label'), Tools.toFixed0(state.nextWaypointDist) + "&nbsp;nm");
        diffAndSetHTML(this.display.querySelector('#map-panel-next-name-label'), state.nextWaypoint || "&nbsp;");

        if (rotationMode === EMapRotationMode.NorthUp) {
            this.display.querySelector(`#map-panel-north-up-div`).classList.remove('hidden');
            this.display.querySelector(`#map-panel-hdg-up-div`).classList.add('hidden');
        } else {
            this.display.querySelector(`#map-panel-north-up-div`).classList.add('hidden');
            this.display.querySelector(`#map-panel-hdg-up-div`).classList.remove('hidden');
        }
        diffAndSetText(this.display.querySelector('#map-panel-hdg-up-label'), this.formatHdg(state.hdg));
    }

    initMapRanges() {
        console.log("MapPanel initMapRanges")

        const ringCoeff = this.canvas.height / (2 * this.baseRingRadiusPx) * 2;
        this.ranges = this.baseRanges.map(r => r * ringCoeff);
    }

    loadMapSettings() {
        console.log("MapPanel loadMapSettings")

        const rotationModeStr = GetStoredData("DU2.Map.Rotation");
        console.log("MapPanel loadMapSettings rotation " + rotationModeStr)

        const rotationMode = rotationModeStr === "HDGUp" ? EMapRotationMode.HDGUp : EMapRotationMode.NorthUp;

        this.rotationDirty = true;
        this.targetRotation = rotationMode;

        const zoomStr = GetStoredData("DU2.Map.Zoom");
        console.log("MapPanel loadMapSettings zoom " + zoomStr)

        if (zoomStr !== undefined) {
            const zoom = Number(zoomStr);
            if (!isNaN(zoom)) {
                this.zoomDirty = true;
                this.targetZoom = zoom;
            }
        }
    }

    onAction(action) {
        if (action === "zoom-plus") {
            const newZoom = Math.min(this.map.getZoom() + 1, this.baseRanges.length-1);

            this.zoomDirty = true;
            this.targetZoom = newZoom;

            SetStoredData("DU2.Map.Zoom", newZoom.toString());
        } else if (action === 'zoom-minus') {
            const newZoom = Math.max(this.map.getZoom() - 1, 0);

            this.zoomDirty = true;
            this.targetZoom = newZoom;

            SetStoredData("DU2.Map.Zoom", newZoom.toString());
        } else if (action === 'rotation') {
            let rotationMode = this.map.getRotationMode();
            if (rotationMode === EMapRotationMode.NorthUp) {
                rotationMode = EMapRotationMode.HDGUp;
                SetStoredData("DU2.Map.Rotation", "HDGUp");
            } else {
                rotationMode = EMapRotationMode.NorthUp;
                SetStoredData("DU2.Map.Rotation", "NorthUp");
            }

            this.rotationDirty = true;
            this.targetRotation = rotationMode;
        } else if (action === 'test') {
            // this.yOffset = this.yOffset - 0.01;
/*            let counter = 0;
            for (let i = 0; i < 10000000; i++) {
                SimVar.SetSimVarValue('L:ULRBJ_TEST_TEST', 'number', i);
                const read = SimVar.GetSimVarValue('L:ULRBJ_TEST_TEST', 'number');
                if (i !== read) {
                    counter++;
                }
            }
            console.log('counter = ' + counter);*/


            [
                "GET_FLIGHTPLAN",
                // "GET_FLIGHTPLAN_FULL",
                // "GET_APPROACH_FLIGHTPLAN",
                // "GET_FLIGHTPLAN_GEOMETRY",
                // "GET_ACTIVE_WAYPOINT_INDEX",
                // "GET_CURRENT_FLIGHTPLAN_INDEX"
            ].forEach(cmd => {
                Coherent.call(cmd).then(r => {
                    console.log(cmd, r);
                    console.log(JSON.stringify(r));
                });
            });
        }
    }

    formatHdg(hdg) {
        const s = Tools.toFixed0(hdg).padStart(3, "0");
        return s === "000" ? "360" : s;
    }

    getRangeLabel() {
        if (!this.map) {
            return "";
        }

        const zoom = this.map.getZoom();
        if (zoom < 0 || zoom > this.baseRangeLabels.length-1) {
            return "???";
        }

        return this.baseRangeLabels[zoom];
    }

    getNavRoseHdgLabel(hdg) {
        const norm = ((hdg % 360) + 360) % 360;

        if (norm === 0) return "N";
        if (norm === 90) return "E";
        if (norm === 180) return "S";
        if (norm === 270) return "W";

        if (norm % 30 === 0) {
            return (norm / 10).toString(); // 30° → "3"
        }

        return null;
    }

    feetToNm(feet) {
        return feet / 6076.12;
    }
}

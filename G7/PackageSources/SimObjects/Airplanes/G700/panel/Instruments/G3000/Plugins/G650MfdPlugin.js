var G650Mfd = (function (exports, msfssdk, wtg3000common, wtg3000mfd, garminsdk) {
	
	class NGGauge extends msfssdk.DisplayComponent {
        constructor() {
            super(...arguments);
			this.needleRef = msfssdk.FSComponent.createRef();
            this.ngValue = msfssdk.ComputedSubject.create(0, (v) => { return v.toFixed(1); });
            this.titleCssClass = msfssdk.SetSubject.create(['dial-gauge-title']);
            this.readoutCssClass = msfssdk.SetSubject.create(['dial-digital-readout']);
            this.svgPathStream = new msfssdk.SvgPathStream(0.01);
            this.transformPathStream = new msfssdk.AffineTransformPathStream(this.svgPathStream);
        }
		
        onAfterRender() {
            this.updateNg(this.ngValue.getRaw());
        }
		
        updateNg(ng) {
            this.ngValue.set(ng);
            const needleRotation = this.getRotation(ng);
            this.needleRef.instance.style.transform = `rotate3d(0, 0, 1, ${needleRotation}deg)`;
        }
		
        getRotation(ng) {
            return NGGauge.ARC_START_ANGLE + (msfssdk.MathUtils.clamp(ng / NGGauge.MAX_NG, 0, 1) * NGGauge.ARC_ANGULAR_WIDTH);
        }
		
        render() {
            return (msfssdk.FSComponent.buildComponent("div", { class: "dial-gauge", "data-checklist": "checklist-ng-gauge" },
                this.renderArc(),
                msfssdk.FSComponent.buildComponent("div", { class: this.titleCssClass },
                    "N1%"),
                msfssdk.FSComponent.buildComponent("div", { class: "dial-needle", ref: this.needleRef },
                    msfssdk.FSComponent.buildComponent("svg", { height: "90", width: "140" },
                        msfssdk.FSComponent.buildComponent("path", { d: "M 17 65 l 22 7 l 0 -14 z", fill: "var(--g3000-color-green)" }))),
                msfssdk.FSComponent.buildComponent("div", { class: this.readoutCssClass }, this.ngValue)));
        }
		
        renderArc() {
            const arcStartRad = NGGauge.ARC_START_ANGLE * Avionics.Utils.DEG2RAD;
            const arcAngularWidthRad = NGGauge.ARC_ANGULAR_WIDTH * Avionics.Utils.DEG2RAD;
            const colorArcRadius = NGGauge.ARC_RADIUS - 5;
            const tickLength = 12;
            // Draw outer white arc border with end ticks
            this.transformPathStream.resetTransform();
            this.transformPathStream.beginPath();
            this.transformPathStream.addTranslation(70, 65);
            this.transformPathStream.addRotation(arcStartRad, 'before');
            this.transformPathStream.moveTo(-NGGauge.ARC_RADIUS + tickLength, 0);
            this.transformPathStream.lineTo(-NGGauge.ARC_RADIUS, 0);
            this.transformPathStream.arc(0, 0, NGGauge.ARC_RADIUS, Math.PI, Math.PI + arcAngularWidthRad);
            this.transformPathStream.addRotation(arcAngularWidthRad, 'before');
            this.transformPathStream.lineTo(-NGGauge.ARC_RADIUS + tickLength, 0);
            const outerBorderPath = this.svgPathStream.getSvgPath();
            // Draw green arc range
            const greenArcStartRad = arcStartRad + 25 / NGGauge.MAX_NG * arcAngularWidthRad;
            const greenArcAngularWidthRad = 77 / NGGauge.MAX_NG * arcAngularWidthRad;
            this.transformPathStream.resetTransform();
            this.transformPathStream.beginPath();
            this.transformPathStream.addTranslation(70, 65);
            this.transformPathStream.addRotation(greenArcStartRad, 'before');
            this.transformPathStream.moveTo(-colorArcRadius, 0);
            this.transformPathStream.arc(0, 0, colorArcRadius, Math.PI, Math.PI + greenArcAngularWidthRad);
            const greenArcPath = this.svgPathStream.getSvgPath();
            // Draw red tick
            const redTickStartRad = arcStartRad + 101 / NGGauge.MAX_NG * arcAngularWidthRad;
            const redTickWidth = 4;
            this.transformPathStream.resetTransform();
            this.transformPathStream.beginPath();
            this.transformPathStream.addTranslation(70, 65);
            this.transformPathStream.addRotation(redTickStartRad, 'before');
            this.transformPathStream.moveTo(-NGGauge.ARC_RADIUS, 0);
            this.transformPathStream.lineTo(-NGGauge.ARC_RADIUS + tickLength, 0);
            this.transformPathStream.lineTo(-NGGauge.ARC_RADIUS + tickLength, -redTickWidth);
            this.transformPathStream.lineTo(-NGGauge.ARC_RADIUS, -redTickWidth);
            this.transformPathStream.closePath();
            const redTickPath = this.svgPathStream.getSvgPath();
            return (msfssdk.FSComponent.buildComponent("svg", { height: "90", width: "140" },
                msfssdk.FSComponent.buildComponent("path", { d: greenArcPath, stroke: "var(--g3000-color-green)", "stroke-width": "5px", fill: "none" }),
                msfssdk.FSComponent.buildComponent("path", { d: outerBorderPath, stroke: "white", "stroke-width": "2px", fill: "none" }),
                msfssdk.FSComponent.buildComponent("path", { d: redTickPath, fill: "var(--g3000-color-red)" })));
        }
    }
    NGGauge.ARC_RADIUS = 60; // pixels, outer border
    NGGauge.ARC_START_ANGLE = -20; // degrees, relative to the negative x-axis
    NGGauge.ARC_END_ANGLE = 170; // degrees, relative to the negative x-axis
    NGGauge.ARC_ANGULAR_WIDTH = NGGauge.ARC_END_ANGLE - NGGauge.ARC_START_ANGLE;
    NGGauge.MAX_NG = 115;
	
	class ITTGauge extends msfssdk.DisplayComponent {
        constructor() {
            super(...arguments);
			this.needleRef = msfssdk.FSComponent.createRef();
            this.ngValue = msfssdk.ComputedSubject.create(0, (v) => { return v.toFixed(2); });
            this.titleCssClass = msfssdk.SetSubject.create(['dial-gauge-title']);
            this.readoutCssClass = msfssdk.SetSubject.create(['dial-digital-readout']);
            this.svgPathStream = new msfssdk.SvgPathStream(0.01);
            this.transformPathStream = new msfssdk.AffineTransformPathStream(this.svgPathStream);
        }
		
        onAfterRender() {
            this.updateNg(this.ngValue.getRaw());
        }
		
        updateNg(ng) {
            this.ngValue.set(ng);
            const needleRotation = this.getRotation(ng);
            this.needleRef.instance.style.transform = `rotate3d(0, 0, 1, ${needleRotation}deg)`;
        }
		
        getRotation(ng) {
            return ITTGauge.ARC_START_ANGLE + (msfssdk.MathUtils.clamp((ng-0.8) / ITTGauge.MAX_NG, 0, 1) * ITTGauge.ARC_ANGULAR_WIDTH);
        }
		
        render() {
            return (msfssdk.FSComponent.buildComponent("div", { class: "dial-gauge", "data-checklist": "checklist-ng-gauge" },
                this.renderArc(),
                msfssdk.FSComponent.buildComponent("div", { class: this.titleCssClass },
                    "EPR"),
                msfssdk.FSComponent.buildComponent("div", { class: "dial-needle", ref: this.needleRef },
                    msfssdk.FSComponent.buildComponent("svg", { height: "90", width: "140" },
                        msfssdk.FSComponent.buildComponent("path", { d: "M 17 65 l 22 7 l 0 -14 z", fill: "var(--g3000-color-green)" }))),
                msfssdk.FSComponent.buildComponent("div", { class: this.readoutCssClass }, this.ngValue)));
        }
		
        renderArc() {
            const arcStartRad = ITTGauge.ARC_START_ANGLE * Avionics.Utils.DEG2RAD;
            const arcAngularWidthRad = ITTGauge.ARC_ANGULAR_WIDTH * Avionics.Utils.DEG2RAD;
            const colorArcRadius = ITTGauge.ARC_RADIUS - 5;
            const tickLength = 12;
            // Draw outer white arc border with end ticks
            this.transformPathStream.resetTransform();
            this.transformPathStream.beginPath();
            this.transformPathStream.addTranslation(70, 65);
            this.transformPathStream.addRotation(arcStartRad, 'before');
            this.transformPathStream.moveTo(-ITTGauge.ARC_RADIUS + tickLength, 0);
            this.transformPathStream.lineTo(-ITTGauge.ARC_RADIUS, 0);
            this.transformPathStream.arc(0, 0, ITTGauge.ARC_RADIUS, Math.PI, Math.PI + arcAngularWidthRad);
            this.transformPathStream.addRotation(arcAngularWidthRad, 'before');
            this.transformPathStream.lineTo(-ITTGauge.ARC_RADIUS + tickLength, 0);
            const outerBorderPath = this.svgPathStream.getSvgPath();
            // Draw red tick
            const redTickStartRad = arcStartRad + 1 / ITTGauge.MAX_NG * arcAngularWidthRad;
            const redTickWidth = 4;
            this.transformPathStream.resetTransform();
            this.transformPathStream.beginPath();
            this.transformPathStream.addTranslation(70, 65);
            this.transformPathStream.addRotation(redTickStartRad, 'before');
            this.transformPathStream.moveTo(-ITTGauge.ARC_RADIUS, 0);
            this.transformPathStream.lineTo(-ITTGauge.ARC_RADIUS + tickLength, 0);
            this.transformPathStream.lineTo(-ITTGauge.ARC_RADIUS + tickLength, -redTickWidth);
            this.transformPathStream.lineTo(-ITTGauge.ARC_RADIUS, -redTickWidth);
            this.transformPathStream.closePath();
            const redTickPath = this.svgPathStream.getSvgPath();
            return (msfssdk.FSComponent.buildComponent("svg", { height: "90", width: "140" },
			
                msfssdk.FSComponent.buildComponent("path", { d: outerBorderPath, stroke: "white", "stroke-width": "2px", fill: "none" }),
                msfssdk.FSComponent.buildComponent("path", { d: redTickPath, fill: "var(--g3000-color-red)" })));
        }
    }
    ITTGauge.ARC_RADIUS = 60; // pixels, outer border
    ITTGauge.ARC_START_ANGLE = -20; // degrees, relative to the negative x-axis
    ITTGauge.ARC_END_ANGLE = 170; // degrees, relative to the negative x-axis
    ITTGauge.ARC_ANGULAR_WIDTH = ITTGauge.ARC_END_ANGLE - ITTGauge.ARC_START_ANGLE;
    ITTGauge.MAX_NG = 1.2;
	
	class FlapsGauge extends msfssdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.spoilersNeedleRef = msfssdk.FSComponent.createRef();
            this.flapsSelectBugRef = msfssdk.FSComponent.createRef();
            this.flapsNeedleRef = msfssdk.FSComponent.createRef();
        }
        //Spoiler animate range: 3deg to -45deg
        //Flaps animate range: 0deg to 77deg
        //Flap bug animate range: -1deg to 78 deg
        /**
         * Updates the flaps needle.
         * @param flapsAngle The value to update the needle to.
         */
        updateFlaps(flapsAngle) {
            const startAngle = 0;
            const endAngle = 77;
            const arc = endAngle - startAngle;
            if (flapsAngle <= 20) {
                flapsAngle *= 1.666;
            }
            else if (flapsAngle > 20 && flapsAngle <= 43) {
                flapsAngle *= 1.333;
            }
            else if (flapsAngle > 43 && flapsAngle < 100) {
                flapsAngle *= 1.333;
            }
            const rotation = startAngle + ((flapsAngle / 100) * arc);
            this.flapsNeedleRef.instance.style.transform = `rotate3d(0, 0, 1, ${msfssdk.MathUtils.clamp(rotation, 0, 77)}deg)`; //Math utils hack for stopping the pointer from snapping because it is displaying the actual flaps angle.
        }
        /**
         * Updates the flaps selector bug.
         * @param handleIndex The flaps handle index.
         */
        updateFlapsHandle(handleIndex) {
            const startAngle = -1;
            const endAngle = 78;
            const arc = endAngle - startAngle;
            const rotation = startAngle + ((handleIndex / 3) * arc);
            this.flapsSelectBugRef.instance.style.transform = `rotate3d(0, 0, 1, ${rotation}deg)`;
        }
        /**
         * Updates the spoilers needle.
         * @param spoilerPct The value to update the needle to in percent.
         */
        updateSpoilers(spoilerPct) {
            const startAngle = 3;
            const endAngle = -45;
            const arc = endAngle - startAngle;
            const rotation = startAngle + ((spoilerPct / 100) * arc);
            this.spoilersNeedleRef.instance.style.transform = `rotate3d(0, 0, 1, ${rotation}deg)`;
        }
        /** @inheritdoc */
        render() {
            return (msfssdk.FSComponent.buildComponent("div", { class: "flaps-gauge-container" },
                msfssdk.FSComponent.buildComponent("svg", null,
                    msfssdk.FSComponent.buildComponent("path", { d: "M 188 90 c -8 -2 -8 -12 0 -14 M 188 90 c -78 7 -108 5 -125 1 c -18 -4 -6 -13 0 -16 c 21.398 -9.139 50 -4 60 -4 m 65 5 l -14 -1", stroke: "white", "stroke-width": "2px" }),
                    msfssdk.FSComponent.buildComponent("path", { d: "M 205 127 a 42 42 0 0 0 34 -44", stroke: "white", "stroke-width": "2px" }),
                    msfssdk.FSComponent.buildComponent("text", { x: "255", y: "87", "font-size": "12", fill: "white" }, "UP"),
                    msfssdk.FSComponent.buildComponent("text", { x: "250", y: "114", "font-size": "12", fill: "white" }, "1"),
                    msfssdk.FSComponent.buildComponent("text", { x: "232", y: "136", "font-size": "12", fill: "white" }, "2"),
                    msfssdk.FSComponent.buildComponent("text", { x: "190", y: "150", "font-size": "12", fill: "white" }, "FULL")),
                msfssdk.FSComponent.buildComponent("div", { class: "flaps-needle", ref: this.flapsNeedleRef },
                    msfssdk.FSComponent.buildComponent("svg", { height: "8px", width: "47px" },
                        msfssdk.FSComponent.buildComponent("path", { d: "M 6 0 c 10.5 -0.2 26.8 2.1 40 3.5 c 1 0 1 1 0 1 c -13.3 1.1 -28 2.5 -40 3.5 c -7 0 -7 -8 0 -8", fill: "white" }))),
                msfssdk.FSComponent.buildComponent("div", { class: "spoiler-needle", ref: this.spoilersNeedleRef },
                    msfssdk.FSComponent.buildComponent("svg", { height: "8px", width: "47px" },
                        msfssdk.FSComponent.buildComponent("path", { d: "M 5.616 0.549 c 8.4 -0.16 21.44 1.68 32 2.4 c 0.8 0 0.8 0.8 0 0.8 c -10.64 0.88 -22.4 1.6 -32 1.6 c -5.6 0 -5.6 -4 -0 -4.8 ", fill: "white" }))),
                msfssdk.FSComponent.buildComponent("div", { class: "flaps-cyan-carrot", ref: this.flapsSelectBugRef },
                    msfssdk.FSComponent.buildComponent("svg", null,
                        msfssdk.FSComponent.buildComponent("path", { d: "M 0 6 l 7.2 -4.8 l 0 1.6 l -4.8 3.2 l 4.8 3.2 l 0 1.6 l -7.2 -4.8", fill: "rgb(0,255,255)" })))));
        }
    }
	
	class TrimGauge extends msfssdk.DisplayComponent {
        constructor() {
            super(...arguments);
			this.elevNeedleRef = msfssdk.FSComponent.createRef();
			this.elevPosText = msfssdk.Subject.create(0);
			this.rudderNeedleRef = msfssdk.FSComponent.createRef();
			this.aileronNeedleRef = msfssdk.FSComponent.createRef();
        }
		
		updateElevTrim(elevPos){
			const newValue = elevPos * 0.4;
			this.elevNeedleRef.instance.style.transform = `translateY(${newValue}px)`;
		}
		
		updateElevTrimText(elevPos){
			const newValue = elevPos * 10;
			this.elevPosText.set(newValue.toFixed(1));
		}
		
		updateRudderTrim(ruddPos){
			const newValue = ruddPos * 0.4;
			this.rudderNeedleRef.instance.style.transform = `translateX(${newValue}px)`;
		}
		
		updateAileronTrim(aileronPos){
			const newValue = aileronPos * 0.4;
			this.aileronNeedleRef.instance.style.transform = `rotate(${newValue}deg)`;
		}

        render() {
            return (msfssdk.FSComponent.buildComponent("div", null,
						msfssdk.FSComponent.buildComponent("svg", { id:"ailSvg", height: "35px", width: "132px", "viewBox":"610 245 140 43" },
							msfssdk.FSComponent.buildComponent("path", { d: "M 740.543 284.402 L 747.4 275.052 L 743.764 271.727 C 740.128 268.403 732.855 261.753 721.843 256.766 C 710.83 251.779 696.077 248.455 681.324 248.559 C 666.571 248.663 651.817 252.195 640.805 257.182 C 629.792 262.169 622.519 268.61 618.883 271.831 L 615.247 275.051 L 622.104 284.403", stroke:"white", "stroke-width":"4px" }),
							msfssdk.FSComponent.buildComponent("line", { x1: "650.155", y1: "267.571", x2: "645.168", y2: "256.351", stroke: "white", "stroke-width": "4px" }),
							msfssdk.FSComponent.buildComponent("line", { x1: "713.115", y1: "267.571", x2: "719.972", y2: "256.351", stroke: "white", "stroke-width": "4px" }),
							msfssdk.FSComponent.buildComponent("line", { x1: "665", y1: "244", x2: "700", y2: "244", stroke: "var(--g3000-color-green)", "stroke-width": "4px" })
						),
						msfssdk.FSComponent.buildComponent("svg", { id:"ailSvg-marker", height: "23px", width: "24px", "viewBox":"668 253 30 28.5" , ref: this.aileronNeedleRef },
							msfssdk.FSComponent.buildComponent("polygon", { points:"670.103 276.922 681.947 253.857 694.414 276.922", stroke: "var(--g3000-color-green)", "stroke-width": "4px" })
						),
						msfssdk.FSComponent.buildComponent("svg", { id:"rudSvg", height: "18px", width: "124px", "viewBox":"466 260 130 23.5" },
							msfssdk.FSComponent.buildComponent("polyline", { points:"469.379 260.091 469.38 278.169 593.429 278.169 593.429 260.091", stroke: "white", "stroke-width": "4px" }),
							msfssdk.FSComponent.buildComponent("line", { x1: "499.925", y1: "268.195", x2: "499.925", y2: "277.545", stroke: "white", "stroke-width": "4px" }),
							msfssdk.FSComponent.buildComponent("line", { x1: "562.261", y1: "268.195", x2: "562.261", y2: "278.169", stroke: "white", "stroke-width": "4px" }),
							msfssdk.FSComponent.buildComponent("line", { x1: "518", y1: "283", x2: "547", y2: "283", stroke: "var(--g3000-color-green)", "stroke-width": "4px" })
						),
						msfssdk.FSComponent.buildComponent("svg", { id:"rudSvg-marker", height: "18px", width: "18px", "viewBox":"519 254 26 26", ref: this.rudderNeedleRef },
							msfssdk.FSComponent.buildComponent("polygon", { points:"530.469 273.182 521.742 254.481 539.82 254.481", stroke: "var(--g3000-color-green)", "stroke-width": "4px" })
						),
						msfssdk.FSComponent.buildComponent("svg", { id:"stabSvg", height: "104px", width: "21px", "viewBox":"375 191 27 111" },
							msfssdk.FSComponent.buildComponent("polyline", { points:"397.07 195.261 376.499 195.261 375.252 299.363 395.823 299.363", stroke: "white", "stroke-width": "4px" }),
							msfssdk.FSComponent.buildComponent("line", { x1: "387.719", y1: "273.874", x2: "375.875", y2: "273.874", stroke: "white", "stroke-width": "4px" }),
							msfssdk.FSComponent.buildComponent("line", { x1: "388.966", y1: "220.265", x2: "376.499", y2: "220.265", stroke: "white", "stroke-width": "4px" })
						),
						msfssdk.FSComponent.buildComponent("div", { class: "stab-needle", ref: this.elevNeedleRef },
							msfssdk.FSComponent.buildComponent("svg", { id:"stab-marker", height: "28px", width: "70px", "viewBox":"374 221 85 35" },
								msfssdk.FSComponent.buildComponent("polygon", { points:"448.809 224.005 448.809 252.68 397.07 252.68 378.369 238.343 397.693 224.005", stroke: "var(--g3000-color-green)", "stroke-width": "4px" })
							),
							msfssdk.FSComponent.buildComponent("p", { "id":"txt-stab-value" }, this.elevPosText)
						),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-ail" }, "AIL"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-rud" }, "RUD"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-stab-nu" }, "ND"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-stab" }, "STAB"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-stab-nd" }, "NU")
					)

			);
        }
    }
	
	class DoorGauge extends msfssdk.DisplayComponent {
        constructor() {
            super(...arguments);
			this.mainDoorOpen = msfssdk.FSComponent.createRef();
			this.mainDoorClosed = msfssdk.FSComponent.createRef();
			this.baggageDoorOpen = msfssdk.FSComponent.createRef();
			this.baggageDoorClosed = msfssdk.FSComponent.createRef();
        }
		
		updateMainDoor(doorIsOpen){
			if(doorIsOpen){
				this.mainDoorClosed.instance.style.display = "none";
				this.mainDoorOpen.instance.style.display = "block";
			} else{
				this.mainDoorOpen.instance.style.display = "none";
				this.mainDoorClosed.instance.style.display = "block";
			}				
		}	
		
		updateBaggageDoor(doorIsOpen){
			if(doorIsOpen){
				this.baggageDoorClosed.instance.style.display = "none";
				this.baggageDoorOpen.instance.style.display = "block";
			} else{
				this.baggageDoorOpen.instance.style.display = "none";
				this.baggageDoorClosed.instance.style.display = "block";
			}				
		}		

        render() {
            return (msfssdk.FSComponent.buildComponent("div", {class: "doors-container" },
						msfssdk.FSComponent.buildComponent("svg", { height: "54px", width: "283px", "viewBox":"310 193 284 55" },
							msfssdk.FSComponent.buildComponent("path", { d: "M 392.479 235.416 C 392.479 235.416 369.638168979304 235.61105502304198 359.963 234.355 C 351.98486370431806 233.31925807237675 344.95510319109803 231.75915723507265 338.402 229.407 C 332.46179982325526 227.274836898633 326.60448784007497 224.20789254969355 322.144 221.278 C 318.58991634524824 218.94348332953868 313.26739764295695 216.33296521315864 313.308 213.855 C 313.3504004991696 211.2672940239261 319.5706273620636 208.38228485104884 323.204 206.08 C 327.0669866054533 203.63222036719284 331.27922579886723 201.43765685248908 335.928 199.718 C 341.0821556847438 197.81139435331025 347.96888992858646 196.35209730175185 352.893 195.477 C 356.60802564775366 194.81677736623686 357.74523374025466 194.66819282655217 362.79 194.416 C 378.97875873493285 193.6067080301594 465.289 195.123 465.289 195.123", stroke:"white", "stroke-width":"2px" }),
							msfssdk.FSComponent.buildComponent("path", { d: "M 414.749 236.475 C 414.749 236.475 503.3467851788514 237.3762381694487 515.128 236.475 C 517.6631614793461 236.2810654757944 519.722 235.768 519.722 235.768", stroke:"white", "stroke-width":"2px" }),
							msfssdk.FSComponent.buildComponent("path", { d: "M 537.747 232.234 C 537.747 232.234 555.7661390782328 228.63379460620294 563.195 226.932 C 569.0288759907233 225.5955826408892 575.040836679753 224.7833334482651 578.747 223.044 C 581.1203966109433 221.93014511701062 583.1549234597129 220.77548218126188 584.049 219.157 C 584.8257178472044 217.75096378394534 585.14615070494 215.5459911635482 584.402 214.208 C 583.4817203398487 212.55332703509995 581.1604569596611 211.997387055629 577.687 210.674 C 567.7944695088776 206.90494601389736 529.6658802819891 197.6737860235591 517.954 195.829 C 513.1691459995859 195.0753181340481 511.635250793948 195.25739806387267 507.705 195.122 C 502.39777188266066 194.93916474360245 488.972 195.122 488.972 195.122", stroke:"white", "stroke-width":"2px" }),
							msfssdk.FSComponent.buildComponent("path", { d: "M 376.22 197.597 C 376.22 197.597 368.91879803522846 199.37824541437465 365.617 200.778 C 362.4589362094157 202.11682031105585 358.665504117118 203.64698195709096 356.781 205.726 C 355.30975323755587 207.34910527045744 354.5976330286821 209.42668771225348 354.307 211.381 C 354.01927823056633 213.31573602090603 354.04906810677323 215.52446118431018 355.014 217.389 C 356.2238614015937 219.72681633782727 359.5100850231685 222.03027457987173 362.083 223.751 C 364.58745695164265 225.42594176026577 367.71482324164884 226.65735297541875 370.212 227.639 C 372.23707352421604 228.43506194994285 373.9600597600225 229.44173365869554 375.868 229.407 C 377.84636017232947 229.370984360955 381.91432114195817 227.82464464667078 381.876 227.286 C 381.840698257592 226.78979624419995 378.5430351820511 226.77400307843868 376.574 226.226 C 373.97899757986977 225.503783694395 370.3638743632111 224.2057396623478 367.738 223.045 C 365.50371709991566 222.0573591534433 363.29465722083347 221.2544446973733 361.729 219.864 C 360.30949918007616 218.6033553571519 358.9654276772282 216.96645550690795 358.549 215.268 C 358.12852566014436 213.55303964291087 358.31363264945094 211.2713912446498 359.256 209.614 C 360.3767553425291 207.6428683696223 363.2407820162142 205.89700237820102 365.617 204.665 C 368.05688603827235 203.3999875212619 370.99761893761627 202.95208609695845 373.746 202.191 C 376.53415691002317 201.4188991114439 382.16865925672846 200.91187816642565 382.23 200.071 C 382.2828817066325 199.34608096350127 376.22 197.597 376.22 197.597 C 376.2200000000001 197.59700000000007 376.22 197.597 376.22 197.597 C 376.22 197.597 376.21999999999997 197.59699999999998 376.22 197.597", stroke:"white" }),
							msfssdk.FSComponent.buildComponent("line", { ref: this.mainDoorOpen, x1: "393.893", y1: "235.768", x2: "411.918", y2: "246.725", stroke: "yellow", "stroke-width": "3px", "stroke-linecap": "round" }),
							msfssdk.FSComponent.buildComponent("line", { ref: this.baggageDoorOpen, x1: "520.78", y1: "235.689", x2: "536.685", y2: "243.82", stroke: "yellow", "stroke-width": "3px", "stroke-linecap": "round" }),
							msfssdk.FSComponent.buildComponent("line", { x1: "466.702", y1: "195.397", x2: "487.555", y2: "195.044", stroke: "var(--g3000-color-green)", "stroke-width": "3px", "stroke-linecap": "round" }),
							msfssdk.FSComponent.buildComponent("line", { ref: this.mainDoorClosed, x1: "393.893", y1: "235.689", x2: "413.332", y2: "236.043", stroke: "var(--g3000-color-green)", "stroke-width": "3px", "stroke-linecap": "round" }),
							msfssdk.FSComponent.buildComponent("line", { ref: this.baggageDoorClosed, x1: "521.133", y1: "235.689", x2: "536.33", y2: "232.508", stroke: "var(--g3000-color-green)", "stroke-width": "3px", "stroke-linecap": "round" })
						),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-emer" }, "EMER"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-cargo" }, "CARGO"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-pax" }, "PAX"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-oxy" }, "OXY<br>95%"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-ckpt" }, "CKPT<br>25°C"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-fwd" }, "FWD<br>25°C"),
						msfssdk.FSComponent.buildComponent("p", { "id":"txt-aft" }, "AFT<br>27°C")
					)
			);
        }
    }


	class G650EngineInstruments extends msfssdk.DisplayComponent {
        constructor(props) {
            super(...arguments);
			this.bus = props.bus;
			this.sub = this.bus.getSubscriber();
			this.previousTimestamp = -1;
			
			this.n1LeftRef = msfssdk.FSComponent.createRef();
			this.n1RightRef = msfssdk.FSComponent.createRef();
			this.eprLeftRef = msfssdk.FSComponent.createRef();
			this.eprRightRef = msfssdk.FSComponent.createRef();
			this.n2Left = msfssdk.Subject.create(0);
			this.n2Right = msfssdk.Subject.create(0);
			this.ffLeft = msfssdk.Subject.create(0);
			this.ffRight = msfssdk.Subject.create(0);
			this.oilTempLeft = msfssdk.Subject.create(0);
			this.oilTempRight = msfssdk.Subject.create(0);
			this.oilPresLeft = msfssdk.Subject.create(0);
			this.oilPresRight = msfssdk.Subject.create(0);
			this.totFuel = msfssdk.Subject.create(0);
			this.fuelLeft = msfssdk.Subject.create(0);
			this.fuelCenter = msfssdk.Subject.create(0);
			this.fuelRight = msfssdk.Subject.create(0);
			this.fuelReserve = msfssdk.Subject.create(0);
			this.tempSat = msfssdk.Subject.create(0);
			this.tempTat = msfssdk.Subject.create(0);
			this.flapsGaugeRef = msfssdk.FSComponent.createRef();
			this.trimGaugeRef = msfssdk.FSComponent.createRef();
			this.doorGaugeRef = msfssdk.FSComponent.createRef();
			this.cabAlt = msfssdk.Subject.create(0);
			this.cabRate = msfssdk.Subject.create(0);
			this.cabDelta = msfssdk.Subject.create(0);
			this.batVolt = msfssdk.Subject.create(0);
			this.batLoad = msfssdk.Subject.create(0);
        }
		
        onAfterRender() {
			this.sub.on('simTime').handle(this.update.bind(this));
			this.sub.on("n1_1").withPrecision(1).handle(e => {
                this.n1LeftRef.instance.updateNg(e);
            });
			this.sub.on("n1_2").withPrecision(1).handle(e => {
                this.n1RightRef.instance.updateNg(e);
            });
        }
		
		update(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
                return;
            }
			this.eprLeftRef.instance.updateNg(SimVar.GetSimVarValue('ENG PRESSURE RATIO:1', msfssdk.SimVarValueType.Percent)/100);
			this.eprRightRef.instance.updateNg(SimVar.GetSimVarValue('ENG PRESSURE RATIO:2', 'percent over 100'));
			this.n2Left.set(SimVar.GetSimVarValue('TURB ENG N2:1', msfssdk.SimVarValueType.Percent).toFixed(1));
			this.n2Right.set(SimVar.GetSimVarValue('TURB ENG N2:2', msfssdk.SimVarValueType.Percent).toFixed(1));
			this.ffLeft.set(SimVar.GetSimVarValue('ENG FUEL FLOW PPH:1', msfssdk.SimVarValueType.PPH).toFixed(0));
			this.ffRight.set(SimVar.GetSimVarValue('ENG FUEL FLOW PPH:2', msfssdk.SimVarValueType.PPH).toFixed(0));
			this.oilTempLeft.set(SimVar.GetSimVarValue('GENERAL ENG OIL TEMPERATURE:1', msfssdk.SimVarValueType.Celsius).toFixed(0));
			this.oilTempRight.set(SimVar.GetSimVarValue('GENERAL ENG OIL TEMPERATURE:2', msfssdk.SimVarValueType.Celsius).toFixed(0));
			this.oilPresLeft.set(SimVar.GetSimVarValue('ENG OIL PRESSURE:1', msfssdk.SimVarValueType.PSI).toFixed(0));
			this.oilPresRight.set(SimVar.GetSimVarValue('ENG OIL PRESSURE:2', msfssdk.SimVarValueType.PSI).toFixed(0));
			this.totFuel.set(SimVar.GetSimVarValue('FUEL TOTAL QUANTITY WEIGHT', msfssdk.SimVarValueType.LBS).toFixed(0));
			this.fuelLeft.set((SimVar.GetSimVarValue('FUEL TANK LEFT MAIN QUANTITY', msfssdk.SimVarValueType.GAL) * 6.7 ).toFixed(0));
			this.fuelCenter.set((SimVar.GetSimVarValue('FUEL TANK CENTER2 QUANTITY', msfssdk.SimVarValueType.GAL) * 6.7 ).toFixed(0));
			this.fuelRight.set((SimVar.GetSimVarValue('FUEL TANK RIGHT MAIN QUANTITY', msfssdk.SimVarValueType.GAL) * 6.7 ).toFixed(0));
			this.tempSat.set(SimVar.GetSimVarValue('AMBIENT TEMPERATURE', msfssdk.SimVarValueType.Celsius).toFixed(0));			
			this.flapsGaugeRef.instance.updateFlaps(SimVar.GetSimVarValue('TRAILING EDGE FLAPS LEFT PERCENT', msfssdk.SimVarValueType.Percent));
			this.flapsGaugeRef.instance.updateFlapsHandle(SimVar.GetSimVarValue('FLAPS HANDLE INDEX', msfssdk.SimVarValueType.Number));
			this.flapsGaugeRef.instance.updateSpoilers(SimVar.GetSimVarValue('SPOILERS WITHOUT SPOILERONS LEFT POSITION', msfssdk.SimVarValueType.Percent));			
			this.trimGaugeRef.instance.updateElevTrim(SimVar.GetSimVarValue('ELEVATOR TRIM PCT', msfssdk.SimVarValueType.Percent));
			this.trimGaugeRef.instance.updateElevTrimText(SimVar.GetSimVarValue('ELEVATOR TRIM INDICATOR', msfssdk.SimVarValueType.Number));
			this.trimGaugeRef.instance.updateRudderTrim(SimVar.GetSimVarValue('RUDDER TRIM PCT', msfssdk.SimVarValueType.Percent));
			this.trimGaugeRef.instance.updateAileronTrim(SimVar.GetSimVarValue('AILERON TRIM PCT', msfssdk.SimVarValueType.Percent));
			this.doorGaugeRef.instance.updateMainDoor(SimVar.GetSimVarValue('CABIN NO SMOKING ALERT SWITCH', msfssdk.SimVarValueType.Bool));
			this.doorGaugeRef.instance.updateBaggageDoor(SimVar.GetSimVarValue('CABIN SEATBELTS ALERT SWITCH', msfssdk.SimVarValueType.Bool));
			this.cabAlt.set(SimVar.GetSimVarValue('PRESSURIZATION CABIN ALTITUDE', msfssdk.SimVarValueType.Feet).toFixed(0));
			this.cabRate.set(SimVar.GetSimVarValue('PRESSURIZATION CABIN ALTITUDE RATE', msfssdk.SimVarValueType.FPM).toFixed(0));
			this.cabDelta.set(SimVar.GetSimVarValue('PRESSURIZATION PRESSURE DIFFERENTIAL', msfssdk.SimVarValueType.PSI).toFixed(1));
			this.batVolt.set(SimVar.GetSimVarValue('ELECTRICAL BATTERY VOLTAGE', msfssdk.SimVarValueType.Volts).toFixed(1));
			this.batLoad.set(SimVar.GetSimVarValue('ELECTRICAL BATTERY LOAD', msfssdk.SimVarValueType.Amps).toFixed(0));
			
            this.previousTimestamp = timestamp;
        }

        render() {
            return (msfssdk.FSComponent.buildComponent("div", { class: "engine-instruments-container" },
						msfssdk.FSComponent.buildComponent("div", { class: "double-div" },
							msfssdk.FSComponent.buildComponent(ITTGauge, { ref: this.eprLeftRef }),
							msfssdk.FSComponent.buildComponent(ITTGauge, { ref: this.eprRightRef })						
						),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div" },
							msfssdk.FSComponent.buildComponent(NGGauge, { ref: this.n1LeftRef }),
							msfssdk.FSComponent.buildComponent(NGGauge, { ref: this.n1RightRef })						
						),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div eng-varis" },
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.n2Left),
							msfssdk.FSComponent.buildComponent("div", null, "N2%"),
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.n2Right)
						),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div eng-varis-2" },
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.ffLeft),
							msfssdk.FSComponent.buildComponent("div", null, "FF PPH"),
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.ffRight)
						),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div eng-varis-2" },
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.oilTempLeft),
							msfssdk.FSComponent.buildComponent("div", null, "OIL TEMP"),
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.oilTempRight)
						),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div eng-varis-2" },
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.oilPresLeft),
							msfssdk.FSComponent.buildComponent("div", null, "OIL PRESS"),
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.oilPresRight)
						),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div fuel-cont" },
							msfssdk.FSComponent.buildComponent("div", null, "TOTAL"),
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt full-border" }, this.totFuel),
							msfssdk.FSComponent.buildComponent("div", null, "FUEL LBS")
						),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div eng-varis-2" },
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.fuelLeft),
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.fuelCenter),
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.fuelRight)
						),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div temp-varis" },
							msfssdk.FSComponent.buildComponent("div", { class: "flow-row temp-border" }, "SAT&nbsp;", 
								msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.tempSat),"°C"),
							msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.fuelReserve),
							msfssdk.FSComponent.buildComponent("div", { class: "flow-row temp-border" }, "TAT&nbsp;&nbsp;", 
								msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.tempTat),"°C")
						),
						msfssdk.FSComponent.buildComponent("div", null,
							msfssdk.FSComponent.buildComponent(FlapsGauge, { ref: this.flapsGaugeRef })
						),
						msfssdk.FSComponent.buildComponent("div", { class: "trim-class"},
							msfssdk.FSComponent.buildComponent(TrimGauge, { ref: this.trimGaugeRef })
						),
						msfssdk.FSComponent.buildComponent("div", null,
							msfssdk.FSComponent.buildComponent(DoorGauge, { ref: this.doorGaugeRef })
						),
						msfssdk.FSComponent.buildComponent("div", null, "<br>----------------------&nbsp;&nbsp;&nbsp;CABIN PRESS&nbsp;&nbsp;&nbsp;-----------------------"),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div" },
							msfssdk.FSComponent.buildComponent("div", { class: "double-div2" }, 
								msfssdk.FSComponent.buildComponent("div", null, "CAB ALT"),
								msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.cabAlt)
							),
							msfssdk.FSComponent.buildComponent("div", { class: "double-div2" }, 
								msfssdk.FSComponent.buildComponent("div", null, "CAB RATE"),
								msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.cabRate)
							)
						),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div" },
							msfssdk.FSComponent.buildComponent("div", { class: "double-div2" }, 
								msfssdk.FSComponent.buildComponent("div", null, "CAB \u0394P"),
								msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.cabDelta)
							)
						),
						msfssdk.FSComponent.buildComponent("div", null, "<br>-------------------------&nbsp;&nbsp;&nbsp;BATTERY&nbsp;&nbsp;&nbsp;--------------------------"),
						msfssdk.FSComponent.buildComponent("div", { class: "double-div" },
							msfssdk.FSComponent.buildComponent("div", { class: "double-div2" }, 
								msfssdk.FSComponent.buildComponent("div", null, "VOLTS"),
								msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.batVolt)
							),
							msfssdk.FSComponent.buildComponent("div", { class: "double-div2" }, 
								msfssdk.FSComponent.buildComponent("div", null, "LOAD"),
								msfssdk.FSComponent.buildComponent("div", { class: "green-txt" }, this.batLoad, "A")
							)
						)
				    )
			);			
        }
    }

    class G650EisPlugin extends wtg3000mfd.AbstractG3000MfdPlugin {
		
        onInit() {
			
        }
		
        renderEis() {
            return (msfssdk.FSComponent.buildComponent(G650EngineInstruments, { bus: this.binder.bus }));
        }

    }
    msfssdk.registerPlugin(G650EisPlugin);
	
	class G650MfdCssPlugin extends wtg3000mfd.AbstractG3000MfdPlugin {
		
        onInstalled() {
            this.loadCss('coui://SimObjects/Airplanes/G700/panel/Instruments/G3000/Plugins/G650MfdPlugin.css');
        }
    }
    msfssdk.registerPlugin(G650MfdCssPlugin);

	exports.G650MfdCssPlugin = G650MfdCssPlugin;
    exports.G650EisPlugin = G650EisPlugin;

    return exports;

})({}, msfssdk, wtg3000common, wtg3000mfd, garminsdk);

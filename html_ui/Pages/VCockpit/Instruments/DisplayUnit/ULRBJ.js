ULRBJ = {
    firstRun: true,
    now: 0,
    lastTime: 0,

    CAS_LEVEL_0_NOTHING: 0,
    CAS_LEVEL_1_WHITE: 1,
    CAS_LEVEL_2_CYAN: 2,
    CAS_LEVEL_3_AMBER: 3,
    CAS_LEVEL_4_RED: 4,

    flightplanCounter: 0,
    flightplan: {},

    updateState() {
        this.now = SimVar.GetSimVarValue("E:ABSOLUTE TIME", "seconds");

        this.updateFuelSystemState();
        this.updateFlightPlanState();

        this.firstRun = false;
        this.lastTime = this.now;
    },

    updateFuelSystemState() {
        const dt = Math.max(ULRBJ.now - ULRBJ.lastTime, 10);
        const tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "celsius");

        let minFuelTankTemp = Number.MAX_VALUE;
        let maxFuelTankTemp = Number.MIN_VALUE;

        calcFuelTankTemp(1);
        calcFuelTankTemp(2);
        checkFuelTankTempCasMessage();

        // todo ak3 sun heating, direction of flight and shadow from fuselage
        // todo ak3 fuel return simulation
        function calcFuelTankTemp(tank) {
            const currTemp = ULRBJ.getFuelTankTemp(tank);

            let newTemp;
            if (!ULRBJ.firstRun) {
                const tankMassKg = ULRBJ.getFuelTankMassKg(tank);
                const c = 2100; // heat capacity Jet-A, J/(kg·°C)
                // this 500 is roughly calibrated to make 5 tons of fuel temp dropping by 10 degrees in 15 minutes
                const heatTransferCoeff = 50; // rough heat transfer coefficient J/(s·°C)

                const k = heatTransferCoeff / (Math.max(tankMassKg, 100) * c);

                newTemp = currTemp + (tat - currTemp) * k * dt;
            } else {
                newTemp = tat;
            }

            SimVar.SetSimVarValue(`L:ULRBJ_FUEL_TANK_TEMP:${tank}`, "celsius", newTemp);

            minFuelTankTemp = Math.min(minFuelTankTemp, newTemp);
            maxFuelTankTemp = Math.max(maxFuelTankTemp, newTemp);
        }

        function checkFuelTankTempCasMessage() {
            // todo ak0 -37 and +54 are not so simple, implement it
            let status = ULRBJ.CAS_LEVEL_0_NOTHING;
            if (minFuelTankTemp < -37 || maxFuelTankTemp > 54) {
                status = ULRBJ.CAS_LEVEL_3_AMBER;
            } else if (minFuelTankTemp < -34.5) {
                status = ULRBJ.CAS_LEVEL_2_CYAN;
            }

            SimVar.SetSimVarValue("L:ULRBJ_CAS_FUEL_TANK_TEMP", "number", status);
        }
    },

    getFuelTankTemp(tank) {
        return SimVar.GetSimVarValue(`L:ULRBJ_FUEL_TANK_TEMP:${tank}`, "celsius");
    },

    getFuelTankTempCas() {
        return SimVar.GetSimVarValue("L:ULRBJ_CAS_FUEL_TANK_TEMP", "number");
    },

    getFuelTankMassKg(tank) {
        return SimVar.GetSimVarValue(tank === 1
                    ? "FUEL TANK LEFT MAIN QUANTITY"
                    : "FUEL TANK RIGHT MAIN QUANTITY",
                "gallons")
            * Tools.GALLONS_TO_LITERS * Tools.JET_A_DENSITY;
    },

    updateFlightPlanState() {
        if (this.flightplan > 0) {
            this.flightplan--;
            return;
        }

        Coherent.call("GET_FLIGHTPLAN").then(r => {
            // console.log("GET_FLIGHTPLAN", r);

            const fp = {
                waypoints: []
            };
            fp.waypoints = r.waypoints.map(w => {
                return {
                    ident: w.ident,
                    eta: w.estimatedTimeOfArrival
                };
            })
            fp.activeWaypointIndex = r.activeWaypointIndex;

            this.flightplan = fp;
            this.flightplanCounter = 10;

            let prevIdent = "";
            let nextIdent = "";
            let destIdent = "";

            if (fp.waypoints.length > 0) {
                if (fp.activeWaypointIndex < fp.waypoints.length) {
                    nextIdent = fp.waypoints[fp.activeWaypointIndex].ident;
                }

                if (0 <= fp.activeWaypointIndex-1) {
                    prevIdent = fp.waypoints[fp.activeWaypointIndex-1].ident;
                }

                destIdent = fp.waypoints[fp.waypoints.length-1].ident;
            }

            SimVar.SetSimVarValue("L:ULRBJ_FLIGHTPLAN_PREV_CODE", "number", Tools.waypointNameToCode(prevIdent));
            SimVar.SetSimVarValue("L:ULRBJ_FLIGHTPLAN_NEXT_CODE", "number", Tools.waypointNameToCode(nextIdent));
            SimVar.SetSimVarValue("L:ULRBJ_FLIGHTPLAN_DEST_CODE", "number", Tools.waypointNameToCode(destIdent));

            // console.log("our flightplan", this.flightplan);
        });
    },

    // =================================================================================================================

    // todo ak store timestamp and use it for calculations
    // todo ak build a bit more complex model
    // todo ak tgt can not be lower than egt
    estimateTgt: function (engineState) {
        const isRunning = SimVar.GetSimVarValue(`ENG COMBUSTION:${engineState.index}`, "bool");

        const oat = SimVar.GetSimVarValue("AMBIENT TEMPERATURE", "celsius");
        const alt = SimVar.GetSimVarValue("PRESSURE ALTITUDE", "feet");

        const targetTgtIfRunning =
            250 +
            engineState.n1 * 5.5 +
            engineState.fuelFlow * 0.02 +
            oat * 0.4 -
            alt * 0.0008;

        const targetTgt = isRunning ? targetTgtIfRunning : oat;

        return engineState.tgt + (targetTgt - engineState.tgt) * 0.04;
    },

    // todo ak vibration spike at 40-50%
    estimateLpEvm: function (engineState) {
        const engVibration = engineState.engVibration;
        const n1 = SimVar.GetSimVarValue(`TURB ENG CORRECTED N1:${engineState.index}`, "percent");
        const noise = (Math.random() - 0.5) * 0.002;
        return engVibration * (0.6 + n1 / 400) + noise;
    },

    // todo ak vibration spike at 40-50%
    estimateHpEvm: function (engineState) {
        const engVibration = engineState.engVibration;
        const n2 = SimVar.GetSimVarValue(`TURB ENG CORRECTED N2:${engineState.index}`, "percent");
        const noise = (Math.random() - 0.5) * 0.002;
        return engVibration * (0.6 + n2 / 200) + noise;
    },

    estimateBleedAirPressure(engineState) {
        const n2 = SimVar.GetSimVarValue(`TURB ENG CORRECTED N2:${engineState.index}`, "percent");
        const alt = SimVar.GetSimVarValue("PRESSURE ALTITUDE", "feet");
        const mach = SimVar.GetSimVarValue("AIRSPEED MACH", "mach");

        let targetPressure;

        const bleedOn = SimVar.GetSimVarValue(`BLEED AIR ENGINE:${engineState.index}`, "bool");

        if (!bleedOn) {
            targetPressure = 0;
        } else {
            const densityFactor = Math.exp(-alt / 45000);
            const basePressure = (n2 - 20) * 0.7;
            const ramEffect = mach * 8;
            const pressure = basePressure * densityFactor + ramEffect;
            targetPressure = Math.max(0, pressure);
        }

        return engineState.bleedAirPressure + (targetPressure - engineState.bleedAirPressure) * 0.05;
    },

    calcHydAuxAndPtuPressure(state) {
        const auxPumpOn = SimVar.GetSimVarValue("CIRCUIT HYDRAULIC PUMP ON", "bool");
        state.hydAuxPressure = auxPumpOn ? 2800 : 0;

        const leftPsi = state.leftEngine.hydPressure * Tools.PSF_TO_PSI;
        const rightPsi = state.rightEngine.hydPressure * Tools.PSF_TO_PSI;

        if (leftPsi < 2000 && rightPsi > 2500) {
            state.rightEngine.hydPressure = state.rightEngine.hydPressure * 0.91;
            state.hydPtuPressure = state.rightEngine.hydPressure * 0.95;
            state.leftEngine.hydPressure = state.rightEngine.hydPressure * 0.97;
        } else if (rightPsi < 2000 && leftPsi > 2500) {
            state.leftEngine.hydPressure = state.leftEngine.hydPressure * 0.91;
            state.hydPtuPressure = state.leftEngine.hydPressure * 0.95;
            state.rightEngine.hydPressure = state.leftEngine.hydPressure * 0.97;
        } else {
            state.hydPtuPressure = 0;
        }
    }
}

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

    updateState() {
        this.now = SimVar.GetSimVarValue("E:ABSOLUTE TIME", "seconds");

        this.FuelSystem.updateState();
        this.updateFlightPlanState();

        this.firstRun = false;
        this.lastTime = this.now;
    },

    FuelSystem: {
        updateState() {
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
                const currTemp = ULRBJ.FuelSystem.getFuelTankTemp(tank);

                let newTemp;
                if (!ULRBJ.firstRun) {
                    const tankMassKg = ULRBJ.FuelSystem.getFuelTankMassKg(tank);
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
                // todo ak3 -37 and +54 are not so simple, implement it
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
            return this.getFuelTankGallons(tank) * Tools.GALLONS_TO_LITERS * Tools.JET_A_DENSITY;
        },

        getFuelTankGallons(tank) {
            return SimVar.GetSimVarValue(tank === 1
                        ? "FUEL TANK LEFT MAIN QUANTITY"
                        : "FUEL TANK RIGHT MAIN QUANTITY",
                    "gallons");
        },
    },

    updateFlightPlanState() {
        if (ULRBJ.firstRun) {
            SimVar.SetSimVarValue("L:ULRBJ_FLIGHTPLAN_ACTIVE_WAYPOINT_INDEX", "number", 0);
            console.log("ULRBJ/Flightplan/WAYPOINT: resetting to 0"); // todo ak1 support flightplan reloading, or flightplan changing, reset or update it somehow
        }

        const FLIGHTPLAN_REQUEST_IS_RUNNING = 11;

        if (this.flightplanCounter === FLIGHTPLAN_REQUEST_IS_RUNNING) {
            return;
        }

        if (this.flightplanCounter > 0) {
            this.flightplanCounter--;
            return;
        }

        this.flightplanCounter = FLIGHTPLAN_REQUEST_IS_RUNNING;
        Coherent.call("GET_FLIGHTPLAN").then(r => {
            const fp = FlightPlanHelper.parseSnapshot(r);

            if (fp.activeWaypointIndex !== r.activeWaypointIndex && fp.activeWaypointIndex !== 0) {
                console.log("ULRBJ/Flightplan: setting active waypoint index to " + fp.activeWaypointIndex + " (was " + r.activeWaypointIndex + ")");
                Coherent.call("SET_ACTIVE_WAYPOINT_INDEX", fp.activeWaypointIndex);
            }

            this.flightplanCounter = 10;
        });
    },

    // =================================================================================================================

    // todo ak3 store timestamp and use it for calculations
    // todo ak3 build a bit more complex model
    // todo ak3 tgt can not be lower than egt
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

    // todo ak3 vibration spike at 40-50%
    estimateLpEvm: function (engineState) {
        const engVibration = engineState.engVibration;
        const n1 = SimVar.GetSimVarValue(`TURB ENG CORRECTED N1:${engineState.index}`, "percent");
        const noise = (Math.random() - 0.5) * 0.002;
        return engVibration * (0.6 + n1 / 400) + noise;
    },

    // todo ak3 vibration spike at 40-50%
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

FlightPlanHelper = {
    parseSnapshot(r) {
        const planeLat = SimVar.GetSimVarValue("PLANE LATITUDE", "degrees");
        const planeLon = SimVar.GetSimVarValue("PLANE LONGITUDE", "degrees");
        const trackDeg = SimVar.GetSimVarValue("GPS GROUND TRUE TRACK", "degrees");

        const currWaypointIndex = SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_ACTIVE_WAYPOINT_INDEX", "number");

        const fp = {
            waypoints: []
        };
        fp.waypoints = r.waypoints.map(w => {
            const wp = {
                icao: this.extractIcao(w),
                lat: w.lla.lat,
                long: w.lla.long,
                dist: w.distance,

            };
            prevCoords = { lat: w.lla.lat, long: w.lla.long };
            return wp;
        })

        fp.activeWaypointIndex = this.findActiveWaypointIndex(r, planeLat, planeLon, trackDeg, currWaypointIndex);
        if (fp.activeWaypointIndex > currWaypointIndex) { // todo ak1 support flightplan reloading, or flightplan changing, reset or update it somehow
            SimVar.SetSimVarValue("L:ULRBJ_FLIGHTPLAN_ACTIVE_WAYPOINT_INDEX", "number", fp.activeWaypointIndex);
            console.log("ULRBJ/Flightplan/WAYPOINT: changing to " + fp.activeWaypointIndex);
        }

        return fp;
    },

    extractIcao(w) {
        const icao = w.icao.trim();
        const ident = w.ident.trim();

        if (icao.length === 0) {
            return ident;
        } else {
            return icao.split(/\s+/).pop().trim();
        }
    },

    findActiveWaypointIndex(r, planeLat, planeLon, trackDeg, currWaypointIndex) {
        for (let i = currWaypointIndex; i < r.waypoints.length; i++) {
            const wp = r.waypoints[i];
            const passed = this.hasPassedWaypoint(planeLat, planeLon, wp.lla.lat, wp.lla.long, trackDeg);
            if (!passed) {
                return i;
            }
        }
        return currWaypointIndex;
    },

    hasPassedWaypoint(planeLat, planeLon, wpLat, wpLon, trackDeg) {
        const bearingToWp = this.bearingDeg(planeLat, planeLon, wpLat, wpLon);

        let angle = Math.abs(bearingToWp - trackDeg);
        if (angle > 180) angle = 360 - angle;

        return angle > 90;
    },

    toRad(deg) {
        return deg * Math.PI / 180;
    },

    toDeg(rad) {
        return rad * 180 / Math.PI;
    },

    bearingDeg(lat1, lon1, lat2, lon2) {
        const dLon = this.toRad(lon2 - lon1);

        const y = Math.sin(dLon) * Math.cos(this.toRad(lat2));
        const x =
            Math.cos(this.toRad(lat1)) * Math.sin(this.toRad(lat2)) -
            Math.sin(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.cos(dLon);

        return (this.toDeg(Math.atan2(y, x)) + 360) % 360;
    },

    emptyFlightplan() {
        return {
            waypoints: [],
            activeWaypointIndex: 0
        };
    },

    toActivePlan(fp) {
        const planeLat = SimVar.GetSimVarValue("PLANE LATITUDE", "degrees");
        const planeLon = SimVar.GetSimVarValue("PLANE LONGITUDE", "degrees");

        const currentFuelGallons = ULRBJ.FuelSystem.getFuelTankGallons(1) + ULRBJ.FuelSystem.getFuelTankGallons(2);
        const avgFuelFlowGph = 470; // was 500, decreased a bit after LFPB-LEBL flight
        const maxFlightLevel = 51000; // todo ak3 read it from TSC flight plan page

        const result = {
            waypoints: []
        }

        if (fp.activeWaypointIndex < 0 || fp.activeWaypointIndex >= fp.waypoints.length) {
            return result;
        }

        const now = SimVar.GetSimVarValue("E:ABSOLUTE TIME", "seconds");
        let cumDistance = 0;

        for (let i = fp.activeWaypointIndex-1; i < fp.waypoints.length; i++) {
            if (i < 0) {
                continue;
            }

            const wp = fp.waypoints[i];

            const legDistance = (i === fp.activeWaypointIndex)
                ? Tools.distanceNM(planeLat, planeLon, wp.lat, wp.long)
                : wp.dist;
            cumDistance = cumDistance + legDistance;

            result.waypoints.push({
                icao: wp.icao,
                legDistance: legDistance,
                cumDistance: cumDistance
            });
        }

        if (result.waypoints.length === 0) {
            return result;
        }

        result.dest = result.waypoints[result.waypoints.length - 1];

        result.dest.isAirport = true; // todo ak2 implement it

        if (result.dest.isAirport) {
            result.dest.altitude = 500; // todo ak2 load it somehow from somewhere
        } else {
            result.dest.altitude = maxFlightLevel;
        }

        const planeAltitude = SimVar.GetSimVarValue("PRESSURE ALTITUDE", "feet");

        if (result.dest.isAirport) {
            let descendNextWp = result.dest;
            for (let i = result.waypoints.length - 2; i >= 0; i--) {
                const legDistance = descendNextWp.legDistance;
                const legDescent = legDistance * 3 * 100; // 6000 is 1NM in feet, 3 is a planned descent profile
                const prevWpAltitudeRaw = descendNextWp.altitude + legDescent;
                const prevWpAltitude = Math.min(prevWpAltitudeRaw, maxFlightLevel);

                const prevWp = result.waypoints[i];
                prevWp.altitude = prevWpAltitude;

                descendNextWp = prevWp;
            }
        }

        let climbAltitude = planeAltitude;
        for (let i = 0; i < result.waypoints.length; i++) {
            const wp = result.waypoints[i];
            const legDistance = wp.legDistance;
            const legProfile = (climbAltitude < 40000 ? 5 : 2);
            const legClimb = legDistance * legProfile * 100;
            const legAltitude = climbAltitude + legClimb;
            if (legAltitude >= wp.altitude && !isNaN(wp.altitude)) {
                break;
            }

            wp.altitude = legAltitude;
            climbAltitude = legAltitude;
        }

        let cumTime = 0;
        for (let i = 0; i < result.waypoints.length; i++) {
            const wp = result.waypoints[i];
            const legAltitude = wp.altitude;
            const legTrackSpeedKts = (legAltitude < 3000 ? 200 : (legAltitude > 30000 ? 500 : ((legAltitude - 3000) / (30000 - 3000) * (500 - 200) + 200)));
            const legDistance = wp.legDistance;
            const legTime = legDistance / legTrackSpeedKts * 3600;

            cumTime = cumTime + legTime;

            wp.eta = cumTime + now;
            wp.fuelRemaining = Math.max(currentFuelGallons - cumTime * avgFuelFlowGph / 3600, 0);
        }

        return result;
    }
}

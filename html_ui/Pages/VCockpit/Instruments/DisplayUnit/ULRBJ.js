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
            if (ULRBJ.firstRun) {
                ULRBJ.FuelSystem.loadStoredState();
            } else {
                ULRBJ.FuelSystem.updateStoredState();
            }

            const dt = Math.max(ULRBJ.now - ULRBJ.lastTime, 10);
            const tat = SimVar.GetSimVarValue("TOTAL AIR TEMPERATURE", "celsius");

            calcFuelTankTemp(1);
            calcFuelTankTemp(2);

            ULRBJ.FuelSystem.CAS.FuelImbalance.update();
            ULRBJ.FuelSystem.CAS.LRFuelLevelLow.update();
            ULRBJ.FuelSystem.CAS.FuelTankTemp.update();
            ULRBJ.FuelSystem.CAS.FuelFlowDifference.update();

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
            }
        },

        updateStoredState() {
            if (--ULRBJ.FuelSystem.storedStateCounter > 0) {
                return;
            }

            const fuel1 = ULRBJ.FuelSystem.getFuelTankGallons(1);
            const fuel2 = ULRBJ.FuelSystem.getFuelTankGallons(2);

            SetStoredData("ULRBJ.StoredState.Fuel.1", fuel1 > 0.01 ? fuel1.toString() : "EMPTY");
            SetStoredData("ULRBJ.StoredState.Fuel.2", fuel1 > 0.01 ? fuel2.toString() : "EMPTY");

            ULRBJ.FuelSystem.storedStateCounter = 100;
        },

        loadStoredState() {
            const fuel1str = GetStoredData("ULRBJ.StoredState.Fuel.1");
            const fuel2str = GetStoredData("ULRBJ.StoredState.Fuel.2");

            const fuel1 = (fuel1str !== undefined) ? (fuel1str === "EMPTY" ? 0 : Number(fuel1str)) : undefined;
            const fuel2 = (fuel2str !== undefined) ? (fuel2str === "EMPTY" ? 0 : Number(fuel2str)) : undefined;

            if (fuel1) SimVar.SetSimVarValue("FUEL TANK LEFT MAIN QUANTITY", "gallons", fuel1);
            if (fuel2) SimVar.SetSimVarValue("FUEL TANK RIGHT MAIN QUANTITY", "gallons", fuel2);

            ULRBJ.FuelSystem.storedStateCounter = 100;
        },

        CAS: {
            FuelImbalance: {
                get() {
                    return SimVar.GetSimVarValue("L:ULRBJ_CAS_FUEL_IMBALANCE", "number");
                },

                update() {
                    const fuel1 = ULRBJ.FuelSystem.getFuelTankGallons(1);
                    const fuel2 = ULRBJ.FuelSystem.getFuelTankGallons(2);

                    const differenceLbs = Math.abs(fuel1 - fuel2) * Tools.GALLONS_TO_LB;

                    const onGround = SimVar.GetSimVarValue("SIM ON GROUND", "bool");

                    let level = ULRBJ.CAS_LEVEL_0_NOTHING;
                    if (onGround) {
                        if (500 <= differenceLbs && differenceLbs < 1000) {
                            level = ULRBJ.CAS_LEVEL_1_WHITE;
                        } else if (1000 <= differenceLbs) {
                            level = ULRBJ.CAS_LEVEL_3_AMBER;
                        }
                    } else {
                        if (500 < differenceLbs && differenceLbs < 1000) {
                            level = ULRBJ.CAS_LEVEL_1_WHITE;
                        } else if (1000 <= differenceLbs && differenceLbs < 2000) {
                            level = ULRBJ.CAS_LEVEL_2_CYAN;
                        } else if (2000 <= differenceLbs) {
                            level = ULRBJ.CAS_LEVEL_3_AMBER;
                        }
                    }

                    SimVar.SetSimVarValue("L:ULRBJ_CAS_FUEL_IMBALANCE", "number", level);
                }
            },

            LRFuelLevelLow: {
                getLR() {
                    return [
                        SimVar.GetSimVarValue("L:ULRBJ_CAS_FUEL_TANK_LEVEL_L", "number"),
                        SimVar.GetSimVarValue("L:ULRBJ_CAS_FUEL_TANK_LEVEL_R", "number")
                    ];
                },

                update() {
                    const fuel1 = ULRBJ.FuelSystem.getFuelTankGallons(1);
                    const fuel2 = ULRBJ.FuelSystem.getFuelTankGallons(2);

                    const level1 = ULRBJ.FuelSystem.CAS.LRFuelLevelLow.calcLevel(fuel1);
                    const level2 = ULRBJ.FuelSystem.CAS.LRFuelLevelLow.calcLevel(fuel2);

                    SimVar.SetSimVarValue("L:ULRBJ_CAS_FUEL_TANK_LEVEL_L", "number", level1);
                    SimVar.SetSimVarValue("L:ULRBJ_CAS_FUEL_TANK_LEVEL_R", "number", level2);
                },

                calcLevel(fuelGallons) {
                    const thresholdLbs = 650;
                    const thresholdGallons = thresholdLbs / Tools.GALLONS_TO_LB;
                    return fuelGallons < thresholdGallons ? ULRBJ.CAS_LEVEL_3_AMBER : ULRBJ.CAS_LEVEL_0_NOTHING;
                }
            },

            FuelTankTemp: {
                get() {
                    return SimVar.GetSimVarValue("L:ULRBJ_CAS_FUEL_TANK_TEMP", "number");
                },

                update() {
                    const temp1 = ULRBJ.FuelSystem.getFuelTankTemp(1);
                    const temp2 = ULRBJ.FuelSystem.getFuelTankTemp(2);

                    const level1 = ULRBJ.FuelSystem.CAS.FuelTankTemp.calcLevel(temp1);
                    const level2 = ULRBJ.FuelSystem.CAS.FuelTankTemp.calcLevel(temp2);

                    SimVar.SetSimVarValue("L:ULRBJ_CAS_FUEL_TANK_TEMP", "number", Math.max(level1, level2));
                },

                calcLevel(temp) {
                    const totalFuelLbs = ULRBJ.FuelSystem.getTotalFuelGallons() * Tools.GALLONS_TO_LB;
                    const minAllowedFuelTankTemp = totalFuelLbs > 5000 ? -37 : -30;

                    const alt = SimVar.GetSimVarValue("PRESSURE ALTITUDE", "feet");
                    const maxAllowedFuelTankTemp = 54 - (54-47) / 51000 * alt;

                    if (temp < minAllowedFuelTankTemp || temp > maxAllowedFuelTankTemp) {
                        return ULRBJ.CAS_LEVEL_3_AMBER;
                    } else if (temp < minAllowedFuelTankTemp + 2.5) {
                        return ULRBJ.CAS_LEVEL_2_CYAN;
                    } else {
                        return ULRBJ.CAS_LEVEL_0_NOTHING;
                    }
                }
            },

            FuelFlowDifference: {
                get() {
                    return SimVar.GetSimVarValue("L:ULRBJ_CAS_FUEL_FLOW_DIFFERENCE", "number");
                },

                update() {
                    const flow1gph = SimVar.GetSimVarValue("ENG FUEL FLOW GPH:1", "gallons per hour");
                    const flow2gph = SimVar.GetSimVarValue("ENG FUEL FLOW GPH:2", "gallons per hour");

                    const flow1pph = flow1gph * Tools.GALLONS_TO_LB;
                    const flow2pph = flow2gph * Tools.GALLONS_TO_LB;

                    const diff = Math.abs(flow1pph - flow2pph);

                    const level = diff > 40 ? ULRBJ.CAS_LEVEL_2_CYAN : ULRBJ.CAS_LEVEL_0_NOTHING;

                    SimVar.SetSimVarValue("L:ULRBJ_CAS_FUEL_FLOW_DIFFERENCE", "number", level);
                }
            }
        },

        getFuelTankTemp(tank) {
            return SimVar.GetSimVarValue(`L:ULRBJ_FUEL_TANK_TEMP:${tank}`, "celsius");
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

        getTotalFuelGallons() {
            return ULRBJ.FuelSystem.getFuelTankGallons(1) + ULRBJ.FuelSystem.getFuelTankGallons(2);
        },
    },

    updateFlightPlanState() {
        if (ULRBJ.firstRun) {
            FlightPlanHelper.saveActiveWaypointState({ index: -1, dist: 10000 });
            // todo ak1 support flightplan reloading, or flightplan changing, reset or update it somehow
            console.log("ULRBJ/Flightplan/WAYPOINT: resetting to (-1, 10000)");
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
        Coherent.call("GET_FLIGHTPLAN").then(simFlightplan => {
            // todo ak1 support flightplan reloading, or flightplan changing, reset or update it somehow

            const fp = FlightPlanHelper.parseSnapshot(simFlightplan);

            const planeLat = SimVar.GetSimVarValue("PLANE LATITUDE", "degrees");
            const planeLon = SimVar.GetSimVarValue("PLANE LONGITUDE", "degrees");

            const newWpState = FlightPlanHelper.refreshActiveWaypointState(fp, planeLat, planeLon, fp.activeWaypoint);
            FlightPlanHelper.saveActiveWaypointState(newWpState);

            if (newWpState.index > fp.activeWaypoint.index) {
                console.log("ULRBJ/Flightplan: progressing to waypoint " + newWpState.index + " (was " + fp.activeWaypoint.index + ")");
            }

            if (newWpState.index > simFlightplan.activeWaypointIndex/* && newWpState.index !== 0*/) {
                console.log("ULRBJ/Flightplan: setting Sim Flightplan active waypoint index to " + newWpState.index + " (was " + simFlightplan.activeWaypointIndex + ")");
                Coherent.call("SET_ACTIVE_WAYPOINT_INDEX", newWpState.index);
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
        const fp = {
            waypoints: []
        };

        fp.waypoints = r.waypoints.map(w => {
            return {
                icao: this.extractIcao(w),
                lat: w.lla.lat,
                long: w.lla.long,
                dist: w.distance,

            };
        })

        fp.activeWaypoint = this.loadActiveWaypointState();

        return fp;
    },

    loadActiveWaypointState() {
        return {
            index: SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_ACTIVE_WAYPOINT_INDEX", "number"),
            dist: SimVar.GetSimVarValue("L:ULRBJ_FLIGHTPLAN_ACTIVE_WAYPOINT_DIST", "number")
        };
    },

    saveActiveWaypointState(state) {
        SimVar.SetSimVarValue("L:ULRBJ_FLIGHTPLAN_ACTIVE_WAYPOINT_INDEX", "number", state.index);
        SimVar.SetSimVarValue("L:ULRBJ_FLIGHTPLAN_ACTIVE_WAYPOINT_DIST", "number", state.dist);
    },

    refreshActiveWaypointState(r, planeLat, planeLon, state) {
        const EPS = 0.000001;

        const wps = r.waypoints;

        if (!wps || wps.length === 0) {
            return { index: -1, dist: 10000 };
        }

        const endOfRoute = { index: wps.length, dist: 10000 };

        const activeWaypointIndex = Math.max(1, state.index);

        const activeLeg = getLeg(activeWaypointIndex);
        const nextLeg = getLeg(activeWaypointIndex + 1);

        if (!activeLeg) {
            return endOfRoute;
        }

        if (activeLeg.before) {
            // we even have not reached the beginning of the leg
            return activeLeg.state;
        }

        if (activeLeg.after) {
            // we have passed the end of the leg, lets switch to the next
            console.log("ULRBJ/Flightplan/WAYPOINT: activeLeg.after - switching...");
            return nextLeg ? nextLeg.state : endOfRoute;
        }

        if (nextLeg) {
            // todo ak1 do I really need it?
            // const gs = SimVar.GetSimVarValue("GROUND VELOCITY", "knots");
            // const leadNm = Math.min(gs * 0.01, activeLeg.legDistance * 0.7);
            //
            // if (activeLeg.state.dist < leadNm) {
            //     console.log("ULRBJ/Flightplan/WAYPOINT: activeLeg.state.dist < " + Tools.round3(leadNm) + " - switching...");
            //     return nextLeg.state;
            // }

            if (activeLeg.passedMostOfLeg && nextLeg.inside) {
                // we already can switch to the next leg, we are 'inside' of the turn
                console.log("ULRBJ/Flightplan/WAYPOINT: activeLeg.passedMostOfLeg AND nextLeg.inside - switching...");
                return nextLeg.state;
            }

            // todo ak1 should distance depend on airspeed?
            if (activeLeg.state.dist < 3.0 && activeLeg.state.dist > state.dist) {
                // we are starting to fly away from the waypoint, lets switch to the next
                console.log("ULRBJ/Flightplan/WAYPOINT: flying away from the end - switching...");
                return nextLeg.state;
            }
        }

        // we are just continuing on this leg
        return activeLeg.state;

        function getLeg(index) {
            if (index >= wps.length) {
                return null;
            }

            const prevWp = wps[index - 1];
            const wp = wps[index];

            const distAB = Tools.distanceNM(prevWp.lat, prevWp.long, wp.lat, wp.long);
            const distAP = Tools.distanceNM(prevWp.lat, prevWp.long, planeLat, planeLon);
            const distToWp = Tools.distanceNM(planeLat, planeLon, wp.lat, wp.long);

            const bearingAB = Tools.toRad(Tools.bearingDeg(prevWp.lat, prevWp.long, wp.lat, wp.long));
            const bearingAP = Tools.toRad(Tools.bearingDeg(prevWp.lat, prevWp.long, planeLat, planeLon));

            const alongTrack = Math.cos(bearingAP - bearingAB) * distAP;

            return {
                before: alongTrack < -EPS,
                inside: -EPS <= alongTrack && alongTrack < distAB + EPS,
                passedMostOfLeg: distAB * 0.8 < alongTrack,
                after: distAB + EPS <= alongTrack,
                legDistance: distAB,
                state: {
                    index: index,
                    dist: distToWp
                }
            }
        }
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

    emptyFlightplan() {
        return {
            waypoints: [],
            activeWaypoint: { index: 0, dist: 10000 }
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

        if (fp.activeWaypoint.index < 0 || fp.activeWaypoint.index >= fp.waypoints.length) {
            return result;
        }

        const now = SimVar.GetSimVarValue("E:ABSOLUTE TIME", "seconds");
        let cumDistance = 0;

        for (let i = fp.activeWaypoint.index-1; i < fp.waypoints.length; i++) {
            if (i < 0) {
                continue;
            }

            const wp = fp.waypoints[i];

            const legDistance = (i === fp.activeWaypoint.index)
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

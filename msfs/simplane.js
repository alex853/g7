class RangeDisplay {
    constructor(_type = "RangeDisplay") {
        this.min = 0;
        this.max = 0;
        this.lowLimit = 0;
        this.highLimit = 0;
        this.__Type = _type;
    }
}
class ColorRangeDisplay extends RangeDisplay {
    constructor(_type = "ColorRangeDisplay") {
        super(_type);
        this.greenStart = 0;
        this.greenEnd = 0;
    }
}
class ColorRangeDisplay2 extends ColorRangeDisplay {
    constructor(_type = "ColorRangeDisplay2") {
        super(_type);
        this.yellowStart = 0;
        this.yellowEnd = 0;
        this.redStart = 0;
        this.redEnd = 0;
    }
}
class ColorRangeDisplay3 extends ColorRangeDisplay2 {
    constructor(_type = "ColorRangeDisplay3") {
        super(_type);
        this.lowRedStart = 0;
        this.lowRedEnd = 0;
        this.lowYellowStart = 0;
        this.lowYellowEnd = 0;
    }
}
class ColorRangeDisplay4 extends ColorRangeDisplay2 {
    constructor(_type = "ColorRangeDisplay4") {
        super(_type);
        this.whiteStart = 0;
        this.whiteEnd = 0;
    }
}
class FlapsRangeDisplay extends RangeDisplay {
    constructor(_type = "FlapsRangeDisplay") {
        super(_type);
        this.takeOffValue = 0;
    }
}
class ThrottleLevelsInfo {
    constructor() {
        this.__Type = "ThrottleLevelsInfo";
        this.minValues = [0, 0, 0, 0, 0];
        this.names = ["", "", "", "", ""];
    }
}
class FlapsLevelsInfo {
    constructor() {
        this.__Type = "FlapsLevelsInfo";
        this.slatsAngle = [0, 0, 0, 0];
        this.flapsAngle = [0, 0, 0, 0];
    }
}
class TakeOffSpeedsInfo {
    constructor() {
        this.__Type = "TakeOffSpeedsInfo";
        this.minVal = 0;
        this.minWeight = 0;
        this.maxVal = 200;
        this.maxWeight = 1000000;
    }
}
class GlassCockpitMisc {
    constructor() {
        this.__Type = "GlassCockpitMisc";
        this.hasGMeter = false;
        this.vCockpitHud = false;
        this.highAltitudeHud = false;
        this.hudAirspeedColorFromLVar = false;
        this.hudShowFuel = false;
        this.hudShowAOA = false;
        this.hudShowVario = false;
        this.hudShowTachometer = false;
        this.hudMoonTachometer = false;
        this.hudShowTrim = false;
        this.hudSpeedInMach = false;
        this.hudHelicopterMode = false;
        this.equivalentAirspeedHud = false;
        this.hudNavyAOA = false;
        this.gpsAltimeterHud = false;
    }
}
class GlassCockpitSettings {
    constructor() {
        this.FuelFlow = new ColorRangeDisplay();
        this.FuelQuantity = new ColorRangeDisplay2();
        this.FuelTemperature = new ColorRangeDisplay3();
        this.FuelPressure = new ColorRangeDisplay3();
        this.OilPressure = new ColorRangeDisplay3();
        this.OilTemperature = new ColorRangeDisplay3();
        this.EGTTemperature = new ColorRangeDisplay2();
        this.CHTTemperature = new ColorRangeDisplay2();
        this.Vacuum = new ColorRangeDisplay();
        this.ManifoldPressure = new ColorRangeDisplay();
        this.AirSpeed = new ColorRangeDisplay4();
        this.Torque = new ColorRangeDisplay2();
        this.RPM = new ColorRangeDisplay2();
        this.HelicopterRotorRPM = new ColorRangeDisplay2();
        this.TurbineNg = new ColorRangeDisplay2();
        this.TurbineN1 = new ColorRangeDisplay2();
        this.TurbineN2 = new ColorRangeDisplay2();
        this.ITTEngineOff = new ColorRangeDisplay3();
        this.ITTEngineOn = new ColorRangeDisplay3();
        this.MainBusVoltage = new ColorRangeDisplay3();
        this.HotBatteryBusVoltage = new ColorRangeDisplay3();
        this.BatteryBusAmps = new ColorRangeDisplay2();
        this.GenAltBusAmps = new ColorRangeDisplay2();
        this.CoolantLevel = new RangeDisplay();
        this.CoolantTemperature = new ColorRangeDisplay3();
        this.GearOilTemperature = new ColorRangeDisplay2();
        this.CabinAltitude = new ColorRangeDisplay();
        this.CabinAltitudeChangeRate = new RangeDisplay();
        this.CabinPressureDiff = new ColorRangeDisplay();
        this.ThrottleLevels = new ThrottleLevelsInfo();
        this.FlapsLevels = new FlapsLevelsInfo();
        this.TakeOffSpeeds = new TakeOffSpeedsInfo();
        this.Misc = new GlassCockpitMisc();
    }
}
class FuelLevels {
    constructor() {
        this.fuel_tank_selector = new Array();
    }
}
class DesignSpeeds {
}
var EngineType;
(function (EngineType) {
    EngineType[EngineType["ENGINE_TYPE_PISTON"] = 0] = "ENGINE_TYPE_PISTON";
    EngineType[EngineType["ENGINE_TYPE_JET"] = 1] = "ENGINE_TYPE_JET";
    EngineType[EngineType["ENGINE_TYPE_NONE"] = 2] = "ENGINE_TYPE_NONE";
    EngineType[EngineType["ENGINE_TYPE_HELO_TURBINE"] = 3] = "ENGINE_TYPE_HELO_TURBINE";
    EngineType[EngineType["ENGINE_TYPE_ROCKET"] = 4] = "ENGINE_TYPE_ROCKET";
    EngineType[EngineType["ENGINE_TYPE_TURBOPROP"] = 5] = "ENGINE_TYPE_TURBOPROP";
})(EngineType || (EngineType = {}));
var PropellerType;
(function (PropellerType) {
    PropellerType[PropellerType["PROPELLER_TYPE_CONSTANT_SPEED"] = 0] = "PROPELLER_TYPE_CONSTANT_SPEED";
    PropellerType[PropellerType["PROPELLER_TYPE_FIXED_PITCH"] = 1] = "PROPELLER_TYPE_FIXED_PITCH";
})(PropellerType || (PropellerType = {}));
var Aircraft;
(function (Aircraft) {
    Aircraft[Aircraft["CJ4"] = 0] = "CJ4";
    Aircraft[Aircraft["A320_NEO"] = 1] = "A320_NEO";
    Aircraft[Aircraft["B747_8"] = 2] = "B747_8";
    Aircraft[Aircraft["AS01B"] = 3] = "AS01B";
    Aircraft[Aircraft["AS02A"] = 4] = "AS02A";
    Aircraft[Aircraft["AS03D"] = 5] = "AS03D";
    Aircraft[Aircraft["AS05B"] = 6] = "AS05B";
})(Aircraft || (Aircraft = {}));
var ThrottleMode;
(function (ThrottleMode) {
    ThrottleMode[ThrottleMode["UNKNOWN"] = 0] = "UNKNOWN";
    ThrottleMode[ThrottleMode["REVERSE"] = 1] = "REVERSE";
    ThrottleMode[ThrottleMode["IDLE"] = 2] = "IDLE";
    ThrottleMode[ThrottleMode["AUTO"] = 3] = "AUTO";
    ThrottleMode[ThrottleMode["CLIMB"] = 4] = "CLIMB";
    ThrottleMode[ThrottleMode["FLEX_MCT"] = 5] = "FLEX_MCT";
    ThrottleMode[ThrottleMode["TOGA"] = 6] = "TOGA";
    ThrottleMode[ThrottleMode["HOLD"] = 7] = "HOLD";
})(ThrottleMode || (ThrottleMode = {}));
var AutopilotMode;
(function (AutopilotMode) {
    AutopilotMode[AutopilotMode["MANAGED"] = 0] = "MANAGED";
    AutopilotMode[AutopilotMode["SELECTED"] = 1] = "SELECTED";
    AutopilotMode[AutopilotMode["HOLD"] = 2] = "HOLD";
})(AutopilotMode || (AutopilotMode = {}));
var MinimumReferenceMode;
(function (MinimumReferenceMode) {
    MinimumReferenceMode[MinimumReferenceMode["RADIO"] = 0] = "RADIO";
    MinimumReferenceMode[MinimumReferenceMode["BARO"] = 1] = "BARO";
})(MinimumReferenceMode || (MinimumReferenceMode = {}));
var FlightState;
(function (FlightState) {
    FlightState[FlightState["FLIGHT_STATE_BRIEFING"] = 0] = "FLIGHT_STATE_BRIEFING";
    FlightState[FlightState["FLIGHT_STATE_INTRO_PLANE"] = 1] = "FLIGHT_STATE_INTRO_PLANE";
    FlightState[FlightState["FLIGHT_STATE_INTRO"] = 2] = "FLIGHT_STATE_INTRO";
    FlightState[FlightState["FLIGHT_STATE_PREFLIGHT_GATE"] = 3] = "FLIGHT_STATE_PREFLIGHT_GATE";
    FlightState[FlightState["FLIGHT_STATE_PREFLIGHT_PUSHBACK"] = 4] = "FLIGHT_STATE_PREFLIGHT_PUSHBACK";
    FlightState[FlightState["FLIGHT_STATE_PREFLIGHT_TAXI"] = 5] = "FLIGHT_STATE_PREFLIGHT_TAXI";
    FlightState[FlightState["FLIGHT_STATE_PREFLIGHT_HOLDSHORT"] = 6] = "FLIGHT_STATE_PREFLIGHT_HOLDSHORT";
    FlightState[FlightState["FLIGHT_STATE_FLIGHT_RUNWAY"] = 7] = "FLIGHT_STATE_FLIGHT_RUNWAY";
    FlightState[FlightState["FLIGHT_STATE_FLIGHT_INITIAL_CLIMB"] = 8] = "FLIGHT_STATE_FLIGHT_INITIAL_CLIMB";
    FlightState[FlightState["FLIGHT_STATE_FLIGHT_CLIMB"] = 9] = "FLIGHT_STATE_FLIGHT_CLIMB";
    FlightState[FlightState["FLIGHT_STATE_FLIGHT_CRUISE"] = 10] = "FLIGHT_STATE_FLIGHT_CRUISE";
    FlightState[FlightState["FLIGHT_STATE_FLIGHT_DESCENT"] = 11] = "FLIGHT_STATE_FLIGHT_DESCENT";
    FlightState[FlightState["FLIGHT_STATE_JOINPLANE"] = 12] = "FLIGHT_STATE_JOINPLANE";
    FlightState[FlightState["FLIGHT_STATE_LANDING_APPROACH"] = 13] = "FLIGHT_STATE_LANDING_APPROACH";
    FlightState[FlightState["FLIGHT_STATE_LANDING_FINAL"] = 14] = "FLIGHT_STATE_LANDING_FINAL";
    FlightState[FlightState["FLIGHT_STATE_LANDING_TOUCHDOWN"] = 15] = "FLIGHT_STATE_LANDING_TOUCHDOWN";
    FlightState[FlightState["FLIGHT_STATE_LANDING_GROUNDROLL"] = 16] = "FLIGHT_STATE_LANDING_GROUNDROLL";
    FlightState[FlightState["FLIGHT_STATE_LANDING_TAXI"] = 17] = "FLIGHT_STATE_LANDING_TAXI";
    FlightState[FlightState["FLIGHT_STATE_LANDING_GATE"] = 18] = "FLIGHT_STATE_LANDING_GATE";
    FlightState[FlightState["FLIGHT_STATE_LANDING_REST"] = 19] = "FLIGHT_STATE_LANDING_REST";
    FlightState[FlightState["FLIGHT_STATE_OUTRO"] = 20] = "FLIGHT_STATE_OUTRO";
    FlightState[FlightState["FLIGHT_STATE_WAITING"] = 21] = "FLIGHT_STATE_WAITING";
    FlightState[FlightState["FLIGHT_STATE_TELEPORTTOSTATE"] = 22] = "FLIGHT_STATE_TELEPORTTOSTATE";
    FlightState[FlightState["FLIGHT_STATE_FREEFLIGHT"] = 23] = "FLIGHT_STATE_FREEFLIGHT";
    FlightState[FlightState["FLIGHT_STATE_LANDINGCHALLENGE"] = 24] = "FLIGHT_STATE_LANDINGCHALLENGE";
    FlightState[FlightState["FLIGHT_STATE_BUSHTRIP"] = 25] = "FLIGHT_STATE_BUSHTRIP";
})(FlightState || (FlightState = {}));
var FlightPhase;
(function (FlightPhase) {
    FlightPhase[FlightPhase["FLIGHT_PHASE_PREFLIGHT"] = 0] = "FLIGHT_PHASE_PREFLIGHT";
    FlightPhase[FlightPhase["FLIGHT_PHASE_TAXI"] = 1] = "FLIGHT_PHASE_TAXI";
    FlightPhase[FlightPhase["FLIGHT_PHASE_TAKEOFF"] = 2] = "FLIGHT_PHASE_TAKEOFF";
    FlightPhase[FlightPhase["FLIGHT_PHASE_CLIMB"] = 3] = "FLIGHT_PHASE_CLIMB";
    FlightPhase[FlightPhase["FLIGHT_PHASE_CRUISE"] = 4] = "FLIGHT_PHASE_CRUISE";
    FlightPhase[FlightPhase["FLIGHT_PHASE_DESCENT"] = 5] = "FLIGHT_PHASE_DESCENT";
    FlightPhase[FlightPhase["FLIGHT_PHASE_APPROACH"] = 6] = "FLIGHT_PHASE_APPROACH";
    FlightPhase[FlightPhase["FLIGHT_PHASE_GOAROUND"] = 7] = "FLIGHT_PHASE_GOAROUND";
})(FlightPhase || (FlightPhase = {}));
var ApproachType;
(function (ApproachType) {
    ApproachType[ApproachType["APPROACH_TYPE_UNKNOWN"] = 0] = "APPROACH_TYPE_UNKNOWN";
    ApproachType[ApproachType["APPROACH_TYPE_GPS"] = 1] = "APPROACH_TYPE_GPS";
    ApproachType[ApproachType["APPROACH_TYPE_VOR"] = 2] = "APPROACH_TYPE_VOR";
    ApproachType[ApproachType["APPROACH_TYPE_NDB"] = 3] = "APPROACH_TYPE_NDB";
    ApproachType[ApproachType["APPROACH_TYPE_ILS"] = 4] = "APPROACH_TYPE_ILS";
    ApproachType[ApproachType["APPROACH_TYPE_LOCALIZER"] = 5] = "APPROACH_TYPE_LOCALIZER";
    ApproachType[ApproachType["APPROACH_TYPE_SDF"] = 6] = "APPROACH_TYPE_SDF";
    ApproachType[ApproachType["APPROACH_TYPE_LDA"] = 7] = "APPROACH_TYPE_LDA";
    ApproachType[ApproachType["APPROACH_TYPE_VORDME"] = 8] = "APPROACH_TYPE_VORDME";
    ApproachType[ApproachType["APPROACH_TYPE_NDBDME"] = 9] = "APPROACH_TYPE_NDBDME";
    ApproachType[ApproachType["APPROACH_TYPE_RNAV"] = 10] = "APPROACH_TYPE_RNAV";
    ApproachType[ApproachType["APPROACH_TYPE_LOCALIZER_BACK_COURSE"] = 11] = "APPROACH_TYPE_LOCALIZER_BACK_COURSE";
})(ApproachType || (ApproachType = {}));
var RunwayDesignator;
(function (RunwayDesignator) {
    RunwayDesignator[RunwayDesignator["RUNWAY_DESIGNATOR_NONE"] = 0] = "RUNWAY_DESIGNATOR_NONE";
    RunwayDesignator[RunwayDesignator["RUNWAY_DESIGNATOR_LEFT"] = 1] = "RUNWAY_DESIGNATOR_LEFT";
    RunwayDesignator[RunwayDesignator["RUNWAY_DESIGNATOR_RIGHT"] = 2] = "RUNWAY_DESIGNATOR_RIGHT";
    RunwayDesignator[RunwayDesignator["RUNWAY_DESIGNATOR_CENTER"] = 3] = "RUNWAY_DESIGNATOR_CENTER";
    RunwayDesignator[RunwayDesignator["RUNWAY_DESIGNATOR_WATER"] = 4] = "RUNWAY_DESIGNATOR_WATER";
    RunwayDesignator[RunwayDesignator["RUNWAY_DESIGNATOR_A"] = 5] = "RUNWAY_DESIGNATOR_A";
    RunwayDesignator[RunwayDesignator["RUNWAY_DESIGNATOR_B"] = 6] = "RUNWAY_DESIGNATOR_B";
})(RunwayDesignator || (RunwayDesignator = {}));
var WorldRegion;
(function (WorldRegion) {
    WorldRegion[WorldRegion["NORTH_AMERICA"] = 0] = "NORTH_AMERICA";
    WorldRegion[WorldRegion["AUSTRALIA"] = 1] = "AUSTRALIA";
    WorldRegion[WorldRegion["HAWAII"] = 2] = "HAWAII";
    WorldRegion[WorldRegion["OTHER"] = 3] = "OTHER";
})(WorldRegion || (WorldRegion = {}));
var NAV_AID_STATE;
(function (NAV_AID_STATE) {
    NAV_AID_STATE[NAV_AID_STATE["OFF"] = 0] = "OFF";
    NAV_AID_STATE[NAV_AID_STATE["ADF"] = 1] = "ADF";
    NAV_AID_STATE[NAV_AID_STATE["VOR"] = 2] = "VOR";
})(NAV_AID_STATE || (NAV_AID_STATE = {}));
var NAV_AID_MODE;
(function (NAV_AID_MODE) {
    NAV_AID_MODE[NAV_AID_MODE["NONE"] = 0] = "NONE";
    NAV_AID_MODE[NAV_AID_MODE["MANUAL"] = 1] = "MANUAL";
    NAV_AID_MODE[NAV_AID_MODE["REMOTE"] = 2] = "REMOTE";
})(NAV_AID_MODE || (NAV_AID_MODE = {}));
var Simplane;
(function (Simplane) {
    var OneFrameIsMS = 33;
    var StaticSimVarTimer = OneFrameIsMS * 150;
    var FastSimVarTimer = OneFrameIsMS;
    var MedSimVarTimer = OneFrameIsMS * 4;
    var SlowSimVarTimer = OneFrameIsMS * 8;
    var VerySlowSimVarTimer = OneFrameIsMS * 16;
    var OneSecSlowSimVarTimer = OneFrameIsMS * 30;
    var AllwaysTimer = -1;
    var DispatchCounter = 0;
    class SimVarGetter {
        constructor(_name, _unit, _reftime) {
            this.SVTimer = -10000000;
            this.SVReg = -1;
            this.SVName = _name;
            this.SVunit = _unit;
            this.SVRefreshT = _reftime;
        }
        GetVal() {
            let t = performance.now();
            if (t > this.SVTimer) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredId(this.SVName, this.SVunit, "");
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal = SimVar.GetSimVarValueFastReg(this.SVReg);
                engine.endProfileEvent();
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
        GetValString() {
            let t = performance.now();
            if (t > this.SVTimer) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredId(this.SVName, this.SVunit, "");
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal = SimVar.GetSimVarValueFastRegString(this.SVReg);
                engine.endProfileEvent();
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
        GetValSlowType() {
            let t = performance.now();
            if (t > this.SVTimer) {
                this.SVVal = SimVar.GetSimVarValue(this.SVName, this.SVunit);
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
        SetVal(val) {
            if (this.SVReg < 0)
                this.SVReg = SimVar.GetRegisteredId(this.SVName, this.SVunit, "");
            Coherent.call("setValueReg_Number", this.SVReg, +val);
            this.SVVal = val;
        }
        GetValForce(force) {
            let t = performance.now();
            if (force || (t > this.SVTimer)) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredId(this.SVName, this.SVunit, "");
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal = SimVar.GetSimVarValueFastReg(this.SVReg);
                engine.endProfileEvent();
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
        GetValt(t) {
            if (t > this.SVTimer) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredId(this.SVName, this.SVunit, "");
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal = SimVar.GetSimVarValueFastReg(this.SVReg);
                engine.endProfileEvent();
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
    }
    class SimVarTBatchGetter {
        constructor(_name, _unit, _reftime, _nameafter = "", _size = 10) {
            this.SVName = _name;
            this.SVunit = _unit;
            this.SVRefreshT = _reftime;
            this.SVNameAfter = _nameafter;
            this.SVVal = new Array();
            this.SVTimer = new Array();
            this.SVReg = new Array();
            for (var i = 0; i < _size; i++) {
                this.SVTimer[i] = -10000000;
                this.SVReg[i] = -1;
            }
        }
        GetVal(index) {
            let t = performance.now();
            if (t > this.SVTimer[index]) {
                if (this.SVReg[index] < 0)
                    this.SVReg[index] = SimVar.GetRegisteredId(this.SVName + index + this.SVNameAfter, this.SVunit, "");
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal[index] = SimVar.GetSimVarValueFastReg(this.SVReg[index]);
                engine.endProfileEvent();
                this.SVTimer[index] = t + this.SVRefreshT;
            }
            return this.SVVal[index];
        }
        GetValString(index) {
            let t = performance.now();
            if (t > this.SVTimer[index]) {
                if (this.SVReg[index] < 0)
                    this.SVReg[index] = SimVar.GetRegisteredId(this.SVName + index + this.SVNameAfter, this.SVunit, "");
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal[index] = SimVar.GetSimVarValueFastRegString(this.SVReg[index]);
                engine.endProfileEvent();
                this.SVTimer[index] = t + this.SVRefreshT;
            }
            return this.SVVal[index];
        }
    }
    class GameVarGetter {
        constructor(_name, _unit, _reftime) {
            this.SVTimer = -10000000;
            this.SVReg = -1;
            this.SVName = _name;
            this.SVunit = _unit;
            this.SVRefreshT = _reftime;
        }
        GetVal() {
            let t = performance.now();
            if (t > this.SVTimer) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredGameVarId(this.SVName, this.SVunit);
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal = SimVar.GetGameVarValueFastReg(this.SVReg);
                engine.endProfileEvent();
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
        GetValSlowType() {
            let t = performance.now();
            if (t > this.SVTimer) {
                this.SVVal = SimVar.GetGameVarValue(this.SVName, this.SVunit);
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
        GetValForce(force) {
            let t = performance.now();
            if (force || (t > this.SVTimer)) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredGameVarId(this.SVName, this.SVunit);
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal = SimVar.GetGameVarValueFastReg(this.SVReg);
                engine.endProfileEvent();
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
        GetValParam1(v1) {
            let t = performance.now();
            if (t > this.SVTimer) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredGameVarId(this.SVName, this.SVunit);
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal = SimVar.GetGameVarValueFastReg(this.SVReg, v1);
                engine.endProfileEvent();
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
        GetValParam2(v1, v2) {
            let t = performance.now();
            if (t > this.SVTimer) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredGameVarId(this.SVName, this.SVunit);
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal = SimVar.GetGameVarValueFastReg(this.SVReg, v1, v2);
                engine.endProfileEvent();
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
        GetValt(t) {
            if (t > this.SVTimer) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredGameVarId(this.SVName, this.SVunit);
                this.SVVal = SimVar.GetGameVarValueFastReg(this.SVReg);
                this.SVTimer = t + this.SVRefreshT;
            }
            return this.SVVal;
        }
    }
    class GameVarTBatchGetter {
        constructor(_name, _unit, _reftime) {
            this.SVTimer = [-1000, -1000, -1000, -1000, -1000, -1000, -1000, -1000, -1000, -1000];
            this.SVReg = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
            this.SVName = _name;
            this.SVunit = _unit;
            this.SVRefreshT = _reftime;
            this.SVVal = new Array();
        }
        GetVal(index) {
            let t = performance.now();
            if (t > this.SVTimer[index]) {
                if (this.SVReg[index] < 0)
                    this.SVReg[index] = SimVar.GetRegisteredGameVarId(this.SVName + index, this.SVunit);
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal[index] = SimVar.GetGameVarValueFastReg(this.SVReg[index]);
                engine.endProfileEvent();
                this.SVTimer[index] = t + this.SVRefreshT;
            }
            return this.SVVal[index];
        }
    }
    class GameVarBatchGetter {
        constructor(_name, _unit, _reftime) {
            this.SVTimer = [-1000, -1000, -1000, -1000, -1000, -1000, -1000, -1000, -1000, -1000];
            this.SVReg = -1;
            this.SVName = _name;
            this.SVunit = _unit;
            this.SVRefreshT = _reftime;
            this.SVVal = new Array();
        }
        GetVal(index) {
            let t = performance.now();
            if (t > this.SVTimer[index]) {
                if (this.SVReg < 0)
                    this.SVReg = SimVar.GetRegisteredGameVarId(this.SVName, this.SVunit);
                engine.beginProfileEvent("GetVal:" + this.SVName);
                this.SVVal[index] = SimVar.GetGameVarValueFastReg(this.SVReg, index);
                engine.endProfileEvent();
                this.SVTimer[index] = t + this.SVRefreshT;
            }
            return this.SVVal[index];
        }
    }
    var _simplaneDSVNO = new GameVarGetter("AIRCRAFT_DESIGN_SPEED_VNO", "knots", StaticSimVarTimer);
    function getDSVNO() {
        return _simplaneDSVNO.GetVal();
    }
    Simplane.getDSVNO = getDSVNO;
    var _simplaneMGSP = new GameVarGetter("AIRCRAFT_MAX_GEAR_EXTENDED", "knots", StaticSimVarTimer);
    function getMGSP() {
        return _simplaneMGSP.GetVal();
    }
    Simplane.getMGSP = getMGSP;
    var _simplaneLoVa = new GameVarGetter("WARNING VACUUM", "boolean", SlowSimVarTimer);
    function LowVaccum() {
        return _simplaneLoVa.GetVal();
    }
    Simplane.LowVaccum = LowVaccum;
    var _simplaneStruDeIce = new SimVarGetter("STRUCTURAL DEICE SWITCH", "bool", SlowSimVarTimer);
    function getStructuralDeiceSwitch() {
        return _simplaneStruDeIce.GetVal();
    }
    Simplane.getStructuralDeiceSwitch = getStructuralDeiceSwitch;
    function getDesignSpeeds() {
        var speeds = new DesignSpeeds();
        speeds.VS0 = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VS0", "knots");
        speeds.VS1 = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VS1", "knots");
        speeds.VFe = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VFE", "knots");
        speeds.VNe = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VNE", "knots");
        speeds.VNo = getDSVNO();
        speeds.VMin = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VMIN", "knots");
        speeds.VMax = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VMAX", "knots");
        speeds.Vr = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VR", "knots");
        speeds.Vx = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VX", "knots");
        speeds.Vy = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VY", "knots");
        speeds.Vapp = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VAPP", "knots");
        speeds.BestGlide = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_BEST_GLIDE", "knots");
        speeds.Vyse = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VYSE", "knots");
        speeds.Vmc = SimVar.GetGameVarValueFast("AIRCRAFT_DESIGN_SPEED_VMC", "knots");
        return speeds;
    }
    Simplane.getDesignSpeeds = getDesignSpeeds;
    var _simplaneBTNWXActive = new SimVarGetter("L:BTN_WX_ACTIVE", "bool", SlowSimVarTimer);
    function getBTNWXActive() {
        return _simplaneBTNWXActive.GetVal();
    }
    Simplane.getBTNWXActive = getBTNWXActive;
    function setBTNWXActive(val) {
        return _simplaneBTNWXActive.SetVal(val);
    }
    Simplane.setBTNWXActive = setBTNWXActive;
    var _simplaneBTNTerrOnNdActive = new SimVarGetter("L:BTN_TERRONND_ACTIVE", "bool", SlowSimVarTimer);
    function getBTNTerrOnNdActive() {
        return _simplaneBTNTerrOnNdActive.GetVal();
    }
    Simplane.getBTNTerrOnNdActive = getBTNTerrOnNdActive;
    function setBTNTerrOnNdActive(val) {
        return _simplaneBTNTerrOnNdActive.SetVal(val);
    }
    Simplane.setBTNTerrOnNdActive = setBTNTerrOnNdActive;
    var _simplane747MFDNavMode = new SimVarGetter("L:B747_8_MFD_NAV_MODE", "number", SlowSimVarTimer);
    function get747MFDNavMode() {
        return _simplane747MFDNavMode.GetVal();
    }
    Simplane.get747MFDNavMode = get747MFDNavMode;
    function set747MFDNavMode(val) {
        return _simplane747MFDNavMode.SetVal(val);
    }
    Simplane.set747MFDNavMode = set747MFDNavMode;
    var _simplane747MFDRange = new SimVarGetter("L:B747_8_MFD_Range", "number", SlowSimVarTimer);
    function get747MFDRange() {
        return _simplane747MFDRange.GetVal();
    }
    Simplane.get747MFDRange = get747MFDRange;
    var _simplaneTAS = new SimVarGetter("AIRSPEED TRUE", "knots", FastSimVarTimer);
    function getTrueSpeed() {
        return _simplaneTAS.GetVal();
    }
    Simplane.getTrueSpeed = getTrueSpeed;
    var _simplaneIAS = new SimVarGetter("AIRSPEED INDICATED", "knots", FastSimVarTimer);
    function getIndicatedSpeed() {
        return _simplaneIAS.GetVal();
    }
    Simplane.getIndicatedSpeed = getIndicatedSpeed;
    var _simplaneEAS = new SimVarGetter("AIRSPEED EQUIVALENT", "knots", FastSimVarTimer);
    function getEquivalentAirSpeed() {
        return _simplaneEAS.GetVal();
    }
    Simplane.getEquivalentAirSpeed = getEquivalentAirSpeed;
    var _simplaneVS = new SimVarGetter("VERTICAL SPEED", "feet per minute", FastSimVarTimer);
    function getVerticalSpeed() {
        return _simplaneVS.GetVal();
    }
    Simplane.getVerticalSpeed = getVerticalSpeed;
    var _simplaneGS = new SimVarGetter("GPS GROUND SPEED", "knots", MedSimVarTimer);
    function getGroundSpeed() {
        return _simplaneGS.GetVal();
    }
    Simplane.getGroundSpeed = getGroundSpeed;
    var _simplaneGSTA = new SimVarGetter("GPS GROUND MAGNETIC TRACK", "degree", MedSimVarTimer);
    function getTrackAngle() {
        if (getGroundSpeed() < 5)
            return getHeadingMagnetic();
        return _simplaneGSTA.GetVal();
    }
    Simplane.getTrackAngle = getTrackAngle;
    var _simplaneMS = new SimVarGetter("AIRSPEED MACH", "mach", MedSimVarTimer);
    function getMachSpeed() {
        return _simplaneMS.GetVal();
    }
    Simplane.getMachSpeed = getMachSpeed;
    var _simplaneVWY = new SimVarGetter("VELOCITY WORLD Y", "feet per second", FastSimVarTimer);
    function getFlightPathAngleY() {
        let fpaY = Math.atan(_simplaneVWY.GetVal() / (getGroundSpeed() * 1.68781)) * Avionics.Utils.RAD2DEG;
        if (!isFinite(fpaY)) {
            fpaY = 0;
        }
        return fpaY;
    }
    Simplane.getFlightPathAngleY = getFlightPathAngleY;
    var _simplaneV1AS = new SimVarGetter("L:AIRLINER_V1_SPEED", "knots", SlowSimVarTimer);
    function getV1AirspeedR() {
        return _simplaneV1AS.GetVal();
    }
    Simplane.getV1AirspeedR = getV1AirspeedR;
    function getV1AirspeedP(phase) {
        if (phase <= FlightPhase.FLIGHT_PHASE_TAKEOFF) {
            return getV1AirspeedR();
        }
        return -1;
    }
    Simplane.getV1AirspeedP = getV1AirspeedP;
    var _simplaneVRAS = new SimVarGetter("L:AIRLINER_VR_SPEED", "knots", SlowSimVarTimer);
    function getVRAirspeedP(phase) {
        if (phase <= FlightPhase.FLIGHT_PHASE_TAKEOFF) {
            return _simplaneVRAS.GetVal();
        }
        return -1;
    }
    Simplane.getVRAirspeedP = getVRAirspeedP;
    function getV1Airspeed() {
        let phase = getCurrentFlightPhase();
        return getV1AirspeedP(phase);
    }
    Simplane.getV1Airspeed = getV1Airspeed;
    function getVRAirspeed() {
        let phase = getCurrentFlightPhase();
        return getVRAirspeedP(phase);
    }
    Simplane.getVRAirspeed = getVRAirspeed;
    function getV2Airspeed() {
        let phase = getCurrentFlightPhase();
        return getV2AirspeedP(phase);
    }
    Simplane.getV2Airspeed = getV2Airspeed;
    var _simplaneV2AS = new SimVarGetter("L:AIRLINER_V2_SPEED", "knots", SlowSimVarTimer);
    function getV2AirspeedP(phase) {
        if (phase <= FlightPhase.FLIGHT_PHASE_TAKEOFF) {
            return _simplaneV2AS.GetVal();
        }
        return -1;
    }
    Simplane.getV2AirspeedP = getV2AirspeedP;
    var _simplaneDecisionHeight = new SimVarGetter("DECISION HEIGHT", "feet", MedSimVarTimer);
    function getDecisionHeight() {
        return _simplaneDecisionHeight.GetVal();
    }
    Simplane.getDecisionHeight = getDecisionHeight;
    var _simplaneDecisionHeightMSL = new SimVarGetter("DECISION ALTITUDE MSL", "feet", MedSimVarTimer);
    function getDecisionHeightMSL() {
        return _simplaneDecisionHeightMSL.GetVal();
    }
    Simplane.getDecisionHeightMSL = getDecisionHeightMSL;
    var _simplaneREFAS = new SimVarGetter("L:AIRLINER_VREF_SPEED", "knots", SlowSimVarTimer);
    function getREFAirspeed() {
        return _simplaneREFAS.GetVal();
    }
    Simplane.getREFAirspeed = getREFAirspeed;
    var _simplaneVXS = new SimVarGetter("L:AIRLINER_VX_SPEED", "knots", SlowSimVarTimer);
    function getVXAirspeed() {
        return _simplaneVXS.GetVal();
    }
    Simplane.getVXAirspeed = getVXAirspeed;
    var _simplaneTGDS = new SimVarGetter("L:AIRLINER_TO_GREEN_DOT_SPD", "knots", SlowSimVarTimer);
    function getFMCGreenDotSpeed() {
        return _simplaneTGDS.GetVal();
    }
    Simplane.getFMCGreenDotSpeed = getFMCGreenDotSpeed;
    var _simplaneAGDS = new SimVarGetter("L:AIRLINER_APPR_GREEN_DOT_SPD", "number", SlowSimVarTimer);
    function getFMCApprGreenDotSpeed() {
        return _simplaneAGDS.GetVal();
    }
    Simplane.getFMCApprGreenDotSpeed = getFMCApprGreenDotSpeed;
    var _simplaneGDS = new GameVarGetter("AIRCRAFT GREEN DOT SPEED", "knots", SlowSimVarTimer);
    function getGreenDotSpeed() {
        return _simplaneGDS.GetVal();
    }
    Simplane.getGreenDotSpeed = getGreenDotSpeed;
    var _simplaneCruiseMach = new GameVarGetter("AIRCRAFT CRUISE MACH", "mach", StaticSimVarTimer);
    function getCruiseMach() {
        return _simplaneCruiseMach.GetVal();
    }
    Simplane.getCruiseMach = getCruiseMach;
    var _simplaneCrossoverSpeed = new GameVarGetter("AIRCRAFT CROSSOVER SPEED", "knots", SlowSimVarTimer);
    function getCrossoverSpeed() {
        return _simplaneCrossoverSpeed.GetVal();
    }
    Simplane.getCrossoverSpeed = getCrossoverSpeed;
    var _simplaneCOSF = new GameVarGetter("AIRCRAFT CROSSOVER SPEED FACTOR", "number", MedSimVarTimer);
    function getCrossoverSpeedFactor(_cas, _mach) {
        if (_mach <= 0) {
            return 1.0;
        }
        return _simplaneCOSF.GetValParam2(_cas, _mach);
    }
    Simplane.getCrossoverSpeedFactor = getCrossoverSpeedFactor;
    var _simplaneKiasToMach = new GameVarGetter("FROM KIAS TO MACH", "number", AllwaysTimer);
    function getKiasToMach(_kias) {
        return _simplaneKiasToMach.GetValParam1(_kias);
    }
    Simplane.getKiasToMach = getKiasToMach;
    var _simplaneMachToKias = new GameVarGetter("FROM MACH TO KIAS", "number", AllwaysTimer);
    function getMachToKias(_kias) {
        return _simplaneMachToKias.GetValParam1(_kias);
    }
    Simplane.getMachToKias = getMachToKias;
    var _simplaneFlapSL = new GameVarBatchGetter("AIRCRAFT FLAPS SPEED LIMIT", "Knots", StaticSimVarTimer);
    function getFlapsSpeedLim(index) {
        return _simplaneFlapSL.GetVal(index);
    }
    Simplane.getFlapsSpeedLim = getFlapsSpeedLim;
    function getFlapsLimitSpeed(_aircraft, _flapIndex) {
        if (_flapIndex > 0) {
            let limit = getFlapsSpeedLim(_flapIndex);
            if (limit > 0) {
                return limit;
            }
        }
        return getDSVNO();
    }
    Simplane.getFlapsLimitSpeed = getFlapsLimitSpeed;
    var _simplaneFHI = new SimVarGetter("FLAPS HANDLE INDEX", "number", SlowSimVarTimer);
    function getFlapsHandleIndex(forceSimVarCall = false) {
        return _simplaneFHI.GetValForce(forceSimVarCall);
    }
    Simplane.getFlapsHandleIndex = getFlapsHandleIndex;
    var _simplaneFES = 0;
    var _simplaneFESFrame = -1000;
    function getFlapsExtendSpeed(_aircraft, forceSimVarCall = false) {
        let t = performance.now();
        if (t > _simplaneFESFrame || forceSimVarCall) {
            _simplaneFES = getFlapsLimitSpeed(_aircraft, Simplane.getFlapsHandleIndex(forceSimVarCall));
            _simplaneFESFrame = t + SlowSimVarTimer;
        }
        return _simplaneFES;
    }
    Simplane.getFlapsExtendSpeed = getFlapsExtendSpeed;
    var _simplaneNFES = 0;
    var _simplaneNFESFrame = -1000;
    function getNextFlapsExtendSpeed(_aircraft, forceSimVarCall = false) {
        let t = performance.now();
        if (t > _simplaneNFESFrame || forceSimVarCall) {
            _simplaneNFES = getFlapsLimitSpeed(_aircraft, Simplane.getFlapsHandleIndex(forceSimVarCall) + 1);
            _simplaneNFESFrame = t + SlowSimVarTimer;
        }
        return _simplaneNFES;
    }
    Simplane.getNextFlapsExtendSpeed = getNextFlapsExtendSpeed;
    var _simplaneMAXS = 0;
    var _simplaneMAXSFrame = -1000;
    function getMaxSpeed(_aircraft) {
        let t = performance.now();
        if (t > _simplaneMAXSFrame) {
            _simplaneMAXS = Math.min(getDSVNO(), getFlapsExtendSpeed(_aircraft));
            if (getGearPosition() > Number.EPSILON) {
                _simplaneMAXS = Math.min(_simplaneMAXS, getMGSP());
            }
            _simplaneMAXSFrame = t + SlowSimVarTimer;
        }
        return _simplaneMAXS;
    }
    Simplane.getMaxSpeed = getMaxSpeed;
    var _simplaneLSS = new GameVarGetter("AIRCRAFT LOWEST SELECTABLE SPEED", "knots", SlowSimVarTimer);
    function getLowestSelectableSpeed() {
        return _simplaneLSS.GetVal();
    }
    Simplane.getLowestSelectableSpeed = getLowestSelectableSpeed;
    var _simplaneSPMiS = new GameVarGetter("AIRCRAFT STALL PROTECTION SPEED MIN", "knots", SlowSimVarTimer);
    function getStallProtectionMinSpeed() {
        return _simplaneSPMiS.GetVal();
    }
    Simplane.getStallProtectionMinSpeed = getStallProtectionMinSpeed;
    var _simplaneSPMaS = new GameVarGetter("AIRCRAFT STALL PROTECTION SPEED MAX", "knots", SlowSimVarTimer);
    function getStallProtectionMaxSpeed() {
        return _simplaneSPMaS.GetVal();
    }
    Simplane.getStallProtectionMaxSpeed = getStallProtectionMaxSpeed;
    var _simplaneStaS = new GameVarGetter("AIRCRAFT STALL SPEED", "knots", SlowSimVarTimer);
    function getStallSpeed() {
        return _simplaneStaS.GetVal();
    }
    Simplane.getStallSpeed = getStallSpeed;
    var _simplaneFlapSSP = new GameVarBatchGetter("AIRCRAFT STALL SPEED PREDICTED", "Knots", StaticSimVarTimer);
    function getStallSpeedPredicted(index) {
        return _simplaneFlapSSP.GetVal(index);
    }
    Simplane.getStallSpeedPredicted = getStallSpeedPredicted;
    var _simplaneWIND = new SimVarGetter("AMBIENT WIND DIRECTION", "degrees", SlowSimVarTimer);
    function getWindDirection() {
        return _simplaneWIND.GetVal();
    }
    Simplane.getWindDirection = getWindDirection;
    var _simplaneWINS = new SimVarGetter("AMBIENT WIND VELOCITY", "knots", SlowSimVarTimer);
    function getWindStrength() {
        return _simplaneWINS.GetVal();
    }
    Simplane.getWindStrength = getWindStrength;
    var _simplaneAPRadioNavSource = new SimVarGetter("L:RADIONAV_SOURCE", "number", SlowSimVarTimer);
    function getAPRadioNavSource() {
        return _simplaneAPRadioNavSource.GetVal();
    }
    Simplane.getAPRadioNavSource = getAPRadioNavSource;
    function setAPRadioNavSource(val) {
        _simplaneAPRadioNavSource.SetVal(val);
    }
    Simplane.setAPRadioNavSource = setAPRadioNavSource;
    var _simplaneAPLNAVActive = new SimVarGetter("L:AP_LNAV_ACTIVE", "number", SlowSimVarTimer);
    function getAPLNAVActive() {
        return _simplaneAPLNAVActive.GetVal();
    }
    Simplane.getAPLNAVActive = getAPLNAVActive;
    function setAPLNAVActive(val) {
        _simplaneAPLNAVActive.SetVal(val);
    }
    Simplane.setAPLNAVActive = setAPLNAVActive;
    var _simplaneAPLNAVArmed = new SimVarGetter("L:AP_LNAV_ARMED", "number", SlowSimVarTimer);
    function getAPLNAVArmed() {
        return _simplaneAPLNAVArmed.GetVal();
    }
    Simplane.getAPLNAVArmed = getAPLNAVArmed;
    function setAPLNAVArmed(val) {
        _simplaneAPLNAVArmed.SetVal(val);
    }
    Simplane.setAPLNAVArmed = setAPLNAVArmed;
    var _simplaneAPFLCHActive = new SimVarGetter("L:AP_FLCH_ACTIVE", "number", SlowSimVarTimer);
    function getAPFLCHActive() {
        return _simplaneAPFLCHActive.GetVal();
    }
    Simplane.getAPFLCHActive = getAPFLCHActive;
    function setAPFLCHActive(val) {
        _simplaneAPFLCHActive.SetVal(val);
    }
    Simplane.setAPFLCHActive = setAPFLCHActive;
    var _simplaneAPAltHoldActive = new SimVarGetter("L:AP_ALT_HOLD_ACTIVE", "number", SlowSimVarTimer);
    function getAPAltHoldActive() {
        return _simplaneAPAltHoldActive.GetVal();
    }
    Simplane.getAPAltHoldActive = getAPAltHoldActive;
    function setAPAltHoldActive(val) {
        _simplaneAPAltHoldActive.SetVal(val);
    }
    Simplane.setAPAltHoldActive = setAPAltHoldActive;
    var _simplaneAPVNAVActive = new SimVarGetter("L:AP_VNAV_ACTIVE", "number", SlowSimVarTimer);
    function getAPVNAVActive() {
        return _simplaneAPVNAVActive.GetVal();
    }
    Simplane.getAPVNAVActive = getAPVNAVActive;
    function setAPVNAVActive(val) {
        _simplaneAPVNAVActive.SetVal(val);
    }
    Simplane.setAPVNAVActive = setAPVNAVActive;
    var _simplaneAPVNAVArmed = new SimVarGetter("L:AP_VNAV_ARMED", "number", SlowSimVarTimer);
    function getAPVNAVArmed() {
        return _simplaneAPVNAVArmed.GetVal();
    }
    Simplane.getAPVNAVArmed = getAPVNAVArmed;
    function setAPVNAVArmed(val) {
        _simplaneAPVNAVArmed.SetVal(val);
    }
    Simplane.setAPVNAVArmed = setAPVNAVArmed;
    var _simplaneFMCFlightPlanIsTemp = new SimVarGetter("L:FMC_FLIGHT_PLAN_IS_TEMPORARY", "number", SlowSimVarTimer);
    function getFMCFlightPlanIsTemp() {
        return _simplaneFMCFlightPlanIsTemp.GetVal();
    }
    Simplane.getFMCFlightPlanIsTemp = getFMCFlightPlanIsTemp;
    var _simplaneAPAv = new GameVarGetter("AIRCRAFT AUTOPILOT AVAILABLE", "bool", SlowSimVarTimer);
    function getAutoPilotAvailable() {
        return _simplaneAPAv.GetVal();
    }
    Simplane.getAutoPilotAvailable = getAutoPilotAvailable;
    function setAutoPilotSelectedNav(_index) {
        if (Simplane.getAutoPilotAvailable())
            return SimVar.SetSimVarValue("K:AP_NAV_SELECT_SET", "number", _index);
        else
            return SimVar.SetSimVarValue("L:AP_NAV_SELECT_TMP", "number", _index);
    }
    Simplane.setAutoPilotSelectedNav = setAutoPilotSelectedNav;
    var _simplaneAPNavSel = new SimVarGetter("AUTOPILOT NAV SELECTED", "Number", SlowSimVarTimer);
    function getAutoPilotNavSelected() {
        return _simplaneAPNavSel.GetVal();
    }
    Simplane.getAutoPilotNavSelected = getAutoPilotNavSelected;
    var _simplaneAPNavSelTmp = new SimVarGetter("L:AP_NAV_SELECT_TMP", "Number", SlowSimVarTimer);
    function getAutoPilotNavSelectedTMP() {
        return _simplaneAPNavSelTmp.GetVal();
    }
    Simplane.getAutoPilotNavSelectedTMP = getAutoPilotNavSelectedTMP;
    var _simplaneAPSNAv = 0;
    var _simplaneAPSNAvFrame = -1000;
    var _simplaneAPSNAvREG1 = -1;
    var _simplaneAPSNAvREG2 = -1;
    function getAutoPilotSelectedNav() {
        if (Simplane.getAutoPilotAvailable()) {
            return getAutoPilotNavSelected();
        }
        else {
            return getAutoPilotNavSelectedTMP();
        }
    }
    Simplane.getAutoPilotSelectedNav = getAutoPilotSelectedNav;
    var _simplaneAPAc = [false, false, false, false, false, false, false, false, false, false];
    var _simplaneAPAcFrame = [-1000, -1000, -1000, -1000, -1000, -1000, -1000, -1000, -1000, -1000];
    var _simplaneAPAcREG = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    function getAutoPilotActive(_apIndex = 0) {
        let t = performance.now();
        if (t > _simplaneAPAcFrame[_apIndex]) {
            if (_simplaneAPAcREG[_apIndex] < 0) {
                if (_apIndex == 0) {
                    _simplaneAPAcREG[_apIndex] = SimVar.GetRegisteredId("AUTOPILOT MASTER", "Bool", "");
                }
                else {
                    _simplaneAPAcREG[_apIndex] = SimVar.GetRegisteredId("L:XMLVAR_Autopilot_" + _apIndex + "_Status", "Bool", "");
                }
            }
            _simplaneAPAc[_apIndex] = SimVar.GetSimVarValueFastReg(_simplaneAPAcREG[_apIndex]);
            _simplaneAPAcFrame[_apIndex] = t + SlowSimVarTimer;
        }
        return _simplaneAPAc[_apIndex];
    }
    Simplane.getAutoPilotActive = getAutoPilotActive;
    var _simplaneAPASSI = new SimVarGetter("AUTOPILOT SPEED SLOT INDEX", "number", SlowSimVarTimer);
    function getAutoPilotAirspeedSlotIndex() {
        return _simplaneAPASSI.GetVal();
    }
    Simplane.getAutoPilotAirspeedSlotIndex = getAutoPilotAirspeedSlotIndex;
    function getAutoPilotAirspeedManaged() {
        return getAutoPilotAirspeedSlotIndex() == 2;
    }
    Simplane.getAutoPilotAirspeedManaged = getAutoPilotAirspeedManaged;
    function getAutoPilotAirspeedSelected() {
        return getAutoPilotAirspeedSlotIndex() == 1;
    }
    Simplane.getAutoPilotAirspeedSelected = getAutoPilotAirspeedSelected;
    var _simplaneAPASHA2 = new SimVarGetter("AUTOPILOT AIRSPEED HOLD:2", "bool", SlowSimVarTimer);
    function getAutoPilotAirspeedHold2() {
        return _simplaneAPASHA2.GetVal();
    }
    Simplane.getAutoPilotAirspeedHold2 = getAutoPilotAirspeedHold2;
    var _simplaneAPASHA1 = new SimVarGetter("AUTOPILOT AIRSPEED HOLD:1", "bool", SlowSimVarTimer);
    function getAutoPilotAirspeedHold1() {
        return _simplaneAPASHA1.GetVal();
    }
    Simplane.getAutoPilotAirspeedHold1 = getAutoPilotAirspeedHold1;
    var _simplaneAPASH = new SimVarGetter("AUTOPILOT AIRSPEED HOLD", "bool", SlowSimVarTimer);
    function getAutoPilotAirspeedHold() {
        return _simplaneAPASH.GetVal();
    }
    Simplane.getAutoPilotAirspeedHold = getAutoPilotAirspeedHold;
    var _simplaneAPASHA = false;
    var _simplaneAPASHAFrame = -1000;
    var _simplaneAPASHAREG1 = -1;
    var _simplaneAPASHAREG2 = -1;
    function getAutoPilotAirspeedHoldActive(isManaged = false) {
        if (isManaged) {
            return getAutoPilotAirspeedHold2();
        }
        else {
            return getAutoPilotAirspeedHold1();
        }
    }
    Simplane.getAutoPilotAirspeedHoldActive = getAutoPilotAirspeedHoldActive;
    var _simplaneAPASHV = new SimVarGetter("AUTOPILOT AIRSPEED HOLD VAR", "knots", SlowSimVarTimer);
    function getAutoPilotAirspeedHoldValue() {
        return _simplaneAPASHV.GetVal();
    }
    Simplane.getAutoPilotAirspeedHoldValue = getAutoPilotAirspeedHoldValue;
    var _simplaneAPSASHV = new SimVarGetter("AUTOPILOT AIRSPEED HOLD VAR:1", "knots", SlowSimVarTimer);
    function getAutoPilotSelectedAirspeedHoldValue() {
        return _simplaneAPSASHV.GetVal();
    }
    Simplane.getAutoPilotSelectedAirspeedHoldValue = getAutoPilotSelectedAirspeedHoldValue;
    var _simplaneAPMASHV = new SimVarGetter("AUTOPILOT AIRSPEED HOLD VAR:2", "knots", SlowSimVarTimer);
    function getAutoPilotManagedAirspeedHoldValue() {
        return _simplaneAPMASHV.GetVal();
    }
    Simplane.getAutoPilotManagedAirspeedHoldValue = getAutoPilotManagedAirspeedHoldValue;
    var _simplaneAPMMA = new SimVarGetter("L:XMLVAR_AirSpeedIsInMach", "bool", SlowSimVarTimer);
    function getAutoPilotMachModeActive() {
        return _simplaneAPMMA.GetVal();
    }
    Simplane.getAutoPilotMachModeActive = getAutoPilotMachModeActive;
    function setAutoPilotMachModeActive(val) {
        _simplaneAPMMA.SetVal(val);
    }
    Simplane.setAutoPilotMachModeActive = setAutoPilotMachModeActive;
    var _simplaneAS1000WarIndex = new SimVarGetter("L:AS1000_Warnings_WarningIndex", "number", SlowSimVarTimer);
    function getAS1000WarIndex() {
        return _simplaneAS1000WarIndex.GetVal();
    }
    Simplane.getAS1000WarIndex = getAS1000WarIndex;
    function setAS1000WarIndex(val) {
        _simplaneAS1000WarIndex.SetVal(val);
    }
    Simplane.setAS1000WarIndex = setAS1000WarIndex;
    var _simplaneAS1000WarMasterSet = new SimVarGetter("L:AS1000_Warnings_Master_Set", "number", SlowSimVarTimer);
    function getAS1000WarMasterSet() {
        return _simplaneAS1000WarMasterSet.GetVal();
    }
    Simplane.getAS1000WarMasterSet = getAS1000WarMasterSet;
    function setAS1000WarMasterSet(val) {
        _simplaneAS1000WarMasterSet.SetVal(val);
    }
    Simplane.setAS1000WarMasterSet = setAS1000WarMasterSet;
    var _simplaneAutoPilotManSpdIsMachOn = new SimVarGetter("K:AP_MANAGED_SPEED_IN_MACH_ON", "number", SlowSimVarTimer);
    function getAutoPilotManSpdIsMachOn() {
        return _simplaneAutoPilotManSpdIsMachOn.GetVal();
    }
    Simplane.getAutoPilotManSpdIsMachOn = getAutoPilotManSpdIsMachOn;
    function setAutoPilotManSpdIsMachOn(val) {
        _simplaneAutoPilotManSpdIsMachOn.SetVal(val);
    }
    Simplane.setAutoPilotManSpdIsMachOn = setAutoPilotManSpdIsMachOn;
    var _simplaneECAMCurPage = new SimVarGetter("L:XMLVAR_ECAM_CURRENT_PAGE", "number", SlowSimVarTimer);
    function getECAMCurPage() {
        return _simplaneECAMCurPage.GetVal();
    }
    Simplane.getECAMCurPage = getECAMCurPage;
    function setECAMCurPage(val) {
        _simplaneECAMCurPage.SetVal(val);
    }
    Simplane.setECAMCurPage = setECAMCurPage;
    var _simplaneAutoPilotPanMachHold = new SimVarGetter("K:AP_PANEL_MACH_HOLD", "number", SlowSimVarTimer);
    function getAutoPilotPanMachHold() {
        return _simplaneAutoPilotPanMachHold.GetVal();
    }
    Simplane.getAutoPilotPanMachHold = getAutoPilotPanMachHold;
    function setAutoPilotPanMachHold(val) {
        _simplaneAutoPilotPanMachHold.SetVal(val);
    }
    Simplane.setAutoPilotPanMachHold = setAutoPilotPanMachHold;
    var _simplaneAutoPilotManSpdIsMachOff = new SimVarGetter("K:AP_MANAGED_SPEED_IN_MACH_OFF", "number", SlowSimVarTimer);
    function getAutoPilotManSpdIsMachOff() {
        return _simplaneAutoPilotManSpdIsMachOff.GetVal();
    }
    Simplane.getAutoPilotManSpdIsMachOff = getAutoPilotManSpdIsMachOff;
    function setAutoPilotManSpdIsMachOff(val) {
        _simplaneAutoPilotManSpdIsMachOff.SetVal(val);
    }
    Simplane.setAutoPilotManSpdIsMachOff = setAutoPilotManSpdIsMachOff;
    var _simplaneAutoPilotFMCForceNextUpdate = new SimVarGetter("L:AIRLINER_FMC_FORCE_NEXT_UPDATE", "number", SlowSimVarTimer);
    function getAutoPilotFMCForceNextUpdate() {
        return _simplaneAutoPilotFMCForceNextUpdate.GetVal();
    }
    Simplane.getAutoPilotFMCForceNextUpdate = getAutoPilotFMCForceNextUpdate;
    function setAutoPilotFMCForceNextUpdate(val) {
        _simplaneAutoPilotFMCForceNextUpdate.SetVal(val);
    }
    Simplane.setAutoPilotFMCForceNextUpdate = setAutoPilotFMCForceNextUpdate;
    var _simplaneAPMH = new SimVarGetter("AUTOPILOT MACH HOLD", "boolean", SlowSimVarTimer);
    function getAutoPilotMachHold() {
        return _simplaneAPMH.GetVal();
    }
    Simplane.getAutoPilotMachHold = getAutoPilotMachHold;
    var _simplaneAPMHV = new SimVarGetter("AUTOPILOT MACH HOLD VAR", "number", SlowSimVarTimer);
    function getAutoPilotMachHoldValue() {
        return _simplaneAPMHV.GetVal();
    }
    Simplane.getAutoPilotMachHoldValue = getAutoPilotMachHoldValue;
    var _simplaneAPSMHV = new SimVarGetter("AUTOPILOT MACH HOLD VAR:1", "number", SlowSimVarTimer);
    function getAutoPilotSelectedMachHoldValue() {
        return _simplaneAPSMHV.GetVal();
    }
    Simplane.getAutoPilotSelectedMachHoldValue = getAutoPilotSelectedMachHoldValue;
    var _simplaneAPMMHV = new SimVarGetter("AUTOPILOT MACH HOLD VAR:2", "number", SlowSimVarTimer);
    function getAutoPilotManagedMachHoldValue() {
        return _simplaneAPMMHV.GetVal();
    }
    Simplane.getAutoPilotManagedMachHoldValue = getAutoPilotManagedMachHoldValue;
    var _simplaneAPHeaSI = new SimVarGetter("AUTOPILOT HEADING SLOT INDEX", "number", SlowSimVarTimer);
    function getAutoPilotHeadingSlotIndex() {
        return _simplaneAPHeaSI.GetVal();
    }
    Simplane.getAutoPilotHeadingSlotIndex = getAutoPilotHeadingSlotIndex;
    function getAutoPilotHeadingManaged() {
        return getAutoPilotHeadingSlotIndex() == 2;
    }
    Simplane.getAutoPilotHeadingManaged = getAutoPilotHeadingManaged;
    function getAutoPilotHeadingSelected() {
        return getAutoPilotHeadingSlotIndex() == 1;
    }
    Simplane.getAutoPilotHeadingSelected = getAutoPilotHeadingSelected;
    var _simplaneAPHeaLA = new SimVarGetter("AUTOPILOT HEADING LOCK", "bool", SlowSimVarTimer);
    function getAutoPilotHeadingLockActive() {
        return _simplaneAPHeaLA.GetVal();
    }
    Simplane.getAutoPilotHeadingLockActive = getAutoPilotHeadingLockActive;
    var _simplaneAPHeaLVR = new SimVarGetter("AUTOPILOT HEADING LOCK DIR", "radians", SlowSimVarTimer);
    function getAutoPilotHeadingLockValueRadians() {
        return _simplaneAPHeaLVR.GetVal();
    }
    Simplane.getAutoPilotHeadingLockValueRadians = getAutoPilotHeadingLockValueRadians;
    var _simplaneAPHeaLVD = new SimVarGetter("AUTOPILOT HEADING LOCK DIR", "degrees", SlowSimVarTimer);
    function getAutoPilotHeadingLockValueDegrees() {
        return _simplaneAPHeaLVD.GetVal();
    }
    Simplane.getAutoPilotHeadingLockValueDegrees = getAutoPilotHeadingLockValueDegrees;
    function getAutoPilotHeadingLockValue(_radians = true) {
        if (_radians) {
            return getAutoPilotHeadingLockValueRadians();
        }
        else {
            return getAutoPilotHeadingLockValueDegrees();
        }
    }
    Simplane.getAutoPilotHeadingLockValue = getAutoPilotHeadingLockValue;
    var _simplaneAPSHeaLVR = new SimVarGetter("AUTOPILOT HEADING LOCK DIR:1", "radians", SlowSimVarTimer);
    function getAutoPilotSelectedHeadingLockValueRadians() {
        return _simplaneAPSHeaLVR.GetVal();
    }
    Simplane.getAutoPilotSelectedHeadingLockValueRadians = getAutoPilotSelectedHeadingLockValueRadians;
    var _simplaneAPSHeaLVD = new SimVarGetter("AUTOPILOT HEADING LOCK DIR:1", "degrees", SlowSimVarTimer);
    function getAutoPilotSelectedHeadingLockValueDegrees() {
        return _simplaneAPSHeaLVD.GetVal();
    }
    Simplane.getAutoPilotSelectedHeadingLockValueDegrees = getAutoPilotSelectedHeadingLockValueDegrees;
    function getAutoPilotSelectedHeadingLockValue(_radians = true) {
        if (_radians) {
            return getAutoPilotSelectedHeadingLockValueRadians();
        }
        else {
            return getAutoPilotSelectedHeadingLockValueDegrees();
        }
    }
    Simplane.getAutoPilotSelectedHeadingLockValue = getAutoPilotSelectedHeadingLockValue;
    var _simplaneAPMHeaLVR = new SimVarGetter("AUTOPILOT HEADING LOCK DIR:2", "radians", SlowSimVarTimer);
    function getAutoPilotManagedHeadingLockValueRadians() {
        return _simplaneAPMHeaLVR.GetVal();
    }
    Simplane.getAutoPilotManagedHeadingLockValueRadians = getAutoPilotManagedHeadingLockValueRadians;
    var _simplaneAPMHeaLVD = new SimVarGetter("AUTOPILOT HEADING LOCK DIR:2", "degrees", SlowSimVarTimer);
    function getAutoPilotManagedHeadingLockValueDegrees() {
        return _simplaneAPMHeaLVD.GetVal();
    }
    Simplane.getAutoPilotManagedHeadingLockValueDegrees = getAutoPilotManagedHeadingLockValueDegrees;
    function getAutoPilotManagedHeadingValue(_radians = true) {
        if (_radians) {
            return getAutoPilotManagedHeadingLockValueRadians();
        }
        else {
            return getAutoPilotManagedHeadingLockValueDegrees();
        }
    }
    Simplane.getAutoPilotManagedHeadingValue = getAutoPilotManagedHeadingValue;
    var _simplaneAPDHeaLVR = new SimVarGetter("AUTOPILOT HEADING LOCK DIR:3", "radians", SlowSimVarTimer);
    function getAutoPilotDisplayedHeadingLockValueRadians() {
        return _simplaneAPDHeaLVR.GetVal();
    }
    Simplane.getAutoPilotDisplayedHeadingLockValueRadians = getAutoPilotDisplayedHeadingLockValueRadians;
    var _simplaneAPDHeaLVD = new SimVarGetter("AUTOPILOT HEADING LOCK DIR:3", "degrees", SlowSimVarTimer);
    function getAutoPilotDisplayedHeadingLockValueDegrees() {
        return _simplaneAPDHeaLVD.GetVal();
    }
    Simplane.getAutoPilotDisplayedHeadingLockValueDegrees = getAutoPilotDisplayedHeadingLockValueDegrees;
    function getAutoPilotDisplayedHeadingValue(_radians = true) {
        if (_radians) {
            return getAutoPilotDisplayedHeadingLockValueRadians();
        }
        else {
            return getAutoPilotDisplayedHeadingLockValueDegrees();
        }
    }
    Simplane.getAutoPilotDisplayedHeadingValue = getAutoPilotDisplayedHeadingValue;
    var _simplaneAPAltSI = new SimVarGetter("AUTOPILOT ALTITUDE SLOT INDEX", "number", MedSimVarTimer);
    function getAutoPilotAltitudeSlotIndex() {
        return _simplaneAPAltSI.GetVal();
    }
    Simplane.getAutoPilotAltitudeSlotIndex = getAutoPilotAltitudeSlotIndex;
    function getAutoPilotAltitudeManaged() {
        return getAutoPilotAltitudeSlotIndex() == 2;
    }
    Simplane.getAutoPilotAltitudeManaged = getAutoPilotAltitudeManaged;
    function getAutoPilotAltitudeSelected() {
        return getAutoPilotAltitudeSlotIndex() == 1;
    }
    Simplane.getAutoPilotAltitudeSelected = getAutoPilotAltitudeSelected;
    var _simplaneAPAltAr = new SimVarGetter("AUTOPILOT ALTITUDE ARM", "bool", SlowSimVarTimer);
    function getAutoPilotAltitudeArm() {
        return _simplaneAPAltAr.GetVal();
    }
    Simplane.getAutoPilotAltitudeArm = getAutoPilotAltitudeArm;
    function getAutoPilotAltitudeArmed() {
        if (getAutoPilotVerticalSpeedHoldActive()) {
            return true;
        }
        return getAutoPilotAltitudeArm();
    }
    Simplane.getAutoPilotAltitudeArmed = getAutoPilotAltitudeArmed;
    var _simplaneAPAltLoA = new SimVarGetter("AUTOPILOT ALTITUDE LOCK", "bool", SlowSimVarTimer);
    function getAutoPilotAltitudeLockActive() {
        return _simplaneAPAltLoA.GetVal();
    }
    Simplane.getAutoPilotAltitudeLockActive = getAutoPilotAltitudeLockActive;
    var _simplaneAPAltFLCA = new SimVarGetter("AUTOPILOT FLIGHT LEVEL CHANGE", "boolean", SlowSimVarTimer);
    function getAutoPilotFLCActive() {
        return _simplaneAPAltFLCA.GetVal();
    }
    Simplane.getAutoPilotFLCActive = getAutoPilotFLCActive;
    var _simplaneAPAltLoV = new SimVarGetter("AUTOPILOT ALTITUDE LOCK VAR", "feet", MedSimVarTimer);
    function getAutoPilotAltitudeLockValueFeet() {
        return _simplaneAPAltLoV.GetVal();
    }
    Simplane.getAutoPilotAltitudeLockValueFeet = getAutoPilotAltitudeLockValueFeet;
    function getAutoPilotAltitudeLockValue(_units = "feet") {
        if (_units == "feet") {
            return getAutoPilotAltitudeLockValueFeet();
        }
        return SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR", _units);
    }
    Simplane.getAutoPilotAltitudeLockValue = getAutoPilotAltitudeLockValue;
    var _simplaneAPSAltLoV = new SimVarGetter("AUTOPILOT ALTITUDE LOCK VAR:1", "feet", MedSimVarTimer);
    function getAutoPilotSelectedAltitudeLockValueFeet() {
        return _simplaneAPSAltLoV.GetVal();
    }
    Simplane.getAutoPilotSelectedAltitudeLockValueFeet = getAutoPilotSelectedAltitudeLockValueFeet;
    function getAutoPilotSelectedAltitudeLockValue(_units = "feet") {
        if (_units == "feet") {
            return getAutoPilotSelectedAltitudeLockValueFeet();
        }
        return SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR:1", _units);
    }
    Simplane.getAutoPilotSelectedAltitudeLockValue = getAutoPilotSelectedAltitudeLockValue;
    var _simplaneAPDAltLoV = new SimVarGetter("AUTOPILOT ALTITUDE LOCK VAR:3", "feet", MedSimVarTimer);
    function getAutoPilotDisplayedAltitudeLockValueFeet() {
        return _simplaneAPDAltLoV.GetVal();
    }
    Simplane.getAutoPilotDisplayedAltitudeLockValueFeet = getAutoPilotDisplayedAltitudeLockValueFeet;
    function getAutoPilotDisplayedAltitudeLockValue(_units = "feet") {
        if (_units == "feet") {
            return getAutoPilotDisplayedAltitudeLockValueFeet();
        }
        return SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR:3", _units);
    }
    Simplane.getAutoPilotDisplayedAltitudeLockValue = getAutoPilotDisplayedAltitudeLockValue;
    function getAutoPilotAltitudeLockUnits() {
        return "feet";
    }
    Simplane.getAutoPilotAltitudeLockUnits = getAutoPilotAltitudeLockUnits;
    var _simplaneAPVSHA = new SimVarGetter("AUTOPILOT VERTICAL HOLD", "Bool", SlowSimVarTimer);
    function getAutoPilotVerticalSpeedHoldActive() {
        return _simplaneAPVSHA.GetVal();
    }
    Simplane.getAutoPilotVerticalSpeedHoldActive = getAutoPilotVerticalSpeedHoldActive;
    var _simplaneAPVSHV = new SimVarGetter("AUTOPILOT VERTICAL HOLD VAR", "feet per minute", MedSimVarTimer);
    function getAutoPilotVerticalSpeedHoldValue() {
        return _simplaneAPVSHV.GetVal();
    }
    Simplane.getAutoPilotVerticalSpeedHoldValue = getAutoPilotVerticalSpeedHoldValue;
    var _simplaneAPSVSHV = new SimVarGetter("AUTOPILOT VERTICAL HOLD VAR:1", "feet per minute", MedSimVarTimer);
    function getAutoPilotSelectedVerticalSpeedHoldValue() {
        return _simplaneAPSVSHV.GetVal();
    }
    Simplane.getAutoPilotSelectedVerticalSpeedHoldValue = getAutoPilotSelectedVerticalSpeedHoldValue;
    var _simplaneAPDVSHV = new SimVarGetter("AUTOPILOT VERTICAL HOLD VAR:3", "feet per minute", MedSimVarTimer);
    function getAutoPilotDisplayedVerticalSpeedHoldValue() {
        return _simplaneAPDVSHV.GetVal();
    }
    Simplane.getAutoPilotDisplayedVerticalSpeedHoldValue = getAutoPilotDisplayedVerticalSpeedHoldValue;
    var _simplaneAPLMA = new SimVarGetter("AUTOPILOT NAV1 LOCK", "bool", SlowSimVarTimer);
    function getAutoPilotLateralModeActive() {
        return _simplaneAPLMA.GetVal();
    }
    Simplane.getAutoPilotLateralModeActive = getAutoPilotLateralModeActive;
    var _simplaneAPNavHasLoc = new SimVarTBatchGetter("NAV HAS LOCALIZER:", "bool", SlowSimVarTimer);
    function getAutoPilotNavHasLoc(_fdIndex) {
        return _simplaneAPNavHasLoc.GetVal(_fdIndex);
    }
    Simplane.getAutoPilotNavHasLoc = getAutoPilotNavHasLoc;
    var _simplaneAPFDA = new SimVarTBatchGetter("AUTOPILOT FLIGHT DIRECTOR ACTIVE:", "bool", SlowSimVarTimer);
    function getAutoPilotFlightDirectorActive(_fdIndex) {
        return _simplaneAPFDA.GetVal(_fdIndex);
    }
    Simplane.getAutoPilotFlightDirectorActive = getAutoPilotFlightDirectorActive;
    var _simplaneAPFDBV = new SimVarGetter("AUTOPILOT FLIGHT DIRECTOR BANK", "degree", SlowSimVarTimer);
    function getAutoPilotFlightDirectorBankValue() {
        return _simplaneAPFDBV.GetVal();
    }
    Simplane.getAutoPilotFlightDirectorBankValue = getAutoPilotFlightDirectorBankValue;
    var _simplaneAPFDPV = new SimVarGetter("AUTOPILOT FLIGHT DIRECTOR PITCH", "degree", SlowSimVarTimer);
    function getAutoPilotFlightDirectorPitchValue() {
        return _simplaneAPFDPV.GetVal();
    }
    Simplane.getAutoPilotFlightDirectorPitchValue = getAutoPilotFlightDirectorPitchValue;
    var _simplaneAPGPDS = new SimVarGetter("GPS DRIVES NAV1", "Bool", SlowSimVarTimer);
    function getAutopilotGPSDriven() {
        return _simplaneAPGPDS.GetVal();
    }
    Simplane.getAutopilotGPSDriven = getAutopilotGPSDriven;
    var _simplaneAPTCNDN = new SimVarGetter("TACAN DRIVES NAV1", "Bool", SlowSimVarTimer);
    function getAutopilotTacanDriven() {
        return _simplaneAPTCNDN.GetVal();
    }
    Simplane.getAutopilotTacanDriven = getAutopilotTacanDriven;
    var _simplaneAPGPDA = new SimVarGetter("GPS IS ACTIVE WAY POINT", "Bool", SlowSimVarTimer);
    function getAutopilotGPSActive() {
        return _simplaneAPGPDA.GetVal();
    }
    Simplane.getAutopilotGPSActive = getAutopilotGPSActive;
    function getAutoPilotTrackAngle() {
        if (getGroundSpeed() < 5)
            return getHeadingMagnetic();
        return getTrackAngle();
    }
    Simplane.getAutoPilotTrackAngle = getAutoPilotTrackAngle;
    function getAutoPilotFlightPathAngle() {
        return Simplane.getAutoPilotSelectedVerticalSpeedHoldValue() / 100;
    }
    Simplane.getAutoPilotFlightPathAngle = getAutoPilotFlightPathAngle;
    var _simplaneAPTArmA = new SimVarGetter("AUTOPILOT THROTTLE ARM", "bool", SlowSimVarTimer);
    function getAutoPilotThrottleArmedA() {
        return _simplaneAPTArmA.GetVal();
    }
    Simplane.getAutoPilotThrottleArmedA = getAutoPilotThrottleArmedA;
    var _simplaneAPTArmB = new SimVarTBatchGetter("AUTOPILOT THROTTLE ARM:", "bool", SlowSimVarTimer);
    function getAutoPilotThrottleArmedB(_fdIndex) {
        return _simplaneAPTArmB.GetVal(_fdIndex);
    }
    Simplane.getAutoPilotThrottleArmedB = getAutoPilotThrottleArmedB;
    function getAutoPilotThrottleArmed(_index = 0) {
        if (_index == 0) {
            return getAutoPilotThrottleArmedA();
        }
        else {
            return getAutoPilotThrottleArmedB(_index);
        }
    }
    Simplane.getAutoPilotThrottleArmed = getAutoPilotThrottleArmed;
    var _simplaneAPTLo = new SimVarGetter("FLY BY WIRE ALPHA PROTECTION", "bool", SlowSimVarTimer);
    function getAutoPilotThrottleLocked() {
        return _simplaneAPTLo.GetVal();
    }
    Simplane.getAutoPilotThrottleLocked = getAutoPilotThrottleLocked;
    var _simplaneAPTActA = new SimVarGetter("AUTOPILOT MANAGED THROTTLE ACTIVE", "bool", SlowSimVarTimer);
    function getAutoPilotThrottleActiveA() {
        return _simplaneAPTActA.GetVal();
    }
    Simplane.getAutoPilotThrottleActiveA = getAutoPilotThrottleActiveA;
    var _simplaneAPTActB = new SimVarTBatchGetter("AUTOPILOT MANAGED THROTTLE ACTIVE:", "bool", SlowSimVarTimer);
    function getAutoPilotThrottleActiveB(_fdIndex) {
        return _simplaneAPTActB.GetVal(_fdIndex);
    }
    Simplane.getAutoPilotThrottleActiveB = getAutoPilotThrottleActiveB;
    function getAutoPilotThrottleActive(_index = 0) {
        if (_index == 0) {
            return getAutoPilotThrottleActiveA();
        }
        else {
            return getAutoPilotThrottleActiveB(_index);
        }
    }
    Simplane.getAutoPilotThrottleActive = getAutoPilotThrottleActive;
    var _simplaneAPTOGAA = new SimVarGetter("AUTOPILOT TAKEOFF POWER ACTIVE", "bool", SlowSimVarTimer);
    function getAutoPilotTOGAActive() {
        return _simplaneAPTOGAA.GetVal();
    }
    Simplane.getAutoPilotTOGAActive = getAutoPilotTOGAActive;
    var _simplaneAPAprLo = new SimVarGetter("AUTOPILOT APPROACH IS LOCALIZER", "bool", SlowSimVarTimer);
    function getAutoPilotAPPRIsLocalizer() {
        return _simplaneAPAprLo.GetVal();
    }
    Simplane.getAutoPilotAPPRIsLocalizer = getAutoPilotAPPRIsLocalizer;
    var _simplaneAPAprCa = new SimVarGetter("AUTOPILOT APPROACH CAPTURED", "bool", SlowSimVarTimer);
    function getAutoPilotAPPRCaptured() {
        return _simplaneAPAprCa.GetVal();
    }
    Simplane.getAutoPilotAPPRCaptured = getAutoPilotAPPRCaptured;
    var _simplaneAPAprAc = new SimVarGetter("AUTOPILOT APPROACH ACTIVE", "bool", SlowSimVarTimer);
    function getAutoPilotAPPRAct() {
        return _simplaneAPAprAc.GetVal();
    }
    Simplane.getAutoPilotAPPRAct = getAutoPilotAPPRAct;
    function getAutoPilotAPPRActive() {
        if (getAutoPilotAPPRAct() && !getAutopilotGPSDriven() && getAutoPilotAPPRCaptured())
            return true;
        return false;
    }
    Simplane.getAutoPilotAPPRActive = getAutoPilotAPPRActive;
    var _simplaneAPAprAr = new SimVarGetter("AUTOPILOT APPROACH ARM", "bool", SlowSimVarTimer);
    function getAutoPilotAPPRAr() {
        return _simplaneAPAprAr.GetVal();
    }
    Simplane.getAutoPilotAPPRAr = getAutoPilotAPPRAr;
    function getAutoPilotAPPRArm() {
        if (getAutoPilotAPPRAr())
            return true;
        if (getAutoPilotAPPRAct() && (getAutopilotGPSDriven() || !getAutoPilotAPPRCaptured()))
            return true;
        return false;
    }
    Simplane.getAutoPilotAPPRArm = getAutoPilotAPPRArm;
    var _simplaneAPAprHo = new SimVarGetter("AUTOPILOT APPROACH HOLD", "bool", SlowSimVarTimer);
    function getAutoPilotAPPRHold() {
        return _simplaneAPAprHo.GetVal();
    }
    Simplane.getAutoPilotAPPRHold = getAutoPilotAPPRHold;
    var _simplaneAPTrkFPAMA = new SimVarGetter("L:XMLVAR_TRK_FPA_MODE_ACTIVE", "boolean", SlowSimVarTimer);
    function getAutoPilotTRKFPAModeActive() {
        return _simplaneAPTrkFPAMA.GetVal();
    }
    Simplane.getAutoPilotTRKFPAModeActive = getAutoPilotTRKFPAModeActive;
    var _simplaneAPTrkMA = new SimVarGetter("L:XMLVAR_TRK_MODE_ACTIVE", "boolean", SlowSimVarTimer);
    function getAutoPilotTRKModeActive() {
        return _simplaneAPTrkMA.GetVal();
    }
    Simplane.getAutoPilotTRKModeActive = getAutoPilotTRKModeActive;
    var _simplaneAPFPAMA = new SimVarGetter("L:XMLVAR_FPA_MODE_ACTIVE", "boolean", SlowSimVarTimer);
    function getAutoPilotFPAModeActive() {
        return _simplaneAPFPAMA.GetVal();
    }
    Simplane.getAutoPilotFPAModeActive = getAutoPilotFPAModeActive;
    var _simplaneAPGSA = new SimVarGetter("AUTOPILOT GLIDESLOPE ACTIVE", "bool", SlowSimVarTimer);
    function getAutoPilotGlideslopeActive() {
        return _simplaneAPGSA.GetVal();
    }
    Simplane.getAutoPilotGlideslopeActive = getAutoPilotGlideslopeActive;
    var _simplaneAPGSArm = new SimVarGetter("AUTOPILOT GLIDESLOPE ARM", "bool", SlowSimVarTimer);
    function getAutoPilotGlideslopeArm() {
        return _simplaneAPGSArm.GetVal();
    }
    Simplane.getAutoPilotGlideslopeArm = getAutoPilotGlideslopeArm;
    var _simplaneAPGSHo = new SimVarGetter("AUTOPILOT GLIDESLOPE HOLD", "bool", SlowSimVarTimer);
    function getAutoPilotGlideslopeHold() {
        return _simplaneAPGSHo.GetVal();
    }
    Simplane.getAutoPilotGlideslopeHold = getAutoPilotGlideslopeHold;
    var _simplaneAPApTy = new SimVarGetter("GPS APPROACH APPROACH TYPE", "Enum", SlowSimVarTimer);
    function getAutoPilotApproachType() {
        return _simplaneAPApTy.GetVal();
    }
    Simplane.getAutoPilotApproachType = getAutoPilotApproachType;
    var _simplaneGPSWpNextID = new SimVarGetter("GPS WP NEXT ID", "string", SlowSimVarTimer);
    function getGPSWpNextID() {
        return _simplaneGPSWpNextID.GetValString();
    }
    Simplane.getGPSWpNextID = getGPSWpNextID;
    var _simplaneAPApLo = new SimVarGetter("GPS IS APPROACH LOADED", "bool", SlowSimVarTimer);
    function getAutoPilotApproachLoaded() {
        return _simplaneAPApLo.GetVal();
    }
    Simplane.getAutoPilotApproachLoaded = getAutoPilotApproachLoaded;
    var _simplaneAutoPilotNavAidStateL = new SimVarTBatchGetter("L:XMLVAR_NAV_AID_SWITCH_L", "number", SlowSimVarTimer, "_State");
    function getAutoPilotNavAidStateL(_Index) {
        return _simplaneAutoPilotNavAidStateL.GetVal(_Index);
    }
    Simplane.getAutoPilotNavAidStateL = getAutoPilotNavAidStateL;
    var _simplaneAutoPilotNavAidStateR = new SimVarTBatchGetter("L:XMLVAR_NAV_AID_SWITCH_R", "number", SlowSimVarTimer, "_State");
    function getAutoPilotNavAidStateR(_Index) {
        return _simplaneAutoPilotNavAidStateR.GetVal(_Index);
    }
    Simplane.getAutoPilotNavAidStateR = getAutoPilotNavAidStateR;
    function getAutoPilotNavAidState(_aircraft, _user, _switch) {
        var state;
        if (_user == 1)
            state = getAutoPilotNavAidStateL(_switch);
        else
            state = getAutoPilotNavAidStateR(_switch);
        if (_aircraft == Aircraft.B747_8) {
            state--;
            if (state < 0)
                state = 2;
        }
        return state;
    }
    Simplane.getAutoPilotNavAidState = getAutoPilotNavAidState;
    function getAutoPilotIsHeadingAligned() {
        let heading = getHeadingMagnetic();
        let targetHeading = getAutoPilotHeadingLockValue(false);
        let delta = Math.abs(targetHeading - heading);
        while (delta >= 360) {
            delta -= 360;
        }
        return delta < 1;
    }
    Simplane.getAutoPilotIsHeadingAligned = getAutoPilotIsHeadingAligned;
    function getNextWaypointName() {
        return SimVar.GetSimVarValue("GPS WP NEXT ID", "string");
    }
    Simplane.getNextWaypointName = getNextWaypointName;
    var _simplaneNWPTrk = new SimVarGetter("GPS WP BEARING", "degree", MedSimVarTimer);
    function getNextWaypointTrack() {
        return _simplaneNWPTrk.GetVal();
    }
    Simplane.getNextWaypointTrack = getNextWaypointTrack;
    var _simplaneNWPDst = new SimVarGetter("GPS WP DISTANCE", "nautical miles", MedSimVarTimer);
    function getNextWaypointDistance() {
        return _simplaneNWPDst.GetVal();
    }
    Simplane.getNextWaypointDistance = getNextWaypointDistance;
    var _simplaneNWPDesiredTrk = new SimVarGetter("GPS WP DESIRED TRACK", "degree", MedSimVarTimer);
    function getNextWaypointDesiredTrack() {
        return _simplaneNWPDesiredTrk.GetVal();
    }
    Simplane.getNextWaypointDesiredTrack = getNextWaypointDesiredTrack;
    var _simplaneNWPCTrk = new SimVarGetter("GPS WP CROSS TRK", "nautical mile", MedSimVarTimer);
    function getNextWaypointCrossTrk() {
        return _simplaneNWPCTrk.GetVal();
    }
    Simplane.getNextWaypointCrossTrk = getNextWaypointCrossTrk;
    var _simplaneNWPEta = new SimVarGetter("GPS WP ETA", "seconds", MedSimVarTimer);
    function getNextWaypointETA() {
        return _simplaneNWPEta.GetVal();
    }
    Simplane.getNextWaypointETA = getNextWaypointETA;
    var _simplaneFltTim = new SimVarGetter("GENERAL ENG ELAPSED TIME:1", "seconds", MedSimVarTimer);
    function getFlightTime() {
        return _simplaneFltTim.GetVal();
    }
    Simplane.getFlightTime = getFlightTime;
    function getCurrentUTC() {
        return SimVar.GetGlobalVarValue("ZULU TIME", "seconds");
    }
    Simplane.getCurrentUTC = getCurrentUTC;
    function getCurrentLocalTime() {
        return SimVar.GetGlobalVarValue("LOCAL TIME", "seconds");
    }
    Simplane.getCurrentLocalTime = getCurrentLocalTime;
    function getCurrentTimeDeviation() {
        return SimVar.GetGlobalVarValue("TIME ZONE OFFSET", "seconds");
    }
    Simplane.getCurrentTimeDeviation = getCurrentTimeDeviation;
    var _simplaneTurbEng1IsIgn = new SimVarGetter("TURB ENG IS IGNITING:1", "bool", StaticSimVarTimer);
    function getTurbEng1IsIgn() {
        return _simplaneTurbEng1IsIgn.GetVal();
    }
    Simplane.getTurbEng1IsIgn = getTurbEng1IsIgn;
    var _simplaneEngStarAc1 = new SimVarGetter("GENERAL ENG STARTER ACTIVE:1", "bool", StaticSimVarTimer);
    function getEngStarAc1() {
        return _simplaneEngStarAc1.GetVal();
    }
    Simplane.getEngStarAc1 = getEngStarAc1;
    var _simplaneEngCnt = new SimVarGetter("NUMBER OF ENGINES", "number", StaticSimVarTimer);
    function getEngineCount() {
        return _simplaneEngCnt.GetVal();
    }
    Simplane.getEngineCount = getEngineCount;
    var _simplaneEngEGT = new SimVarTBatchGetter("ENG EXHAUST GAS TEMPERATURE:", "celsius", SlowSimVarTimer);
    function getEngineEGT(_engineIndex) {
        return _simplaneEngEGT.GetVal(_engineIndex);
    }
    Simplane.getEngineEGT = getEngineEGT;
    var _simplaneEngAntiIce = new SimVarTBatchGetter("ENG ANTI ICE:", "bool", SlowSimVarTimer);
    function getEngineAntiIce(_engineIndex) {
        return _simplaneEngAntiIce.GetVal(_engineIndex);
    }
    Simplane.getEngineAntiIce = getEngineAntiIce;
    var _simplaneEngAct = new SimVarTBatchGetter("ENG COMBUSTION:", "bool", SlowSimVarTimer);
    function getEngineActive(_engineIndex) {
        return _simplaneEngAct.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineActive = getEngineActive;
    var _simplaneEngThr = new SimVarTBatchGetter("GENERAL ENG THROTTLE LEVER POSITION:", "percent", FastSimVarTimer);
    function getEngineThrottle(_engineIndex) {
        return _simplaneEngThr.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineThrottle = getEngineThrottle;
    var _simplaneEngRevThr = new SimVarTBatchGetter("GENERAL ENG REVERSE THRUST ENGAGED:", "bool", MedSimVarTimer);
    function getEngineRevThrust(_engineIndex) {
        return _simplaneEngRevThr.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineRevThrust = getEngineRevThrust;
    var _simplaneEngThrM = new SimVarTBatchGetter("GENERAL ENG THROTTLE MANAGED MODE:", "number", MedSimVarTimer);
    function getEngineThrottleMode(_engineIndex) {
        return _simplaneEngThrM.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineThrottleMode = getEngineThrottleMode;
    var _simplaneEngCoN1 = new SimVarTBatchGetter("TURB ENG COMMANDED N1:", "percent", MedSimVarTimer);
    function getEngineCommandedN1(_engineIndex) {
        return _simplaneEngCoN1.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineCommandedN1 = getEngineCommandedN1;
    var _simplaneEngN2 = new SimVarTBatchGetter("ENG N2 RPM:", "percent", MedSimVarTimer);
    function getN2Value(_engineIndex) {
        return _simplaneEngN2.GetVal(_engineIndex);
    }
    Simplane.getN2Value = getN2Value;
    var _simplaneEngFVO = new SimVarTBatchGetter("FUELSYSTEM VALVE OPEN:", "boolean", SlowSimVarTimer);
    function getFuelValveOpen(_engineIndex) {
        return _simplaneEngFVO.GetVal(4 + _engineIndex);
    }
    Simplane.getFuelValveOpen = getFuelValveOpen;
    var _simplaneEngThCoN1 = new SimVarTBatchGetter("TURB ENG THROTTLE COMMANDED N1:", "percent", FastSimVarTimer);
    function getEngineThrottleCommandedN1(_engineIndex, inverseIfReverseMode) {
        let v = _simplaneEngThCoN1.GetVal(_engineIndex + 1);
        if (inverseIfReverseMode && getTurbEngineReverseNozzlePercent(_engineIndex) > 50) {
            return -1;
        }
        return v;
    }
    Simplane.getEngineThrottleCommandedN1 = getEngineThrottleCommandedN1;
    var _simplaneTurbEngRevNoz = new SimVarTBatchGetter("TURB ENG REVERSE NOZZLE PERCENT:", "percent", FastSimVarTimer);
    function getTurbEngineReverseNozzlePercent(_engineIndex) {
        return _simplaneTurbEngRevNoz.GetVal(_engineIndex + 1);
    }
    Simplane.getTurbEngineReverseNozzlePercent = getTurbEngineReverseNozzlePercent;
    var _simplaneEngThMT = new SimVarGetter("AUTOPILOT THROTTLE MAX THRUST", "number", StaticSimVarTimer);
    function getEngineThrottleMaxThrust(_engineIndex) {
        return _simplaneEngThMT.GetVal() * 100;
    }
    Simplane.getEngineThrottleMaxThrust = getEngineThrottleMaxThrust;
    var _simplaneEngThTO = new SimVarGetter("L:AIRLINER_THRUST_TAKEOFF_MODE", "number", StaticSimVarTimer);
    function getEngineThrustTakeOffMode(_engineIndex) {
        return _simplaneEngThTO.GetVal();
    }
    Simplane.getEngineThrustTakeOffMode = getEngineThrustTakeOffMode;
    var _simplaneEngThCL = new SimVarGetter("L:AIRLINER_THRUST_CLIMB_MODE", "number", StaticSimVarTimer);
    function getEngineThrustClimbMode(_engineIndex) {
        return _simplaneEngThCL.GetVal();
    }
    Simplane.getEngineThrustClimbMode = getEngineThrustClimbMode;
    function getAutopilotThrottle(_engineIndex) {
        return getEngineThrottle(_engineIndex);
    }
    Simplane.getAutopilotThrottle = getAutopilotThrottle;
    function getAutopilotCommandedN1(_engineIndex) {
        return getEngineCommandedN1(_engineIndex);
    }
    Simplane.getAutopilotCommandedN1 = getAutopilotCommandedN1;
    var _simplaneEngType = new SimVarGetter("ENGINE TYPE", "Enum", StaticSimVarTimer);
    function getEngineType() {
        return _simplaneEngType.GetVal();
    }
    Simplane.getEngineType = getEngineType;
    var _simplaneEngUPro = new GameVarGetter("AIRCRAFT USE PROPELLER RPM", "bool", StaticSimVarTimer);
    function getEngineUsePropRPM() {
        return _simplaneEngUPro.GetVal();
    }
    Simplane.getEngineUsePropRPM = getEngineUsePropRPM;
    var _simplaneEngRPMjet = new SimVarTBatchGetter("ENG N1 RPM:", "rpm", FastSimVarTimer);
    function getEngineRPMJet(_engineIndex) {
        return _simplaneEngRPMjet.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineRPMJet = getEngineRPMJet;
    var _simplaneEngRPMjetPC = new SimVarTBatchGetter("ENG N1 RPM:", "percent", FastSimVarTimer);
    function getEngineRPMJetPC(_engineIndex) {
        return _simplaneEngRPMjetPC.GetVal(_engineIndex);
    }
    Simplane.getEngineRPMJetPC = getEngineRPMJetPC;
    var _simplaneEngRPMProp = new SimVarTBatchGetter("PROP RPM:", "rpm", FastSimVarTimer);
    function getEngineRPMProp(_engineIndex) {
        return _simplaneEngRPMProp.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineRPMProp = getEngineRPMProp;
    var _simplaneEngRPMGen = new SimVarTBatchGetter("GENERAL ENG RPM:", "rpm", FastSimVarTimer);
    function getEngineRPMGen(_engineIndex) {
        return _simplaneEngRPMGen.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineRPMGen = getEngineRPMGen;
    function getEngineRPM(_engineIndex) {
        var engineType = getEngineType();
        if (engineType == EngineType.ENGINE_TYPE_JET) {
            return getEngineRPMJet(_engineIndex);
        }
        else if (engineType == EngineType.ENGINE_TYPE_TURBOPROP) {
            return getEngineRPMProp(_engineIndex);
        }
        else if (engineType == EngineType.ENGINE_TYPE_PISTON) {
            if (getEngineUsePropRPM()) {
                return getEngineRPMProp(_engineIndex);
            }
            else {
                return getEngineRPMGen(_engineIndex);
            }
        }
        else {
            return getEngineRPMGen(_engineIndex);
        }
    }
    Simplane.getEngineRPM = getEngineRPM;
    var _simplaneEngMaxHP = new GameVarGetter("AIRCRAFT MAX RATED HP", "ft lb per second", StaticSimVarTimer);
    function getEngineMaxHP() {
        return _simplaneEngMaxHP.GetVal() / 550;
    }
    Simplane.getEngineMaxHP = getEngineMaxHP;
    var _simplaneEngTURTQ = new SimVarTBatchGetter("TURB ENG MAX TORQUE PERCENT:", "percent", MedSimVarTimer);
    function getEngineTurbTorque(_engineIndex) {
        return _simplaneEngTURTQ.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineTurbTorque = getEngineTurbTorque;
    var _simplaneEngJETTQ = new SimVarTBatchGetter("ENG N1 RPM:", "percent", MedSimVarTimer);
    function getEngineJetTorque(_engineIndex) {
        return _simplaneEngJETTQ.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineJetTorque = getEngineJetTorque;
    var _simplaneEngTorque = new SimVarTBatchGetter("ENG TORQUE:", "Foot pounds", MedSimVarTimer);
    function getEngineTorque(_engineIndex) {
        return _simplaneEngTorque.GetVal(_engineIndex + 1);
    }
    Simplane.getEngineTorque = getEngineTorque;
    function getEnginePistonTorque(_engineIndex) {
        return getEngineTorque(_engineIndex) * getEngineRPMGen(_engineIndex) / 5252;
    }
    Simplane.getEnginePistonTorque = getEnginePistonTorque;
    function getEnginePower(_engineIndex) {
        var percent = 0;
        var engineType = getEngineType();
        if (engineType == EngineType.ENGINE_TYPE_TURBOPROP) {
            percent = getEngineTurbTorque(_engineIndex);
        }
        else if (engineType == EngineType.ENGINE_TYPE_JET) {
            percent = getEngineJetTorque(_engineIndex);
        }
        else if (engineType == EngineType.ENGINE_TYPE_PISTON) {
            var maxHP = getEngineMaxHP();
            maxHP /= getEngineCount();
            var currentHP = getEnginePistonTorque(_engineIndex);
            percent = (currentHP / maxHP) * 100;
        }
        return percent;
    }
    Simplane.getEnginePower = getEnginePower;
    var _simplaneEngMinCRPM = new GameVarGetter("AIRCRAFT MIN CRUISE RPM", "rpm", StaticSimVarTimer);
    function getMinCruiseRPM() {
        return _simplaneEngMinCRPM.GetVal();
    }
    Simplane.getMinCruiseRPM = getMinCruiseRPM;
    var _simplaneEngMaxCRPM = new GameVarGetter("AIRCRAFT MAX CRUISE RPM", "rpm", StaticSimVarTimer);
    function getMaxCruiseRPM() {
        return _simplaneEngMaxCRPM.GetVal();
    }
    Simplane.getMaxCruiseRPM = getMaxCruiseRPM;
    var _simplaneEngMaxInPM = new GameVarGetter("AIRCRAFT MAX INDICATED RPM", "rpm", StaticSimVarTimer);
    function getMaxIndicatedRPM() {
        return _simplaneEngMaxInPM.GetVal();
    }
    Simplane.getMaxIndicatedRPM = getMaxIndicatedRPM;
    var _simplaneEngMaxRaPM = new GameVarGetter("AIRCRAFT MAX RATED RPM", "rpm", StaticSimVarTimer);
    function getMaxRatedRPM() {
        return _simplaneEngMaxRaPM.GetVal();
    }
    Simplane.getMaxRatedRPM = getMaxRatedRPM;
    var _simplaneEngProTyp = new GameVarGetter("AIRCRAFT PROPELLER TYPE", "Enum", StaticSimVarTimer);
    function getPropellerType() {
        return _simplaneEngProTyp.GetVal();
    }
    Simplane.getPropellerType = getPropellerType;
    var _simplaneEngProNb = new GameVarGetter("AIRCRAFT NB PROPELLERS", "Enum", StaticSimVarTimer);
    function getNbPropellers() {
        return _simplaneEngProNb.GetVal();
    }
    Simplane.getNbPropellers = getNbPropellers;
    var _simplaneTCBInc = new SimVarGetter("TURN COORDINATOR BALL", "position", MedSimVarTimer);
    function getInclinometer() {
        return _simplaneTCBInc.GetVal();
    }
    Simplane.getInclinometer = getInclinometer;
    var _simplaneAngOADeg = new GameVarGetter("AIRCRAFT AOA ANGLE", "degree", MedSimVarTimer);
    var _simplaneAngOA16 = new GameVarGetter("AIRCRAFT AOA ANGLE", "angl16", MedSimVarTimer);
    function getAngleOfAttack(_unit = "angl16") {
        if (_unit == "degree")
            return _simplaneAngOADeg.GetVal();
        else
            return _simplaneAngOA16.GetVal();
    }
    Simplane.getAngleOfAttack = getAngleOfAttack;
    var _simplaneOriAxi = new GameVarGetter("AIRCRAFT ORIENTATION AXIS", "XYZ", FastSimVarTimer);
    function getOrientationAxis() {
        return _simplaneOriAxi.GetValSlowType();
    }
    Simplane.getOrientationAxis = getOrientationAxis;
    var _simplaneIAlti = new SimVarGetter("INDICATED ALTITUDE", "feet", FastSimVarTimer);
    function getAltitude() {
        return _simplaneIAlti.GetVal();
    }
    Simplane.getAltitude = getAltitude;
    var _simplaneGAlti = new SimVarGetter("GROUND ALTITUDE", "feet", MedSimVarTimer);
    function getGroundReference() {
        return _simplaneGAlti.GetVal();
    }
    Simplane.getGroundReference = getGroundReference;
    var _simplaneTurnRat = new SimVarGetter("TURN INDICATOR RATE", "radians per second", MedSimVarTimer);
    function getTurnRate() {
        return _simplaneTurnRat.GetVal();
    }
    Simplane.getTurnRate = getTurnRate;
    var _simplaneHeadMag = new SimVarGetter("PLANE HEADING DEGREES MAGNETIC", "degree", FastSimVarTimer);
    function getHeadingMagnetic() {
        return _simplaneHeadMag.GetVal();
    }
    Simplane.getHeadingMagnetic = getHeadingMagnetic;
    var _simplaneHeadTrue = new SimVarGetter("PLANE HEADING DEGREES TRUE", "degree", MedSimVarTimer);
    function getHeadingTrue() {
        return _simplaneHeadTrue.GetVal();
    }
    Simplane.getHeadingTrue = getHeadingTrue;
    function getHeadingTrueRadians() {
        return getHeadingTrue() * 0.0174533;
    }
    Simplane.getHeadingTrueRadians = getHeadingTrueRadians;
    var _simplanePitch = new SimVarGetter("ATTITUDE INDICATOR PITCH DEGREES:1", "degree", FastSimVarTimer);
    function getPitch() {
        return _simplanePitch.GetVal();
    }
    Simplane.getPitch = getPitch;
    var _simplaneBank = new SimVarGetter("ATTITUDE INDICATOR BANK DEGREES:1", "degree", FastSimVarTimer);
    function getBank() {
        return _simplaneBank.GetVal();
    }
    Simplane.getBank = getBank;
    var _simplaneDirPitch = new SimVarGetter("AUTOPILOT FLIGHT DIRECTOR PITCH EX1", "degree", MedSimVarTimer);
    function getFlightDirectorPitch() {
        return _simplaneDirPitch.GetVal();
    }
    Simplane.getFlightDirectorPitch = getFlightDirectorPitch;
    var _simplaneDirBank = new SimVarGetter("AUTOPILOT FLIGHT DIRECTOR BANK EX1", "degree", MedSimVarTimer);
    function getFlightDirectorBank() {
        return _simplaneDirBank.GetVal();
    }
    Simplane.getFlightDirectorBank = getFlightDirectorBank;
    function getIsGrounded() {
        return getAltitudeAboveGround() < 10;
    }
    Simplane.getIsGrounded = getIsGrounded;
    var _simplaneGearOnGrnd = new SimVarGetter("GEAR IS ON GROUND", "boolean", MedSimVarTimer);
    function getGearIsOnGround() {
        return _simplaneGearOnGrnd.GetVal() === 1;
    }
    Simplane.getGearIsOnGround = getGearIsOnGround;
    var _simplaneAltAG = new SimVarGetter("PLANE ALT ABOVE GROUND", "feet", SlowSimVarTimer);
    function getAltitudeAboveGround_() {
        return Math.max(0, _simplaneAltAG.GetVal());
    }
    Simplane.getAltitudeAboveGround_ = getAltitudeAboveGround_;
    var _simplaneAltCG = new SimVarGetter("PLANE ALT ABOVE GROUND MINUS CG", "feet", SlowSimVarTimer);
    function getAltitudeAboveGround(forceSimVarCall = false) {
        return Math.max(0, _simplaneAltCG.GetValForce(forceSimVarCall));
    }
    Simplane.getAltitudeAboveGround = getAltitudeAboveGround;
    var _simplaneCrossAlt = new GameVarGetter("AIRCRAFT CROSSOVER ALTITUDE", "feet", SlowSimVarTimer);
    function getCrossoverAltitude(_cas, _mach) {
        return _simplaneCrossAlt.GetValParam2(_cas, _mach);
    }
    Simplane.getCrossoverAltitude = getCrossoverAltitude;
    var _simplaneTRAlt = new SimVarGetter("L:AIRLINER_THR_RED_ALT", "number", SlowSimVarTimer);
    function getThrustReductionAltitude() {
        return _simplaneTRAlt.GetVal();
    }
    Simplane.getThrustReductionAltitude = getThrustReductionAltitude;
    var _simplaneMSBaro = new SimVarGetter("L:XMLVAR_Mins_Selector_Baro", "number", SlowSimVarTimer);
    function getMinimumReferenceMode() {
        if (_simplaneMSBaro.GetVal() === 0) {
            return MinimumReferenceMode.RADIO;
        }
        return MinimumReferenceMode.BARO;
    }
    Simplane.getMinimumReferenceMode = getMinimumReferenceMode;
    var _simplaneComActFreq = new SimVarTBatchGetter("COM ACTIVE FREQUENCY:", "mhz", SlowSimVarTimer);
    function getComActFreq(Index) {
        return _simplaneComActFreq.GetVal(Index);
    }
    Simplane.getComActFreq = getComActFreq;
    function getComActFreq1() {
        return getComActFreq(1);
    }
    Simplane.getComActFreq1 = getComActFreq1;
    var _simplaneComSbyFreq = new SimVarTBatchGetter("COM STANDBY FREQUENCY:", "mhz", SlowSimVarTimer);
    function getComSbyFreq(Index) {
        return _simplaneComSbyFreq.GetVal(Index);
    }
    Simplane.getComSbyFreq = getComSbyFreq;
    function getComSbyFreq1() {
        return getComSbyFreq(1);
    }
    Simplane.getComSbyFreq1 = getComSbyFreq1;
    var _simplaneNavHasnav = new SimVarTBatchGetter("NAV HAS NAV:", "bool", SlowSimVarTimer);
    function getNavHasNav(Index) {
        return _simplaneNavHasnav.GetVal(Index);
    }
    Simplane.getNavHasNav = getNavHasNav;
    var _simplaneNavHasTacan = new SimVarTBatchGetter("NAV HAS TACAN:", "bool", SlowSimVarTimer);
    function getNavHasTacan(Index) {
        return _simplaneNavHasTacan.GetVal(Index);
    }
    Simplane.getNavHasTacan = getNavHasTacan;
    var _simplaneNavSignal = new SimVarTBatchGetter("NAV SIGNAL:", "number", SlowSimVarTimer);
    function getNavSignal(Index) {
        return _simplaneNavSignal.GetVal(Index);
    }
    Simplane.getNavSignal = getNavSignal;
    var _simplaneNavIdent = new SimVarTBatchGetter("NAV IDENT:", "string", SlowSimVarTimer);
    function getNavIdent(Index) {
        return _simplaneNavIdent.GetValString(Index);
    }
    Simplane.getNavIdent = getNavIdent;
    var _simplaneNavHasDme = new SimVarTBatchGetter("NAV HAS DME:", "bool", SlowSimVarTimer);
    function getNavHasDme(Index) {
        return _simplaneNavHasDme.GetVal(Index);
    }
    Simplane.getNavHasDme = getNavHasDme;
    var _simplaneNavDme = new SimVarTBatchGetter("NAV DME:", "nautical miles", SlowSimVarTimer);
    function getNavDme(Index) {
        return _simplaneNavDme.GetVal(Index);
    }
    Simplane.getNavDme = getNavDme;
    var _simplaneNavRadial = new SimVarTBatchGetter("NAV RADIAL:", "degree", SlowSimVarTimer);
    function getNavRadial(Index) {
        return _simplaneNavRadial.GetVal(Index);
    }
    Simplane.getNavRadial = getNavRadial;
    var _simplaneNavObs = new SimVarTBatchGetter("NAV OBS:", "degree", SlowSimVarTimer);
    function getNavObs(Index) {
        return _simplaneNavObs.GetVal(Index);
    }
    Simplane.getNavObs = getNavObs;
    var _simplaneTacanObs = new SimVarTBatchGetter("TACAN OBS:", "degree", SlowSimVarTimer);
    function getTacanObs(Index) {
        return _simplaneTacanObs.GetVal(Index);
    }
    Simplane.getTacanObs = getTacanObs;
    var _simplaneNavCdi = new SimVarTBatchGetter("NAV CDI:", "number", SlowSimVarTimer);
    function getNavCdi(Index) {
        return _simplaneNavCdi.GetVal(Index);
    }
    Simplane.getNavCdi = getNavCdi;
    var _simplaneTacanCdi = new SimVarTBatchGetter("TACAN STATION CDI:", "number", SlowSimVarTimer);
    function getTacanCdi(Index) {
        return _simplaneTacanCdi.GetVal(Index);
    }
    Simplane.getTacanCdi = getTacanCdi;
    var _simplaneNavToFrom = new SimVarTBatchGetter("NAV TOFROM:", "Enum", SlowSimVarTimer);
    function getNavToFrom(Index) {
        return _simplaneNavToFrom.GetVal(Index);
    }
    Simplane.getNavToFrom = getNavToFrom;
    var _simplaneTacanToFrom = new SimVarTBatchGetter("TACAN STATION TOFROM:", "Enum", SlowSimVarTimer);
    function getTacanToFrom(Index) {
        return _simplaneTacanToFrom.GetVal(Index);
    }
    Simplane.getTacanToFrom = getTacanToFrom;
    var _simplaneNavActFreq = new SimVarTBatchGetter("NAV ACTIVE FREQUENCY:", "mhz", SlowSimVarTimer);
    function getNavActFreq(Index) {
        return _simplaneNavActFreq.GetVal(Index);
    }
    Simplane.getNavActFreq = getNavActFreq;
    function getNavActFreq1() {
        return getNavActFreq(1);
    }
    Simplane.getNavActFreq1 = getNavActFreq1;
    var _simplaneNavSbyFreq = new SimVarTBatchGetter("NAV STANDBY FREQUENCY:", "mhz", SlowSimVarTimer);
    function getNavSbyFreq(Index) {
        return _simplaneNavSbyFreq.GetVal(Index);
    }
    Simplane.getNavSbyFreq = getNavSbyFreq;
    function getNavSbyFreq1() {
        return getNavSbyFreq(1);
    }
    Simplane.getNavSbyFreq1 = getNavSbyFreq1;
    var _simplaneNavLocalizer = new SimVarTBatchGetter("NAV LOCALIZER:", "degree", SlowSimVarTimer);
    function getNavLocalizer(Index) {
        return _simplaneNavLocalizer.GetVal(Index);
    }
    Simplane.getNavLocalizer = getNavLocalizer;
    var _simplaneAdfSignal = new SimVarTBatchGetter("ADF SIGNAL:", "number", SlowSimVarTimer);
    function getAdfSignal(Index) {
        return _simplaneAdfSignal.GetVal(Index);
    }
    Simplane.getAdfSignal = getAdfSignal;
    var _simplaneAdfActFreq = new SimVarTBatchGetter("ADF ACTIVE FREQUENCY:", "KHz", SlowSimVarTimer);
    function getAdfActFreq(Index) {
        return _simplaneAdfActFreq.GetVal(Index);
    }
    Simplane.getAdfActFreq = getAdfActFreq;
    var _simplaneAdfRadial = new SimVarTBatchGetter("ADF RADIAL:", "degree", SlowSimVarTimer);
    function getAdfRadial(Index) {
        return _simplaneAdfRadial.GetVal(Index);
    }
    Simplane.getAdfRadial = getAdfRadial;
    var _simplaneFlNhH = new SimVarGetter("FLAPS NUM HANDLE POSITIONS", "number", SlowSimVarTimer);
    function getFlapsNbHandles() {
        return _simplaneFlNhH.GetVal();
    }
    Simplane.getFlapsNbHandles = getFlapsNbHandles;
    var _simplaneFlHPc = new SimVarGetter("FLAPS HANDLE PERCENT", "percent over 100", SlowSimVarTimer);
    function getFlapsHandlePercent() {
        return _simplaneFlHPc.GetVal();
    }
    Simplane.getFlapsHandlePercent = getFlapsHandlePercent;
    var _simplaneFlHanAng = new GameVarBatchGetter("AIRCRAFT FLAPS HANDLE ANGLE", "Degree", MedSimVarTimer);
    function getFlapsHandleAngle(_flapIndex) {
        return _simplaneFlHanAng.GetVal(_flapIndex);
    }
    Simplane.getFlapsHandleAngle = getFlapsHandleAngle;
    var _simplaneFlapAng = new SimVarGetter("TRAILING EDGE FLAPS LEFT ANGLE", "Degree", SlowSimVarTimer);
    function getFlapsAngle() {
        return _simplaneFlapAng.GetVal();
    }
    Simplane.getFlapsAngle = getFlapsAngle;
    var _simplaneFlapPc = new SimVarGetter("TRAILING EDGE FLAPS LEFT PERCENT", "percent", SlowSimVarTimer);
    function getFlapsPercent() {
        return _simplaneFlapPc.GetVal();
    }
    Simplane.getFlapsPercent = getFlapsPercent;
    var _simplaneSlatAn = new SimVarGetter("LEADING EDGE FLAPS LEFT ANGLE", "Degree", SlowSimVarTimer);
    function getSlatsAngle() {
        return _simplaneSlatAn.GetVal();
    }
    Simplane.getSlatsAngle = getSlatsAngle;
    var _simplaneSlatPc = new SimVarGetter("LEADING EDGE FLAPS LEFT PERCENT", "percent", SlowSimVarTimer);
    function getSlatsPercent() {
        return _simplaneSlatPc.GetVal();
    }
    Simplane.getSlatsPercent = getSlatsPercent;
    var _simplaneHasTrim = new GameVarGetter("AIRCRAFT ELEVATOR TRIM LIMIT", "number", SlowSimVarTimer);
    function hasTrim() {
        return _simplaneHasTrim.GetVal() > 0;
    }
    Simplane.hasTrim = hasTrim;
    var _simplaneTrimPos = new SimVarGetter("ELEVATOR TRIM POSITION", "degree", SlowSimVarTimer);
    function getTrimPos() {
        return _simplaneTrimPos.GetVal();
    }
    Simplane.getTrimPos = getTrimPos;
    var _simplaneRudTrimPos = new SimVarGetter("RUDDER TRIM", "degrees", SlowSimVarTimer);
    function getRudTrimPos() {
        return _simplaneRudTrimPos.GetVal();
    }
    Simplane.getRudTrimPos = getRudTrimPos;
    var _simplaneTrimV = new SimVarGetter("ELEVATOR TRIM PCT", "percent over 100", SlowSimVarTimer);
    function getTrim() {
        return _simplaneTrimV.GetVal();
    }
    Simplane.getTrim = getTrim;
    var _simplaneTrimI = new SimVarGetter("ELEVATOR TRIM INDICATOR", "number", SlowSimVarTimer);
    function getTrimIndicator() {
        return _simplaneTrimI.GetVal();
    }
    Simplane.getTrimIndicator = getTrimIndicator;
    var _simplaneTrimN = new GameVarGetter("AIRCRAFT ELEVATOR TRIM NEUTRAL", "percent over 100", SlowSimVarTimer);
    function getTrimNeutral() {
        return _simplaneTrimN.GetVal();
    }
    Simplane.getTrimNeutral = getTrimNeutral;
    function setTransponderToRegion(_index = 1) {
        var code = 0;
        let region = getWorldRegion();
        if (region == WorldRegion.NORTH_AMERICA || region == WorldRegion.AUSTRALIA)
            code = (1 * 4096) + (2 * 256) + (0 * 16) + 0;
        else
            code = (7 * 4096) + (0 * 256) + (0 * 16) + 0;
        SimVar.SetSimVarValue("TRANSPONDER CODE:" + _index, "Bco16", code);
    }
    Simplane.setTransponderToRegion = setTransponderToRegion;
    var _simplaneXPnderCode = new SimVarGetter("K:XPNDR_SET", "Bco16", SlowSimVarTimer);
    function getXPnderCode() {
        return _simplaneXPnderCode.GetVal();
    }
    Simplane.getXPnderCode = getXPnderCode;
    function setXPnderCode(val) {
        _simplaneXPnderCode.SetVal(val);
    }
    Simplane.setXPnderCode = setXPnderCode;
    function setTransponderToZero() {
        setXPnderCode(0);
    }
    Simplane.setTransponderToZero = setTransponderToZero;
    var _simplaneTransponderCode1 = new SimVarGetter("TRANSPONDER CODE:1", "number", SlowSimVarTimer);
    function getTransponderCode1() {
        return _simplaneTransponderCode1.GetVal();
    }
    Simplane.getTransponderCode1 = getTransponderCode1;
    var _simplaneAirTemp = new SimVarGetter("TOTAL AIR TEMPERATURE", "celsius", SlowSimVarTimer);
    function getTotalAirTemperature() {
        return _simplaneAirTemp.GetVal();
    }
    Simplane.getTotalAirTemperature = getTotalAirTemperature;
    var _simplaneAmbTemp = new SimVarGetter("AMBIENT TEMPERATURE", "celsius", SlowSimVarTimer);
    function getAmbientTemperature() {
        return _simplaneAmbTemp.GetVal();
    }
    Simplane.getAmbientTemperature = getAmbientTemperature;
    var _simplaneFlxTemp = new SimVarGetter("L:AIRLINER_TO_FLEX_TEMP", "Number", SlowSimVarTimer);
    function getFlexTemperature() {
        return _simplaneFlxTemp.GetVal();
    }
    Simplane.getFlexTemperature = getFlexTemperature;
    var _simplaneElMBus = new SimVarGetter("ELECTRICAL MAIN BUS VOLTAGE", "volts", SlowSimVarTimer);
    function getElecMainBusVolt() {
        return _simplaneElMBus.GetVal();
    }
    Simplane.getElecMainBusVolt = getElecMainBusVolt;
    var _simplaneElMBat = new SimVarGetter("ELECTRICAL MASTER BATTERY", "bool", SlowSimVarTimer);
    function getElecMasterBatt() {
        return _simplaneElMBat.GetVal();
    }
    Simplane.getElecMasterBatt = getElecMasterBatt;
    var _simplaneElecBatBusAmp = new SimVarGetter("ELECTRICAL BATTERY BUS AMPS", "amperes", SlowSimVarTimer);
    function getElecBatBusAmp() {
        return _simplaneElecBatBusAmp.GetVal();
    }
    Simplane.getElecBatBusAmp = getElecBatBusAmp;
    var _simplaneEngGenSw1 = new SimVarGetter("GENERAL ENG GENERATOR SWITCH:1", "bool", SlowSimVarTimer);
    function getEngGenSw1() {
        return _simplaneEngGenSw1.GetVal();
    }
    Simplane.getEngGenSw1 = getEngGenSw1;
    var _simplaneExitOpen = new SimVarGetter("EXIT OPEN:0", "percent", SlowSimVarTimer);
    function getExitOpen() {
        return _simplaneExitOpen.GetVal();
    }
    Simplane.getExitOpen = getExitOpen;
    var _simplaneParkBrake = new SimVarGetter("BRAKE PARKING INDICATOR", "bool", SlowSimVarTimer);
    function getParkBrake() {
        return _simplaneParkBrake.GetVal();
    }
    Simplane.getParkBrake = getParkBrake;
    var _simplaneStallWarning = new SimVarGetter("STALL WARNING", "boolean", SlowSimVarTimer);
    function getStallWarning() {
        return _simplaneStallWarning.GetVal();
    }
    Simplane.getStallWarning = getStallWarning;
    var _simplaneEngOilTemp1 = new SimVarGetter("GENERAL ENG OIL TEMPERATURE:1", "celsius", SlowSimVarTimer);
    function getEngOilTemp1() {
        return _simplaneEngOilTemp1.GetVal();
    }
    Simplane.getEngOilTemp1 = getEngOilTemp1;
    var _simplaneEngOilTemp = new SimVarTBatchGetter("ENG OIL TEMPERATURE:", "celsius", SlowSimVarTimer);
    function getEngOilTemp(Index) {
        return _simplaneEngOilTemp.GetVal(Index);
    }
    Simplane.getEngOilTemp = getEngOilTemp;
    var _simplaneWoilP = new SimVarGetter("WARNING OIL PRESSURE", "boolean", SlowSimVarTimer);
    function getWOilPressure() {
        return _simplaneWoilP.GetVal();
    }
    Simplane.getWOilPressure = getWOilPressure;
    var _simplaneEngOilQuant = new SimVarTBatchGetter("ENG OIL QUANTITY:", "percent scaler 16k", SlowSimVarTimer);
    function getEngOilQuant(Index) {
        return _simplaneEngOilQuant.GetVal(Index);
    }
    Simplane.getEngOilQuant = getEngOilQuant;
    var _simplaneEngVibration = new SimVarTBatchGetter("ENG VIBRATION:", "number", SlowSimVarTimer);
    function getEngVibration(Index) {
        return _simplaneEngVibration.GetVal(Index);
    }
    Simplane.getEngVibration = getEngVibration;
    var _simplaneEngOilP = new SimVarTBatchGetter("ENG OIL PRESSURE:", "psi", SlowSimVarTimer);
    function getEngOilPressure(Index) {
        return _simplaneEngOilP.GetVal(Index);
    }
    Simplane.getEngOilPressure = getEngOilPressure;
    function getEngOilPressure1() {
        return getEngOilPressure(1);
    }
    Simplane.getEngOilPressure1 = getEngOilPressure1;
    var _simplaneEngITT = new SimVarGetter("TURB ENG ITT:1", "celsius", SlowSimVarTimer);
    function getEngITT() {
        return _simplaneEngITT.GetVal();
    }
    Simplane.getEngITT = getEngITT;
    var _simplaneFuelWPG = new SimVarGetter("FUEL WEIGHT PER GALLON", "kilogram", StaticSimVarTimer);
    function getFuelWPG() {
        return _simplaneFuelWPG.GetVal();
    }
    Simplane.getFuelWPG = getFuelWPG;
    var _simplaneEngFuelP = new SimVarTBatchGetter("ENG FUEL PRESSURE", "psi", SlowSimVarTimer);
    function getEngFuelPressure(Index) {
        return _simplaneEngFuelP.GetVal(Index);
    }
    Simplane.getEngFuelPressure = getEngFuelPressure;
    function getEngFuelPressure0() {
        return _simplaneEngFuelP.GetVal(0);
    }
    Simplane.getEngFuelPressure0 = getEngFuelPressure0;
    var _simplaneEngFuelFlow = new SimVarTBatchGetter("ENG FUEL FLOW GPH:", "gallons per hour", SlowSimVarTimer);
    function getEngFuelFlow(Index) {
        return _simplaneEngFuelFlow.GetVal(Index);
    }
    Simplane.getEngFuelFlow = getEngFuelFlow;
    function getEngFuelFlow1() {
        return getEngFuelFlow(1);
    }
    Simplane.getEngFuelFlow1 = getEngFuelFlow1;
    var _simplaneFuelLineFlow = new SimVarTBatchGetter("FUELSYSTEM LINE FUEL FLOW:", "number", OneSecSlowSimVarTimer, "", 256);
    function getEngFuelLineFlow(index) {
        return _simplaneFuelLineFlow.GetVal(index);
    }
    Simplane.getEngFuelLineFlow = getEngFuelLineFlow;
    var _simplaneFuelValveSwitch = new SimVarTBatchGetter("FUELSYSTEM VALVE SWITCH:", "bool", OneSecSlowSimVarTimer, "", 64);
    function getEngFuelValveSwitch(index) {
        return _simplaneFuelValveSwitch.GetVal(index);
    }
    Simplane.getEngFuelValveSwitch = getEngFuelValveSwitch;
    var _simplaneFuelValveOpen = new SimVarTBatchGetter("FUELSYSTEM VALVE OPEN:", "number", OneSecSlowSimVarTimer, "", 64);
    function getEngFuelValveOpen(index) {
        return _simplaneFuelValveOpen.GetVal(index);
    }
    Simplane.getEngFuelValveOpen = getEngFuelValveOpen;
    var _simplaneFuelPumpActive = new SimVarTBatchGetter("FUELSYSTEM PUMP ACTIVE:", "number", OneSecSlowSimVarTimer, "", 32);
    function getEngFuelPumpActive(index) {
        return _simplaneFuelPumpActive.GetVal(index);
    }
    Simplane.getEngFuelPumpActive = getEngFuelPumpActive;
    var _simplaneFuelPumpSwitch = new SimVarTBatchGetter("FUELSYSTEM PUMP SWITCH:", "number", OneSecSlowSimVarTimer, "", 32);
    function getEngFuelPumpSwitch(index) {
        return _simplaneFuelPumpSwitch.GetVal(index);
    }
    Simplane.getEngFuelPumpSwitch = getEngFuelPumpSwitch;
    var _simplaneFuelTankQuantity = new SimVarTBatchGetter("FUELSYSTEM TANK QUANTITY:", "gallons", OneSecSlowSimVarTimer, "", 16);
    function getEngFuelTankQuantity(index) {
        return _simplaneFuelTankQuantity.GetVal(index);
    }
    Simplane.getEngFuelTankQuantity = getEngFuelTankQuantity;
    var _simplaneFuelFuelPmp = new SimVarGetter("GENERAL ENG FUEL PUMP ON:1", "bool", SlowSimVarTimer);
    function getEngFuelPump1() {
        return _simplaneFuelFuelPmp.GetVal();
    }
    Simplane.getEngFuelPump1 = getEngFuelPump1;
    var _simplaneFuelPress = new SimVarGetter("GENERAL ENG FUEL PRESSURE:1", "psi", SlowSimVarTimer);
    function getFuelPress() {
        return _simplaneFuelPress.GetVal();
    }
    Simplane.getFuelPress = getFuelPress;
    var _simplaneTankSel = new SimVarGetter("FUEL TANK SELECTOR:1", "number", SlowSimVarTimer);
    function getTankSelector() {
        return _simplaneTankSel.GetVal();
    }
    Simplane.getTankSelector = getTankSelector;
    var _simplaneFuelR = new SimVarGetter("FUEL RIGHT QUANTITY", "gallon", OneSecSlowSimVarTimer);
    function getFuelQuantityR() {
        return _simplaneFuelR.GetVal();
    }
    Simplane.getFuelQuantityR = getFuelQuantityR;
    var _simplaneFuelL = new SimVarGetter("FUEL LEFT QUANTITY", "gallon", OneSecSlowSimVarTimer);
    function getFuelQuantityL() {
        return _simplaneFuelL.GetVal();
    }
    Simplane.getFuelQuantityL = getFuelQuantityL;
    var _simplaneMFuelL = new SimVarGetter("FUEL TANK LEFT MAIN QUANTITY", "gallon", OneSecSlowSimVarTimer);
    function getFuelMQuantityL() {
        return _simplaneMFuelL.GetVal();
    }
    Simplane.getFuelMQuantityL = getFuelMQuantityL;
    var _simplaneMFuelR = new SimVarGetter("FUEL TANK RIGHT MAIN QUANTITY", "gallon", OneSecSlowSimVarTimer);
    function getFuelMQuantityR() {
        return _simplaneMFuelR.GetVal();
    }
    Simplane.getFuelMQuantityR = getFuelMQuantityR;
    var _simplaneFueCap = new SimVarGetter("FUEL TOTAL CAPACITY", "gallons", OneSecSlowSimVarTimer);
    function getFuelCapacity() {
        return _simplaneFueCap.GetVal();
    }
    Simplane.getFuelCapacity = getFuelCapacity;
    var _simplaneFueQua = new SimVarGetter("FUEL TOTAL QUANTITY", "gallons", OneSecSlowSimVarTimer);
    function getFuelcQuantity() {
        return _simplaneFueQua.GetVal();
    }
    Simplane.getFuelcQuantity = getFuelcQuantity;
    function getFuelPercent() {
        var fFuelCapacity = getFuelCapacity();
        if (fFuelCapacity > 0) {
            var fFuelQuantity = getFuelcQuantity();
            var fPercent = (fFuelQuantity / fFuelCapacity) * 100;
            fPercent = Math.max(0, Math.min(100, fPercent));
            return fPercent;
        }
        return 0;
    }
    Simplane.getFuelPercent = getFuelPercent;
    function getFuelQuantity() {
        if (getFuelCapacity() > 0) {
            return getFuelcQuantity();
        }
        return 0;
    }
    Simplane.getFuelQuantity = getFuelQuantity;
    var _simplaneTotFue = new SimVarGetter("FUEL TOTAL QUANTITY WEIGHT", "kg", SlowSimVarTimer);
    function getTotalFuel() {
        return _simplaneTotFue.GetVal();
    }
    Simplane.getTotalFuel = getTotalFuel;
    var _simplaneFueUse = new SimVarTBatchGetter("GENERAL ENG FUEL USED SINCE START:", "kg", SlowSimVarTimer);
    function getFuelUsed(_engineIndex) {
        return _simplaneFueUse.GetVal(_engineIndex);
    }
    Simplane.getFuelUsed = getFuelUsed;
    var _simplaneComAng = new SimVarGetter("WISKEY COMPASS INDICATION DEGREES", "radians", SlowSimVarTimer);
    function getCompassAngle() {
        return _simplaneComAng.GetVal();
    }
    Simplane.getCompassAngle = getCompassAngle;
    var _simplaneKohHg = new SimVarGetter("KOHLSMAN SETTING HG", "inches of mercury", SlowSimVarTimer);
    function getPressureValue(_units = "inches of mercury") {
        if (_units == "inches of mercury") {
            return _simplaneKohHg.GetVal();
        }
        else {
            return SimVar.GetSimVarValue("KOHLSMAN SETTING HG", _units);
        }
    }
    Simplane.getPressureValue = getPressureValue;
    var _simplaneBaroSele = new SimVarGetter("L:XMLVAR_Baro_Selector_HPA_1", "Bool", SlowSimVarTimer);
    function getBaroSele() {
        return _simplaneBaroSele.GetVal();
    }
    Simplane.getBaroSele = getBaroSele;
    function getPressureSelectedUnits() {
        if (getBaroSele())
            return "millibar";
        return "inches of mercury";
    }
    Simplane.getPressureSelectedUnits = getPressureSelectedUnits;
    var _simplaneBaroMode = new SimVarGetter("L:XMLVAR_Baro1_Mode", "number", SlowSimVarTimer);
    function getBaroMode() {
        return _simplaneBaroMode.GetVal();
    }
    Simplane.getBaroMode = getBaroMode;
    var _simplaneBaroFStd = new SimVarGetter("L:XMLVAR_Baro1_ForcedToSTD", "bool", SlowSimVarTimer);
    function getBaroFStd() {
        return _simplaneBaroFStd.GetVal();
    }
    Simplane.getBaroFStd = getBaroFStd;
    function getPressureSelectedMode(_aircraft) {
        if (_aircraft == Aircraft.A320_NEO) {
            let val = getBaroMode();
            if (val == 0)
                return "QFE";
            else if (val == 1)
                return "QNH";
            else
                return "STD";
        }
        let val = getBaroFStd();
        if (val)
            return "STD";
        return "";
    }
    Simplane.getPressureSelectedMode = getPressureSelectedMode;
    var _simplaneHasGC = new GameVarGetter("AIRCRAFT HAS GLASSCOCKPIT", "boolean", StaticSimVarTimer);
    function getHasGlassCockpit() {
        return _simplaneHasGC.GetVal();
    }
    Simplane.getHasGlassCockpit = getHasGlassCockpit;
    var _simplanePrCaAl = new SimVarGetter("PRESSURIZATION CABIN ALTITUDE", "Feet", SlowSimVarTimer);
    function getPressurisationCabinAltitude() {
        return _simplanePrCaAl.GetVal();
    }
    Simplane.getPressurisationCabinAltitude = getPressurisationCabinAltitude;
    var _simplanePrCaAlGo = new SimVarGetter("PRESSURIZATION CABIN ALTITUDE GOAL", "Feet", SlowSimVarTimer);
    function getPressurisationCabinAltitudeGoal() {
        return _simplanePrCaAlGo.GetVal();
    }
    Simplane.getPressurisationCabinAltitudeGoal = getPressurisationCabinAltitudeGoal;
    var _simplanePrCaAlRa = new SimVarGetter("PRESSURIZATION CABIN ALTITUDE RATE", "Feet", SlowSimVarTimer);
    function getPressurisationCabinAltitudeRate() {
        return _simplanePrCaAlRa.GetVal();
    }
    Simplane.getPressurisationCabinAltitudeRate = getPressurisationCabinAltitudeRate;
    var _simplanePrDiff = new SimVarGetter("PRESSURIZATION PRESSURE DIFFERENTIAL", "psi", SlowSimVarTimer);
    function getPressurisationDifferential() {
        return _simplanePrDiff.GetVal();
    }
    Simplane.getPressurisationDifferential = getPressurisationDifferential;
    var _simplaneBleedAirSourceCont = new SimVarGetter("BLEED AIR SOURCE CONTROL", "Enum", SlowSimVarTimer);
    function getBleedAirSourceCont() {
        return _simplaneBleedAirSourceCont.GetVal();
    }
    Simplane.getBleedAirSourceCont = getBleedAirSourceCont;
    var _simplanePartpanVacu = new GameVarGetter("PARTIAL PANEL VACUUM", "Enum", SlowSimVarTimer);
    function getPartpanVacu() {
        return _simplanePartpanVacu.GetVal();
    }
    Simplane.getPartpanVacu = getPartpanVacu;
    var _simplaneWeight = new SimVarGetter("TOTAL WEIGHT", "kg", SlowSimVarTimer);
    function getWeight() {
        return _simplaneWeight.GetVal();
    }
    Simplane.getWeight = getWeight;
    var _simplaneMWeight = new SimVarGetter("MAX GROSS WEIGHT", "kg", StaticSimVarTimer);
    function getMaxWeight() {
        return _simplaneMWeight.GetVal();
    }
    Simplane.getMaxWeight = getMaxWeight;
    var _simplaneGForce = new SimVarGetter("G FORCE", "gforce", SlowSimVarTimer);
    function getGForce() {
        return _simplaneGForce.GetVal();
    }
    Simplane.getGForce = getGForce;
    var _simplaneIsGRet = new SimVarGetter("IS GEAR RETRACTABLE", "boolean", StaticSimVarTimer);
    function getIsGearRetractable() {
        return _simplaneIsGRet.GetVal();
    }
    Simplane.getIsGearRetractable = getIsGearRetractable;
    var _simplaneGearHPos = new SimVarGetter("GEAR HANDLE POSITION", "boolean", SlowSimVarTimer);
    function getGearHandlePosition() {
        return _simplaneGearHPos.GetVal();
    }
    Simplane.getGearHandlePosition = getGearHandlePosition;
    var _simplaneGPOS = new SimVarGetter("GEAR POSITION", "percent", SlowSimVarTimer);
    function getGearPosition() {
        return _simplaneGPOS.GetVal();
    }
    Simplane.getGearPosition = getGearPosition;
    var _simplaneisMet = new GameVarGetter("GAME UNIT IS METRIC", "boolean", SlowSimVarTimer);
    function getUnitIsMetric() {
        return _simplaneisMet.GetVal();
    }
    Simplane.getUnitIsMetric = getUnitIsMetric;
    var _simplaneisLatSp = new SimVarGetter("VELOCITY BODY X", "feet per minute", MedSimVarTimer);
    function getLatSpeed() {
        return _simplaneisLatSp.GetVal();
    }
    Simplane.getLatSpeed = getLatSpeed;
    var _simplaneisGroundVelocity = new SimVarGetter("GROUND VELOCITY", "knot", MedSimVarTimer);
    function getGroundVelocity() {
        return _simplaneisGroundVelocity.GetVal();
    }
    Simplane.getGroundVelocity = getGroundVelocity;
    function isAircraftBoeing(aircraft) {
        if (aircraft === Aircraft.B747_8) {
            return true;
        }
        if (aircraft === Aircraft.AS01B) {
            return true;
        }
        return false;
    }
    Simplane.isAircraftBoeing = isAircraftBoeing;
    function convertTrackToHeading(track, trueGroundSpeed, lateralVelocity) {
        if (isNaN(trueGroundSpeed)) {
            trueGroundSpeed = Simplane.getGroundSpeed();
        }
        if (isNaN(lateralVelocity)) {
            lateralVelocity = getLatSpeed();
        }
        let airspeedInFeetPerMin = trueGroundSpeed * 6076.12 / 60;
        let alpha = Math.atan(lateralVelocity / airspeedInFeetPerMin) * Math.sign(lateralVelocity) / Math.PI * 180;
        let heading = track + alpha;
        while (heading < 0) {
            heading += 360;
        }
        while (heading >= 360) {
            heading -= 360;
        }
        return heading;
    }
    Simplane.convertTrackToHeading = convertTrackToHeading;
    function convertFPAToVS(fpa, trueAirspeed) {
        if (isNaN(trueAirspeed)) {
            trueAirspeed = Simplane.getTrueSpeed();
        }
        let trueAirspeedFtPerMin = trueAirspeed * 6076.12 / 60;
        return Math.sin(fpa / 180 * Math.PI) * trueAirspeedFtPerMin;
    }
    Simplane.convertFPAToVS = convertFPAToVS;
    var _simplaneRadioNavAct = new SimVarGetter("L:RADIONAV ACTIVE:1", "bool", SlowSimVarTimer);
    function getRadioNavAct() {
        return _simplaneRadioNavAct.GetVal();
    }
    Simplane.getRadioNavAct = getRadioNavAct;
    function setRadioNavAct(val) {
        _simplaneRadioNavAct.SetVal(val);
    }
    Simplane.setRadioNavAct = setRadioNavAct;
    var _simplaneCurrentPage = new SimVarGetter("L:FMC_UPDATE_CURRENT_PAGE", "number", SlowSimVarTimer);
    function getCurrentPage() {
        return _simplaneCurrentPage.GetVal();
    }
    Simplane.getCurrentPage = getCurrentPage;
    function setCurrentPage(val) {
        _simplaneCurrentPage.SetVal(val);
    }
    Simplane.setCurrentPage = setCurrentPage;
    var _simplanePhase = new SimVarGetter("L:AIRLINER_FLIGHT_PHASE", "number", SlowSimVarTimer);
    function getCurrentFlightPhase(forceSimVarCall = false) {
        return _simplanePhase.GetValForce(forceSimVarCall);
    }
    Simplane.getCurrentFlightPhase = getCurrentFlightPhase;
    function setCurrentFlightPhase(val) {
        _simplanePhase.SetVal(val);
    }
    Simplane.setCurrentFlightPhase = setCurrentFlightPhase;
    var _simplaneLat = new SimVarGetter("PLANE LATITUDE", "degree latitude", SlowSimVarTimer);
    function getCurrentLat() {
        return _simplaneLat.GetVal();
    }
    Simplane.getCurrentLat = getCurrentLat;
    var _simplaneLon = new SimVarGetter("PLANE LONGITUDE", "degree longitude", SlowSimVarTimer);
    function getCurrentLon() {
        return _simplaneLon.GetVal();
    }
    Simplane.getCurrentLon = getCurrentLon;
    function getWorldRegion() {
        let long = getCurrentLon();
        let lat = getCurrentLat();
        if (lat >= 20 && lat <= 50 && long <= -60 && long >= -130) {
            return WorldRegion.NORTH_AMERICA;
        }
        else if (lat <= -8 && lat >= -50 && long >= 23 && long <= 160) {
            return WorldRegion.AUSTRALIA;
        }
        else if (lat >= 17 && lat <= 23 && long >= -159 && long <= -153) {
            return WorldRegion.HAWAII;
        }
        return WorldRegion.OTHER;
    }
    Simplane.getWorldRegion = getWorldRegion;
})(Simplane || (Simplane = {}));
//# sourceMappingURL=SimPlane.js.map
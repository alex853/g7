var longitudePfd = (function (exports, msfsSdk, msfsWtg3000Pfd, msfsWtg3000Common) {
    'use strict';

    /**
     * Citation Longitude autothrottle system modes.
     */
    var LongitudeAutothrottleModes;
    (function (LongitudeAutothrottleModes) {
        /** Null mode. */
        LongitudeAutothrottleModes["NONE"] = "";
        /** Autothrottle servos are disabled to allow throttle to be held in place during takeoff and climb while below 400 feet AGL. */
        LongitudeAutothrottleModes["HOLD"] = "HOLD";
        /** Autothrottle hold protection has failed. */
        LongitudeAutothrottleModes["HOLD_FAIL"] = "HOLD FAIL";
        /** Autothrottle targets takeoff thrust. */
        LongitudeAutothrottleModes["TO"] = "TO";
        /** Autothrottle targets CLB thrust. */
        LongitudeAutothrottleModes["CLIMB"] = "CLIMB";
        /** Autothrottle targets idle thrust. */
        LongitudeAutothrottleModes["DESC"] = "DESC";
        /** Autothrottle targets a set airspeed. */
        LongitudeAutothrottleModes["SPD"] = "SPD";
        /** Autothrottle reduces throttles to idle during landing once below 40 AGL. */
        LongitudeAutothrottleModes["RETARD"] = "RETARD";
        /** Automatic overspeed protection mode. */
        LongitudeAutothrottleModes["MAX_SPD"] = "MAX SPD";
        /** Automatic underspeed protection mode. */
        LongitudeAutothrottleModes["MIN_SPD"] = "MIN SPD";
    })(LongitudeAutothrottleModes || (LongitudeAutothrottleModes = {}));

    /**
     * A Citation Longitude PFD autothrottle annunciation.
     */
    class PfdAutothrottleAnnunciation extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.rootCssClass = msfsSdk.SetSubject.create(['autothrottle-annunc', 'hidden']);
            this.atActiveMode = msfsSdk.ConsumerSubject.create(null, LongitudeAutothrottleModes.NONE);
            this.flashTimer = new msfsSdk.DebounceTimer();
            this.clearFlash = () => { this.rootCssClass.delete('autothrottle-annunc-flash'); };
            this.isAutoOn = false;
        }
        /** @inheritdoc */
        onAfterRender() {
            this.atActiveMode.setConsumer(this.props.bus.getSubscriber().on('g3000_at_mode_active'));
            this.atActiveMode.sub(this.onAutothrottleModeChanged.bind(this), true);
            this.declutterSub = this.props.declutter.sub(declutter => {
                this.rootCssClass.toggle('hidden', declutter);
            }, true);
        }
        /**
         * Responds to when the autothrottle active mode changes.
         * @param mode The autothrottle active mode.
         */
        onAutothrottleModeChanged(mode) {
            const isAutoOn = mode === LongitudeAutothrottleModes.MAX_SPD || mode === LongitudeAutothrottleModes.MIN_SPD;
            this.rootCssClass.toggle('autothrottle-auto-on', isAutoOn);
            if (isAutoOn && !this.isAutoOn) {
                this.rootCssClass.add('autothrottle-annunc-flash');
                this.flashTimer.schedule(this.clearFlash, PfdAutothrottleAnnunciation.FLASH_DURATION);
            }
            this.isAutoOn = isAutoOn;
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: this.rootCssClass }, "AT AUTO ON"));
        }
        /** @inheritdoc */
        destroy() {
            var _a;
            this.flashTimer.clear();
            this.atActiveMode.destroy();
            (_a = this.declutterSub) === null || _a === void 0 ? void 0 : _a.destroy();
            super.destroy();
        }
    }
    PfdAutothrottleAnnunciation.FLASH_DURATION = 5000;

    /**
     * The PFD synoptics plugin for the Citation Longitude.
     */
    class LongitudePfdInstrumentsPlugin extends msfsWtg3000Pfd.AbstractG3000PfdPlugin {
        /** @inheritdoc */
        renderToPfdInstruments(pfdIndex, displayPaneIndex, isInSplitMode, declutter) {
            return (msfsSdk.FSComponent.buildComponent(msfsSdk.FSComponent.Fragment, null,
                msfsSdk.FSComponent.buildComponent(PfdAutothrottleAnnunciation, { bus: this.binder.bus, declutter: declutter })));
        }
    }
    msfsSdk.registerPlugin(LongitudePfdInstrumentsPlugin);

    /**
     * Citation Longitude display pane view keys.
     */
    var LongitudeDisplayPaneViewKeys;
    (function (LongitudeDisplayPaneViewKeys) {
        LongitudeDisplayPaneViewKeys["EcsSynoptics"] = "synoptics-ecs";
        LongitudeDisplayPaneViewKeys["FuelSynoptics"] = "synoptics-fuel";
        LongitudeDisplayPaneViewKeys["HydraulicsSynoptics"] = "synoptics-hyd";
        LongitudeDisplayPaneViewKeys["SummarySynoptics"] = "synoptics-summary";
        LongitudeDisplayPaneViewKeys["ElectricalSynoptics"] = "synoptics-electrical";
        LongitudeDisplayPaneViewKeys["FlightControlsSynoptics"] = "synoptics-flight-controls";
        LongitudeDisplayPaneViewKeys["AntiIceSynoptics"] = "synoptics-ai";
        LongitudeDisplayPaneViewKeys["PreFlightSynoptics"] = "synoptics-preflight";
    })(LongitudeDisplayPaneViewKeys || (LongitudeDisplayPaneViewKeys = {}));

    /**
     * Utility class defining virtual file system paths for the Citation Longitude.
     */
    class LongitudeFilePaths {
    }
    /** The virtual file system path to the plugins directory. */
    LongitudeFilePaths.PLUGINS_PATH = 'coui://SimObjects/Airplanes/Asobo_Longitude/panel/Instruments/G3000/Plugins';
    /** The virtual file system path to the assets directory. */
    LongitudeFilePaths.ASSETS_PATH = 'coui://SimObjects/Airplanes/Asobo_Longitude/panel/Instruments/G3000/Plugins/Assets';

    var BeaconLightsMode;
    (function (BeaconLightsMode) {
        BeaconLightsMode["Normal"] = "Normal";
        BeaconLightsMode["On"] = "On";
        BeaconLightsMode["Off"] = "Off";
    })(BeaconLightsMode || (BeaconLightsMode = {}));
    var RecircFanSpeed;
    (function (RecircFanSpeed) {
        RecircFanSpeed["Low"] = "LOW";
        RecircFanSpeed["High"] = "HI";
        RecircFanSpeed["Off"] = "OFF";
    })(RecircFanSpeed || (RecircFanSpeed = {}));
    var EcsTemperatureUnits;
    (function (EcsTemperatureUnits) {
        EcsTemperatureUnits["Celsius"] = "Celsius";
        EcsTemperatureUnits["Fahrenheit"] = "Fahrenheit";
    })(EcsTemperatureUnits || (EcsTemperatureUnits = {}));
    var CabinAltitudeMode;
    (function (CabinAltitudeMode) {
        CabinAltitudeMode["FMS"] = "FMS";
        CabinAltitudeMode["LandingAlt"] = "LandingAlt";
        CabinAltitudeMode["CabinAlt"] = "CabinAlt";
    })(CabinAltitudeMode || (CabinAltitudeMode = {}));
    /** Utility class for retreiving a Longitude user setting manager. */
    class LongitudeUserSettings {
        /**
         * Retrieves a manager for the Longitude user settings.
         * @param bus The event bus
         * @returns A manager for LongitudeUserSettingTypes.
         */
        static getManager(bus) {
            var _a;
            return (_a = LongitudeUserSettings.INSTANCE) !== null && _a !== void 0 ? _a : (LongitudeUserSettings.INSTANCE = new msfsSdk.DefaultUserSettingManager(bus, [
                {
                    name: 'recircFanSpeed',
                    defaultValue: RecircFanSpeed.Low
                },
                {
                    name: 'cockpitSetTemperature',
                    defaultValue: 0
                },
                {
                    name: 'cabinSetTemperature',
                    defaultValue: 0
                },
                {
                    name: 'temperatureControlUnits',
                    defaultValue: EcsTemperatureUnits.Celsius
                },
                {
                    name: 'ittEngineDigits',
                    defaultValue: false
                },
                {
                    name: 'apuUsageTime',
                    defaultValue: 0
                },
                {
                    name: 'apuUsageCycles',
                    defaultValue: 0
                },
                {
                    name: 'engineIgnitorsSetOn',
                    defaultValue: false
                },
                {
                    name: 'lightsNavigationOn',
                    defaultValue: true
                },
                {
                    name: 'lightsBeaconMode',
                    defaultValue: BeaconLightsMode.Normal
                },
                {
                    name: 'lightsPulseTaRaOn',
                    defaultValue: true
                },
                {
                    name: 'cabinAltitudeMode',
                    defaultValue: CabinAltitudeMode.FMS
                },
                {
                    name: 'cabinSelectedAltitude',
                    defaultValue: -9999
                },
                {
                    name: 'cabinLandingAltitude',
                    defaultValue: -9999
                }
            ]));
        }
    }

    /**
     * A node for bleed air connections, such as a line, or a junction.
     */
    class BleedAirNode {
        /**
         * Creates an instance of a BleedAirNode.
         * @param label The label for this node.
         */
        constructor(label) {
            this.label = label;
            this._connections = [];
            this._currentPsi = msfsSdk.Subject.create(0);
            this._isActive = msfsSdk.Subject.create(false);
            this.currentLoopIsActive = false;
            this.sources = new Map();
            /**
             * Whether or not this node was processed already during this branch.
             */
            this.isProcessing = false;
        }
        /**
         * Gets the connections to this bleed air node.
         * @returns The connections to this bleed air node.
         */
        get connections() {
            return this._connections;
        }
        /**
         * Gets whether or not the connection is fully connected and has active bleed air pressure.
         * @returns A subscribable indicating the connection/activity state.
         */
        get isActive() {
            return this._isActive;
        }
        /**
         * Gets the current PSI of the node.
         * @returns The current PSI of the node.
         */
        get currentPsi() {
            return this._currentPsi;
        }
        /**
         * Adds a connection to this node.
         * @param node The node to connect.
         */
        addConnection(node) {
            if (this._connections.indexOf(node) === -1) {
                this._connections.push(node);
                node.addConnection(this);
            }
        }
        /**
         * Resets the state of the node for the current update.
         */
        reset() {
            this.currentLoopIsActive = false;
            for (const key of this.sources.keys()) {
                this.sources.set(key, 0);
            }
        }
        /** @inheritdoc */
        process(source, connection, timestamp, isActive, flowPercent) {
            var _a, _b;
            if (this.isProcessing) {
                this.isProcessing = false;
                return;
            }
            if (!this.currentLoopIsActive && isActive) {
                this.currentLoopIsActive = true;
            }
            const currentSourceFlow = (_a = this.sources.get(source)) !== null && _a !== void 0 ? _a : 0;
            this.sources.set(source, Math.max(flowPercent, currentSourceFlow));
            this.isProcessing = true;
            for (let i = 0; i < this._connections.length; i++) {
                if (this._connections[i] !== connection && ((_b = this._connections[i].sources.get(source)) !== null && _b !== void 0 ? _b : 0) < flowPercent) {
                    this._connections[i].process(source, this, timestamp, this.currentLoopIsActive, flowPercent);
                }
            }
            this.isProcessing = false;
        }
        /**
         * Synchronizes the current processing values to the externally visible state subjects.
         */
        sync() {
            this._isActive.set(this.currentLoopIsActive);
            this._currentPsi.set(this.mergePressureSources());
            this.reset();
        }
        /**
         * Merges pressures from incoming connections.
         * @returns The merged PSI value.
         */
        mergePressureSources() {
            let maxPsi = 0;
            let maxPsiSource;
            for (const kv of this.sources) {
                const [source, flowPercent] = kv;
                const sourcePsi = source.currentPsi.get() * flowPercent;
                if (sourcePsi > maxPsi) {
                    maxPsi = sourcePsi;
                    maxPsiSource = source;
                }
            }
            let outputPsi = maxPsi;
            for (const kv of this.sources) {
                const [source, flowPercent] = kv;
                if (source !== maxPsiSource) {
                    const sourcePsi = (source.currentPsi.get() * flowPercent) * 0.3;
                    outputPsi += sourcePsi;
                }
            }
            return outputPsi;
        }
    }
    /**
     * A source of bleed air.
     */
    class BleedAirSource extends BleedAirNode {
        /** @inheritdoc */
        setOutputPsi(psi) {
            this._currentPsi.set(psi);
        }
        /**
         * Processes the bleed air source and propagates processing down
         * the bleed air path.
         * @param timestamp The current simtime timestamp.
         */
        processSource(timestamp) {
            if (this.isProcessing) {
                this.isProcessing = false;
                return;
            }
            this.isProcessing = true;
            for (let i = 0; i < this._connections.length; i++) {
                this._connections[i].process(this, this, timestamp, true, 1);
            }
            this.isProcessing = false;
        }
        /** @inheritdoc */
        process() {
            return;
        }
    }
    var BleedValveState;
    (function (BleedValveState) {
        BleedValveState[BleedValveState["Closed"] = 0] = "Closed";
        BleedValveState[BleedValveState["Ready"] = 1] = "Ready";
        BleedValveState[BleedValveState["Open"] = 2] = "Open";
    })(BleedValveState || (BleedValveState = {}));
    /**
     * A class that handles a bleed air valve..
     */
    class BleedValve extends BleedAirNode {
        /**
         * Creates an instance of a BleedValve.
         * @param label The label for this valve.
         * @param isOpen Whether or not this valve starts in an open state or not.
         * @param options The options to apply to this valve.
         */
        constructor(label, isOpen, options) {
            super(label);
            this.isOpen = false;
            this.state = BleedValveState.Closed;
            this._percentOpen = msfsSdk.Subject.create(0);
            this.currentSimTime = -1;
            this.stateChangeTimestamp = -1;
            this.options = Object.assign({ transitionTime: 0, delayTime: 250 }, options);
            this.isOpen = isOpen;
            this._percentOpen.set(isOpen ? 1 : 0);
            this.state = isOpen ? BleedValveState.Open : BleedValveState.Closed;
        }
        /**
         * Gets the percent this valve is open, from 0 (closed) to 1 (open).
         * @returns The percent this valve is open, from 0 (closed) to 1 (open).
         */
        get percentOpen() {
            return this._percentOpen;
        }
        /**
         * Sets whether or not the bleed check valve is open.
         * @param isOpen Whether or not the bleed check valve is open.
         */
        setOpen(isOpen) {
            if (this.isOpen !== isOpen) {
                this.changeOpenState(isOpen);
            }
        }
        /**
         * Checks to see if the valve is fully open.
         * @returns True if fully open, false otherwise.
         */
        isFullyOpen() {
            return this._percentOpen.get() === 1;
        }
        /**
         * Updates the valve.
         * @param timestamp The current timestamp.
         */
        update(timestamp) {
            const deltaTime = timestamp - this.currentSimTime;
            const deltaStateChange = timestamp - this.stateChangeTimestamp;
            this.currentSimTime = timestamp;
            if (deltaTime < 0) {
                this.stateChangeTimestamp = 0;
            }
            switch (this.state) {
                case BleedValveState.Closed:
                    this._percentOpen.set(1 - Math.min(deltaStateChange / this.options.transitionTime, 1));
                    break;
                case BleedValveState.Ready:
                    if (deltaStateChange >= this.options.delayTime) {
                        this.state = BleedValveState.Open;
                        this.stateChangeTimestamp = timestamp;
                    }
                    break;
                case BleedValveState.Open:
                    this._percentOpen.set(Math.min(deltaStateChange / this.options.transitionTime, 1));
                    break;
            }
        }
        /** @inheritdoc */
        process(source, connection, timestamp, isActive, flowPercent) {
            if (this.isProcessing) {
                this.isProcessing = false;
                return;
            }
            if (this._percentOpen.get() === 1 && isActive) {
                this.currentLoopIsActive = true;
            }
            super.process(source, connection, timestamp, this.currentLoopIsActive, Math.pow(this._percentOpen.get(), 0.25) * flowPercent);
        }
        /**
         * Changes the open state of the bleed check valve.
         * @param isOpen Whether or not the bleed check valve is open.
         */
        changeOpenState(isOpen) {
            this.isOpen = isOpen;
            if (isOpen) {
                if (this.state === BleedValveState.Closed) {
                    this.state = this.options.delayTime > 0 ? BleedValveState.Ready : BleedValveState.Open;
                    this.stateChangeTimestamp = this.currentSimTime;
                }
            }
            else {
                if (this.state === BleedValveState.Ready || this.state === BleedValveState.Open) {
                    this.state = BleedValveState.Closed;
                    this.stateChangeTimestamp = this.currentSimTime;
                }
            }
        }
    }

    var TestResult;
    (function (TestResult) {
        TestResult["None"] = "NONE";
        TestResult["Pending"] = "PENDING";
        TestResult["Testing"] = "TESTING";
        TestResult["Completed"] = "COMPLETED";
        TestResult["Passed"] = "PASS";
        TestResult["Failed"] = "FAIL";
    })(TestResult || (TestResult = {}));
    var TestSequenceState;
    (function (TestSequenceState) {
        TestSequenceState["Reset"] = "Reset";
        TestSequenceState["Stopped"] = "Stopped";
        TestSequenceState["Completed"] = "Completed";
        TestSequenceState["Started"] = "Started";
    })(TestSequenceState || (TestSequenceState = {}));
    /**
     * A sequences that runs a number of test steps in order.
     */
    class TestSequence {
        /**
         * Creates an instance of a TestSequence.
         * @param timeConsumer The consumer that supplies time to use.
         */
        constructor(timeConsumer) {
            this.timeConsumer = timeConsumer;
            this._testResult = msfsSdk.Subject.create(TestResult.Pending);
            this.steps = [];
            this.currentStepIndex = 0;
            this.previousTimestamp = -1;
            this.state = TestSequenceState.Reset;
        }
        /**
         * The current results of the test sequence.
         * @returns The test sequence results.
         */
        get testResult() {
            return this._testResult;
        }
        /**
         * Sets the result to a value and completes the sequence.
         * @param result The result to set.
         */
        set(result) {
            this.reset();
            this.state = TestSequenceState.Completed;
            this._testResult.set(result);
        }
        /**
         * Starts the test sequence.
         */
        start() {
            if (this.state !== TestSequenceState.Started && this.state !== TestSequenceState.Completed) {
                this._testResult.set(TestResult.Testing);
                this.timeSubscription = this.timeConsumer.handle(this.update.bind(this));
                this.state = TestSequenceState.Started;
            }
        }
        /**
         * Stops the test sequence.
         */
        stop() {
            this.complete(TestSequenceState.Stopped);
        }
        /**
         * Completes the test and sets the provided state.
         * @param state The state to check and set.
         */
        complete(state = TestSequenceState.Completed) {
            var _a;
            if (this.state !== state) {
                (_a = this.timeSubscription) === null || _a === void 0 ? void 0 : _a.destroy();
                this.timeSubscription = undefined;
                this.previousTimestamp = -1;
                this.state = state;
            }
        }
        /**
         * Resets the test sequence.
         */
        reset() {
            if (this.state !== TestSequenceState.Reset) {
                this.stop();
                this.currentStepIndex = 0;
                this._testResult.set(TestResult.Pending);
                for (let i = 0; i < this.steps.length; i++) {
                    this.steps[i].reset();
                }
                this.state = TestSequenceState.Reset;
            }
        }
        /**
         * Includes a step in the test sequence.
         * @param step The step to include.
         * @returns The modified test sequence.
         */
        withStep(step) {
            this.steps.push(step);
            return this;
        }
        /**
         * Updates the test sequence.
         * @param timestamp The current timestamp.
         */
        update(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
            }
            const deltaTime = msfsSdk.NavMath.clamp(timestamp - this.previousTimestamp, 0, 10000);
            const result = this.steps[this.currentStepIndex].advance(deltaTime);
            switch (result) {
                case TestResult.Completed:
                    this._testResult.set(TestResult.Testing);
                    this.currentStepIndex++;
                    break;
                case TestResult.Pending:
                    this._testResult.set(TestResult.Pending);
                    break;
                case TestResult.Failed:
                    this._testResult.set(TestResult.Failed);
                    this.complete();
                    break;
                case TestResult.Passed:
                    this._testResult.set(TestResult.Passed);
                    this.complete();
                    break;
                default:
                    this._testResult.set(TestResult.Testing);
                    break;
            }
            this.previousTimestamp = timestamp;
        }
    }
    /**
     * A step that runs over a fixed duration and returns a pre-computed result.
     */
    class FixedTimeStep {
        /**
         * Creates an instance of a FixedTimeStep.
         * @param duration The length of time this step should run for.
         * @param result The result at the end of the duration.
         */
        constructor(duration, result = TestResult.Passed) {
            this.duration = duration;
            this.durationRemaining = this.duration;
            this.testResult = msfsSdk.SubscribableUtils.toSubscribable(result, true);
        }
        /** @inheritdoc */
        advance(deltaTime) {
            this.durationRemaining -= deltaTime;
            if (this.durationRemaining <= 0) {
                return this.testResult.get();
            }
            else {
                return TestResult.Pending;
            }
        }
        /** @inheritdoc */
        reset() {
            this.durationRemaining = this.duration;
        }
    }
    /**
     * A step that runs a supplied step advance (and optionally reset) function.
     */
    class DynamicFunctionStep {
        /**
         * Creates an instance of a DynamicFunctionStep.
         * @param advance The function to run when the step is advanced.
         * @param reset The option reset function.
         */
        constructor(advance, reset = () => { }) {
            this.advance = advance;
            this.reset = reset;
        }
    }

    /// <reference types="@microsoft/msfs-types/js/simvar" />
    var BleedSwitchMode;
    (function (BleedSwitchMode) {
        BleedSwitchMode[BleedSwitchMode["Norm"] = 0] = "Norm";
        BleedSwitchMode[BleedSwitchMode["Off"] = 1] = "Off";
    })(BleedSwitchMode || (BleedSwitchMode = {}));
    var BleedIsolateMode;
    (function (BleedIsolateMode) {
        BleedIsolateMode[BleedIsolateMode["Norm"] = 0] = "Norm";
        BleedIsolateMode[BleedIsolateMode["XFlow"] = 1] = "XFlow";
    })(BleedIsolateMode || (BleedIsolateMode = {}));
    var EcsSelection;
    (function (EcsSelection) {
        EcsSelection[EcsSelection["Norm"] = 0] = "Norm";
        EcsSelection[EcsSelection["HeatExchangerOnly"] = 1] = "HeatExchangerOnly";
        EcsSelection[EcsSelection["AcmOnly"] = 2] = "AcmOnly";
    })(EcsSelection || (EcsSelection = {}));
    var BleedValvePosition;
    (function (BleedValvePosition) {
        BleedValvePosition["LeftEngine"] = "LeftEngine";
        BleedValvePosition["LeftEngineHP"] = "LeftEngineHP";
        BleedValvePosition["RightEngine"] = "RightEngine";
        BleedValvePosition["RightEngineHP"] = "RightEngineHP";
        BleedValvePosition["APU"] = "APU";
        BleedValvePosition["BleedIsolate"] = "BleedIsolate";
        BleedValvePosition["LeftPressureSource"] = "LeftPressureSource";
        BleedValvePosition["RightPressureSource"] = "RightPressureSource";
        BleedValvePosition["LeftPressureHeatExchange"] = "LeftPressureHeatExchange";
        BleedValvePosition["LeftPressureACM"] = "LeftPressureACM";
        BleedValvePosition["HeatExchangeIsolation"] = "HeatExchangeIsolation";
        BleedValvePosition["HeatExchangeACM"] = "HeatExchangeACM";
        BleedValvePosition["HeatExchangeAirSupply"] = "HeatExchangeAirSupply";
        BleedValvePosition["LeftWingAntiIce"] = "LeftWingAntiIce";
        BleedValvePosition["LeftWingIsolation"] = "LeftWingIsolation";
        BleedValvePosition["RightWingAntiIce"] = "RightWingAntiIce";
        BleedValvePosition["RightWingIsolation"] = "RightWingIsolation";
        BleedValvePosition["WingXFlow"] = "WingXFlow";
    })(BleedValvePosition || (BleedValvePosition = {}));
    var BleedLine;
    (function (BleedLine) {
        BleedLine["LeftEngineFront"] = "LeftEngineFront";
        BleedLine["LeftEngineBack"] = "LeftEngineBack";
        BleedLine["ApuEcs"] = "ApuEcs";
        BleedLine["ApuBack"] = "ApuBack";
        BleedLine["RightEngineFront"] = "RightEngineFront";
        BleedLine["RightEngineBack"] = "RightEngineBack";
        BleedLine["LeftCrossBleed"] = "LeftCrossBleed";
        BleedLine["RightCrossBleed"] = "RightCrossBleed";
        BleedLine["LeftPressure"] = "LeftPressure";
        BleedLine["RightPressure"] = "RightPressure";
        BleedLine["PressureToHeatExchange"] = "PressureToHeatExchange";
        BleedLine["HeatExchangeToAcm"] = "HeatExchangeToAcm";
        BleedLine["LeftPressureToAcm"] = "LeftPressureToAcm";
        BleedLine["HeatExchangeToSupply"] = "HeatExchangeToSupply";
        BleedLine["AcmToSupply"] = "AcmToSupply";
        BleedLine["Acm"] = "Acm";
        BleedLine["HeatExchange"] = "HeatExchange";
    })(BleedLine || (BleedLine = {}));
    var BleedSwitchSimVars;
    (function (BleedSwitchSimVars) {
        BleedSwitchSimVars["LeftEngineBleedAir"] = "L:WT_LNG_L_BLEED_AIR";
        BleedSwitchSimVars["RightEngineBleedAir"] = "L:WT_LNG_R_BLEED_AIR";
        BleedSwitchSimVars["ApuBleedAir"] = "L:WT_LNG_APU_BLEED_AIR";
        BleedSwitchSimVars["LeftPressureSource"] = "L:WT_LNG_L_PRESS_SRC";
        BleedSwitchSimVars["RightPressureSource"] = "L:WT_LNG_R_PRESS_SRC";
        BleedSwitchSimVars["BleedIsolate"] = "L:WT_LNG_BLEED_ISOLATE";
        BleedSwitchSimVars["BleedFlowMode"] = "L:WT_LNG_FLOW_MODE";
        BleedSwitchSimVars["BleedEcsSelection"] = "L:WT_LNG_ECS_SELECTION";
    })(BleedSwitchSimVars || (BleedSwitchSimVars = {}));
    /**
     * The bleed air system of the Citation Longitude.
     */
    class LongitudeBleedAirSystem {
        /**
         * Creates an instance of the LongitudeBleedAirSystem
         * @param bus An instance of the event bus.
         * @param isPrimary Whether or not this is the primary sim-controlling instance.
         */
        constructor(bus, isPrimary) {
            this.bus = bus;
            this.isPrimary = isPrimary;
            this.alt = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('indicated_alt'), 0);
            this.engine1N2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_1'), 0);
            this.engine2N2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_2'), 0);
            this.engine1N1 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n1_1'), 0);
            this.engine2N1 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n1_2'), 0);
            this.engine1Itt = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('itt_1'), 0);
            this.engine2Itt = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('itt_2'), 0);
            this.apuRpmPct = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('apu_pct'), 0);
            this.leftEngineRunStopState = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_1'), false);
            this.rightEngineRunStopState = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_2'), false);
            this.wingAntiIce = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('anti_ice_structural_switch_on'), false);
            this.outsideAirTemp = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ambient_temp_c'), 0);
            this.lEngineSource = new BleedAirSource('LeftEngine');
            this.rEngineSource = new BleedAirSource('RightEngine');
            this.apuSource = new BleedAirSource('APU');
            this.leftCheckValve = new BleedValve('LeftCheckValve', false);
            this.rightCheckValve = new BleedValve('RightCheckValve', false);
            this.apuCheckValve = new BleedValve('ApuCheckValve', false, { transitionTime: 4000, delayTime: 3000 });
            this.apuEcsEndCheckValve = new BleedValve('ApuEcsEndCheckValve', false, { transitionTime: 4000, delayTime: 3000 });
            this.lEngBleedAir = BleedSwitchMode.Norm;
            this.rEngBleedAir = BleedSwitchMode.Norm;
            this.apuBleedAir = BleedSwitchMode.Norm;
            this.lPressureSource = BleedSwitchMode.Norm;
            this.rPressureSource = BleedSwitchMode.Norm;
            this.bleedIsolate = BleedIsolateMode.Norm;
            this.ecsSelection = EcsSelection.Norm;
            this.previousTimestamp = -1;
            this.apuStarted = false;
            this.apuTest = new TestSequence(this.bus.getSubscriber().on('simTime'))
                .withStep(new FixedTimeStep(2000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                if (this.isPrimary) {
                    SimVar.SetSimVarValue('L:WT_LNG_APU_FIRE_LIGHT', msfsSdk.SimVarValueType.Number, 1);
                }
                return TestResult.Completed;
            }))
                .withStep(new FixedTimeStep(3000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                if (this.isPrimary) {
                    SimVar.SetSimVarValue('L:WT_LNG_APU_FIRE_LIGHT', msfsSdk.SimVarValueType.Number, 0);
                }
                return TestResult.Completed;
            }))
                .withStep(new FixedTimeStep(3000));
            this.apuFireLightSub = this.apuTest.testResult.sub(result => {
                if (result === TestResult.None || result === TestResult.Passed) {
                    SimVar.SetSimVarValue('L:WT_LNG_APU_FIRE_LIGHT', msfsSdk.SimVarValueType.Number, 0);
                }
            });
            this.apuBleedTimeout = 60000;
            this.previousApuTimestamp = -1;
            this.settings = LongitudeUserSettings.getManager(this.bus);
            /**
             * The collection of valves of the bleed air system.
             */
            this.valveStates = new Map([
                [BleedValvePosition.LeftEngine, new BleedValve(BleedValvePosition.LeftEngine, true)],
                [BleedValvePosition.LeftEngineHP, new BleedValve(BleedValvePosition.LeftEngineHP, true)],
                [BleedValvePosition.RightEngine, new BleedValve(BleedValvePosition.RightEngine, true)],
                [BleedValvePosition.RightEngineHP, new BleedValve(BleedValvePosition.RightEngineHP, true)],
                [BleedValvePosition.APU, new BleedValve(BleedValvePosition.APU, true)],
                [BleedValvePosition.BleedIsolate, new BleedValve(BleedValvePosition.BleedIsolate, true)],
                [BleedValvePosition.LeftPressureSource, new BleedValve(BleedValvePosition.LeftPressureSource, true)],
                [BleedValvePosition.RightPressureSource, new BleedValve(BleedValvePosition.RightPressureSource, true)],
                [BleedValvePosition.LeftPressureHeatExchange, new BleedValve(BleedValvePosition.LeftPressureHeatExchange, true)],
                [BleedValvePosition.LeftPressureACM, new BleedValve(BleedValvePosition.LeftPressureACM, false)],
                [BleedValvePosition.HeatExchangeIsolation, new BleedValve(BleedValvePosition.HeatExchangeACM, true)],
                [BleedValvePosition.HeatExchangeACM, new BleedValve(BleedValvePosition.HeatExchangeACM, true)],
                [BleedValvePosition.HeatExchangeAirSupply, new BleedValve(BleedValvePosition.HeatExchangeAirSupply, false)],
                [BleedValvePosition.LeftWingAntiIce, new BleedValve(BleedValvePosition.LeftWingAntiIce, false)],
                [BleedValvePosition.LeftWingIsolation, new BleedValve(BleedValvePosition.LeftWingIsolation, false)],
                [BleedValvePosition.RightWingAntiIce, new BleedValve(BleedValvePosition.RightWingAntiIce, false)],
                [BleedValvePosition.RightWingIsolation, new BleedValve(BleedValvePosition.RightWingIsolation, false)],
                [BleedValvePosition.WingXFlow, new BleedValve(BleedValvePosition.WingXFlow, false)],
            ]);
            /**
             * The collection of lines of the bleed air system.
             */
            this.lineStates = new Map([
                [BleedLine.LeftEngineFront, new BleedAirNode(BleedLine.LeftEngineFront)],
                [BleedLine.LeftEngineBack, new BleedAirNode(BleedLine.LeftEngineBack)],
                [BleedLine.ApuEcs, new BleedAirNode(BleedLine.ApuEcs)],
                [BleedLine.ApuBack, new BleedAirNode(BleedLine.ApuBack)],
                [BleedLine.RightEngineFront, new BleedAirNode(BleedLine.RightEngineFront)],
                [BleedLine.RightEngineBack, new BleedAirNode(BleedLine.RightEngineBack)],
                [BleedLine.LeftCrossBleed, new BleedAirNode(BleedLine.LeftCrossBleed)],
                [BleedLine.RightCrossBleed, new BleedAirNode(BleedLine.RightCrossBleed)],
                [BleedLine.LeftPressure, new BleedAirNode(BleedLine.LeftPressure)],
                [BleedLine.RightPressure, new BleedAirNode(BleedLine.RightPressure)],
                [BleedLine.PressureToHeatExchange, new BleedAirNode(BleedLine.PressureToHeatExchange)],
                [BleedLine.HeatExchangeToAcm, new BleedAirNode(BleedLine.HeatExchangeToAcm)],
                [BleedLine.LeftPressureToAcm, new BleedAirNode(BleedLine.LeftPressureToAcm)],
                [BleedLine.HeatExchangeToSupply, new BleedAirNode(BleedLine.HeatExchangeToSupply)],
                [BleedLine.AcmToSupply, new BleedAirNode(BleedLine.AcmToSupply)],
                [BleedLine.Acm, new BleedAirNode(BleedLine.Acm)],
                [BleedLine.HeatExchange, new BleedAirNode(BleedLine.HeatExchange)],
            ]);
            /** The output PSI of the left side of the bleed air system. */
            this.leftOutputPsi = msfsSdk.Subject.create(0);
            /** The output PSI of the right side of the bleed air system. */
            this.rightOutputPsi = msfsSdk.Subject.create(0);
            /** The output of the APU bleed air trunk. */
            this.apuOutputPsi = msfsSdk.Subject.create(0);
            /** The bleed air temp at the left pylon sensor */
            this.leftPylonTemp = msfsSdk.Subject.create(NaN);
            /** The bleed air temp at the right pylon sensor. */
            this.rightPylonTemp = msfsSdk.Subject.create(NaN);
            /** The bleed air temp at the left wing AI bleed air sensor. */
            this.leftAITemp = msfsSdk.Subject.create(NaN);
            /** The bleed air temp at the right wing AI bleed air sensor. */
            this.rightAITemp = msfsSdk.Subject.create(NaN);
            /** If the bleed air system High Flow mode has been selected. */
            this.highFlow = msfsSdk.Subject.create(false);
            msfsSdk.Wait.awaitSubscribable(msfsSdk.GameStateProvider.get(), v => v === GameState.ingame, true)
                .then(() => msfsSdk.KeyEventManager.getManager(this.bus))
                .then(keyEventManager => {
                if (this.isPrimary) {
                    this.getValve(BleedValvePosition.LeftEngine).isActive.sub(active => keyEventManager.triggerKey('ENGINE_BLEED_AIR_SOURCE_SET', true, 1, active ? 1 : 0), true);
                    this.getValve(BleedValvePosition.RightEngine).isActive.sub(active => keyEventManager.triggerKey('ENGINE_BLEED_AIR_SOURCE_SET', true, 2, active ? 1 : 0), true);
                    this.getValve(BleedValvePosition.APU).isActive.sub(active => keyEventManager.triggerKey('APU_BLEED_AIR_SOURCE_SET', true, active ? 1 : 0), true);
                }
            });
        }
        /**
         * Initializes the bleed air system.
         */
        init() {
            this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
            if (this.isPrimary) {
                this.bus.getSubscriber().on('simTime').atFrequency(0.2).handle(this.updateApuTime.bind(this));
            }
            //APU
            this.apuSource.addConnection(this.apuCheckValve);
            this.apuCheckValve.addConnection(this.getLine(BleedLine.ApuBack));
            this.getLine(BleedLine.ApuBack).addConnection(this.getValve(BleedValvePosition.APU));
            this.getValve(BleedValvePosition.APU).addConnection(this.getLine(BleedLine.ApuEcs));
            this.getValve(BleedValvePosition.APU).addConnection(this.getLine(BleedLine.LeftCrossBleed));
            this.getLine(BleedLine.ApuEcs).addConnection(this.apuEcsEndCheckValve);
            this.apuEcsEndCheckValve.addConnection(this.getLine(BleedLine.LeftPressure));
            //Bleed Isolate
            this.getLine(BleedLine.LeftCrossBleed).addConnection(this.getLine(BleedLine.LeftEngineFront));
            this.getValve(BleedValvePosition.BleedIsolate).addConnection(this.getLine(BleedLine.LeftCrossBleed));
            this.getValve(BleedValvePosition.BleedIsolate).addConnection(this.getLine(BleedLine.RightCrossBleed));
            this.getLine(BleedLine.RightCrossBleed).addConnection(this.getLine(BleedLine.RightEngineFront));
            //Left main manifold
            this.lEngineSource.addConnection(this.leftCheckValve);
            this.leftCheckValve.addConnection(this.getLine(BleedLine.LeftEngineBack));
            this.leftCheckValve.addConnection(this.getValve(BleedValvePosition.LeftEngineHP));
            this.getLine(BleedLine.LeftEngineBack).addConnection(this.getValve(BleedValvePosition.LeftEngine));
            this.getValve(BleedValvePosition.LeftEngine).addConnection(this.getLine(BleedLine.LeftEngineFront));
            this.getLine(BleedLine.LeftEngineFront).addConnection(this.getValve(BleedValvePosition.LeftWingIsolation));
            this.getValve(BleedValvePosition.LeftWingIsolation).addConnection(this.getValve(BleedValvePosition.LeftWingAntiIce));
            this.getLine(BleedLine.LeftEngineFront).addConnection(this.getValve(BleedValvePosition.LeftPressureSource));
            this.getLine(BleedLine.LeftEngineFront).addConnection(this.getValve(BleedValvePosition.BleedIsolate));
            //Wing XFLOW
            this.getValve(BleedValvePosition.LeftWingAntiIce).addConnection(this.getValve(BleedValvePosition.WingXFlow));
            this.getValve(BleedValvePosition.WingXFlow).addConnection(this.getValve(BleedValvePosition.RightWingAntiIce));
            //Right main manifold
            this.rEngineSource.addConnection(this.rightCheckValve);
            this.rightCheckValve.addConnection(this.getLine(BleedLine.RightEngineBack));
            this.leftCheckValve.addConnection(this.getValve(BleedValvePosition.RightEngineHP));
            this.getLine(BleedLine.RightEngineBack).addConnection(this.getValve(BleedValvePosition.RightEngine));
            this.getValve(BleedValvePosition.RightEngine).addConnection(this.getLine(BleedLine.RightEngineFront));
            this.getLine(BleedLine.RightEngineFront).addConnection(this.getValve(BleedValvePosition.RightWingIsolation));
            this.getValve(BleedValvePosition.RightWingIsolation).addConnection(this.getValve(BleedValvePosition.RightWingAntiIce));
            this.getLine(BleedLine.RightEngineFront).addConnection(this.getValve(BleedValvePosition.RightPressureSource));
            this.getLine(BleedLine.RightEngineFront).addConnection(this.getValve(BleedValvePosition.BleedIsolate));
            //Left ECS
            this.getValve(BleedValvePosition.LeftPressureSource).addConnection(this.getLine(BleedLine.LeftPressure));
            this.getLine(BleedLine.LeftPressure).addConnection(this.getValve(BleedValvePosition.LeftPressureHeatExchange));
            this.getLine(BleedLine.LeftPressure).addConnection(this.getValve(BleedValvePosition.LeftPressureACM));
            this.getValve(BleedValvePosition.LeftPressureACM).addConnection(this.getLine(BleedLine.LeftPressureToAcm));
            this.getLine(BleedLine.LeftPressureToAcm).addConnection(this.getLine(BleedLine.Acm));
            //Right ECS
            this.getValve(BleedValvePosition.RightPressureSource).addConnection(this.getLine(BleedLine.RightPressure));
            this.getLine(BleedLine.RightPressure).addConnection(this.getValve(BleedValvePosition.HeatExchangeIsolation));
            this.getLine(BleedLine.RightPressure).addConnection(this.getValve(BleedValvePosition.LeftPressureHeatExchange));
            //ECS
            this.getValve(BleedValvePosition.HeatExchangeIsolation).addConnection(this.getLine(BleedLine.PressureToHeatExchange));
            this.getLine(BleedLine.PressureToHeatExchange).addConnection(this.getLine(BleedLine.HeatExchange));
            this.getLine(BleedLine.HeatExchange).addConnection(this.getValve(BleedValvePosition.HeatExchangeACM));
            this.getValve(BleedValvePosition.HeatExchangeACM).addConnection(this.getLine(BleedLine.HeatExchangeToAcm));
            this.getLine(BleedLine.HeatExchangeToAcm).addConnection(this.getLine(BleedLine.Acm));
            this.getLine(BleedLine.HeatExchange).addConnection(this.getValve(BleedValvePosition.HeatExchangeAirSupply));
            this.getValve(BleedValvePosition.HeatExchangeAirSupply).addConnection(this.getLine(BleedLine.HeatExchangeToSupply));
        }
        /**
         * Updates the bleed air system
         * @param timestamp The current timestamp.
         */
        update(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
                return;
            }
            const deltaTime = msfsSdk.MathUtils.clamp(timestamp - this.previousTimestamp, 0, 10000);
            const leftN2 = this.engine1N2.get();
            const rightN2 = this.engine2N2.get();
            this.apuSource.setOutputPsi(this.apuRpmPct.get() * (32 / 100));
            this.lEngineSource.setOutputPsi(Math.min(leftN2 * (56 / 100), 32));
            this.rEngineSource.setOutputPsi(Math.min(rightN2 * (56 / 100), 32));
            this.synchronizeSwitchPositions();
            this.updateValveStates(leftN2, rightN2);
            for (const valve of this.valveStates.values()) {
                valve.update(timestamp);
            }
            this.apuCheckValve.update(timestamp);
            this.apuEcsEndCheckValve.update(timestamp);
            this.leftCheckValve.update(timestamp);
            this.rightCheckValve.update(timestamp);
            this.apuSource.processSource(timestamp);
            this.lEngineSource.processSource(timestamp);
            this.rEngineSource.processSource(timestamp);
            const leftEngineStarting = this.leftEngineRunStopState.get() && this.engine1N2.get() < 58;
            const rightEngineStarting = this.rightEngineRunStopState.get() && this.engine2N2.get() < 58;
            if (this.apuRpmPct.get() > 5) {
                this.apuBleedTimeout = Math.max(this.apuBleedTimeout - deltaTime, 0);
            }
            else {
                this.apuBleedTimeout = 60000;
            }
            this.apuCheckValve.setOpen(this.apuBleedTimeout === 0);
            this.apuEcsEndCheckValve.setOpen(this.apuBleedTimeout === 0 && !leftEngineStarting && !rightEngineStarting);
            this.leftCheckValve.setOpen(leftN2 > 58 && this.lEngBleedAir === BleedSwitchMode.Norm);
            this.rightCheckValve.setOpen(rightN2 > 58 && this.rEngBleedAir === BleedSwitchMode.Norm);
            this.syncBleedNodes();
            this.updateApu();
            this.previousTimestamp = timestamp;
        }
        /**
         * Updates the APU data and tests.
         */
        updateApu() {
            const apuSwitchOn = SimVar.GetSimVarValue('L:XMLVAR_APU_StarterKnob_Pos', msfsSdk.SimVarValueType.Number) > 0;
            if (this.apuSwitchOn !== apuSwitchOn) {
                if (this.apuSwitchOn === false) {
                    this.apuTest.start();
                }
                else if (this.apuSwitchOn === true) {
                    this.apuTest.reset();
                    SimVar.SetSimVarValue('L:WT_LNG_APU_FIRE_LIGHT', msfsSdk.SimVarValueType.Number, 0);
                }
                this.apuSwitchOn = apuSwitchOn;
            }
            if (this.apuRpmPct.get() > 0 && this.apuStarted === false) {
                this.apuStarted = true;
            }
            else if (this.apuRpmPct.get() === 0 && this.apuStarted === true) {
                if (this.isPrimary) {
                    this.settings.getSetting('apuUsageCycles').set(this.settings.getSetting('apuUsageCycles').get() + 1);
                }
                this.apuStarted = false;
            }
        }
        /**
         * Updates the APU usage time.
         * @param timestamp The current timestamp, in milliseconds simtime.
         */
        updateApuTime(timestamp) {
            if (this.apuStarted) {
                if (this.previousApuTimestamp === -1) {
                    this.previousApuTimestamp = timestamp;
                }
                // Upper limit set to 90 seconds so that we don't incorrectly clamp at 16x simrate
                // (5 second update period * 16 = 80 seconds expected to elapse between updates).
                const deltaTime = msfsSdk.MathUtils.clamp(timestamp - this.previousApuTimestamp, 0, 90000);
                this.settings.getSetting('apuUsageTime').set(this.settings.getSetting('apuUsageTime').get() + (deltaTime / 1000));
                this.previousApuTimestamp = timestamp;
            }
            else {
                this.previousApuTimestamp = -1;
            }
        }
        /**
         * Syncs the currently calculated values to the outputs.
         */
        syncBleedNodes() {
            this.apuCheckValve.sync();
            this.apuEcsEndCheckValve.sync();
            this.leftCheckValve.sync();
            this.rightCheckValve.sync();
            for (const valve of this.valveStates.values()) {
                valve.sync();
            }
            for (const node of this.lineStates.values()) {
                node.sync();
            }
        }
        /**
         * Updates the bleed isolation valve state.
         */
        updateIsolateValves() {
            if (this.bleedIsolate === BleedIsolateMode.Norm) {
                const leftEngineStarted = this.leftEngineRunStopState.get() && this.engine1N2.get() >= 58;
                const rightEngineStarting = this.rightEngineRunStopState.get() && this.engine2N2.get() < 58;
                if (rightEngineStarting && leftEngineStarted && !this.apuCheckValve.isFullyOpen()) {
                    this.getValve(BleedValvePosition.BleedIsolate).setOpen(true);
                }
                else if (rightEngineStarting && !leftEngineStarted) {
                    this.getValve(BleedValvePosition.BleedIsolate).setOpen(true);
                }
                else {
                    this.getValve(BleedValvePosition.BleedIsolate).setOpen(false);
                }
                this.getValve(BleedValvePosition.WingXFlow).setOpen(false);
            }
            else {
                if (this.wingAntiIce.get()) {
                    this.getValve(BleedValvePosition.BleedIsolate).setOpen(false);
                    this.getValve(BleedValvePosition.WingXFlow).setOpen(true);
                }
                else {
                    this.getValve(BleedValvePosition.BleedIsolate).setOpen(true);
                    this.getValve(BleedValvePosition.WingXFlow).setOpen(false);
                }
            }
        }
        /**
         * Updates the pressure source valves.
         */
        updatePressureSourceValves() {
            const leftEngineStarting = this.leftEngineRunStopState.get() && this.engine1N2.get() < 58;
            const rightEngineStarted = this.rightEngineRunStopState.get() && this.engine2N2.get() >= 58;
            const rightEngineStarting = this.rightEngineRunStopState.get() && this.engine2N2.get() < 58;
            if (this.lPressureSource === BleedSwitchMode.Norm) {
                this.getValve(BleedValvePosition.LeftPressureSource).setOpen(!(rightEngineStarting || (leftEngineStarting && !rightEngineStarted)));
            }
            else {
                this.getValve(BleedValvePosition.LeftPressureSource).setOpen(false);
            }
            if (this.rPressureSource === BleedSwitchMode.Norm) {
                this.getValve(BleedValvePosition.RightPressureSource).setOpen(!(rightEngineStarting || (leftEngineStarting && !rightEngineStarted)));
            }
            else {
                this.getValve(BleedValvePosition.RightPressureSource).setOpen(false);
            }
        }
        /**
         * Updates the left engine bleed air valve.
         */
        updateLeftEngineValve() {
            const rightEngineStarting = this.rightEngineRunStopState.get() && this.engine2N2.get() < 58;
            if (this.lEngBleedAir === BleedSwitchMode.Norm) {
                if (rightEngineStarting && this.apuCheckValve.isFullyOpen()) {
                    this.getValve(BleedValvePosition.LeftEngine).setOpen(false);
                }
                else {
                    this.getValve(BleedValvePosition.LeftEngine).setOpen(true);
                }
            }
            else {
                this.getValve(BleedValvePosition.LeftEngine).setOpen(false);
            }
        }
        /**
         * Synchronizes the bleed air switch positions from the associated simvars.
         */
        synchronizeSwitchPositions() {
            this.lEngBleedAir = SimVar.GetSimVarValue(BleedSwitchSimVars.LeftEngineBleedAir, msfsSdk.SimVarValueType.Number);
            this.rEngBleedAir = SimVar.GetSimVarValue(BleedSwitchSimVars.RightEngineBleedAir, msfsSdk.SimVarValueType.Number);
            this.apuBleedAir = SimVar.GetSimVarValue(BleedSwitchSimVars.ApuBleedAir, msfsSdk.SimVarValueType.Number);
            this.lPressureSource = SimVar.GetSimVarValue(BleedSwitchSimVars.LeftPressureSource, msfsSdk.SimVarValueType.Number);
            this.rPressureSource = SimVar.GetSimVarValue(BleedSwitchSimVars.RightPressureSource, msfsSdk.SimVarValueType.Number);
            this.bleedIsolate = SimVar.GetSimVarValue(BleedSwitchSimVars.BleedIsolate, msfsSdk.SimVarValueType.Number);
            this.highFlow.set(SimVar.GetSimVarValue(BleedSwitchSimVars.BleedFlowMode, msfsSdk.SimVarValueType.Number) === 1);
            this.ecsSelection = SimVar.GetSimVarValue(BleedSwitchSimVars.BleedEcsSelection, msfsSdk.SimVarValueType.Number);
        }
        /**
         * Computes the output pressure and temperature values.
         * @param apuPsi The current APU output PSI.
         * @param leftEnginePsi The current left engine output PSI.
         * @param rightEnginePsi The current right engine output PSI.
         */
        computeOutputPressureAndTemp(apuPsi, leftEnginePsi, rightEnginePsi) {
            const apuTemp = this.getTempForApuPsi(apuPsi);
            const leftDuctTemp = this.getTempForITT(this.engine1Itt.get());
            const rightDuctTemp = this.getTempForITT(this.engine2Itt.get());
            this.apuOutputPsi.set(apuPsi);
            if (this.getValve(BleedValvePosition.BleedIsolate).isFullyOpen()) {
                const rearHalfTemp = Math.max(apuTemp, leftDuctTemp, rightDuctTemp);
                const frontTemp = rearHalfTemp * 0.975;
                const outputPsi = Math.max(apuPsi, leftEnginePsi + (0.3 * rightEnginePsi), rightEnginePsi + (0.3 * leftEnginePsi));
                this.leftOutputPsi.set(outputPsi);
                this.rightOutputPsi.set(outputPsi);
                this.leftPylonTemp.set(rearHalfTemp);
                this.rightPylonTemp.set(rearHalfTemp);
                this.rightAITemp.set(frontTemp);
                this.leftAITemp.set(frontTemp);
            }
            else {
                this.leftOutputPsi.set(leftEnginePsi);
                this.rightOutputPsi.set(rightEnginePsi + (0.3 * apuPsi));
                this.leftPylonTemp.set(leftDuctTemp);
                this.rightPylonTemp.set(rightDuctTemp);
                this.leftAITemp.set(leftDuctTemp * 0.975);
                this.rightAITemp.set(rightDuctTemp * 0.975);
            }
        }
        /**
         * Updates the state of the valves in the bleed air system.
         * @param leftN2 The N2 of the left engine.
         * @param rightN2 The N2 of the right engine.
         */
        updateValveStates(leftN2, rightN2) {
            this.getValve(BleedValvePosition.LeftEngineHP).setOpen(this.getHPValveState(this.engine1N1.get(), leftN2));
            this.getValve(BleedValvePosition.RightEngineHP).setOpen(this.getHPValveState(this.engine2N1.get(), rightN2));
            this.updateIsolateValves();
            this.updateLeftEngineValve();
            this.setValveFromSwitch(this.rEngBleedAir, BleedValvePosition.RightEngine);
            if (this.apuBleedAir === BleedSwitchMode.Norm) {
                this.getValve(BleedValvePosition.APU).setOpen(this.apuCheckValve.percentOpen.get() !== 0);
            }
            else {
                this.getValve(BleedValvePosition.APU).setOpen(false);
            }
            this.updatePressureSourceValves();
            if (this.ecsSelection === EcsSelection.Norm) {
                this.getValve(BleedValvePosition.LeftPressureHeatExchange).setOpen(true);
                this.getValve(BleedValvePosition.LeftPressureACM).setOpen(false);
                this.getValve(BleedValvePosition.HeatExchangeACM).setOpen(true);
                this.getValve(BleedValvePosition.HeatExchangeAirSupply).setOpen(false);
                this.getValve(BleedValvePosition.HeatExchangeIsolation).setOpen(true);
            }
            else if (this.ecsSelection === EcsSelection.HeatExchangerOnly) {
                this.getValve(BleedValvePosition.LeftPressureHeatExchange).setOpen(true);
                this.getValve(BleedValvePosition.LeftPressureACM).setOpen(false);
                this.getValve(BleedValvePosition.HeatExchangeACM).setOpen(false);
                this.getValve(BleedValvePosition.HeatExchangeAirSupply).setOpen(true);
                this.getValve(BleedValvePosition.HeatExchangeIsolation).setOpen(true);
            }
            else {
                this.getValve(BleedValvePosition.LeftPressureHeatExchange).setOpen(false);
                this.getValve(BleedValvePosition.LeftPressureACM).setOpen(true);
                this.getValve(BleedValvePosition.HeatExchangeACM).setOpen(false);
                this.getValve(BleedValvePosition.HeatExchangeAirSupply).setOpen(false);
                this.getValve(BleedValvePosition.HeatExchangeIsolation).setOpen(false);
            }
            if (this.lEngBleedAir === BleedSwitchMode.Norm) {
                this.getValve(BleedValvePosition.LeftWingIsolation).setOpen(true);
            }
            else {
                this.getValve(BleedValvePosition.LeftWingIsolation).setOpen(false);
            }
            if (this.rEngBleedAir === BleedSwitchMode.Norm) {
                this.getValve(BleedValvePosition.RightWingIsolation).setOpen(true);
            }
            else {
                this.getValve(BleedValvePosition.RightWingIsolation).setOpen(false);
            }
            if (this.wingAntiIce.get()) {
                const leftEngineStarting = this.engine1N2.get() < 58 && this.leftEngineRunStopState.get();
                const rightEngineStarting = this.engine2N2.get() < 58 && this.rightEngineRunStopState.get();
                this.getValve(BleedValvePosition.LeftWingAntiIce).setOpen(this.engine1N2.get() > 58 && !rightEngineStarting ? true : false);
                this.getValve(BleedValvePosition.RightWingAntiIce).setOpen(this.engine2N2.get() > 58 && !leftEngineStarting ? true : false);
            }
            else {
                this.getValve(BleedValvePosition.LeftWingAntiIce).setOpen(false);
                this.getValve(BleedValvePosition.RightWingAntiIce).setOpen(false);
            }
        }
        /**
         * Sets a valve from a bleed valve mode switch.
         * @param bleedSwitch The switch to read.
         * @param valve The valve to set.
         */
        setValveFromSwitch(bleedSwitch, valve) {
            if (bleedSwitch === BleedSwitchMode.Norm) {
                this.getValve(valve).setOpen(true);
            }
            else {
                this.getValve(valve).setOpen(false);
            }
        }
        /**
         * Gets the desired state of the engine bleed HP valve.
         * @param n1 The current engine N1.
         * @param n2 The current engine N2.
         * @returns True if the HP valve should be open, false otherwise.
         */
        getHPValveState(n1, n2) {
            const hpForbidden = (this.alt.get() >= 41250 && n1 > 80) ||
                (this.alt.get() >= 35000 && this.alt.get() < 41250 && n1 > 76);
            return (this.highFlow.get() || n2 <= 65 || this.highFlow.get() || this.wingAntiIce.get()) && !hpForbidden;
        }
        /**
         * Gets a duct air temperature for a given APU PSI.
         * @param psi The APU PSI.
         * @returns The duct temperature.
         */
        getTempForApuPsi(psi) {
            const pctMax = psi / 38;
            const ductTemp = Math.pow(pctMax, 0.2) * 245;
            const outsideAirTempContribution = (1 - (0.75 * pctMax)) * this.outsideAirTemp.get();
            return ductTemp + outsideAirTempContribution;
        }
        /**
         * Gets a duct air temperature given an engine ITT
         * @param itt The ITT of the engine.
         * @returns The duct temperature.
         */
        getTempForITT(itt) {
            return itt * 0.325;
        }
        /**
         * Gets a valve from the system.
         * @param valve The valve to get.
         * @returns The bleed valve.
         * @throws An error if the valve was not found.
         */
        getValve(valve) {
            const valveSubject = this.valveStates.get(valve);
            if (valveSubject === undefined) {
                throw new Error(`Valve ${valve} could not be found.`);
            }
            return valveSubject;
        }
        /**
         * Gets a line from the system.
         * @param line The line to get.
         * @returns The node that represent the line.
         * @throws An error if the line was not found.
         */
        getLine(line) {
            const node = this.lineStates.get(line);
            if (node === undefined) {
                throw new Error(`Line ${line} could not be found.`);
            }
            return node;
        }
    }

    /**
     * A class for generating formatters for synoptic display number values.
     */
    class SynopticNumberFormatter {
        /**
         * Creates a formatter for values with rounding to the specified precsion and hysteresis of 7/10ths of the
         * precision.
         * @param precision The precision of the formatter.
         * @param min The minimum value at or below which the formatter will report 0.
         * @returns The number formatter.
         */
        static create(precision, min = Number.NEGATIVE_INFINITY) {
            let currentVal = NaN;
            let currentValString = '';
            const hysteresis = 7 * (precision / 10);
            const decimals = SynopticNumberFormatter.countDecimals(precision);
            return (val) => {
                const valToPrecision = Math.round(val / precision) * precision;
                if (isNaN(currentVal)) {
                    currentVal = valToPrecision;
                    currentValString = currentVal.toFixed(decimals);
                }
                if (val <= min) {
                    if (currentVal !== 0) {
                        currentVal = 0;
                        currentValString = currentVal.toFixed(decimals);
                    }
                }
                else if (val >= currentVal + hysteresis || val <= currentVal - hysteresis) {
                    currentVal = valToPrecision;
                    currentValString = currentVal.toFixed(decimals);
                }
                return currentValString;
            };
        }
        /**
         * Counts the number of decimals for precision.
         * @param decimal The number to count.
         * @returns The number of decimals.
         */
        static countDecimals(decimal) {
            const num = parseFloat(decimal.toString());
            if (Number.isInteger(num) === true) {
                return 0;
            }
            const text = num.toString();
            if (text.indexOf('e-') > -1) {
                const split = text.split('e-');
                const deg = parseInt(split[1], 10);
                return deg;
            }
            else {
                const index = text.indexOf('.');
                return text.length - index - 1;
            }
        }
    }

    /**
     * An icon on a synoptics page of a valve.
     */
    class ValveIcon extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.el = msfsSdk.FSComponent.createRef();
            this.lineEl = msfsSdk.FSComponent.createRef();
            this.startAngle = this.props.horizontal ? -90 : 0;
            this.endAngle = this.props.horizontal ? 0 : -90;
        }
        /** @inheritdoc */
        onAfterRender() {
            this.props.percentOpen.sub(this.onTransit.bind(this), true);
            this.props.isActive.sub(this.handleIsActiveChanged.bind(this), true);
        }
        /**
         * Handles when the valve is transiting.
         * @param percentOpen The current percent open value.
         */
        onTransit(percentOpen) {
            const value = this.props.horizontal ? percentOpen * -90 : (1 - percentOpen) * -90;
            this.lineEl.instance.style.transform = `rotate3D(0, 0, 1, ${value}deg)`;
        }
        /**
         * Handles when the isActive status of a valve has changed.
         * @param isActive Whether or not the valve is active.
         */
        handleIsActiveChanged(isActive) {
            if (isActive) {
                this.el.instance.classList.add('active');
            }
            else {
                this.el.instance.classList.remove('active');
            }
        }
        /** @inheritdoc */
        render() {
            var _a;
            return (msfsSdk.FSComponent.buildComponent("svg", { class: `synoptics-valve-icon ${(_a = this.props.class) !== null && _a !== void 0 ? _a : ''}`, viewBox: '0 0 40 40', ref: this.el },
                msfsSdk.FSComponent.buildComponent("circle", { cx: '20', cy: '20', r: '19' }),
                msfsSdk.FSComponent.buildComponent("line", { x1: '20', x2: '20', y1: '1', y2: '39', ref: this.lineEl })));
        }
    }

    /**
     * The Longitude Anti-Ice synoptics pane.
     */
    class AntiIceSynopticsPane extends msfsWtg3000Common.DisplayPaneView {
        constructor() {
            super(...arguments);
            this.title = msfsSdk.Subject.create('Anti Ice');
            this.windshieldHeatActiveClass = this.props.antiIce.windshieldHeatActive.map(v => v ? 'synoptic-ai-windshield active' : 'synoptic-ai-windshield ');
            this.leftEngineActiveHidden = this.props.antiIce.leftEngineAiActive.map(msfsSdk.SubscribableMapFunctions.not());
            this.rightEngineActiveHidden = this.props.antiIce.rightEngineAiActive.map(msfsSdk.SubscribableMapFunctions.not());
        }
        /**
         * Maps a subscribable to an active line class.
         * @param sub The input subscribable.
         * @param side The side to get the subscribable for.
         * @returns The output class subscribable.
         */
        toActiveClass(sub, side) {
            if (side !== undefined) {
                return msfsSdk.MappedSubject.create(([sideSub, isActive]) => (sideSub && isActive) ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics', side === 'left' ? this.props.bleedAir.getValve(BleedValvePosition.LeftWingAntiIce).isActive : this.props.bleedAir.getValve(BleedValvePosition.RightWingAntiIce).isActive, sub);
            }
            else {
                return sub.map(a => a ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics');
            }
        }
        /**
         * Gets an active line class subscribable for a given wing root path.
         * @param side The side to get the subscribable for.
         * @returns The output class subscribable.
         */
        wingRootActive(side) {
            const bleed = this.props.bleedAir;
            return msfsSdk.MappedSubject.create(([leftAi, rightAi, xflow]) => {
                if (side === 'left') {
                    return (leftAi || (rightAi && xflow)) ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics';
                }
                else {
                    return (rightAi || (leftAi && xflow)) ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics';
                }
            }, bleed.getValve(BleedValvePosition.LeftWingAntiIce).isActive, bleed.getValve(BleedValvePosition.RightWingAntiIce).isActive, bleed.getValve(BleedValvePosition.WingXFlow).isActive);
        }
        /**
         * Gets an active line class subscribable for a bleed junction point.
         * @param side The side to get the subscribable for.
         * @returns The output class subscribable.
         */
        bleedJunctionActive(side) {
            const bleed = this.props.bleedAir;
            const antiIce = this.props.antiIce;
            return msfsSdk.MappedSubject.create(([leftAi, rightAi, leftAiValve, rightAiValve, leftEng, rightEng, isolate]) => {
                if (side === 'left') {
                    return (leftAi && leftAiValve && (leftEng || (rightEng && isolate))) ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics';
                }
                else {
                    return (rightAi && rightAiValve && (rightEng || (leftEng && isolate))) ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics';
                }
            }, antiIce.leftAiActive, antiIce.rightAiActive, bleed.getValve(BleedValvePosition.LeftWingAntiIce).isActive, bleed.getValve(BleedValvePosition.RightWingAntiIce).isActive, bleed.getValve(BleedValvePosition.LeftEngine).isActive, bleed.getValve(BleedValvePosition.RightEngine).isActive, bleed.getValve(BleedValvePosition.BleedIsolate).isActive);
        }
        /**
         * Determines if the HP line is active.
         * @param side The side to get the subscribable for.
         * @returns The output class subscribable.
         */
        hpLineActive(side) {
            const bleed = this.props.bleedAir;
            const antiIce = this.props.antiIce;
            return msfsSdk.MappedSubject.create(([leftAi, rightAi, leftHp, leftIso, rightHp, rightIso]) => {
                if (side === 'left') {
                    return (leftAi && leftHp && leftIso) ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics';
                }
                else {
                    return (rightAi && rightHp && rightIso) ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics';
                }
            }, antiIce.leftAiActive, antiIce.rightAiActive, bleed.getValve(BleedValvePosition.LeftEngineHP).isActive, bleed.getValve(BleedValvePosition.LeftWingIsolation).isActive, bleed.getValve(BleedValvePosition.RightEngineHP).isActive, bleed.getValve(BleedValvePosition.RightWingIsolation).isActive);
        }
        /**
         * Determines if the main A/I line is active.
         * @param side The side to get the subscribable for.
         * @returns The output class subscribable.
         */
        aiLineActive(side) {
            const bleed = this.props.bleedAir;
            const antiIce = this.props.antiIce;
            return msfsSdk.MappedSubject.create(([leftAi, rightAi, leftWing, leftIso, rightWing, rightIso]) => {
                if (side === 'left') {
                    return (leftAi && leftWing && leftIso) ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics';
                }
                else {
                    return (rightAi && rightWing && rightIso) ? 'synoptic-ai-graphics active' : 'synoptic-ai-graphics';
                }
            }, antiIce.leftAiActive, antiIce.rightAiActive, bleed.getValve(BleedValvePosition.LeftWingAntiIce).isActive, bleed.getValve(BleedValvePosition.LeftWingIsolation).isActive, bleed.getValve(BleedValvePosition.RightWingAntiIce).isActive, bleed.getValve(BleedValvePosition.RightWingIsolation).isActive);
        }
        /**
         * Gets whether or not a valve is active.
         * @param side The side the valve is on.
         * @param valve The valve to get active for.
         * @returns Whether or not the valve is active.
         */
        valveActive(side, valve) {
            if (side === 'left') {
                return msfsSdk.MappedSubject.create(([leftAi, leftAiValve, valveActive, iso]) => leftAi && valveActive && leftAiValve && iso, this.props.antiIce.leftAiActive, this.props.bleedAir.getValve(BleedValvePosition.LeftWingAntiIce).isActive, this.props.bleedAir.getValve(valve).isActive, this.props.bleedAir.getValve(BleedValvePosition.LeftWingIsolation).isActive);
            }
            else if (side === 'center') {
                return msfsSdk.MappedSubject.create(([leftAi, rightAi, valveActive]) => (leftAi || rightAi) && valveActive, this.props.antiIce.leftAiActive, this.props.antiIce.rightAiActive, this.props.bleedAir.getValve(valve).isActive);
            }
            else {
                return msfsSdk.MappedSubject.create(([rightAi, rightAiValve, valveActive, iso]) => rightAi && valveActive && rightAiValve && iso, this.props.antiIce.rightAiActive, this.props.bleedAir.getValve(BleedValvePosition.RightWingAntiIce).isActive, this.props.bleedAir.getValve(valve).isActive, this.props.bleedAir.getValve(BleedValvePosition.RightWingIsolation).isActive);
            }
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-ai-container' },
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/ai-wings.png`, class: "synoptics-ai-graphics-wings" }),
                msfsSdk.FSComponent.buildComponent("svg", { width: "495", height: "748", class: "synoptics-ai-graphics-svg" },
                    msfsSdk.FSComponent.buildComponent("g", null,
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 255,23 v 92 h 70 c 0,0 18.63479,0.87819 53.20264,8.4989 C 412.77049,131.11961 427,139 427,139 V 74 C 427,74 398.8397,54.456378 351,40 303.1603,25.543622 255,23 255,23 Z", "dev-name": "r-inner-windshield-outline", class: "synoptic-ai-windshield" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 239,23 v 92 h -70 c 0,0 -18.63479,0.87819 -53.20264,8.4989 C 81.229507,131.11961 66.999997,139 66.999997,139 V 74 c 0,0 28.1603,-19.543622 76.000003,-34 47.8397,-14.45638 96,-17 96,-17 z", "dev-name": "l-inner-windshield-outline", class: "synoptic-ai-windshield" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 434.12598,81.070866 c 0,0 15.90187,7.216097 30.75591,17.007874 14.85404,9.79178 23.52756,19.13386 23.52756,19.13386 l -1.84253,45.49606 c 0,0 -9.24798,-5.44166 -26.64566,-12.7559 -17.39768,-7.31424 -25.79528,-9.92126 -25.79528,-9.92126 z", "dev-name": "r-outer-windshield-outline", class: "synoptic-ai-windshield" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 60.75591,80.99213 c 0,0 -15.90187,7.21609 -30.75591,17.00787 -14.85404,9.79178 -23.52756,19.13386 -23.52756,19.13386 l 1.84253,45.49606 c 0,0 9.24798,-5.44166 26.64566,-12.7559 17.39768,-7.31424 25.79528,-9.92126 25.79528,-9.92126 z", "dev-name": "l-outer-windshield-outline", class: "synoptic-ai-windshield" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 261,35 v 70 c 0,0 13,0 33,0 20,0 33,1 33,1 V 43 c 0,0 -13,-2 -31,-5 -18,-3 -35,-3 -35,-3 z", "dev-name": "r1-windshield", class: this.windshieldHeatActiveClass }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 159,48 v 60 c 0,0 -13,1 -24,3 -11,2 -23,4 -23,4 V 61 c 0,0 9,-3 22,-7 13,-4 25,-6 25,-6 z", "dev-name": "l2-windshield", class: this.windshieldHeatActiveClass }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 106,63 v 53 c 0,0 -11,3 -17,5 -6,2 -15,6 -15,6 V 81 c 0,0 7,-5 14,-9 7,-4 18,-9 18,-9 z", "dev-name": "l3-windshield", class: this.windshieldHeatActiveClass }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 55,91 v 43 c 0,0 -13,4 -21,8 -8,4 -20,10 -20,10 l -1,-34 c 0,0 8,-7 18,-14 10,-7 24,-13 24,-13 z", "dev-name": "l3-windshield-outer", class: this.windshieldHeatActiveClass }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 233,36 v 70 c 0,0 -13,0 -33,0 -20,0 -33,1 -33,1 V 44 c 0,0 13,-2 31,-5 18,-3 35,-3 35,-3 z", "dev-name": "l1-windshield", class: this.windshieldHeatActiveClass }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 335,47 v 60 c 0,0 13,1 24,3 11,2 23,4 23,4 V 60 c 0,0 -9,-3 -22,-7 -13,-4 -25,-6 -25,-6 z", "dev-name": "r2-windshield", class: this.windshieldHeatActiveClass }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 388,62 v 53 c 0,0 11,3 17,5 6,2 15,6 15,6 V 80 c 0,0 -7,-5 -14,-9 -7,-4 -18,-9 -18,-9 z", "dev-name": "r3-windshield", class: this.windshieldHeatActiveClass }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 439,90 v 43 c 0,0 13,4 21,8 8,4 20,10 20,10 l 1,-34 c 0,0 -8,-7 -18,-14 -10,-7 -24,-13 -24,-13 z", "dev-name": "r3-windshield-outer", class: this.windshieldHeatActiveClass })),
                    msfsSdk.FSComponent.buildComponent("g", null,
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 56,686 h 61 v -78", "dev-name": "l-eng-hp-line", class: this.hpLineActive('left') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 378,608 v 78 l 63,-1", "dev-name": "r-eng-hp-line", class: this.hpLineActive('right') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 56,605 H 204", "dev-name": "l-eng-bleed-line", class: this.toActiveClass(this.props.bleedAir.getValve(BleedValvePosition.LeftEngine).isActive, 'left') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 210,605 h 75", "dev-name": "bleed-isolate-line", class: this.toActiveClass(this.valveActive('center', BleedValvePosition.BleedIsolate)) }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 291,605 H 441", "dev-name": "r-eng-bleed-line", class: this.toActiveClass(this.props.bleedAir.getValve(BleedValvePosition.RightEngine).isActive, 'right') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 204,605 h 6", "dev-name": "l-bleed-junc-line", class: this.bleedJunctionActive('left') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 285,605 h 6", "dev-name": "r-bleed-junc-line", class: this.bleedJunctionActive('right') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 207,602 V 416", "dev-name": "l-wing-ai-line", class: this.aiLineActive('left') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 288,602 V 416", "dev-name": "r-wing-ai-line", class: this.aiLineActive('right') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 210,413 h 75", "dev-name": "wing-xflow-line", class: this.toActiveClass(this.props.bleedAir.getValve(BleedValvePosition.WingXFlow).isActive) }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 204,413 h 6", "dev-name": "l-wing-junc-line", class: this.wingRootActive('left') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 285,413 h 6", "dev-name": "r-wing-junc-line", class: this.wingRootActive('right') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 207,410 V 297", "dev-name": "l-wing-pflow-main-line", class: this.wingRootActive('left') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 288,410.5 v -113", "dev-name": "r-wing-pflow-main-line", class: this.wingRootActive('right') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 207,263 V 212 L 50,313", "dev-name": "l-wing-line", class: "synoptic-ai-graphics wing" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 288,263.5 v -51 l 157,101", "dev-name": "r-wing-line", class: "synoptic-ai-graphics wing" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 207,263 V 212 L 50,313", "dev-name": "l-wing-line", class: this.wingRootActive('left') }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 288,263.5 v -51 l 157,101", "dev-name": "r-wing-line", class: this.wingRootActive('right') }))),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/ai-engine-off.png`, class: "synoptics-ai-graphics-engine-left" }),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/ai-engine-off.png`, class: "synoptics-ai-graphics-engine-right" }),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/ai-engine-on.png`, class: {
                        'synoptics-ai-graphics-engine-left': true,
                        'hidden': this.leftEngineActiveHidden
                    } }),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/ai-engine-on.png`, class: {
                        'synoptics-ai-graphics-engine-right': true,
                        'hidden': this.rightEngineActiveHidden
                    } }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'synoptics-ai-l-hp-valve', isActive: this.valveActive('left', BleedValvePosition.LeftEngineHP), percentOpen: this.props.bleedAir.getValve(BleedValvePosition.LeftEngineHP).percentOpen }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'synoptics-ai-r-hp-valve', isActive: this.valveActive('right', BleedValvePosition.RightEngineHP), percentOpen: this.props.bleedAir.getValve(BleedValvePosition.RightEngineHP).percentOpen }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'synoptics-ai-l-main-valve', isActive: this.valveActive('left', BleedValvePosition.LeftEngine), percentOpen: this.props.bleedAir.getValve(BleedValvePosition.LeftEngine).percentOpen, horizontal: true }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'synoptics-ai-r-main-valve', isActive: this.valveActive('right', BleedValvePosition.RightEngine), percentOpen: this.props.bleedAir.getValve(BleedValvePosition.RightEngine).percentOpen, horizontal: true }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'synoptics-ai-isolate-valve', isActive: this.valveActive('center', BleedValvePosition.BleedIsolate), percentOpen: this.props.bleedAir.getValve(BleedValvePosition.BleedIsolate).percentOpen, horizontal: true }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'synoptics-ai-l-ai-valve', isActive: this.valveActive('left', BleedValvePosition.LeftWingAntiIce), percentOpen: this.props.bleedAir.getValve(BleedValvePosition.LeftWingAntiIce).percentOpen }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'synoptics-ai-r-ai-valve', isActive: this.valveActive('right', BleedValvePosition.RightWingAntiIce), percentOpen: this.props.bleedAir.getValve(BleedValvePosition.RightWingAntiIce).percentOpen }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'synoptics-ai-xflow-valve', isActive: this.valveActive('center', BleedValvePosition.WingXFlow), percentOpen: this.props.bleedAir.getValve(BleedValvePosition.WingXFlow).percentOpen, horizontal: true }),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-ai-labels' },
                    msfsSdk.FSComponent.buildComponent("div", { style: 'left: 32px; top: 118px;' }, "L3"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'left: 82px; top: 100px;' }, "L3"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'left: 136px; top: 92px;' }, "R2"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'left: 200px; top: 88px;' }, "L1"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'right: 32px; top: 118px;' }, "R3"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'right: 82px; top: 100px;' }, "R3"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'right: 136px; top: 92px;' }, "L2"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'right: 200px; top: 88px;' }, "R1")),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-ai-data' },
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'left: 171px; bottom: 180px;', temp: this.props.antiIce.leftRootTemp.value }),
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'right: 171px; bottom: 180px;', temp: this.props.antiIce.rightRootTemp.value }),
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'left: 150px; bottom: 440px;', temp: this.props.antiIce.leftWingTemp.value, psi: this.props.antiIce.leftAiActive.map(a => a ? 60 : 0) }),
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'right: 150px; bottom: 440px;', temp: this.props.antiIce.rightWingTemp.value, psi: this.props.antiIce.rightAiActive.map(a => a ? 60 : 0) }),
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'left: 100px; top: 194px;', temp: this.props.antiIce.l1Temp.value }),
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'left: 14px; top: 250px;', temp: this.props.antiIce.l2Temp.value }),
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'right: 100px; top: 194px;', temp: this.props.antiIce.r1Temp.value }),
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'right: 14px; top: 250px;', temp: this.props.antiIce.r2Temp.value }),
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'left: 160px; top: 54px; border: none; background-color: unset;', temp: this.props.antiIce.windshieldTemp.value }),
                    msfsSdk.FSComponent.buildComponent(DataBox, { style: 'right: 170px; top: 54px; border: none; background-color: unset;', temp: this.props.antiIce.windshieldTemp.value }))));
        }
    }
    /**
     * Displays a box of temperature and optionally PSI data.
     */
    class DataBox extends msfsSdk.DisplayComponent {
        /**
         * Creates an instance of a DataBox component.
         * @param props The props for this component.
         */
        constructor(props) {
            super(props);
            this.tempValue = this.props.temp.map(SynopticNumberFormatter.create(1));
            if (this.props.psi !== undefined) {
                this.psiValue = this.props.psi.map(SynopticNumberFormatter.create(1));
            }
        }
        /** @inheritdoc */
        render() {
            if (this.psiValue !== undefined) {
                return (msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-ai-databox with-psi', style: this.props.style },
                    msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-ai-databox-psi' },
                        msfsSdk.FSComponent.buildComponent("span", { class: 'synoptic-ai-databox-value' }, this.psiValue),
                        msfsSdk.FSComponent.buildComponent("span", { class: 'synoptic-ai-databox-unit' }, " PSI")),
                    msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-ai-databox-temp' },
                        msfsSdk.FSComponent.buildComponent("span", { class: 'synoptic-ai-databox-value' }, this.tempValue),
                        msfsSdk.FSComponent.buildComponent("span", { class: 'synoptic-ai-databox-unit' }, " \u00B0C"))));
            }
            else {
                return (msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-ai-databox', style: this.props.style },
                    msfsSdk.FSComponent.buildComponent("span", { class: 'synoptic-ai-databox-value' }, this.tempValue),
                    msfsSdk.FSComponent.buildComponent("span", { class: 'synoptic-ai-databox-unit' }, " \u00B0C")));
            }
        }
        /** @inheritdoc */
        destroy() {
            var _a;
            this.tempValue.destroy();
            (_a = this.psiValue) === null || _a === void 0 ? void 0 : _a.destroy();
        }
    }

    /**
     * A icon depicting a fan or pump on a synoptics page.
     */
    class FanIcon extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.el = msfsSdk.FSComponent.createRef();
        }
        /** @inheritdoc */
        onAfterRender() {
            this.props.isActive.sub(isActive => {
                if (isActive) {
                    this.el.instance.classList.add('active');
                }
                else {
                    this.el.instance.classList.remove('active');
                }
            }, true);
        }
        /** @inheritdoc */
        render() {
            var _a;
            return (msfsSdk.FSComponent.buildComponent("svg", { class: `synoptics-fan-icon ${(_a = this.props.class) !== null && _a !== void 0 ? _a : ''}`, ref: this.el, viewBox: '0 0 34 34' },
                msfsSdk.FSComponent.buildComponent("circle", { cx: "16.5", cy: "17.5", r: "15", stroke: "green", "stroke-width": "3px" }),
                msfsSdk.FSComponent.buildComponent("path", { d: "M 16 5.2 c -1.122 1.939 -3.724 6.123 -0.816 9.848 c 0.34 0.496 0.637 0.42 0.816 0 c 1.837 -5.205 6.328 -7.297 10.359 -5.766 c 1.735 2.704 2.449 5.154 2.449 7.45 c -3.113 -3.011 -7.96 -2.705 -9.44 -0.715 c -0.398 0.335 -0.655 0.619 0 0.766 c 4.082 0.816 6.072 7.092 6.327 9.337 c -2.5 2.807 -6.429 4.44 -8.521 4.083 c 3.011 -3.981 3.113 -7.603 1.072 -9.9 c -0.339 -0.486 -0.88 -0.548 -1.276 0.103 c -2.296 3.163 -3.674 5.408 -8.674 6.225 c -3.776 -3.215 -3.674 -6.685 -3.725 -8.828 c 3.01 2.603 6.531 4.133 9.541 1.174 c 0.566 -0.542 0.288 -0.799 -0.153 -1.021 c -5.102 -2.092 -6.174 -5 -6.633 -9.133 c 2.194 -3.674 6.225 -3.419 8.674 -3.623", fill: "green", m: "" })));
        }
    }

    /**
     * A display pane view that displays the ECS synoptics page.
     */
    class EcsSynopticsPane extends msfsWtg3000Common.DisplayPaneView {
        constructor() {
            super(...arguments);
            this.title = msfsSdk.Subject.create('ECS');
            this.apuLine = msfsSdk.FSComponent.createRef();
            this.apuRearLine = msfsSdk.FSComponent.createRef();
            this.leftFrontBleedLine = msfsSdk.FSComponent.createRef();
            this.leftEngJuncLine = msfsSdk.FSComponent.createRef();
            this.rightFrontBleedLine = msfsSdk.FSComponent.createRef();
            this.rightEngJuncLine = msfsSdk.FSComponent.createRef();
            this.leftRearBleedLine = msfsSdk.FSComponent.createRef();
            this.rightRearBleedLine = msfsSdk.FSComponent.createRef();
            this.leftPressureLine = msfsSdk.FSComponent.createRef();
            this.leftPressureAcmJuncLine = msfsSdk.FSComponent.createRef();
            this.leftPressureAcmToApuLine = msfsSdk.FSComponent.createRef();
            this.leftPressureApuJuncLine = msfsSdk.FSComponent.createRef();
            this.leftPressureApuLine = msfsSdk.FSComponent.createRef();
            this.rightPressureLine = msfsSdk.FSComponent.createRef();
            this.rightPressureValveToExchLine = msfsSdk.FSComponent.createRef();
            this.rightPressureJuncLine = msfsSdk.FSComponent.createRef();
            this.bleedIsolateLeftLine = msfsSdk.FSComponent.createRef();
            this.bleedIsolateRightLine = msfsSdk.FSComponent.createRef();
            this.pressureToHeatExchangeLine = msfsSdk.FSComponent.createRef();
            this.acmToSupplyLine = msfsSdk.FSComponent.createRef();
            this.heatExchangeToSupplyLine = msfsSdk.FSComponent.createRef();
            this.heatExchangeToAcmLine = msfsSdk.FSComponent.createRef();
            this.leftPressureToAcmLine = msfsSdk.FSComponent.createRef();
            this.supplyToTempLine = msfsSdk.FSComponent.createRef();
            this.supplyToTemp2Line = msfsSdk.FSComponent.createRef();
            this.recircStartLine = msfsSdk.FSComponent.createRef();
            this.recircEndLine = msfsSdk.FSComponent.createRef();
            this.recircArrow = msfsSdk.FSComponent.createRef();
            this.heatExchanger = msfsSdk.FSComponent.createRef();
            this.acm = msfsSdk.FSComponent.createRef();
            this.settings = LongitudeUserSettings.getManager(this.props.bus);
            this.apuValve = msfsSdk.Subject.create(false);
            this.lEngineBleedValve = msfsSdk.Subject.create(false);
            this.lEnginePressSourceValve = msfsSdk.Subject.create(false);
            this.bleedIsolateValve = msfsSdk.Subject.create(false);
            this.rEngineBleedValve = msfsSdk.Subject.create(false);
            this.rEnginePressSourceValve = msfsSdk.Subject.create(false);
            this.ecsXFlowValve = msfsSdk.Subject.create(false);
        }
        /** @inheritdoc */
        onAfterRender() {
            const bleedAir = this.props.bleedAir;
            this.props.bleedAir.getLine(BleedLine.ApuEcs).isActive.sub(this.toggleLineActive.bind(this, this.apuLine), true);
            this.props.bleedAir.getLine(BleedLine.ApuBack).isActive.sub(this.toggleLineActive.bind(this, this.apuRearLine), true);
            msfsSdk.MappedSubject.create(([lPressSource, ecsXFlow, rPressSource, acm, heatExchange, acmValve, lEngBleed, rEngBleed, apu, bleedIsolate]) => {
                const lSourceActive = (lEngBleed && lPressSource) || (rEngBleed && bleedIsolate && lPressSource);
                const lSourceHeat = lSourceActive && ecsXFlow && heatExchange;
                const rSourceActive = (rEngBleed && rPressSource) || (lEngBleed && bleedIsolate && rPressSource);
                const rSourceAcm = rSourceActive && ecsXFlow && acmValve && acm;
                const apuSourceHeat = apu && ecsXFlow && heatExchange;
                const apuSourceAcm = apu && acmValve && acm;
                const xFlowFromLeft = lEngBleed && bleedIsolate && rPressSource && (heatExchange || rSourceAcm);
                const xFlowFromRight = rEngBleed && bleedIsolate && lPressSource && (acm || lSourceHeat);
                this.toggleLineActive(this.leftPressureLine, lSourceActive && (acmValve || lSourceHeat));
                this.toggleLineActive(this.leftEngJuncLine, lSourceActive || xFlowFromLeft);
                this.toggleLineActive(this.leftPressureAcmJuncLine, (lSourceActive && (acmValve || lSourceHeat)) || (rSourceActive && rSourceAcm) || apuSourceAcm);
                this.toggleLineActive(this.leftPressureAcmToApuLine, (lSourceActive && lSourceHeat) || (rSourceActive && rSourceAcm) || apuSourceAcm);
                this.toggleLineActive(this.leftPressureApuJuncLine, (lSourceActive && lSourceHeat) || (rSourceActive && rSourceAcm) || apuSourceHeat || apuSourceAcm);
                this.toggleLineActive(this.leftPressureApuLine, (lSourceActive && lSourceHeat) || (rSourceActive && rSourceAcm) || apuSourceHeat);
                this.toggleLineActive(this.rightPressureLine, (rSourceActive && heatExchange && !acmValve) || (rSourceActive && rSourceAcm));
                this.toggleLineActive(this.rightEngJuncLine, (rSourceActive && ((acm && ecsXFlow) || heatExchange)) || xFlowFromRight);
                this.toggleLineActive(this.rightPressureJuncLine, (rSourceActive && heatExchange && !acmValve)
                    || (rSourceActive && rSourceAcm) || (lSourceActive && lSourceHeat) || apuSourceHeat);
                this.toggleLineActive(this.rightPressureValveToExchLine, (lSourceActive && lSourceHeat) || (rSourceActive && rSourceAcm) || apuSourceHeat);
                this.toggleLineActive(this.leftPressureToAcmLine, (lSourceActive && acmValve) || (rSourceActive && rSourceAcm) || apuSourceAcm);
                this.ecsXFlowValve.set((lSourceActive && lSourceHeat) || (rSourceActive && rSourceAcm) || apuSourceHeat);
                this.lEnginePressSourceValve.set(lSourceActive && (acmValve || lSourceHeat));
                this.rEnginePressSourceValve.set(rSourceActive && ((heatExchange && !acmValve) || rSourceAcm));
                this.toggleLineActive(this.leftRearBleedLine, (lEngBleed && lPressSource) || xFlowFromLeft);
                this.toggleLineActive(this.leftFrontBleedLine, (lEngBleed && lPressSource) || xFlowFromLeft);
                this.toggleLineActive(this.bleedIsolateLeftLine, xFlowFromLeft || xFlowFromRight);
                this.toggleLineActive(this.bleedIsolateRightLine, xFlowFromLeft || xFlowFromRight);
                this.toggleLineActive(this.rightRearBleedLine, (rEngBleed && rPressSource && heatExchange && !acmValve) || (rEngBleed && bleedIsolate && lPressSource));
                this.toggleLineActive(this.rightFrontBleedLine, (rEngBleed && rPressSource && heatExchange && !acmValve) || (rEngBleed && bleedIsolate && lPressSource));
                this.lEngineBleedValve.set((lEngBleed && lPressSource) || xFlowFromLeft);
                this.bleedIsolateValve.set(xFlowFromLeft || xFlowFromRight);
                this.rEngineBleedValve.set((rEngBleed && rPressSource && heatExchange && !acmValve) || (rEngBleed && bleedIsolate && lPressSource));
            }, bleedAir.getValve(BleedValvePosition.LeftPressureSource).isActive, bleedAir.getValve(BleedValvePosition.LeftPressureHeatExchange).isActive, bleedAir.getValve(BleedValvePosition.RightPressureSource).isActive, bleedAir.getLine(BleedLine.Acm).isActive, bleedAir.getLine(BleedLine.HeatExchange).isActive, bleedAir.getValve(BleedValvePosition.LeftPressureACM).isActive, bleedAir.leftCheckValve.isActive, bleedAir.rightCheckValve.isActive, bleedAir.getValve(BleedValvePosition.APU).isActive, bleedAir.getValve(BleedValvePosition.BleedIsolate).isActive);
            msfsSdk.MappedSubject.create(([apuBleed, acm, heatExchange, heatToAcm, heatToSupply]) => {
                this.toggleLineActive(this.apuRearLine, apuBleed && (acm || heatExchange));
                this.toggleLineActive(this.apuLine, apuBleed && (acm || heatExchange));
                this.toggleLineActive(this.pressureToHeatExchangeLine, heatExchange && (heatToAcm || heatToSupply));
                this.toggleLineActive(this.heatExchanger, heatExchange && (heatToAcm || heatToSupply));
                this.toggleLineActive(this.acmToSupplyLine, acm);
                this.toggleLineActive(this.heatExchangeToSupplyLine, heatExchange && heatToSupply);
                this.toggleLineActive(this.acm, acm);
                this.toggleLineActive(this.heatExchangeToAcmLine, heatExchange && heatToAcm && acm);
                this.apuValve.set(apuBleed && (acm || heatExchange));
            }, bleedAir.getValve(BleedValvePosition.APU).isActive, bleedAir.getLine(BleedLine.Acm).isActive, bleedAir.getLine(BleedLine.HeatExchange).isActive, bleedAir.getValve(BleedValvePosition.HeatExchangeACM).isActive, bleedAir.getValve(BleedValvePosition.HeatExchangeAirSupply).isActive);
            this.props.bleedAir.getLine(BleedLine.Acm).isActive.sub(this.toggleLineActive.bind(this, this.acm), true);
            const supplyIsActive = msfsSdk.MappedSubject.create(this.props.bleedAir.getLine(BleedLine.Acm).isActive, this.props.bleedAir.getLine(BleedLine.HeatExchangeToSupply).isActive)
                .map(v => v[0] || v[1]);
            supplyIsActive.sub(this.toggleLineActive.bind(this, this.supplyToTempLine), true);
            supplyIsActive.sub(this.toggleLineActive.bind(this, this.supplyToTemp2Line), true);
            this.props.ecs.recircPercentOpen.sub(pct => {
                if (pct === 1) {
                    this.recircStartLine.instance.classList.add('active');
                    this.recircEndLine.instance.classList.add('active');
                    this.recircArrow.instance.classList.add('active');
                }
                else {
                    this.recircStartLine.instance.classList.remove('active');
                    this.recircEndLine.instance.classList.remove('active');
                    this.recircArrow.instance.classList.remove('active');
                }
            }, true);
        }
        /**
         * Toggles the active state of a bleed line in the diagram.
         * @param ref The ref to toggle.
         * @param isActive Whether or not the line is active.
         */
        toggleLineActive(ref, isActive) {
            if (isActive) {
                ref.instance.classList.add('active');
            }
            else {
                ref.instance.classList.remove('active');
            }
        }
        /**
         * Gets a subscribable representing the amount the valve is open.
         * @param valve The valve to get.
         * @returns A subscribable from 0 (closed) to 1 (open).
         */
        getValveOpen(valve) {
            return this.props.bleedAir.getValve(valve).percentOpen;
        }
        /**
         * Gets a subscribable representing if the valve is active.
         * @param valve The valve to get.
         * @returns A subscribable representing if the valve is active.
         */
        getValveActive(valve) {
            return this.props.bleedAir.getValve(valve).isActive;
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-ecs-container' },
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/ecs-airplane.png`, class: "synoptics-ecs-graphics-airplane" }),
                msfsSdk.FSComponent.buildComponent("svg", { width: "495", height: "748", viewBox: "0 0 495 748", class: 'synoptics-ecs-graphics' },
                    msfsSdk.FSComponent.buildComponent("g", null,
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 238.32282,248.54525 h -94.4071 v 134.09417", "dev-name": "leftPressureToAcm", class: "ecs-bleed-lines", ref: this.leftPressureToAcmLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 114.25064,435.35507 H 188.811", "dev-name": "bleedIsolateLeft", class: "ecs-bleed-lines", ref: this.bleedIsolateLeftLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 206.85379,560.01281 V 451.591 c 0,0 -13.42946,-5.20994 -13.42946,-16.635 0,-11.42507 13.42946,-16.441 13.42946,-16.441 v -34.07162", "dev-name": "apuBleed", class: "ecs-bleed-lines", ref: this.apuLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 264.17955,383.24074 V 327.67497", "dev-name": "heatExchanger", class: "ecs-bleed-lines", ref: this.pressureToHeatExchangeLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 264.17955,353.24074 V 257.67497", "dev-name": "heatExchangerToAcm", class: "ecs-bleed-lines", ref: this.heatExchangeToAcmLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 113.85,437.62992 0,80.14173", "dev-name": "leftEngineBleedFront", class: "ecs-bleed-lines", ref: this.leftFrontBleedLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 113.84976,539.18284 v 19.64309 H 71.957859", "dev-name": "leftEngineBleedBack", class: "ecs-bleed-lines", ref: this.leftRearBleedLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 113.84976,432.88383 V 383.0403 h 27.2", "dev-name": "leftPressureSource", class: "ecs-bleed-lines", ref: this.leftPressureLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 141,383 h 6.5", "dev-name": "leftPressureSourceAcmJunc", class: "ecs-bleed-lines", ref: this.leftPressureAcmJuncLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 147,383 h 57", "dev-name": "leftPressureSourceAcmToApu", class: "ecs-bleed-lines", ref: this.leftPressureAcmToApuLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 210,383 h 14", "dev-name": "leftPressureSourceApuJunc", class: "ecs-bleed-lines", ref: this.leftPressureApuLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 204,383 h 6", "dev-name": "leftPressureSourceApu", class: "ecs-bleed-lines", ref: this.leftPressureApuJuncLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 247.75,383 h 14", "dev-name": "pressureValveToExch", class: "ecs-bleed-lines", ref: this.rightPressureValveToExchLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 261,383 h 6", "dev-name": "pressureValveExchJunc", class: "ecs-bleed-lines", ref: this.rightPressureJuncLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 267,382.83986 H 387 V 432.276", "dev-name": "rightPressureSource", class: "ecs-bleed-lines", ref: this.rightPressureLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 387.00094,437.52693 v 89.59655", "dev-name": "rightEngineBleedFront", class: "ecs-bleed-lines", ref: this.rightFrontBleedLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 387.00094,540.9868 0,17.63869 h 39.73522", "dev-name": "rightEngineBleedBack", class: "ecs-bleed-lines", ref: this.rightRearBleedLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 206.85354,589.09233 v 57.72664", "dev-name": "apuLineBack", class: "ecs-bleed-lines", ref: this.apuRearLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 264.37999,263.42176 V 196.8318", "dev-name": "acmToSupply", class: "ecs-bleed-lines", ref: this.acmToSupplyLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 180.99707,80.175887 V 195.42872 h 170.57419 v -21.44704", "dev-name": "supplyToTemp", class: "ecs-bleed-lines", ref: this.supplyToTempLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 368.80908,102.22426 v 48.10553", "dev-name": "supplyToTemp2", class: "ecs-bleed-lines", ref: this.supplyToTemp2Line }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 96.611944,41.090142 H 86.990838", "dev-name": "recircStart", class: "ecs-bleed-lines", ref: this.recircStartLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 51.513007,41.491022 H 26.658482 V 220.08281 H 248.74569", "dev-name": "recircEnd", class: "ecs-bleed-lines", ref: this.recircEndLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 198.938,434.95419 H 384.24294", "dev-name": "bleedIsolateRight", class: "ecs-bleed-lines", ref: this.bleedIsolateRightLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 321.90619,340.74752 h 63.33895 V 176.38695", "dev-name": "heatExchangerToSupply", class: "ecs-bleed-lines", ref: this.heatExchangeToSupplyLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 248.59843,212.31496 14.55772,8.40491 -14.85609,8.57716 z", "dev-name": "recircArrow", class: "ecs-arrow", ref: this.recircArrow }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 114.00094,432.52693 v 6", "dev-name": "lEngJunc", class: "ecs-bleed-lines", ref: this.leftEngJuncLine }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 387.00094,431.52693 v 6.5", "dev-name": "rEngJunc", class: "ecs-bleed-lines", ref: this.rightEngJuncLine }))),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/engine.png`, class: "synoptics-ecs-graphics-engine-left" }),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/apu.png`, class: "synoptics-ecs-graphics-apu" }),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/engine.png`, class: "synoptics-ecs-graphics-engine-right" }),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-ecs-labels' },
                    msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-ecs-apu-label' }, "APU"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'left: 124px; bottom: 206px; width: 80px;' }, "L ENG BLEED"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'right: 124px; bottom: 206px; width: 80px;' }, "R ENG BLEED"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'right: 200px; bottom: 140px; width: 60px;' }, "APU ECS BLEED"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'right: 166px; bottom: 250px; width: 80px;' }, "BLEED ISOLATE"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'left: 16px; bottom: 320px; width: 80px;' }, "L PRESS SOURCE"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'right: 10px; bottom: 320px; width: 80px;' }, "R PRESS SOURCE"),
                    msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-ecs-heat-exchg', ref: this.heatExchanger }, "HEAT EXCHG"),
                    msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-ecs-acm', ref: this.acm }, "ACM"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'left: 40px; top: 160px; width: 80px;' }, "RECIRC FAN"),
                    msfsSdk.FSComponent.buildComponent("div", { style: 'left: 64px; top: 196px; width: 30px; color: #5ee;' }, this.props.ecs.recircFanSpeed),
                    msfsSdk.FSComponent.buildComponent(SupplyTempGauge, { class: 'ecs-left-supply', temp: this.props.ecs.leftSupplyTemp, units: this.settings.getSetting('temperatureControlUnits') }),
                    msfsSdk.FSComponent.buildComponent(SupplyTempGauge, { class: 'ecs-right-supply', temp: this.props.ecs.rightSupplyTemp, units: this.settings.getSetting('temperatureControlUnits') }),
                    msfsSdk.FSComponent.buildComponent(EnviroTempGauge, { class: 'ecs-cabin-enviro', selectedTemp: this.props.ecs.cabinSetTemp, currentTemp: this.props.ecs.cabinTemp.value, units: this.settings.getSetting('temperatureControlUnits') }),
                    msfsSdk.FSComponent.buildComponent(EnviroTempGauge, { class: 'ecs-cockpit-enviro', selectedTemp: this.props.ecs.cockpitSetTemp, currentTemp: this.props.ecs.cockpitTemp.value, units: this.settings.getSetting('temperatureControlUnits') })),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-ecs-valves' },
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-leng-bleed', percentOpen: this.getValveOpen(BleedValvePosition.LeftEngine), isActive: this.lEngineBleedValve }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-apu-bleed', percentOpen: this.getValveOpen(BleedValvePosition.APU), isActive: this.apuValve }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-reng-bleed', percentOpen: this.getValveOpen(BleedValvePosition.RightEngine), isActive: this.rEngineBleedValve }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-lpress-source', percentOpen: this.getValveOpen(BleedValvePosition.LeftPressureSource), isActive: this.lEnginePressSourceValve }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-bleed-isolate', horizontal: true, percentOpen: this.getValveOpen(BleedValvePosition.BleedIsolate), isActive: this.bleedIsolateValve }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-rpress-source', percentOpen: this.getValveOpen(BleedValvePosition.RightPressureSource), isActive: this.rEnginePressSourceValve }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-lpress-heat-exchg', horizontal: true, percentOpen: this.getValveOpen(BleedValvePosition.LeftPressureHeatExchange), isActive: this.ecsXFlowValve }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-lpress-acm', percentOpen: this.getValveOpen(BleedValvePosition.LeftPressureACM), isActive: this.getValveActive(BleedValvePosition.LeftPressureACM) }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-heat-exchg-acm', percentOpen: this.getValveOpen(BleedValvePosition.HeatExchangeACM), isActive: this.getValveActive(BleedValvePosition.HeatExchangeACM) }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-heat-exchg-supply', percentOpen: this.getValveOpen(BleedValvePosition.HeatExchangeAirSupply), isActive: this.getValveActive(BleedValvePosition.HeatExchangeAirSupply) }),
                    msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'ecs-valve-recirc', horizontal: true, percentOpen: this.props.ecs.recircPercentOpen, isActive: this.props.ecs.recircPercentOpen.map(p => p === 1) }),
                    msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'ecs-fan-recirc', isActive: this.props.ecs.recircFanSpeed.map(speed => speed === RecircFanSpeed.Low || speed === RecircFanSpeed.High) }))));
        }
    }
    /**
     * A gauge that displays the current ECS supply temperature.
     */
    class SupplyTempGauge extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.formatter = msfsSdk.NumberFormatter.create({ precision: 1 });
            this.displayTemp = msfsSdk.MappedSubject.create(([temp, units]) => this.formatTemp(temp, units), this.props.temp, this.props.units);
        }
        /**
         * Formats a temperature.
         * @param temp The temp to format.
         * @param units The units to display in.
         * @returns A formatted string.
         */
        formatTemp(temp, units) {
            if (units === EcsTemperatureUnits.Fahrenheit) {
                return this.formatter(msfsSdk.UnitType.CELSIUS.convertTo(temp, msfsSdk.UnitType.FAHRENHEIT));
            }
            return this.formatter(temp);
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: `synoptics-ecs-supply ${this.props.class}` },
                msfsSdk.FSComponent.buildComponent("span", { class: 'synoptics-ecs-supply-label' }, "SUPPLY"),
                msfsSdk.FSComponent.buildComponent("span", { class: 'synoptics-ecs-supply-temp' }, this.displayTemp),
                msfsSdk.FSComponent.buildComponent("span", { class: 'synoptics-ecs-supply-unit' }, this.props.units.map(u => u === EcsTemperatureUnits.Celsius ? '°C' : '°F'))));
        }
    }
    /**
     * A gauge that displays the current environment temperatures.
     */
    class EnviroTempGauge extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.formatter = msfsSdk.NumberFormatter.create({ precision: 1 });
            this.displaySelectedTemp = msfsSdk.MappedSubject.create(([temp, units]) => this.formatTemp(temp, units), this.props.selectedTemp, this.props.units);
            this.displayCurrentTemp = msfsSdk.MappedSubject.create(([temp, units]) => this.formatTemp(temp, units), this.props.currentTemp, this.props.units);
            this.displayUnits = this.props.units.map(u => u === EcsTemperatureUnits.Celsius ? '°C' : '°F');
        }
        /**
         * Formats a temperature.
         * @param temp The temp to format.
         * @param units The units to display in.
         * @returns A formatted string.
         */
        formatTemp(temp, units) {
            if (units === EcsTemperatureUnits.Fahrenheit) {
                return this.formatter(msfsSdk.UnitType.CELSIUS.convertTo(temp, msfsSdk.UnitType.FAHRENHEIT));
            }
            return this.formatter(temp);
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: `synoptics-ecs-enviro ${this.props.class}` },
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-ecs-enviro-row' },
                    msfsSdk.FSComponent.buildComponent("span", { class: 'synoptics-ecs-enviro-label' }, "SEL"),
                    msfsSdk.FSComponent.buildComponent("span", { class: 'synoptics-ecs-enviro-seltemp' }, this.displaySelectedTemp),
                    msfsSdk.FSComponent.buildComponent("span", { class: 'synoptics-ecs-enviro-unit' }, this.displayUnits)),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-ecs-enviro-row' },
                    msfsSdk.FSComponent.buildComponent("span", { class: 'synoptics-ecs-enviro-label' }, "CUR"),
                    msfsSdk.FSComponent.buildComponent("span", { class: 'synoptics-ecs-enviro-currtemp' }, this.displayCurrentTemp),
                    msfsSdk.FSComponent.buildComponent("span", { class: 'synoptics-ecs-enviro-unit' }, this.displayUnits))));
        }
    }

    /**
     * A component that displays a synoptic numeric value.
     */
    class ValueDisplay extends msfsSdk.DisplayComponent {
        constructor() {
            var _a;
            super(...arguments);
            this.value = this.props.value.map(SynopticNumberFormatter.create((_a = this.props.precision) !== null && _a !== void 0 ? _a : 1));
            this.el = msfsSdk.FSComponent.createRef();
        }
        /** @inheritdoc */
        onAfterRender() {
            if (this.props.warningRange !== undefined) {
                const warningRange = this.props.warningRange;
                this.value.sub(val => {
                    const num = parseFloat(val);
                    if (num >= warningRange.low && num <= warningRange.high) {
                        this.el.instance.classList.add('warning');
                    }
                    else {
                        this.el.instance.classList.remove('warning');
                    }
                });
            }
        }
        /** @inheritdoc */
        render() {
            var _a;
            return (msfsSdk.FSComponent.buildComponent("span", { class: `syn-value-display ${(_a = this.props.class) !== null && _a !== void 0 ? _a : ''}`, ref: this.el }, this.value));
        }
    }

    /**
     * The Longitude electrical synoptics pane.
     */
    class ElectricalSynopticsPane extends msfsWtg3000Common.DisplayPaneView {
        constructor() {
            super(...arguments);
            this.title = msfsSdk.Subject.create('Electrical');
            this.lGenActive = msfsSdk.MappedSubject.create(([a, b]) => (a || b) ? 'active' : '', this.props.electrical.leftGenerator.isAvailable, this.props.electrical.leftGenerator.isConnected);
            this.rGenActive = msfsSdk.MappedSubject.create(([a, b]) => (a || b) ? 'active' : '', this.props.electrical.rightGenerator.isAvailable, this.props.electrical.rightGenerator.isConnected);
            this.apuGenActive = msfsSdk.MappedSubject.create(([a, b]) => (a || b) ? 'active' : '', this.props.electrical.apuGenerator.isAvailable, this.props.electrical.apuGenerator.isConnected);
            this.hydGenActive = this.props.electrical.hydraulicGenerator.isAvailable.map(a => a ? 'active' : '');
            this.extPowerActive = this.props.electrical.extPowerConn.map(a => a ? 'active' : '');
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-electrical' },
                msfsSdk.FSComponent.buildComponent("svg", { width: "495", height: "748", viewBox: "0 0 495 748" },
                    msfsSdk.FSComponent.buildComponent("g", { id: "graphics" },
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 28,23 h 125 c 0,0 7,1 7,15 0,13 -7,14 -7,14 H 28 c 0,0 -8,-1 -8,-14 0,-14 8,-15 8,-15 z", id: "l-main-box", active: this.props.electrical.lMainBus.isActive }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 50.5,117 h 157 c 0,0 9,1 9,15 0,13 -9,14 -9,14 h -157 c 0,0 -10,-1 -10,-14 0,-14 10,-15 10,-15 z", id: "l-mission-box", active: this.props.electrical.lMissionBus.isActive }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 38.5,504 h 157 c 0,0 9,1 9,15 0,13 -9,14 -9,14 h -157 c 0,0 -10,-1 -10,-14 0,-14 10,-15 10,-15 z", id: "l-emer-box", active: this.props.electrical.lEmerBus.isActive }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 300.5,504 h 157 c 0,0 9,1 9,15 0,13 -9,14 -9,14 h -157 c 0,0 -10,-1 -10,-14 0,-14 10,-15 10,-15 z", id: "r-emer-box", active: this.props.electrical.rEmerBus.isActive }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 283.5,117 h 157 c 0,0 9,1 9,15 0,13 -9,14 -9,14 h -157 c 0,0 -10,-1 -10,-14 0,-14 10,-15 10,-15 z", id: "r-mission-box", active: this.props.electrical.rMissionBus.isActive }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 344.5,23 h 125 c 0,0 7,1 7,15 0,13 -7,14 -7,14 h -125 c 0,0 -8,-1 -8,-14 0,-14 8,-15 8,-15 z", id: "r-main-box", active: this.props.electrical.rMainBus.isActive }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 181.5,23 h 51 c 0,0 7,1 7,15 0,13 -7,14 -7,14 h -51 c 0,0 -8,-1 -8,-14 0,-14 8,-15 8,-15 z", id: "l-int-1-box", active: this.props.electrical.lInt1Bus.isActive }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 267.5,23 h 51 c 0,0 7,1 7,15 0,13 -7,14 -7,14 h -51 c 0,0 -8,-1 -8,-14 0,-14 8,-15 8,-15 z", id: "r-int-1-box", active: this.props.electrical.rInt1Bus.isActive }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 267,201 h 51 c 0,0 7,1 7,15 0,13 -7,14 -7,14 h -51 c 0,0 -8,-1 -8,-14 0,-14 8,-15 8,-15 z", id: "r-int-2-box", active: this.props.electrical.rInt2Bus.isActive }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 334,577 h 71 c 0,0 7,1 7,15 0,13 -7,14 -7,14 h -71 c 0,0 -8,-1 -8,-14 0,-14 8,-15 8,-15 z", id: "service-box", class: this.extPowerActive }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { d: "m 181.5,201 h 51 c 0,0 7,1 7,15 0,13 -7,14 -7,14 h -51 c 0,0 -8,-1 -8,-14 0,-14 8,-15 8,-15 z", id: "l-int-2-box", active: this.props.electrical.lInt2Bus.isActive }),
                        msfsSdk.FSComponent.buildComponent("circle", { id: "l-gen-circle", cx: "80", cy: "272", r: "25", class: this.lGenActive }),
                        msfsSdk.FSComponent.buildComponent("rect", { id: "l-gen-data-box", width: "73", height: "49", x: "43", y: "197", class: this.lGenActive }),
                        msfsSdk.FSComponent.buildComponent("circle", { id: "apu-gen-circle", cx: "64", cy: "688", r: "25", class: this.apuGenActive }),
                        msfsSdk.FSComponent.buildComponent("circle", { id: "ext-power-circle", cx: "435", cy: "658", r: "25", class: this.extPowerActive }),
                        msfsSdk.FSComponent.buildComponent("rect", { id: "apu-gen-data-box", width: "73", height: "49", x: "27", y: "613", class: this.apuGenActive }),
                        msfsSdk.FSComponent.buildComponent("rect", { id: "l-batt-data-box", width: "116.5", height: "113", x: "119.5", y: "613", class: "synoptic-electrical-batt" }),
                        msfsSdk.FSComponent.buildComponent("rect", { id: "r-batt-data-box", width: "116.5", height: "113", x: "262.75", y: "613", class: "synoptic-electrical-batt" }),
                        msfsSdk.FSComponent.buildComponent("circle", { id: "r-gen-circle", cx: "418.5", cy: "272", r: "25", class: this.rGenActive }),
                        msfsSdk.FSComponent.buildComponent("circle", { id: "hyd-gen-circle", cx: "305", cy: "398", r: "25", class: this.hydGenActive }),
                        msfsSdk.FSComponent.buildComponent("rect", { id: "r-gen-data-box", width: "73", height: "49", x: "381.5", y: "197", class: this.rGenActive }),
                        msfsSdk.FSComponent.buildComponent("rect", { id: "hyd-gen-data-box", width: "73", height: "49", x: "268.5", y: "423", class: this.hydGenActive })),
                    msfsSdk.FSComponent.buildComponent("g", { id: "connections" },
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 326,591 h -18", id: "r-service-batt-conn", class: "synoptic-electrical-graphics" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 305,473 v 30", id: "hyd-gen-r-emer-conn", class: "synoptic-electrical-graphics" }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "l-main-mission-conn", d: "M 87,116 V 99 c -1.840551,0 -3,-1.566929 -3,-3 0,-1.59252 1.283465,-3 3,-3 1.822835,0 3,1.372047 3,3 0,1.521654 -1.194882,3 -3,3 v 3 m 0,-49 v 13 c -1.840551,0 -3,1.566929 -3,3 0,1.59252 1.283465,3 3,3 1.822835,0 3,-1.372047 3,-3 0,-1.521654 -1.194882,-3 -3,-3 v -3", connected: this.props.electrical.lMainMissionConn.isConnected, active: this.props.electrical.lMainMissionConn.isActive, x: 92, y: 66, dir: 'right' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "l-emer-apu-conn", d: "m 64,612 v -31.5 c -1.840551,0 -3,-1.56693 -3,-3 0,-1.59252 1.283465,-3 3,-3 1.822835,0 3,1.37205 3,3 0,1.52165 -1.194882,3 -3,3 v 3 M 64,534 v 13.5 c -1.840551,0 -3,1.56693 -3,3 0,1.59252 1.283465,3 3,3 1.822835,0 3,-1.37205 3,-3 0,-1.52165 -1.194882,-3 -3,-3 v -3", connected: this.props.electrical.apuGenerator.isConnected, active: this.props.electrical.apuGenerator.isConnected, x: 70, y: 548, dir: 'right' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "r-emer-service-conn", d: "m 308,612 v -31 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28346,-3 3,-3 1.82283,0 3,1.37205 3,3 0,1.52165 -1.19488,3 -3,3 v 3 m 0,-50 v 14 c -1.84055,0 -3,1.56693 -3,3 0,1.59252 1.28346,3 3,3 1.82283,0 3,-1.37205 3,-3 0,-1.52165 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.rightBattery.isConnected, active: this.props.electrical.rightBattery.isConnected, x: 302, y: 548, dir: 'left' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "r-emer-service-ext-conn", d: "m 434,590 v -9 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28346,-3 3,-3 1.82283,0 3,1.37205 3,3 0,1.52165 -1.19488,3 -3,3 v 3 m 0,-50 v 14 c -1.84055,0 -3,1.56693 -3,3 0,1.59252 1.28346,3 3,3 1.82283,0 3,-1.37205 3,-3 0,-1.52165 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.extPowerConn, active: this.props.electrical.extPowerConn, x: 428, y: 548, dir: 'left' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "l-emer-batt-conn", d: "m 187,612 v -31 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28346,-3 3,-3 1.82283,0 3,1.37205 3,3 0,1.52165 -1.19488,3 -3,3 v 3 m 0,-50 v 14 c -1.84055,0 -3,1.56693 -3,3 0,1.59252 1.28346,3 3,3 1.82283,0 3,-1.37205 3,-3 0,-1.52165 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.leftBattery.isConnected, active: this.props.electrical.leftBattery.isConnected, x: 193, y: 548, dir: 'right' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "bus-tie-conn", d: "m 290,519 h -24 c 0.0292,1.84032 -1.56711,2.97726 -3,3 -1.59232,0.0253 -2.97276,-1.28368 -3,-3 -0.029,-1.8226 1.37226,-2.97416 3,-3 1.52146,-0.0242 2.97135,1.19511 3,3 h 2 m -63,0 h 27 c 0.0292,1.84032 1.56711,3.02274 3,3 1.59233,-0.0253 3.02725,-1.28368 3,-3 -0.029,-1.8226 -1.37225,-3.02584 -3,-3 -1.52146,0.0241 -3.02866,1.19511 -3,3 h -2", connected: this.props.electrical.busTieConn.isConnected, active: this.props.electrical.busTieConn.isActive, x: 232, y: 512, dir: 'top' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "l-mission-emer-conn", d: "M 145,503 V 288.5 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28346,-3 3,-3 1.82283,0 3,1.37205 3,3 0,1.52165 -1.19488,3 -3,3 v 3 M 145,147 v 108.5 c -1.84055,0 -3,1.56693 -3,3 0,1.59252 1.28346,3 3,3 1.82283,0 3,-1.37205 3,-3 0,-1.52165 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.lMissionEmerConn.isConnected, active: this.props.electrical.lMissionEmerConn.isActive, x: 151, y: 255, dir: 'right' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "r-mission-emer-conn", d: "M 354,502.5 V 288 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28346,-3 3,-3 1.82283,0 3,1.37205 3,3 0,1.52165 -1.19488,3 -3,3 v 3 m 0,-144.5 V 255 c -1.84055,0 -3,1.56693 -3,3 0,1.59252 1.28346,3 3,3 1.82283,0 3,-1.37205 3,-3 0,-1.52165 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.rMissionEmerConn.isConnected, active: this.props.electrical.rMissionEmerConn.isActive, x: 348, y: 255, dir: 'left' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "l-mission-gen-conn", d: "m 87,196 v -6 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28347,-3 3,-3 1.82283,0 3,1.37205 3,3 0,1.52165 -1.19488,3 -3,3 v 3 m 0,-46 v 10 c -1.84055,0 -3,1.56693 -3,3 0,1.59252 1.28347,3 3,3 1.82283,0 3,-1.37205 3,-3 0,-1.52165 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.leftGenerator.isConnected, active: this.props.electrical.leftGenerator.isConnected, x: 92, y: 156, dir: 'right' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "r-mission-gen-conn", d: "m 411,196 v -6 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28347,-3 3,-3 1.82283,0 3,1.37205 3,3 0,1.52165 -1.19488,3 -3,3 v 3 m 0,-46 v 10 c -1.84055,0 -3,1.56693 -3,3 0,1.59252 1.28347,3 3,3 1.82283,0 3,-1.37205 3,-3 0,-1.52165 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.rightGenerator.isConnected, active: this.props.electrical.rightGenerator.isConnected, x: 406, y: 156, dir: 'left' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "l-mission-int2-conn", d: "m 203,200 v -10 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28347,-3 3,-3 1.82283,0 3,1.37205 3,3 0,1.52165 -1.19488,3 -3,3 v 3 m 0,-46 v 10 c -1.84055,0 -3,1.56693 -3,3 0,1.59252 1.28347,3 3,3 1.82283,0 3,-1.37205 3,-3 0,-1.52165 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.lInt2MissionConn.isConnected, active: this.props.electrical.lInt2MissionConn.isActive, x: 207, y: 156, dir: 'right' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "r-mission-int2-conn", d: "m 295,200 v -10 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28347,-3 3,-3 1.82283,0 3,1.37205 3,3 0,1.52165 -1.19488,3 -3,3 v 3 m 0,-46 v 10 c -1.84055,0 -3,1.56693 -3,3 0,1.59252 1.28347,3 3,3 1.82283,0 3,-1.37205 3,-3 0,-1.52165 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.rInt2MissionConn.isConnected, active: this.props.electrical.rInt2MissionConn.isActive, x: 290, y: 156, dir: 'left' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "l-int1-mission-conn", d: "M 202,116 V 99 c -1.84055,0 -3,-1.566929 -3,-3 0,-1.59252 1.28346,-3 3,-3 1.82283,0 3,1.372047 3,3 0,1.521654 -1.19488,3 -3,3 v 3 m 0,-49 v 13 c -1.84055,0 -3,1.566929 -3,3 0,1.59252 1.28346,3 3,3 1.82283,0 3,-1.372047 3,-3 0,-1.521654 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.lInt1MissionConn.isConnected, active: this.props.electrical.lInt1MissionConn.isActive, x: 207, y: 66, dir: 'right' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "r-int1-mission-conn", d: "M 295,116 V 99 c -1.84055,0 -3,-1.566929 -3,-3 0,-1.59252 1.28346,-3 3,-3 1.82283,0 3,1.372047 3,3 0,1.521654 -1.19488,3 -3,3 v 3 m 0,-49 v 13 c -1.84055,0 -3,1.566929 -3,3 0,1.59252 1.28346,3 3,3 1.82283,0 3,-1.372047 3,-3 0,-1.521654 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.rInt1MissionConn.isConnected, active: this.props.electrical.rInt1MissionConn.isActive, x: 290, y: 66, dir: 'left' }),
                        msfsSdk.FSComponent.buildComponent(ConnectionPath, { id: "r-main-mission-conn", d: "m 411,115.5 v -17 c -1.84055,0 -3,-1.56693 -3,-3 0,-1.59252 1.28346,-3 3,-3 1.82283,0 3,1.372047 3,3 0,1.52165 -1.19488,3 -3,3 v 3 m 0,-49 v 13 c -1.84055,0 -3,1.566929 -3,3 0,1.59252 1.28346,3 3,3 1.82283,0 3,-1.372047 3,-3 0,-1.521654 -1.19488,-3 -3,-3 v -3", connected: this.props.electrical.rMainMissionConn.isConnected, active: this.props.electrical.rMainMissionConn.isActive, x: 406, y: 66, dir: 'left' }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "m 413,591 h 21 v 41", id: "r-service-ext-conn", class: this.extPowerActive }))),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-electrical-labels' },
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 64px; top: 24px' }, "L MAIN"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 182px; top: 24px' }, "L INT 1"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 266px; top: 24px' }, "R INT 1"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 380px; top: 24px' }, "R MAIN"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 88px; top: 118px' }, "L MISSION"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 324px; top: 118px' }, "R MISSION"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 181px; top: 202px' }, "L INT 2"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 265px; top: 202px' }, "R INT 2"),
                    msfsSdk.FSComponent.buildComponent("label", { class: 'two-line', style: 'left: 63px; top: 252px; width: 34px' }, "L GEN"),
                    msfsSdk.FSComponent.buildComponent("label", { class: 'two-line', style: 'left: 401px; top: 252px; width: 34px' }, "R GEN"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 172px; top: 256px' }, "L ELEC"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 274px; top: 256px' }, "R ELEC"),
                    msfsSdk.FSComponent.buildComponent("label", { class: 'two-line', style: 'left: 288px; top: 381px; width: 34px' }, "HYD GEN"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 90px; top: 505px' }, "L EMER"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 218px; top: 476px' }, "BUS TIE"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 350px; top: 505px' }, "R EMER"),
                    msfsSdk.FSComponent.buildComponent("label", { style: 'left: 337px; top: 578px' }, "SERVICE"),
                    msfsSdk.FSComponent.buildComponent("label", { class: 'two-line', style: 'left: 46px; top: 670px; width: 34px' }, "APU GEN"),
                    msfsSdk.FSComponent.buildComponent("label", { class: 'two-line', style: 'left: 152px; top: 620px; width: 50px' }, "BATT LI-ION"),
                    msfsSdk.FSComponent.buildComponent("label", { class: 'two-line', style: 'left: 296px; top: 620px; width: 50px;' }, "BATT LI-ION"),
                    msfsSdk.FSComponent.buildComponent("label", { class: 'two-line', style: 'left: 418px; top: 640px; width: 34px;' }, "EXT PWR")),
                msfsSdk.FSComponent.buildComponent(BatteryValues, { battery: this.props.electrical.leftBattery, class: 'synoptics-electrical-left-batt' }),
                msfsSdk.FSComponent.buildComponent(BatteryValues, { battery: this.props.electrical.rightBattery, class: 'synoptics-electrical-right-batt' }),
                msfsSdk.FSComponent.buildComponent(GeneratorValues, { generator: this.props.electrical.leftGenerator, class: 'synoptics-electrical-left-gen' }),
                msfsSdk.FSComponent.buildComponent(GeneratorValues, { generator: this.props.electrical.rightGenerator, class: 'synoptics-electrical-right-gen' }),
                msfsSdk.FSComponent.buildComponent(GeneratorValues, { generator: this.props.electrical.apuGenerator, class: 'synoptics-electrical-apu-gen' }),
                msfsSdk.FSComponent.buildComponent(GeneratorValues, { generator: this.props.electrical.hydraulicGenerator, class: 'synoptics-electrical-hyd-gen' })));
        }
    }
    /**
     * A component that displays the battery status values.
     */
    class BatteryValues extends msfsSdk.DisplayComponent {
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: `synoptics-electrical-batt-values ${this.props.class}` },
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-electrical-batt-values-volts' },
                    msfsSdk.FSComponent.buildComponent("div", null,
                        msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.battery.voltage })),
                    msfsSdk.FSComponent.buildComponent("div", null, "V")),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-electrical-batt-values-amps' },
                    msfsSdk.FSComponent.buildComponent("div", null,
                        msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.battery.amps })),
                    msfsSdk.FSComponent.buildComponent("div", null, "A")),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-electrical-batt-values-temp' },
                    msfsSdk.FSComponent.buildComponent("div", null,
                        msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.battery.temp.value })),
                    msfsSdk.FSComponent.buildComponent("div", null, "\u00B0C"))));
        }
    }
    /**
     * A component that displays the generator status values.
     */
    class GeneratorValues extends msfsSdk.DisplayComponent {
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: `synoptics-electrical-gen-values ${this.props.class}` },
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-electrical-gen-values-volts' },
                    msfsSdk.FSComponent.buildComponent("div", null,
                        msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.generator.volts })),
                    msfsSdk.FSComponent.buildComponent("div", null, "V")),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptics-electrical-gen-values-load' },
                    msfsSdk.FSComponent.buildComponent("div", null,
                        msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.generator.loadPct })),
                    msfsSdk.FSComponent.buildComponent("div", null, "%"))));
        }
    }
    /**
     * A line for a bus connection on the synoptic.
     */
    class ConnectionPath extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.line = msfsSdk.FSComponent.createRef();
            this.connector = msfsSdk.FSComponent.createRef();
        }
        /** @inheritdoc */
        onAfterRender() {
            var _a;
            (_a = this.props.connected) === null || _a === void 0 ? void 0 : _a.sub(this.onUpdated.bind(this), true);
            this.props.active.sub(this.onUpdated.bind(this), true);
        }
        /**
         * Handles when the connection data is updated.
         */
        onUpdated() {
            var _a, _b;
            if (this.props.connected !== undefined) {
                if (this.props.connected.get()) {
                    this.connector.instance.classList.remove('disconnected');
                }
                else {
                    this.connector.instance.classList.add('disconnected');
                }
            }
            if (((_b = (_a = this.props.connected) === null || _a === void 0 ? void 0 : _a.get()) !== null && _b !== void 0 ? _b : true) && this.props.active.get()) {
                this.line.instance.classList.add('active');
                this.props.connected && this.connector.instance.classList.add('active');
            }
            else {
                this.line.instance.classList.remove('active');
                this.props.connected && this.connector.instance.classList.remove('active');
            }
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent(msfsSdk.FSComponent.Fragment, null,
                msfsSdk.FSComponent.buildComponent("path", { d: this.props.d, ref: this.line }),
                this.props.connected !== undefined && msfsSdk.FSComponent.buildComponent("path", { d: this.generateConnector(), ref: this.connector, class: `synoptics-connection-connector ${this.props.dir} disconnected` })));
        }
        /**
         * Generates a connector line.
         * @returns The connector line path string.
         */
        generateConnector() {
            switch (this.props.dir) {
                case 'left':
                case 'right':
                    return `M ${this.props.x} ${this.props.y} l 0 34`;
                case 'top':
                    return `M ${this.props.x} ${this.props.y} l 34 0`;
            }
        }
    }

    //For brake temp pointers, 0 is bottom 24px and 100% is 122px so 98 total px translation
    /**
     * A display pane view which displays the Flight Controls Synoptics Pane View.
     */
    class FlightControlsSynopticsPane extends msfsWtg3000Common.DisplayPaneView {
        constructor() {
            super(...arguments);
            this.title = msfsSdk.Subject.create('Flight Controls');
            this.spoilerLeftPct = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('spoilers_left_percent'), 0);
            this.spoilerRightPct = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('spoilers_right_percent'), 0);
            this.groundSpoilerLeftPct = msfsSdk.MappedSubject.create(([isActive, pct]) => isActive ? pct : 0, this.props.hydraulics.spoilerSystem.groundSpoilersOn, this.spoilerLeftPct);
            this.groundSpoilerRightPct = msfsSdk.MappedSubject.create(([isActive, pct]) => isActive ? pct : 0, this.props.hydraulics.spoilerSystem.groundSpoilersOn, this.spoilerRightPct);
            this.aileronLeftPct = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('aileron_left_percent'), 0);
            this.aileronRightPct = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('aileron_right_percent'), 0);
            this.elevatorPct = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('elevator_percent'), 0);
            this.rudderPct = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('rudder_percent'), 0);
            this.flapsLeftPct = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('flaps_left_percent'), 0);
            this.flapsRightPct = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('flaps_right_percent'), 0);
            this.flapsAngle = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('flaps_left_percent'), 0);
            this.flapsHandleIndex = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('flaps_handle_index'), 0);
            this.elevatorLeftRef = msfsSdk.FSComponent.createRef();
            this.elevatorRightRef = msfsSdk.FSComponent.createRef();
            this.rudderRef = msfsSdk.FSComponent.createRef();
            this.aileronLeftRef = msfsSdk.FSComponent.createRef();
            this.aileronRightRef = msfsSdk.FSComponent.createRef();
            this.rollSpoilerOutboardLeftRef = msfsSdk.FSComponent.createRef();
            this.rollSpoilerOutboardRightRef = msfsSdk.FSComponent.createRef();
            this.rollSpoilerInboardRightRef = msfsSdk.FSComponent.createRef();
            this.rollSpoilerInboardLeftRef = msfsSdk.FSComponent.createRef();
            this.groundSpoilerLeftRef = msfsSdk.FSComponent.createRef();
            this.groundSpoilerRightRef = msfsSdk.FSComponent.createRef();
            this.flapsLeftOutboardRef = msfsSdk.FSComponent.createRef();
            this.flapsLeftInboardRef = msfsSdk.FSComponent.createRef();
            this.flapsRightOutboardRef = msfsSdk.FSComponent.createRef();
            this.flapsRightInboardRef = msfsSdk.FSComponent.createRef();
            this.flapsNeedleRef = msfsSdk.FSComponent.createRef();
            this.flapsSelectBugRef = msfsSdk.FSComponent.createRef();
            this.outboardLeftPointerRef = msfsSdk.FSComponent.createRef();
            this.inboardLeftPointerRef = msfsSdk.FSComponent.createRef();
            this.outboardRightPointerRef = msfsSdk.FSComponent.createRef();
            this.inboardRightPointerRef = msfsSdk.FSComponent.createRef();
        }
        /** @inheritdoc */
        onAfterRender(node) {
            super.onAfterRender(node);
            this.spoilerLeftPct.sub(this.onRollSpoilerLeftChange.bind(this), true);
            this.spoilerRightPct.sub(this.onRollSpoilerRightChange.bind(this), true);
            this.groundSpoilerLeftPct.sub(this.onGroundSpoilerLeftChange.bind(this), true);
            this.groundSpoilerRightPct.sub(this.onGroundSpoilerRightChange.bind(this), true);
            this.aileronLeftPct.sub(this.onAileronLeftChange.bind(this), true);
            this.aileronRightPct.sub(this.onAileronRightChange.bind(this), true);
            this.elevatorPct.sub(this.onElevatorChange.bind(this), true);
            this.rudderPct.sub(this.onRudderChange.bind(this), true);
            this.flapsLeftPct.sub(this.onFlapsLeftChange.bind(this), true);
            this.flapsRightPct.sub(this.onFlapsRightChange.bind(this), true);
            this.flapsAngle.sub(this.onFlapsPointer.bind(this), true);
            this.flapsHandleIndex.sub(this.onFlapsHandle.bind(this), true);
            this.props.hydraulics.brakeSystem.outboardLeftBrakeTemp.value.sub(this.onOutboardLeftBrakeTemp.bind(this), true);
            this.props.hydraulics.brakeSystem.inboardLeftBrakeTemp.value.sub(this.onInboardLeftBrakeTemp.bind(this), true);
            this.props.hydraulics.brakeSystem.outboardRightBrakeTemp.value.sub(this.onOutboardRightBrakeTemp.bind(this), true);
            this.props.hydraulics.brakeSystem.inboardRightBrakeTemp.value.sub(this.onInboardRightBrakeTemp.bind(this), true);
        }
        /**
         * When the elevator moves
         * @param percent The percentage of elevator deflection
         */
        onElevatorChange(percent) {
            this.elevatorLeftRef.instance.style.transform = `scaleY(${-(percent / 100)})`;
            this.elevatorRightRef.instance.style.transform = `scaleY(${-(percent / 100)})`;
        }
        /**
         * When the rudder moves
         * @param percent The percentage of rudder deflection
         */
        onRudderChange(percent) {
            this.rudderRef.instance.style.transform = `scaleX(${(percent / 300)})`;
        }
        /**
         * When the left aileron moves
         * @param percent The percentage of aileron deflection
         */
        onAileronLeftChange(percent) {
            this.aileronLeftRef.instance.style.transform = `scaleY(${(percent / 100)})`;
        }
        /**
         * When the right aileron moves
         * @param percent The percentage of aileron deflection
         */
        onAileronRightChange(percent) {
            this.aileronRightRef.instance.style.transform = `scaleY(${(-percent / 100)})`;
        }
        /**
         * When the left roll spoilers moves
         * @param percent The percentage of spoiler deflection
         */
        onRollSpoilerLeftChange(percent) {
            this.rollSpoilerOutboardLeftRef.instance.style.transform = `scaleY(${(-percent / 100)})`;
            this.rollSpoilerInboardLeftRef.instance.style.transform = `scaleY(${(-percent / 100)})`;
        }
        /**
         * When the right roll spoilers moves
         * @param percent The percentage of spoiler deflection
         */
        onRollSpoilerRightChange(percent) {
            this.rollSpoilerOutboardRightRef.instance.style.transform = `scaleY(${(-percent / 100)})`;
            this.rollSpoilerInboardRightRef.instance.style.transform = `scaleY(${(-percent / 100)})`;
        }
        /**
         * When the left ground spoiler moves
         * @param percent The percentage of spoiler deflection
         */
        onGroundSpoilerLeftChange(percent) {
            this.groundSpoilerLeftRef.instance.style.transform = `scaleY(${(-percent / 100)})`;
        }
        /**
         * When the right ground spoiler moves
         * @param percent The percentage of spoiler deflection
         */
        onGroundSpoilerRightChange(percent) {
            this.groundSpoilerRightRef.instance.style.transform = `scaleY(${(-percent / 100)})`;
        }
        /**
         * When the left flaps moves
         * @param percent The percentage of flaps deflection
         */
        onFlapsLeftChange(percent) {
            this.flapsLeftOutboardRef.instance.style.transform = `rotate(2.2deg) skew(2.2deg) scaleY(${percent / 100})`;
            this.flapsLeftInboardRef.instance.style.transform = `rotate(7.5deg) skew(7.5deg) scaleY(${percent / 100})`;
        }
        /**
         * When the left flaps moves
         * @param percent The percentage of flaps deflection
         */
        onFlapsRightChange(percent) {
            this.flapsRightOutboardRef.instance.style.transform = `rotate(-2.2deg) skew(-2.2deg) scaleY(${percent / 100})`;
            this.flapsRightInboardRef.instance.style.transform = `rotate(-7.5deg) skew(-7.5deg) scaleY(${percent / 100})`;
        }
        /**
         * Updates the flaps needle.
         * @param flapsAngle The value to update the needle to.
         */
        onFlapsPointer(flapsAngle) {
            const startAngle = 0;
            const endAngle = 77;
            const arc = endAngle - startAngle;
            if (flapsAngle <= 20) {
                flapsAngle *= 1.666;
            }
            else if (flapsAngle > 20 && flapsAngle <= 43) {
                flapsAngle *= 1.554;
            }
            else if (flapsAngle > 43 && flapsAngle < 100) {
                flapsAngle *= 1.554;
            }
            const rotation = startAngle + ((flapsAngle / 100) * arc);
            this.flapsNeedleRef.instance.style.transform = `rotate3d(0, 0, 1, ${msfsSdk.MathUtils.clamp(rotation, 0, 77)}deg)`; //Math utils hack for stopping the pointer from snapping because it is displaying the actual flaps angle.
        }
        /**
         * Updates the flaps selector bug.
         * @param handleIndex The flaps handle index.
         */
        onFlapsHandle(handleIndex) {
            const startAngle = -1;
            const endAngle = 78;
            const arc = endAngle - startAngle;
            const rotation = startAngle + ((handleIndex / 3) * arc);
            this.flapsSelectBugRef.instance.style.transform = `rotate3d(0, 0, 1, ${rotation}deg)`;
        }
        /**
         * When the left outboard brake temp changes
         * @param temp The temp of the brake
         */
        onOutboardLeftBrakeTemp(temp) {
            this.outboardLeftPointerRef.instance.style.transform = `translate3d(0px, ${-temp / 10}px, 0px`;
            if (temp > 450) {
                this.outboardLeftPointerRef.instance.classList.add('warning');
            }
            else {
                this.outboardLeftPointerRef.instance.classList.remove('warning');
            }
        }
        /**
         * When the left inboard brake temp changes
         * @param temp The temp of the brake
         */
        onInboardLeftBrakeTemp(temp) {
            this.inboardLeftPointerRef.instance.style.transform = `translate3d(0px, ${-temp / 10}px, 0px`;
            if (temp > 450) {
                this.inboardLeftPointerRef.instance.classList.add('warning');
            }
            else {
                this.inboardLeftPointerRef.instance.classList.remove('warning');
            }
        }
        /**
         * When the right outboard brake temp changes
         * @param temp The temp of the brake
         */
        onOutboardRightBrakeTemp(temp) {
            this.outboardRightPointerRef.instance.style.transform = `translate3d(0px, ${-temp / 10}px, 0px`;
            if (temp > 450) {
                this.outboardRightPointerRef.instance.classList.add('warning');
            }
            else {
                this.outboardRightPointerRef.instance.classList.remove('warning');
            }
        }
        /**
         * When the right inboard brake temp changes
         * @param temp The temp of the brake
         */
        onInboardRightBrakeTemp(temp) {
            this.inboardRightPointerRef.instance.style.transform = `translate3d(0px, ${-temp / 10}px, 0px`;
            if (temp > 450) {
                this.inboardRightPointerRef.instance.classList.add('warning');
            }
            else {
                this.inboardRightPointerRef.instance.classList.remove('warning');
            }
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: "flight-controls-synoptic-container" },
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-rudder-text-title" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-rudder-container" },
                        msfsSdk.FSComponent.buildComponent("div", null, "RUDDER"),
                        msfsSdk.FSComponent.buildComponent("div", null, "CONTROL A"))),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-elevator-left" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box", ref: this.elevatorLeftRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-elevator-right" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box", ref: this.elevatorRightRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-rudder" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box rudder-box", ref: this.rudderRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-aileron-left" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box", ref: this.aileronLeftRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-aileron-right" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box", ref: this.aileronRightRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-left-spoiler-outboard" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box tall-box", ref: this.rollSpoilerOutboardLeftRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-left-spoiler-center" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box tall-box", ref: this.rollSpoilerInboardLeftRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-left-spoiler-inboard" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box tall-box", ref: this.groundSpoilerLeftRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-right-spoiler-outboard" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box tall-box", ref: this.rollSpoilerOutboardRightRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-right-spoiler-center" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box tall-box", ref: this.rollSpoilerInboardRightRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-right-spoiler-inboard" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box tall-box", ref: this.groundSpoilerRightRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-left-flap-outboard" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box flap-box wide-box", ref: this.flapsLeftOutboardRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-left-flap-inboard" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box flap-box wide-box", ref: this.flapsLeftInboardRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-right-flap-outboard" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box flap-box wide-box", ref: this.flapsRightOutboardRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-right-flap-inboard" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-standard-box flap-box wide-box", ref: this.flapsRightInboardRef })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-flight-controls-image" },
                    msfsSdk.FSComponent.buildComponent("img", { height: "206px", width: "auto", src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/flightcontrols2.png` })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-flaps-gauge-container" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-flaps-title" }, "FLAPS"),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-flaps-2nd-container" },
                        msfsSdk.FSComponent.buildComponent("svg", null,
                            msfsSdk.FSComponent.buildComponent("path", { d: "M 205 127 a 42 42 0 0 0 34 -44", stroke: "white", "stroke-width": "2px" }),
                            msfsSdk.FSComponent.buildComponent("text", { x: "255", y: "87", "font-size": "12", fill: "white" }, "UP"),
                            msfsSdk.FSComponent.buildComponent("text", { x: "250", y: "114", "font-size": "12", fill: "white" }, "1"),
                            msfsSdk.FSComponent.buildComponent("text", { x: "232", y: "136", "font-size": "12", fill: "white" }, "2"),
                            msfsSdk.FSComponent.buildComponent("text", { x: "190", y: "150", "font-size": "12", fill: "white" }, "FULL")),
                        msfsSdk.FSComponent.buildComponent("div", { class: "fc-flaps-needle", ref: this.flapsNeedleRef },
                            msfsSdk.FSComponent.buildComponent("svg", { height: "8px", width: "47px" },
                                msfsSdk.FSComponent.buildComponent("path", { d: "M 6 0 c 10.5 -0.2 26.8 2.1 40 3.5 c 1 0 1 1 0 1 c -13.3 1.1 -28 2.5 -40 3.5 c -7 0 -7 -8 0 -8", fill: "white" }))),
                        msfsSdk.FSComponent.buildComponent("div", { class: "fc-flaps-cyan-carrot", ref: this.flapsSelectBugRef },
                            msfsSdk.FSComponent.buildComponent("svg", null,
                                msfsSdk.FSComponent.buildComponent("path", { d: "M 0 6 l 7.2 -4.8 l 0 1.6 l -4.8 3.2 l 4.8 3.2 l 0 1.6 l -7.2 -4.8", fill: "rgb(0,255,255)" }))))),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-gray-border" }),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-brakes-title" }, "BRAKES"),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-brakes-image-left" },
                    msfsSdk.FSComponent.buildComponent("img", { height: "99px", width: "auto", src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/braketruck2.png` })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-brakes-left brakes-container" },
                    msfsSdk.FSComponent.buildComponent("div", null, this.props.hydraulics.brakeSystem.outboardLeftBrakePsi.value.map(SynopticNumberFormatter.create(100, 0))),
                    msfsSdk.FSComponent.buildComponent("div", null, "PSI"),
                    msfsSdk.FSComponent.buildComponent("div", null, this.props.hydraulics.brakeSystem.inboardLeftBrakePsi.value.map(SynopticNumberFormatter.create(100, 0)))),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-brakes-image-right" },
                    msfsSdk.FSComponent.buildComponent("img", { height: "99px", width: "auto", src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/braketruck2.png` })),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-brakes-right brakes-container" },
                    msfsSdk.FSComponent.buildComponent("div", null, this.props.hydraulics.brakeSystem.outboardRightBrakePsi.value.map(SynopticNumberFormatter.create(100, 0))),
                    msfsSdk.FSComponent.buildComponent("div", null, "PSI"),
                    msfsSdk.FSComponent.buildComponent("div", null, this.props.hydraulics.brakeSystem.inboardRightBrakePsi.value.map(SynopticNumberFormatter.create(100, 0)))),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-brake-temps-left brake-temp-container" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "brake-temp-vertical-gauge" },
                        msfsSdk.FSComponent.buildComponent("div", null),
                        msfsSdk.FSComponent.buildComponent("div", null)),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-brake-temp-outboard-pointer", ref: this.outboardLeftPointerRef },
                        msfsSdk.FSComponent.buildComponent("svg", { height: "18px", width: "18px" },
                            msfsSdk.FSComponent.buildComponent("path", { d: "M 0 0 l 18 9 l -18 9 z", fill: "white" }))),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-brake-temp-inboard-pointer", ref: this.inboardLeftPointerRef },
                        msfsSdk.FSComponent.buildComponent("svg", { height: "18px", width: "18px" },
                            msfsSdk.FSComponent.buildComponent("path", { d: "M 0 9 l 18 -9 l 0 18 z", fill: "white" }))),
                    msfsSdk.FSComponent.buildComponent("div", { class: "brake-temp-row" },
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent("span", null,
                                msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.brakeSystem.outboardLeftBrakeTemp.value, warningRange: { low: 450, high: 1000 } }))),
                        msfsSdk.FSComponent.buildComponent("div", null, "\u00B0C"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent("span", null,
                                msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.brakeSystem.inboardLeftBrakeTemp.value, warningRange: { low: 450, high: 1000 } }))))),
                msfsSdk.FSComponent.buildComponent("div", { class: "fc-brake-temps-right brake-temp-container" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "brake-temp-vertical-gauge" },
                        msfsSdk.FSComponent.buildComponent("div", null),
                        msfsSdk.FSComponent.buildComponent("div", null)),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-brake-temp-outboard-pointer", ref: this.outboardRightPointerRef },
                        msfsSdk.FSComponent.buildComponent("svg", { height: "18px", width: "18px" },
                            msfsSdk.FSComponent.buildComponent("path", { d: "M 0 0 l 18 9 l -18 9 z", fill: "white" }))),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fc-brake-temp-inboard-pointer", ref: this.inboardRightPointerRef },
                        msfsSdk.FSComponent.buildComponent("svg", { height: "18px", width: "18px" },
                            msfsSdk.FSComponent.buildComponent("path", { d: "M 0 9 l 18 -9 l 0 18 z", fill: "white" }))),
                    msfsSdk.FSComponent.buildComponent("div", { class: "brake-temp-row" },
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent("span", null,
                                msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.brakeSystem.outboardRightBrakeTemp.value, warningRange: { low: 450, high: 1000 } }))),
                        msfsSdk.FSComponent.buildComponent("div", null, "\u00B0C"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent("span", null,
                                msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.brakeSystem.inboardRightBrakeTemp.value, warningRange: { low: 450, high: 1000 } })))))));
        }
    }

    /**
     * A publisher that publishes turbine events for the Longitude.
     */
    class LongitudeTurbinePublisher extends msfsSdk.BasePublisher {
        constructor() {
            super(...arguments);
            this.tr1Servo = new msfsSdk.LinearServo(0.5);
            this.tr1Value = 0;
            this.tr2Servo = new msfsSdk.LinearServo(0.5);
            this.tr2Value = 0;
        }
        /** @inheritdoc */
        onUpdate() {
            if (this.isPublishing()) {
                const leftEngineIgnition = SimVar.GetSimVarValue('TURB ENG IGNITION SWITCH EX1:1', msfsSdk.SimVarValueType.Enum) > 0;
                const leftEngineFuel = SimVar.GetSimVarValue('GENERAL ENG MIXTURE LEVER POSITION:1', msfsSdk.SimVarValueType.Number) === 1;
                const leftEngineRunStopState = leftEngineIgnition && leftEngineFuel;
                const righttEngineIgnition = SimVar.GetSimVarValue('TURB ENG IGNITION SWITCH EX1:2', msfsSdk.SimVarValueType.Enum) > 0;
                const rightEngineFuel = SimVar.GetSimVarValue('GENERAL ENG MIXTURE LEVER POSITION:2', msfsSdk.SimVarValueType.Number) === 1;
                const rightEngineRunStopState = righttEngineIgnition && rightEngineFuel;
                if (this.runStopState1 !== leftEngineRunStopState) {
                    this.runStopState1 = leftEngineRunStopState;
                    this.publish('turb_eng_runstop_1', this.runStopState1, false, true);
                }
                if (this.runStopState2 !== rightEngineRunStopState) {
                    this.runStopState2 = rightEngineRunStopState;
                    this.publish('turb_eng_runstop_2', this.runStopState2, false, true);
                }
                this.tr1Value = this.tr1Servo.drive(this.tr1Value, SimVar.GetSimVarValue('GENERAL ENG THROTTLE LEVER POSITION:1', msfsSdk.SimVarValueType.Percent) < 0 ? 1 : 0);
                this.tr2Value = this.tr2Servo.drive(this.tr2Value, SimVar.GetSimVarValue('GENERAL ENG THROTTLE LEVER POSITION:2', msfsSdk.SimVarValueType.Percent) < 0 ? 1 : 0);
                this.publish('thrust_reverser_pos_1', this.tr1Value);
                this.publish('thrust_reverser_pos_2', this.tr2Value);
            }
        }
    }

    var FuelLines;
    (function (FuelLines) {
        FuelLines["LeftEngineInlet"] = "LeftEngineInlet";
        FuelLines["RightEngineInlet"] = "RightEngineInlet";
        FuelLines["ApuInlet"] = "ApuInlet";
        FuelLines["RightMain"] = "RightMain";
        FuelLines["LeftMain"] = "LeftMain";
        FuelLines["ApuMain"] = "ApuMain";
        FuelLines["GravityXFlow"] = "GravityXFlow";
        FuelLines["LeftPumpToJunction"] = "LeftPumpToJunction";
        FuelLines["RightPumpToJunction"] = "RightPumpToJunction";
        FuelLines["LeftJunction"] = "LeftJunction";
        FuelLines["RightJunction"] = "RightJunction";
        FuelLines["LeftJunctionToTranfer"] = "LeftJunctionToTransfer";
        FuelLines["RightJunctionToTransfer"] = "RightJunctionToTransfer";
        FuelLines["Transfer"] = "Transfer";
        FuelLines["LeftTankOutlet"] = "LeftTankOutlet";
        FuelLines["RightTankOutlet"] = "RightTankOutlet";
        FuelLines["LeftPickup"] = "LeftPickup";
        FuelLines["RightPickup"] = "RightPickup";
        FuelLines["LeftScavenge"] = "LeftScavenge";
        FuelLines["RightScavenge"] = "RightScavenge";
        FuelLines["LeftMotiveFlow"] = "LeftMotiveFlow";
        FuelLines["RightMotiveFlow"] = "RightMotiveFlow";
        FuelLines["LeftRecirc"] = "LeftRecirc";
        FuelLines["RightRecirc"] = "RightRecirc";
    })(FuelLines || (FuelLines = {}));
    var FuelValves;
    (function (FuelValves) {
        FuelValves["LeftShutoffValve"] = "LeftShutoffValve";
        FuelValves["RightShutoffValve"] = "RightShutoffValve";
        FuelValves["ApuShutoffValve"] = "ApuShutoffValve";
        FuelValves["FuelTransferValve"] = "FuelTransferValve";
        FuelValves["GravityXFlowValves"] = "GravityXFlowValves";
        FuelValves["LeftScavengeValve"] = "LeftScavengeValve";
        FuelValves["RightScavengeValve"] = "RightScavengeValve";
    })(FuelValves || (FuelValves = {}));
    var FuelPumps;
    (function (FuelPumps) {
        FuelPumps["LeftBoostPump"] = "LeftBoostPump";
        FuelPumps["RightBoostPump"] = "RightBoostPump";
        FuelPumps["LeftMotiveFlow"] = "LeftMotiveFlow";
        FuelPumps["RightMotiveFlow"] = "RightMotiveFlow";
        FuelPumps["LeftRecirc"] = "LeftRecirc";
        FuelPumps["RightRecirc"] = "RightRecirc";
    })(FuelPumps || (FuelPumps = {}));
    /**
     * A class that manages the state of a fuel valve.
     */
    class FuelValveState {
        constructor() {
            this.isOpen = msfsSdk.Subject.create(false);
            this.isActive = msfsSdk.Subject.create(false);
            this.percentOpen = this.isOpen.map(o => o ? 1 : 0);
        }
        /**
         * Sets the valve to be open or closed.
         * @param isOpen Whether or not the valve is open or closed.
         * @param isActive Whether the valve is active.
         */
        set(isOpen, isActive) {
            this.isOpen.set(isOpen);
            this.isActive.set(isActive);
        }
    }
    /**
     * A class that delays a control input and a response.
     */
    class FuelControlDelay {
        /**
         * Creates an instance of a FuelControlDelay.
         * @param delay The amount of delay in the control.
         */
        constructor(delay = 500) {
            this.delay = delay;
            this.input = msfsSdk.Subject.create(false);
            this.output = msfsSdk.Subject.create(false);
            this.input.sub(value => {
                if (this.timeout !== undefined) {
                    window.clearTimeout(this.timeout);
                }
                this.timeout = window.setTimeout(() => {
                    this.output.set(value);
                }, this.delay);
            });
        }
        /**
         * Sets the value of the control.
         * @param value The value to set.
         */
        set(value) {
            this.input.set(value);
        }
    }
    /**
     * The fuel system of the Longitude.
     */
    class LongitudeFuelSystem {
        /**
         * Creates an instance of a LongitudeFuelSystem.
         * @param bus The event bus to use with this instance.
         * @param isPrimary Whether this is the primary instance that will control sim-side events.
         */
        constructor(bus, isPrimary) {
            this.bus = bus;
            this.valves = new Map([
                [FuelValves.ApuShutoffValve, new FuelValveState()],
                [FuelValves.FuelTransferValve, new FuelValveState()],
                [FuelValves.GravityXFlowValves, new FuelValveState()],
                [FuelValves.LeftShutoffValve, new FuelValveState()],
                [FuelValves.RightShutoffValve, new FuelValveState()],
                [FuelValves.LeftScavengeValve, new FuelValveState()],
                [FuelValves.RightScavengeValve, new FuelValveState()]
            ]);
            this.lines = new Map([
                [FuelLines.LeftEngineInlet, msfsSdk.Subject.create(false)],
                [FuelLines.RightEngineInlet, msfsSdk.Subject.create(false)],
                [FuelLines.ApuInlet, msfsSdk.Subject.create(false)],
                [FuelLines.RightMain, msfsSdk.Subject.create(false)],
                [FuelLines.LeftMain, msfsSdk.Subject.create(false)],
                [FuelLines.ApuMain, msfsSdk.Subject.create(false)],
                [FuelLines.GravityXFlow, msfsSdk.Subject.create(false)],
                [FuelLines.LeftPumpToJunction, msfsSdk.Subject.create(false)],
                [FuelLines.RightPumpToJunction, msfsSdk.Subject.create(false)],
                [FuelLines.LeftJunction, msfsSdk.Subject.create(false)],
                [FuelLines.RightJunction, msfsSdk.Subject.create(false)],
                [FuelLines.LeftJunctionToTranfer, msfsSdk.Subject.create(false)],
                [FuelLines.RightJunctionToTransfer, msfsSdk.Subject.create(false)],
                [FuelLines.Transfer, msfsSdk.Subject.create(false)],
                [FuelLines.LeftTankOutlet, msfsSdk.Subject.create(false)],
                [FuelLines.RightTankOutlet, msfsSdk.Subject.create(false)],
                [FuelLines.LeftPickup, msfsSdk.Subject.create(false)],
                [FuelLines.RightPickup, msfsSdk.Subject.create(false)],
                [FuelLines.LeftScavenge, msfsSdk.Subject.create(false)],
                [FuelLines.RightScavenge, msfsSdk.Subject.create(false)],
                [FuelLines.LeftMotiveFlow, msfsSdk.Subject.create(false)],
                [FuelLines.RightMotiveFlow, msfsSdk.Subject.create(false)],
                [FuelLines.LeftRecirc, msfsSdk.Subject.create(false)],
                [FuelLines.RightRecirc, msfsSdk.Subject.create(false)]
            ]);
            this.pumps = new Map([
                [FuelPumps.LeftBoostPump, msfsSdk.Subject.create(false)],
                [FuelPumps.RightBoostPump, msfsSdk.Subject.create(false)],
                [FuelPumps.LeftMotiveFlow, msfsSdk.Subject.create(false)],
                [FuelPumps.RightMotiveFlow, msfsSdk.Subject.create(false)],
                [FuelPumps.LeftRecirc, msfsSdk.Subject.create(false)],
                [FuelPumps.RightRecirc, msfsSdk.Subject.create(false)]
            ]);
            this.transferLtoRActive = false;
            this.transferRtoLActive = false;
            this.turbinePublisher = new LongitudeTurbinePublisher(this.bus);
            this.ramAirTemp = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ram_air_temp_c'), 0);
            this.leftEngineFuelFlow = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('fuel_flow_1'), 0);
            this.rightEngineFuelFlow = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('fuel_flow_2'), 0);
            this.leftTankFuel = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('fuel_left'), 0);
            this.rightTankFuel = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('fuel_right'), 0);
            this.leftEngineRunStopState = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_1'), false);
            this.rightEngineRunStopState = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_2'), false);
            this.leftN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_1'), NaN);
            this.rightN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_2'), NaN);
            this.onGround = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('on_ground'), true);
            this.leftBoostControl = new FuelControlDelay();
            this.rightBoostControl = new FuelControlDelay();
            this.gravityXFlowControl = new FuelControlDelay();
            this.apuFuelControl = new FuelControlDelay();
            this.recircPumpOffControl = new FuelControlDelay();
            this.settings = LongitudeUserSettings.getManager(this.bus);
            this.ignitorTimeout = NaN;
            this.previousTimestamp = -1;
            this.leftHasFlow = false;
            this.rightHasFlow = false;
            this.leftTankTemp = msfsSdk.Subject.create(NaN);
            this.rightTankTemp = msfsSdk.Subject.create(NaN);
            this.leftLineTemp = msfsSdk.Subject.create(NaN);
            this.rightLineTemp = msfsSdk.Subject.create(NaN);
            this.turbinePublisher.startPublish();
            this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
            if (isPrimary) {
                this.getValve(FuelValves.GravityXFlowValves).isOpen.sub(isOpen => {
                    if (isOpen) {
                        SimVar.SetSimVarValue('K:FUELSYSTEM_VALVE_OPEN', 'number', 3);
                        SimVar.SetSimVarValue('K:FUELSYSTEM_VALVE_OPEN', 'number', 5);
                    }
                    else {
                        SimVar.SetSimVarValue('K:FUELSYSTEM_VALVE_CLOSE', 'number', 3);
                        SimVar.SetSimVarValue('K:FUELSYSTEM_VALVE_CLOSE', 'number', 5);
                    }
                }, true);
                this.getValve(FuelValves.FuelTransferValve).isOpen.sub(isOpen => {
                    if (isOpen) {
                        SimVar.SetSimVarValue('K:FUELSYSTEM_VALVE_OPEN', 'number', 1);
                        SimVar.SetSimVarValue('K:FUELSYSTEM_VALVE_OPEN', 'number', 2);
                    }
                    else {
                        SimVar.SetSimVarValue('K:FUELSYSTEM_VALVE_CLOSE', 'number', 1);
                        SimVar.SetSimVarValue('K:FUELSYSTEM_VALVE_CLOSE', 'number', 2);
                    }
                }, true);
                this.getPump(FuelPumps.LeftBoostPump).sub(isActive => {
                    if (isActive) {
                        SimVar.SetSimVarValue('K:FUELSYSTEM_PUMP_ON', 'number', 3);
                    }
                    else {
                        SimVar.SetSimVarValue('K:FUELSYSTEM_PUMP_OFF', 'number', 3);
                    }
                }, true);
                this.getPump(FuelPumps.RightBoostPump).sub(isActive => {
                    if (isActive) {
                        SimVar.SetSimVarValue('K:FUELSYSTEM_PUMP_ON', 'number', 4);
                    }
                    else {
                        SimVar.SetSimVarValue('K:FUELSYSTEM_PUMP_OFF', 'number', 4);
                    }
                }, true);
            }
        }
        /**
         * Gets a valve from the fuel system.
         * @param valve The valve to get.
         * @returns The requested valve.
         * @throws An error if the valve was not found.
         */
        getValve(valve) {
            const valveState = this.valves.get(valve);
            if (valveState !== undefined) {
                return valveState;
            }
            throw new Error(`Valve ${valve} was not found.`);
        }
        /**
         * Gets a pump from the fuel system.
         * @param pump The pump to get.
         * @returns The requested pump.
         * @throws An error if the pump was not found.
         */
        getPump(pump) {
            const pumpState = this.pumps.get(pump);
            if (pumpState !== undefined) {
                return pumpState;
            }
            throw new Error(`Pump ${pump} was not found.`);
        }
        /**
         * Gets a line from the fuel system.
         * @param line The line to get.
         * @returns The requested line.
         * @throws An error if the line was not found.
         */
        getLine(line) {
            const lineState = this.lines.get(line);
            if (lineState !== undefined) {
                return lineState;
            }
            throw new Error(`Line ${line} was not found.`);
        }
        /**
         * Updates the fuel system.
         * @param timestamp The current simtime timestamp.
         */
        update(timestamp) {
            this.turbinePublisher.onUpdate();
            this.syncFuelSimVars();
            this.updatePumps();
            this.updateInletLines();
            this.updateMainLines();
            this.setInitialTemperatures();
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
            }
            this.adjustTemperatures(timestamp);
            this.previousTimestamp = timestamp;
            const engineNotRunning = this.leftN2.get() < 58 || this.rightN2.get() < 58;
            if (this.onGround.get() && engineNotRunning && this.settings.getSetting('engineIgnitorsSetOn').get()) {
                if (!isNaN(this.ignitorTimeout)) {
                    const deltaTime = msfsSdk.NavMath.clamp(timestamp - this.previousTimestamp, 0, 1000);
                    this.ignitorTimeout -= deltaTime;
                    if (this.ignitorTimeout <= 0) {
                        this.settings.getSetting('engineIgnitorsSetOn').set(false);
                        this.ignitorTimeout = NaN;
                    }
                }
                else {
                    this.ignitorTimeout = 1000 * 60 * 2;
                }
            }
            else {
                this.ignitorTimeout = NaN;
            }
        }
        /**
         * Adjusts the fuel temperatures towards their target values.
         * @param timestamp The current simtime timestamp.
         */
        adjustTemperatures(timestamp) {
            let leftTankTargetTemp = this.ramAirTemp.get();
            let rightTankTargetTemp = this.ramAirTemp.get();
            let leftLineTargetTemp = this.leftTankTemp.get();
            let rightLineTargetTemp = this.rightTankTemp.get();
            if (this.leftEngineFuelFlow.get() > 10) {
                leftLineTargetTemp = 28 + ((-40 - this.ramAirTemp.get()) * -0.1473);
                leftTankTargetTemp += (leftLineTargetTemp - leftTankTargetTemp) * 0.215;
            }
            if (this.rightEngineFuelFlow.get() > 10) {
                rightLineTargetTemp = 28 + ((-40 - this.ramAirTemp.get()) * -0.1473);
                rightTankTargetTemp += (rightLineTargetTemp - rightTankTargetTemp) * 0.215;
            }
            const deltaTime = msfsSdk.NavMath.clamp(timestamp - this.previousTimestamp, 0, 1000);
            const lineTc = 1;
            const tankTc = 1 / 120;
            this.adjustTemp(leftTankTargetTemp, this.leftTankTemp, tankTc, deltaTime);
            this.adjustTemp(rightTankTargetTemp, this.rightTankTemp, tankTc, deltaTime);
            this.adjustTemp(leftLineTargetTemp, this.leftLineTemp, lineTc, deltaTime);
            this.adjustTemp(rightLineTargetTemp, this.rightLineTemp, lineTc, deltaTime);
        }
        /**
         * Adjusts a temperature towards a target.
         * @param target The target temperature.
         * @param temp The temperature to adjust.
         * @param timeConstant The time constant to use when adjusting the temperature.
         * @param deltaTime The current update delta time.
         */
        adjustTemp(target, temp, timeConstant, deltaTime) {
            const error = target - temp.get();
            const change = Math.sign(error) * (timeConstant / 1000) * deltaTime;
            if (Math.abs(change) >= Math.abs(error)) {
                temp.set(target);
            }
            else {
                temp.set(temp.get() + change);
            }
        }
        /**
         * Sets the initial temperatures if not already set.
         */
        setInitialTemperatures() {
            if (isNaN(this.leftTankTemp.get())) {
                this.leftTankTemp.set(this.ramAirTemp.get());
            }
            if (isNaN(this.rightTankTemp.get())) {
                this.rightTankTemp.set(this.ramAirTemp.get());
            }
            if (isNaN(this.leftLineTemp.get())) {
                this.leftLineTemp.set(this.ramAirTemp.get());
            }
            if (isNaN(this.rightLineTemp.get())) {
                this.rightLineTemp.set(this.ramAirTemp.get());
            }
        }
        /**
         * Updates the main fuel line states.
         */
        updateMainLines() {
            this.getLine(FuelLines.LeftJunction).set(this.getPump(FuelPumps.LeftBoostPump).get());
            this.getLine(FuelLines.RightJunction).set(this.getPump(FuelPumps.RightBoostPump).get());
            this.getLine(FuelLines.Transfer).set(this.getValve(FuelValves.FuelTransferValve).isActive.get());
            this.getLine(FuelLines.LeftPumpToJunction).set(this.getPump(FuelPumps.LeftBoostPump).get());
            this.getLine(FuelLines.RightPumpToJunction).set(this.getPump(FuelPumps.RightBoostPump).get());
            this.getLine(FuelLines.GravityXFlow).set(this.getValve(FuelValves.GravityXFlowValves).isActive.get());
            this.getLine(FuelLines.LeftJunctionToTranfer).set(this.getPump(FuelPumps.LeftBoostPump).get() && this.getValve(FuelValves.FuelTransferValve).isActive.get());
            this.getLine(FuelLines.RightTankOutlet).set(this.getPump(FuelPumps.LeftBoostPump).get() && this.getValve(FuelValves.FuelTransferValve).isActive.get());
            this.getLine(FuelLines.RightJunctionToTransfer).set(this.getPump(FuelPumps.RightBoostPump).get() && this.getValve(FuelValves.FuelTransferValve).isActive.get());
            this.getLine(FuelLines.LeftTankOutlet).set(this.getPump(FuelPumps.RightBoostPump).get() && this.getValve(FuelValves.FuelTransferValve).isActive.get());
            this.getLine(FuelLines.LeftPickup).set((this.getValve(FuelValves.LeftScavengeValve).isActive.get() || this.getPump(FuelPumps.LeftBoostPump).get()) && this.leftHasFlow);
            this.getLine(FuelLines.RightPickup).set((this.getValve(FuelValves.RightScavengeValve).isActive.get() || this.getPump(FuelPumps.RightBoostPump).get()) && this.rightHasFlow);
            this.getLine(FuelLines.LeftScavenge).set(this.getValve(FuelValves.LeftScavengeValve).isActive.get() && this.leftHasFlow);
            this.getLine(FuelLines.RightScavenge).set(this.getValve(FuelValves.RightScavengeValve).isActive.get() && this.rightHasFlow);
            this.getLine(FuelLines.LeftMotiveFlow).set(this.getPump(FuelPumps.LeftMotiveFlow).get());
            this.getLine(FuelLines.RightMotiveFlow).set(this.getPump(FuelPumps.RightMotiveFlow).get());
            this.getLine(FuelLines.LeftRecirc).set(this.getPump(FuelPumps.LeftRecirc).get());
            this.getLine(FuelLines.RightRecirc).set(this.getPump(FuelPumps.RightRecirc).get());
        }
        /**
         * Updates the inlet line and associated valve active states.
         */
        updateInletLines() {
            this.getLine(FuelLines.LeftMain).set(this.leftHasFlow);
            this.getLine(FuelLines.RightMain).set(this.rightHasFlow);
            this.getLine(FuelLines.ApuMain).set(this.getValve(FuelValves.ApuShutoffValve).isActive.get() && this.rightHasFlow);
            this.getLine(FuelLines.LeftEngineInlet).set(this.getValve(FuelValves.LeftShutoffValve).isActive.get() && this.leftHasFlow);
            this.getLine(FuelLines.RightEngineInlet).set(this.getValve(FuelValves.RightShutoffValve).isActive.get() && this.rightHasFlow);
            this.getLine(FuelLines.ApuInlet).set(this.getValve(FuelValves.ApuShutoffValve).isActive.get() && this.rightHasFlow);
        }
        /**
         * Updates the pumps in norm position.
         */
        updatePumps() {
            this.recircPumpOffControl.set(SimVar.GetSimVarValue('L:WT_LNG_FUEL_RECIRC', msfsSdk.SimVarValueType.Number) === 1);
            this.getPump(FuelPumps.LeftMotiveFlow).set(this.leftEngineFuelFlow.get() > 10);
            this.getPump(FuelPumps.RightMotiveFlow).set(this.rightEngineFuelFlow.get() > 10);
            if (!this.recircPumpOffControl.output.get()) {
                this.getPump(FuelPumps.LeftRecirc).set((this.leftEngineRunStopState.get() && this.leftN2.get() > 58) && !this.getPump(FuelPumps.LeftBoostPump).get());
                this.getPump(FuelPumps.RightRecirc).set((this.rightEngineRunStopState.get() && this.rightN2.get() > 58) && !this.getPump(FuelPumps.RightBoostPump).get());
            }
            else {
                this.getPump(FuelPumps.LeftRecirc).set(false);
                this.getPump(FuelPumps.RightRecirc).set(false);
            }
        }
        /**
         * Synchronizes the fuel valve simvars from the sim to the fuel system valves.
         */
        syncFuelSimVars() {
            const apuSwitchPosition = SimVar.GetSimVarValue('L:XMLVAR_APU_StarterKnob_Pos', msfsSdk.SimVarValueType.Number);
            const fuelTransferDirection = SimVar.GetSimVarValue('L:WT_LNG_FUEL_TRANSFER_DIRECTION', msfsSdk.SimVarValueType.Number);
            switch (fuelTransferDirection) {
                case -1:
                    this.transferRtoLActive = true;
                    this.transferLtoRActive = false;
                    break;
                case 0:
                    this.transferLtoRActive = false;
                    this.transferRtoLActive = false;
                    break;
                case 1:
                    this.transferLtoRActive = true;
                    this.transferRtoLActive = false;
                    break;
            }
            const leftBoostPump = SimVar.GetSimVarValue('L:WT_LNG_FUEL_PUMP_1_ON', msfsSdk.SimVarValueType.Number) === 1;
            this.leftBoostControl.set(leftBoostPump || (this.leftEngineRunStopState.get() && this.leftN2.get() < 58) || this.transferLtoRActive);
            this.getPump(FuelPumps.LeftBoostPump).set(this.leftBoostControl.output.get());
            const rightBoostPump = SimVar.GetSimVarValue('L:WT_LNG_FUEL_PUMP_2_ON', msfsSdk.SimVarValueType.Number) === 1;
            this.rightBoostControl.set(rightBoostPump
                || (apuSwitchPosition > 0 && !(this.rightEngineRunStopState.get() && this.rightN2.get() > 58))
                || (this.rightEngineRunStopState.get() && this.rightN2.get() < 58)
                || this.transferRtoLActive);
            this.getPump(FuelPumps.RightBoostPump).set(this.rightBoostControl.output.get());
            this.leftHasFlow = this.leftEngineFuelFlow.get() > 10 || this.getPump(FuelPumps.LeftBoostPump).get();
            this.rightHasFlow = this.rightEngineFuelFlow.get() > 10 || this.getPump(FuelPumps.RightBoostPump).get();
            this.getValve(FuelValves.LeftShutoffValve).set(true, this.leftHasFlow);
            this.getValve(FuelValves.RightShutoffValve).set(true, this.rightHasFlow);
            this.apuFuelControl.set(apuSwitchPosition > 0);
            this.getValve(FuelValves.ApuShutoffValve).set(this.apuFuelControl.output.get(), this.apuFuelControl.output.get() && this.rightHasFlow);
            const leftToRightActive = this.transferLtoRActive && this.leftBoostControl.output.get();
            const rightToLeftActive = this.transferRtoLActive && this.rightBoostControl.output.get();
            this.getValve(FuelValves.FuelTransferValve).set(leftToRightActive || rightToLeftActive, leftToRightActive || rightToLeftActive);
            let gravityXFlowOpen = SimVar.GetSimVarValue('L:WT_LNG_GRAVITY_XFLOW_OPEN', msfsSdk.SimVarValueType.Bool);
            if (gravityXFlowOpen && this.onGround.get()) {
                SimVar.SetSimVarValue('L:WT_LNG_GRAVITY_XFLOW_OPEN', msfsSdk.SimVarValueType.Bool, false);
                gravityXFlowOpen = false;
            }
            this.gravityXFlowControl.set(gravityXFlowOpen);
            this.getValve(FuelValves.GravityXFlowValves).set(this.gravityXFlowControl.output.get(), this.gravityXFlowControl.output.get());
            const leftScavengeOn = this.leftTankTemp.get() <= -35 || msfsSdk.UnitType.GALLON_FUEL.convertTo(this.leftTankFuel.get(), msfsSdk.UnitType.POUND) <= 500;
            this.getValve(FuelValves.LeftScavengeValve).set(leftScavengeOn, leftScavengeOn && this.leftHasFlow);
            const rightScavengeOn = this.rightTankTemp.get() <= -35 || msfsSdk.UnitType.GALLON_FUEL.convertTo(this.rightTankFuel.get(), msfsSdk.UnitType.POUND) <= 500;
            this.getValve(FuelValves.RightScavengeValve).set(rightScavengeOn, rightScavengeOn && this.rightHasFlow);
        }
    }

    /**
     * A display pane view that displays the ECS synoptics page.
     */
    class FuelSynopticsPane extends msfsWtg3000Common.DisplayPaneView {
        constructor() {
            super(...arguments);
            this.title = msfsSdk.Subject.create('Fuel');
            this.leftMotiveFlow = msfsSdk.FSComponent.createRef();
            this.rightMotiveFlow = msfsSdk.FSComponent.createRef();
            this.leftMainLine = msfsSdk.FSComponent.createRef();
            this.rightMainLine = msfsSdk.FSComponent.createRef();
            this.leftPickupLine = msfsSdk.FSComponent.createRef();
            this.rightPickupLine = msfsSdk.FSComponent.createRef();
            this.leftInletLine = msfsSdk.FSComponent.createRef();
            this.rightInletLine = msfsSdk.FSComponent.createRef();
            this.leftJunctionLine = msfsSdk.FSComponent.createRef();
            this.rightJunctionLine = msfsSdk.FSComponent.createRef();
            this.leftScavengeLine = msfsSdk.FSComponent.createRef();
            this.rightScavengeLine = msfsSdk.FSComponent.createRef();
            this.leftMotiveFlowLine = msfsSdk.FSComponent.createRef();
            this.rightMotiveFlowLine = msfsSdk.FSComponent.createRef();
            this.leftRecircLine = msfsSdk.FSComponent.createRef();
            this.rightRecircLine = msfsSdk.FSComponent.createRef();
            this.leftPumpToJunctionLine = msfsSdk.FSComponent.createRef();
            this.rightPumpToJunctionLine = msfsSdk.FSComponent.createRef();
            this.leftJunctionToTransferLine = msfsSdk.FSComponent.createRef();
            this.rightJunctionToTransferLine = msfsSdk.FSComponent.createRef();
            this.transferLine = msfsSdk.FSComponent.createRef();
            this.leftTankOutletLine = msfsSdk.FSComponent.createRef();
            this.rightTankOutletLine = msfsSdk.FSComponent.createRef();
            this.gravityXFlowLine = msfsSdk.FSComponent.createRef();
            this.apuMainLine = msfsSdk.FSComponent.createRef();
            this.apuInletLine = msfsSdk.FSComponent.createRef();
            this.fuelFormatter = msfsSdk.NumberFormatter.create({ precision: 20, round: -1 });
            this.totalFuel = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('fuel_usable_total'), 0)
                .map(gals => this.fuelFormatter(msfsSdk.UnitType.GALLON_FUEL.convertTo(gals, msfsSdk.UnitType.POUND)));
            this.leftFuel = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('fuel_left'), 0)
                .map(gals => this.fuelFormatter(msfsSdk.UnitType.GALLON_FUEL.convertTo(gals, msfsSdk.UnitType.POUND)));
            this.rightFuel = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('fuel_right'), 0)
                .map(gals => this.fuelFormatter(msfsSdk.UnitType.GALLON_FUEL.convertTo(gals, msfsSdk.UnitType.POUND)));
            this.leftTankLevel = msfsSdk.FSComponent.createRef();
            this.rightTankLevel = msfsSdk.FSComponent.createRef();
        }
        /** @inheritdoc */
        onAfterRender() {
            this.props.fuelSystem.getPump(FuelPumps.LeftMotiveFlow).sub(isActive => {
                if (isActive) {
                    this.leftMotiveFlow.instance.classList.add('active');
                }
                else {
                    this.leftMotiveFlow.instance.classList.remove('active');
                }
            }, true);
            this.props.fuelSystem.getPump(FuelPumps.RightMotiveFlow).sub(isActive => {
                if (isActive) {
                    this.rightMotiveFlow.instance.classList.add('active');
                }
                else {
                    this.rightMotiveFlow.instance.classList.remove('active');
                }
            }, true);
            this.linkLineState(FuelLines.LeftMain, this.leftMainLine);
            this.linkLineState(FuelLines.RightMain, this.rightMainLine);
            this.linkLineState(FuelLines.LeftEngineInlet, this.leftInletLine);
            this.linkLineState(FuelLines.RightEngineInlet, this.rightInletLine);
            this.linkLineState(FuelLines.ApuMain, this.apuMainLine);
            this.linkLineState(FuelLines.ApuInlet, this.apuInletLine);
            this.linkLineState(FuelLines.LeftPickup, this.leftPickupLine);
            this.linkLineState(FuelLines.RightPickup, this.rightPickupLine);
            this.linkLineState(FuelLines.LeftScavenge, this.leftScavengeLine);
            this.linkLineState(FuelLines.RightScavenge, this.rightScavengeLine);
            this.linkLineState(FuelLines.LeftMotiveFlow, this.leftMotiveFlowLine);
            this.linkLineState(FuelLines.RightMotiveFlow, this.rightMotiveFlowLine);
            this.linkLineState(FuelLines.LeftRecirc, this.leftRecircLine);
            this.linkLineState(FuelLines.RightRecirc, this.rightRecircLine);
            this.linkLineState(FuelLines.LeftJunction, this.leftJunctionLine);
            this.linkLineState(FuelLines.RightJunction, this.rightJunctionLine);
            this.linkLineState(FuelLines.LeftTankOutlet, this.leftTankOutletLine);
            this.linkLineState(FuelLines.RightTankOutlet, this.rightTankOutletLine);
            this.linkLineState(FuelLines.LeftPumpToJunction, this.leftPumpToJunctionLine);
            this.linkLineState(FuelLines.RightPumpToJunction, this.rightPumpToJunctionLine);
            this.linkLineState(FuelLines.LeftJunctionToTranfer, this.leftJunctionToTransferLine);
            this.linkLineState(FuelLines.RightJunctionToTransfer, this.rightJunctionToTransferLine);
            this.linkLineState(FuelLines.Transfer, this.transferLine);
            this.linkLineState(FuelLines.GravityXFlow, this.gravityXFlowLine);
            this.leftFuel.sub(qty => {
                const pct = parseInt(qty) / 7160;
                const totalSize = 120 * pct;
                this.leftTankLevel.instance.style.height = `${totalSize}px`;
                this.leftTankLevel.instance.style.transform = `translate3d(0, ${120 - totalSize}px, 0)`;
            }, true);
            this.rightFuel.sub(qty => {
                const pct = parseInt(qty) / 7160;
                const totalSize = 120 * pct;
                this.rightTankLevel.instance.style.height = `${totalSize}px`;
                this.rightTankLevel.instance.style.transform = `translate3d(0, ${120 - totalSize}px, 0)`;
            }, true);
        }
        /**
         * Links a fuel line state with a line element reference.
         * @param line The fuel line to link.
         * @param ref The line element reference to link to.
         */
        linkLineState(line, ref) {
            this.props.fuelSystem.getLine(line).sub(isActive => {
                if (isActive) {
                    ref.instance.classList.add('active');
                }
                else {
                    ref.instance.classList.remove('active');
                }
            }, true);
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: "fuel-synoptic-container" },
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/engine.png`, class: "fuel-synoptic-graphics-engine-left" }),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/apu.png`, class: "fuel-synoptic-graphics-apu" }),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/engine.png`, class: "fuel-synoptic-graphics-engine-right" }),
                msfsSdk.FSComponent.buildComponent("div", { class: "total-fuel-digital-display" },
                    msfsSdk.FSComponent.buildComponent("div", null, "TOTAL FUEL"),
                    msfsSdk.FSComponent.buildComponent("div", null,
                        this.totalFuel,
                        msfsSdk.FSComponent.buildComponent("span", null, " LBS"))),
                msfsSdk.FSComponent.buildComponent("div", { class: "gravity-xflow-text" }, "GRAVITY XFLOW"),
                msfsSdk.FSComponent.buildComponent("div", { class: "boost-text" }, "BOOST"),
                msfsSdk.FSComponent.buildComponent("div", { class: "transfer-text" }, "TRANSFER"),
                msfsSdk.FSComponent.buildComponent("div", { class: "recirc-left-text" }, "RECIRC"),
                msfsSdk.FSComponent.buildComponent("div", { class: "recirc-right-text" }, "RECIRC"),
                msfsSdk.FSComponent.buildComponent("div", { class: "fuel-tank-outline" },
                    msfsSdk.FSComponent.buildComponent("svg", { height: "222px", width: "496px" },
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 216 2 l 0 211 l -89 0 l -117 7 l 0 -184 l 117 -34 z M 278 2 l 0 211 l 89 0 l 117 7 l 0 -184 l -117 -34 z", stroke: "rgb(30,30,30)", "stroke-width": "4px" }))),
                msfsSdk.FSComponent.buildComponent("div", { class: "gravity-xflow-line", ref: this.gravityXFlowLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-pump-junction-line", ref: this.leftPumpToJunctionLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-pump-junction-line", ref: this.rightPumpToJunctionLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-junction-transfer-line", ref: this.leftJunctionToTransferLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-junction-transfer-line", ref: this.rightJunctionToTransferLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "transfer-line", ref: this.transferLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-tank-gauge fuel-tank-gauge" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fuel-tank-yellow-range" }),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fuel-tank-vertical-box" },
                        msfsSdk.FSComponent.buildComponent("div", { class: "tank-level", ref: this.leftTankLevel })),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fuel-tank-digital-value" },
                        this.leftFuel,
                        msfsSdk.FSComponent.buildComponent("span", null, " LBS")),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fuel-tank-temp" },
                        this.props.fuelSystem.leftTankTemp.map(msfsSdk.NumberFormatter.create({ precision: 1 })),
                        msfsSdk.FSComponent.buildComponent("span", null, "\u00B0C"))),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-tank-gauge fuel-tank-gauge" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "fuel-tank-yellow-range" }),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fuel-tank-vertical-box" },
                        msfsSdk.FSComponent.buildComponent("div", { class: "tank-level", ref: this.rightTankLevel })),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fuel-tank-digital-value" },
                        this.rightFuel,
                        msfsSdk.FSComponent.buildComponent("span", null, " LBS")),
                    msfsSdk.FSComponent.buildComponent("div", { class: "fuel-tank-temp" },
                        this.props.fuelSystem.rightTankTemp.map(msfsSdk.NumberFormatter.create({ precision: 1 })),
                        msfsSdk.FSComponent.buildComponent("span", null, "\u00B0C"))),
                msfsSdk.FSComponent.buildComponent("svg", { class: 'recirc-line-left', width: '76px', height: '22px', ref: this.leftRecircLine },
                    msfsSdk.FSComponent.buildComponent("path", { d: 'M 0 3 L 11 3 L 76 18', "stroke-width": '6' })),
                msfsSdk.FSComponent.buildComponent("svg", { class: 'recirc-line-right', width: '76px', height: '22px', ref: this.rightRecircLine },
                    msfsSdk.FSComponent.buildComponent("path", { d: 'M 0 3 L 11 3 L 76 18', "stroke-width": '6' })),
                msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'recirc-pump-left', isActive: this.props.fuelSystem.getPump(FuelPumps.LeftRecirc) }),
                msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'recirc-pump-right', isActive: this.props.fuelSystem.getPump(FuelPumps.RightRecirc) }),
                msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'left-fuel-boost-pump', isActive: this.props.fuelSystem.getPump(FuelPumps.LeftBoostPump) }),
                msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'right-fuel-boost-pump', isActive: this.props.fuelSystem.getPump(FuelPumps.RightBoostPump) }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-ejector-pump", ref: this.leftMotiveFlow },
                    msfsSdk.FSComponent.buildComponent("svg", { width: "28px", height: "55px" },
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 12.839 4.969 l 12.08 0.007 m 0 4.442 l -8.18 0 l 0 10.077 l -3.337 6.936 l 0 5.3 l 2.879 6.15 l 0 11.124 m -10.73 0 l 0 -11.124 l 2.879 -6.15 l 0 -5.3 l -3.337 -6.936 l 0 -10.077 c -3.156 0 -3.213 -4.479 0 -4.449 l 4.081 0", "stroke-width": "2px" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 9.174 0 l 0 19.452 l 1.244 2.29 l 1.177 0 l 1.244 -2.29 l 0 -19.452", "stroke-width": "1px" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 24.5 4.975 l 0 4.443 M 16.281 48.6 l -10.73 0 M 9.174 .5 l 3.665 0", opacity: "0.5", "stroke-width": "1.5px" }),
                        msfsSdk.FSComponent.buildComponent("path", { class: 'filled', d: "M 12.839 0 l 3.335 0 l -3.335 2.434 z M 9.174 0 l -3.335 0 l 3.335 2.434 z M 24.919 4.976 l 0 -2.541 l -2.515 -1.044 l 0 3.585 z M 24.919 9.418 l 0 2.541 l -2.515 1.044 l 0 -3.585 z M 5.551 49.005 l -2.966 0 l 0.64 -2.31 l 2.326 0 M 16.281 49.005 l 2.966 0 l -0.64 -2.31 l -2.326 0" }))),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-ejector-pump", ref: this.rightMotiveFlow },
                    msfsSdk.FSComponent.buildComponent("svg", { width: "28px", height: "55px" },
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 12.839 4.969 l 12.08 0.007 m 0 4.442 l -8.18 0 l 0 10.077 l -3.337 6.936 l 0 5.3 l 2.879 6.15 l 0 11.124 m -10.73 0 l 0 -11.124 l 2.879 -6.15 l 0 -5.3 l -3.337 -6.936 l 0 -10.077 c -3.156 0 -3.213 -4.479 0 -4.449 l 4.081 0", "stroke-width": "2px" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 9.174 0 l 0 19.452 l 1.244 2.29 l 1.177 0 l 1.244 -2.29 l 0 -19.452", "stroke-width": "1px" }),
                        msfsSdk.FSComponent.buildComponent("path", { d: "M 24.5 4.975 l 0 4.443 M 16.281 48.6 l -10.73 0 M 9.174 .5 l 3.665 0", opacity: "0.5", "stroke-width": "1.5px" }),
                        msfsSdk.FSComponent.buildComponent("path", { class: 'filled', d: "M 12.839 0 l 3.335 0 l -3.335 2.434 z M 9.174 0 l -3.335 0 l 3.335 2.434 z M 24.919 4.976 l 0 -2.541 l -2.515 -1.044 l 0 3.585 z M 24.919 9.418 l 0 2.541 l -2.515 1.044 l 0 -3.585 z M 5.551 49.005 l -2.966 0 l 0.64 -2.31 l 2.326 0 M 16.281 49.005 l 2.966 0 l -0.64 -2.31 l -2.326 0" }))),
                msfsSdk.FSComponent.buildComponent("div", { class: "apu-text" }, "APU"),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-eng-fuel-circuit-above-shutoff above-shutoff", ref: this.leftMainLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-eng-fuel-circuit-below-shutoff below-shutoff", ref: this.leftInletLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-eng-fuel-temp-box fuel-temp-box" },
                    this.props.fuelSystem.leftLineTemp.map(msfsSdk.NumberFormatter.create({ precision: 1 })),
                    msfsSdk.FSComponent.buildComponent("span", null, "\u00B0C")),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'left-eng-sov', percentOpen: this.props.fuelSystem.getValve(FuelValves.LeftShutoffValve).percentOpen, isActive: this.props.fuelSystem.getValve(FuelValves.LeftShutoffValve).isActive }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-eng-fuel-circuit-above-shutoff above-shutoff", ref: this.rightMainLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-eng-fuel-circuit-below-shutoff", ref: this.rightInletLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-eng-fuel-temp-box fuel-temp-box" },
                    this.props.fuelSystem.rightLineTemp.map(msfsSdk.NumberFormatter.create({ precision: 1 })),
                    msfsSdk.FSComponent.buildComponent("span", null, "\u00B0C")),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'right-eng-sov', percentOpen: this.props.fuelSystem.getValve(FuelValves.RightShutoffValve).percentOpen, isActive: this.props.fuelSystem.getValve(FuelValves.RightShutoffValve).isActive }),
                msfsSdk.FSComponent.buildComponent("div", { class: "apu-fuel-circuit-above-shutoff", ref: this.apuMainLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "apu-fuel-circuit-below-shutoff", ref: this.apuInletLine }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'apu-sov', percentOpen: this.props.fuelSystem.getValve(FuelValves.ApuShutoffValve).percentOpen, isActive: this.props.fuelSystem.getValve(FuelValves.ApuShutoffValve).isActive }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { horizontal: true, class: 'fuel-transfer-sov', percentOpen: this.props.fuelSystem.getValve(FuelValves.FuelTransferValve).percentOpen, isActive: this.props.fuelSystem.getValve(FuelValves.FuelTransferValve).isActive }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { horizontal: true, class: 'left-gravity-xflow-sov', percentOpen: this.props.fuelSystem.getValve(FuelValves.GravityXFlowValves).percentOpen, isActive: this.props.fuelSystem.getValve(FuelValves.GravityXFlowValves).isActive }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { horizontal: true, class: 'right-gravity-xflow-sov', percentOpen: this.props.fuelSystem.getValve(FuelValves.GravityXFlowValves).percentOpen, isActive: this.props.fuelSystem.getValve(FuelValves.GravityXFlowValves).isActive }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-boost-pump-feed boost-feed", ref: this.leftJunctionLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-boost-pump-feed boost-feed", ref: this.rightJunctionLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-transfer-feed transfer-feed", ref: this.leftTankOutletLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-transfer-feed transfer-feed", ref: this.rightTankOutletLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-scavenge-line", ref: this.leftScavengeLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-scavenge-line", ref: this.rightScavengeLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-pickup-line", ref: this.leftPickupLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-pickup-line", ref: this.rightPickupLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "left-motive-flow-line", ref: this.leftMotiveFlowLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: "right-motive-flow-line", ref: this.rightMotiveFlowLine }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'left-scavenge-valve', percentOpen: this.props.fuelSystem.getValve(FuelValves.LeftScavengeValve).percentOpen, isActive: this.props.fuelSystem.getValve(FuelValves.LeftScavengeValve).isActive }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'right-scavenge-valve', percentOpen: this.props.fuelSystem.getValve(FuelValves.RightScavengeValve).percentOpen, isActive: this.props.fuelSystem.getValve(FuelValves.RightScavengeValve).isActive })));
        }
    }

    var HydraulicPumpSwitch;
    (function (HydraulicPumpSwitch) {
        HydraulicPumpSwitch[HydraulicPumpSwitch["Norm"] = 0] = "Norm";
        HydraulicPumpSwitch[HydraulicPumpSwitch["Min"] = 1] = "Min";
        HydraulicPumpSwitch[HydraulicPumpSwitch["Shutoff"] = 2] = "Shutoff";
    })(HydraulicPumpSwitch || (HydraulicPumpSwitch = {}));
    var PtcuSwitch;
    (function (PtcuSwitch) {
        PtcuSwitch[PtcuSwitch["Off"] = 0] = "Off";
        PtcuSwitch[PtcuSwitch["AuxA"] = 1] = "AuxA";
        PtcuSwitch[PtcuSwitch["Norm"] = 2] = "Norm";
        PtcuSwitch[PtcuSwitch["AuxB"] = 3] = "AuxB";
        PtcuSwitch[PtcuSwitch["HydGen"] = 4] = "HydGen";
    })(PtcuSwitch || (PtcuSwitch = {}));
    var RudderStandbySwitch;
    (function (RudderStandbySwitch) {
        RudderStandbySwitch["Norm"] = "Norm";
        RudderStandbySwitch["Off"] = "Off";
    })(RudderStandbySwitch || (RudderStandbySwitch = {}));
    var PtcuMode;
    (function (PtcuMode) {
        PtcuMode["Off"] = "Off";
        PtcuMode["AuxA"] = "AuxA";
        PtcuMode["AuxB"] = "AuxB";
        PtcuMode["PtuA"] = "PtuA";
        PtcuMode["PtuB"] = "PtuB";
        PtcuMode["PtuStandby"] = "PtuStandby";
        PtcuMode["HydGenA"] = "HydGenA";
        PtcuMode["HydGenB"] = "HydGenB";
    })(PtcuMode || (PtcuMode = {}));
    var AccumulatorType;
    (function (AccumulatorType) {
        AccumulatorType["LeftSpoiler"] = "LeftSpoiler";
        AccumulatorType["RightSpoiler"] = "RightSpoiler";
        AccumulatorType["OutboardSpoilers"] = "OutboardSpoilers";
        AccumulatorType["MidSpoilers"] = "MidSpoilers";
        AccumulatorType["InboardBrakes"] = "InboardBrakes";
        AccumulatorType["OutboardBrakes"] = "OutboardBrakes";
    })(AccumulatorType || (AccumulatorType = {}));

    /**
     * A display pane view that displays the ECS synoptics page.
     */
    class HydraulicsSynopticsPane extends msfsWtg3000Common.DisplayPaneView {
        constructor() {
            super(...arguments);
            this.leftMainLine = msfsSdk.FSComponent.createRef();
            this.rightMainLine = msfsSdk.FSComponent.createRef();
            this.leftPtcuLine = msfsSdk.FSComponent.createRef();
            this.rightPtcuLine = msfsSdk.FSComponent.createRef();
            this.mgIcon = msfsSdk.FSComponent.createRef();
            this.rudderLine = msfsSdk.FSComponent.createRef();
            this.rudderBox = msfsSdk.FSComponent.createRef();
            this.title = msfsSdk.Subject.create('Hydraulics');
        }
        /** @inheritdoc */
        onAfterRender(node) {
            super.onAfterRender(node);
            this.linkActiveState(this.props.hydraulicSystem.outputs.leftSystemActive, this.leftMainLine);
            this.linkActiveState(this.props.hydraulicSystem.outputs.rightSystemActive, this.rightMainLine);
            this.linkActiveState(this.props.hydraulicSystem.outputs.ptcuMode.map(this.leftPtuActive.bind(this)), this.leftPtcuLine);
            this.linkActiveState(this.props.hydraulicSystem.outputs.ptcuMode.map(this.rightPtuActive.bind(this)), this.rightPtcuLine);
            this.linkActiveState(this.props.hydraulicSystem.outputs.ptcuMode.map(this.motorGeneratorActive.bind(this)), this.mgIcon);
            this.linkActiveState(this.props.hydraulicSystem.rudderSystem.isRudderStandbyActive, this.rudderLine);
            this.linkActiveState(this.props.hydraulicSystem.rudderSystem.isRudderStandbyActive, this.rudderBox);
        }
        /**
         * Links an active state to a subscribable.
         * @param sub The subscribable to link.
         * @param ref The reference to add or remove active state class from.
         */
        linkActiveState(sub, ref) {
            sub.sub(val => {
                if (val) {
                    ref.instance.classList.add('active');
                }
                else {
                    ref.instance.classList.remove('active');
                }
            }, true);
        }
        /**
         * Checks if the left PTU pump is active based on the PTCU mode.
         * @param mode The current PTCU mode.
         * @returns True if active, false otherwise.
         */
        leftPtuActive(mode) {
            return mode === PtcuMode.AuxA || mode === PtcuMode.HydGenA || mode === PtcuMode.PtuA || mode === PtcuMode.PtuB;
        }
        /**
         * Checks if the right PTU pump is active based on the PTCU mode.
         * @param mode The current PTCU mode.
         * @returns True if active, false otherwise.
         */
        rightPtuActive(mode) {
            return mode === PtcuMode.AuxB || mode === PtcuMode.HydGenB || mode === PtcuMode.PtuA || mode === PtcuMode.PtuB;
        }
        /**
         * Checks if the motor/generator is active based on the PTCU mode.
         * @param mode The current PTCU mode.
         * @returns True if active, false otherwise.
         */
        motorGeneratorActive(mode) {
            return mode === PtcuMode.AuxA || mode === PtcuMode.AuxB || mode === PtcuMode.HydGenA || mode === PtcuMode.HydGenB;
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-container' },
                msfsSdk.FSComponent.buildComponent(HydraulicStatus, { side: 'A', psi: this.props.hydraulicSystem.outputs.leftSystemPressure.value, level: this.props.hydraulicSystem.outputs.leftSystemTank.value, temp: this.props.hydraulicSystem.outputs.leftSystemTemp.value }),
                msfsSdk.FSComponent.buildComponent(HydraulicStatus, { side: 'B', psi: this.props.hydraulicSystem.outputs.rightSystemPressure.value, level: this.props.hydraulicSystem.outputs.rightSystemTank.value, temp: this.props.hydraulicSystem.outputs.rightSystemTemp.value }),
                msfsSdk.FSComponent.buildComponent(EngineGraphics, null),
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-main-line line left', ref: this.leftMainLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-main-line line right', ref: this.rightMainLine }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'hyd-synoptic-valve-left', percentOpen: msfsSdk.Subject.create(1), isActive: this.props.hydraulicSystem.outputs.leftSystemActive }),
                msfsSdk.FSComponent.buildComponent(ValveIcon, { class: 'hyd-synoptic-valve-right', percentOpen: msfsSdk.Subject.create(1), isActive: this.props.hydraulicSystem.outputs.rightSystemActive }),
                msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'hyd-synoptic-pump-left', isActive: this.props.hydraulicSystem.outputs.leftPumpOn }),
                msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'hyd-synoptic-pump-right', isActive: this.props.hydraulicSystem.outputs.rightPumpOn }),
                msfsSdk.FSComponent.buildComponent("section", null,
                    msfsSdk.FSComponent.buildComponent(HydraulicsGroup, { mainActive: this.props.hydraulicSystem.outputs.leftSystemActive, class: 'hyd-synoptic-group-left-one', labels: ['RUDDER', 'L THRUST REV', 'MLG AUX EXT'], side: 'A' }),
                    msfsSdk.FSComponent.buildComponent(HydraulicsGroup, { mainActive: this.props.hydraulicSystem.outputs.leftSystemActive, accumulatorPsi: this.props.hydraulicSystem.getAccumulator(AccumulatorType.LeftSpoiler).pressure, class: 'hyd-synoptic-group-left-three', labels: ['R IBD SPOILER'], side: 'A' }),
                    msfsSdk.FSComponent.buildComponent(HydraulicsGroup, { mainActive: this.props.hydraulicSystem.outputs.leftSystemActive, accumulatorPsi: this.props.hydraulicSystem.getAccumulator(AccumulatorType.RightSpoiler).pressure, class: 'hyd-synoptic-group-left-two', labels: ['L IBD SPOILER'], side: 'A' }),
                    msfsSdk.FSComponent.buildComponent(HydraulicsGroup, { mainActive: this.props.hydraulicSystem.outputs.leftSystemActive, accumulatorPsi: this.props.hydraulicSystem.getAccumulator(AccumulatorType.OutboardSpoilers).pressure, class: 'hyd-synoptic-group-left-four', labels: ['OBD SPOILERS'], side: 'A' })),
                msfsSdk.FSComponent.buildComponent("section", null,
                    msfsSdk.FSComponent.buildComponent(HydraulicsGroup, { mainActive: this.props.hydraulicSystem.outputs.rightSystemActive, class: 'hyd-synoptic-group-left-one', labels: ['RUDDER', 'R THRUST REV', 'NWS', 'LANDING GEAR'], side: 'B' }),
                    msfsSdk.FSComponent.buildComponent(HydraulicsGroup, { mainActive: this.props.hydraulicSystem.outputs.rightSystemActive, accumulatorPsi: this.props.hydraulicSystem.getAccumulator(AccumulatorType.MidSpoilers).pressure, class: 'hyd-synoptic-group-left-five', labels: ['MID SPOILERS'], side: 'B' })),
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-rudder-standby' },
                    msfsSdk.FSComponent.buildComponent("div", null, "RUDDER STANDBY"),
                    msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'hyd-synoptic-pump-rudder', isActive: this.props.hydraulicSystem.rudderSystem.isRudderStandbyActive })),
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-rudder-line line', ref: this.rudderLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-rudder', ref: this.rudderBox }, "RUDDER"),
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-ptcu' },
                    "PTCU",
                    msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-mg', ref: this.mgIcon }, "M/G"),
                    msfsSdk.FSComponent.buildComponent("svg", { class: 'hyd-synoptic-ptcu-main-line line left', ref: this.leftPtcuLine },
                        msfsSdk.FSComponent.buildComponent("path", { d: 'M 122 12 l -44 84 l -80 0' })),
                    msfsSdk.FSComponent.buildComponent("svg", { class: 'hyd-synoptic-ptcu-main-line line right', ref: this.rightPtcuLine },
                        msfsSdk.FSComponent.buildComponent("path", { d: 'M 122 12 l -44 84 l -80 0' })),
                    msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'hyd-synoptic-ptcu-pump-left', isActive: this.props.hydraulicSystem.outputs.ptcuMode.map(this.leftPtuActive.bind(this)) }),
                    msfsSdk.FSComponent.buildComponent(FanIcon, { class: 'hyd-synoptic-ptcu-pump-right', isActive: this.props.hydraulicSystem.outputs.ptcuMode.map(this.rightPtuActive.bind(this)) }),
                    msfsSdk.FSComponent.buildComponent(PtcuTransferLine, { mode: this.props.hydraulicSystem.outputs.ptcuMode })),
                msfsSdk.FSComponent.buildComponent(BrakeDisplay, { side: 'A', mainActive: this.props.hydraulicSystem.outputs.leftSystemActive, psi: this.props.hydraulicSystem.getAccumulator(AccumulatorType.InboardBrakes).pressure, brakeSystem: this.props.hydraulicSystem.brakeSystem }),
                msfsSdk.FSComponent.buildComponent(BrakeDisplay, { side: 'B', mainActive: this.props.hydraulicSystem.outputs.rightSystemActive, psi: this.props.hydraulicSystem.getAccumulator(AccumulatorType.OutboardBrakes).pressure, brakeSystem: this.props.hydraulicSystem.brakeSystem })));
        }
    }
    /**
     * A component that displays the hydraulic system status.
     */
    class HydraulicStatus extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.psiFormatter = msfsSdk.NumberFormatter.create({ precision: 100 });
            this.tempFormatter = msfsSdk.NumberFormatter.create({ precision: 1 });
            this.levelPctFormatter = msfsSdk.NumberFormatter.create({ precision: 1 });
            this.levelBarMask = msfsSdk.FSComponent.createRef();
            this.levelPct = this.props.level.map(v => this.levelPctFormatter((v / 375) * 100));
        }
        /** @inheritdoc */
        onAfterRender() {
            this.levelPct.sub(pct => {
                this.levelBarMask.instance.style.height = `${100 - parseInt(pct)}%`;
            }, true);
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: `hyd-synoptic-status ${this.props.side === 'A' ? 'left' : 'right'}` },
                msfsSdk.FSComponent.buildComponent("div", null,
                    "SYSTEM ",
                    this.props.side),
                msfsSdk.FSComponent.buildComponent("div", null,
                    msfsSdk.FSComponent.buildComponent("span", { class: 'hyd-synoptic-psi' }, this.props.psi.map(this.psiFormatter)),
                    " ",
                    msfsSdk.FSComponent.buildComponent("span", null, "PSI "),
                    msfsSdk.FSComponent.buildComponent("span", { class: 'hyd-synoptic-temp' }, this.props.temp.map(this.tempFormatter)),
                    " ",
                    msfsSdk.FSComponent.buildComponent("span", null, "\u00B0C")),
                this.props.side === 'A'
                    ? (msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-level-container' },
                        msfsSdk.FSComponent.buildComponent("div", null, "&nbsp"),
                        msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-level-bar' },
                            msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-level-bar-mask', ref: this.levelBarMask })),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent("span", { class: 'hyd-synoptic-level-pct' }, this.levelPct),
                            "%"))) : (msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-level-container' },
                    msfsSdk.FSComponent.buildComponent("div", null,
                        msfsSdk.FSComponent.buildComponent("span", { class: 'hyd-synoptic-level-pct' }, this.levelPct),
                        "%"),
                    msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-level-bar' },
                        msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-level-bar-mask', ref: this.levelBarMask })),
                    msfsSdk.FSComponent.buildComponent("div", null, "&nbsp")))));
        }
    }
    /**
     * A component that displays the engine graphics.
     */
    class EngineGraphics extends msfsSdk.DisplayComponent {
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent(msfsSdk.FSComponent.Fragment, null,
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/engine.png`, class: "hyd-synoptic-graphics-engine-left" }),
                msfsSdk.FSComponent.buildComponent("img", { src: `${LongitudeFilePaths.ASSETS_PATH}/Images/Synoptics/engine.png`, class: "hyd-synoptic-graphics-engine-right" })));
        }
    }
    /**
     * A component that displays a hydraulic accumulator icon.
     */
    class HydraulicAccumulatorIcon extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.el = msfsSdk.FSComponent.createRef();
        }
        /** @inheritdoc */
        onAfterRender() {
            this.props.psi.sub(psi => {
                if (psi < 2420) {
                    this.el.instance.classList.remove('active');
                }
                else {
                    this.el.instance.classList.add('active');
                }
            }, true);
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("svg", { height: '28px', viewBox: '0 0 45 28', class: 'hyd-synoptic-accumulator', ref: this.el },
                msfsSdk.FSComponent.buildComponent("path", { class: 'stroked', d: 'M 14 2 L 31 2 A 1 1 0 0 1 31 26 L 14 26 A 1 1 0 0 1 14 2 M 24 14 L 33 19 L 33 9 L 24 14' }),
                msfsSdk.FSComponent.buildComponent("path", { class: 'filled', d: 'M 14 2 L 24 2 L 24 26 L 15 26 A 1 1 0 0 1 14 2 Z' })));
        }
    }
    /**
     * A component that displays a hydraulics group box.
     */
    class HydraulicsGroup extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.items = msfsSdk.FSComponent.createRef();
            this.mainLine = msfsSdk.FSComponent.createRef();
            this.accumulatorLine = msfsSdk.FSComponent.createRef();
        }
        /** @inheritdoc */
        onAfterRender() {
            var _a;
            this.props.mainActive.sub(this.onUpdated.bind(this), true);
            (_a = this.props.accumulatorPsi) === null || _a === void 0 ? void 0 : _a.sub(this.onUpdated.bind(this), true);
        }
        /**
         * Handles when the group data is updated.
         */
        onUpdated() {
            if (this.props.mainActive.get() || (this.props.accumulatorPsi !== undefined && this.props.accumulatorPsi.get() > 2420)) {
                this.items.instance.classList.add('active');
            }
            else {
                this.items.instance.classList.remove('active');
            }
            if (this.props.mainActive.get()) {
                this.mainLine.instance.classList.add('active');
            }
            else {
                this.mainLine.instance.classList.remove('active');
            }
            if (this.props.accumulatorPsi !== undefined && this.props.accumulatorPsi.get() > 2420) {
                this.accumulatorLine.instance.classList.add('active');
            }
            else {
                this.accumulatorLine.instance.classList.remove('active');
            }
        }
        /** @inheritdoc */
        render() {
            var _a;
            return (msfsSdk.FSComponent.buildComponent("div", { class: `hyd-synoptic-group ${this.props.side === 'A' ? 'left' : 'right'} ${(_a = this.props.class) !== null && _a !== void 0 ? _a : ''}` },
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-group-system-line line', ref: this.mainLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: `hyd-synoptic-group-accumulator-line line ${!this.props.accumulatorPsi ? 'no-accumulator' : ''}`, ref: this.accumulatorLine }),
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-group-items', ref: this.items }, this.props.labels.map(label => msfsSdk.FSComponent.buildComponent("div", null, label))),
                this.props.accumulatorPsi && msfsSdk.FSComponent.buildComponent(HydraulicAccumulatorIcon, { psi: this.props.accumulatorPsi })));
        }
    }
    /**
     * A component that displays a PTCU transfer line.
     */
    class PtcuTransferLine extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.el = msfsSdk.FSComponent.createRef();
            this.classMap = new Map([
                [PtcuMode.AuxA, 'aux-a'],
                [PtcuMode.AuxB, 'aux-b'],
                [PtcuMode.HydGenA, 'hyd-gen-a'],
                [PtcuMode.HydGenB, 'hyd-gen-b'],
                [PtcuMode.Off, 'off'],
                [PtcuMode.PtuA, 'ptu-left'],
                [PtcuMode.PtuB, 'ptu-right'],
                [PtcuMode.PtuStandby, 'standby']
            ]);
            this.previousMode = PtcuMode.Off;
        }
        /** @inheritdoc */
        onAfterRender() {
            this.props.mode.sub(mode => {
                var _a, _b;
                this.el.instance.classList.remove((_a = this.classMap.get(this.previousMode)) !== null && _a !== void 0 ? _a : '');
                this.el.instance.classList.add((_b = this.classMap.get(mode)) !== null && _b !== void 0 ? _b : '');
                this.previousMode = mode;
            }, true);
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("svg", { width: "72px", height: "32px", class: 'hyd-synoptic-ptcu-xfer off', ref: this.el },
                msfsSdk.FSComponent.buildComponent("path", { class: 'dashed-line', d: "M 0 16 l 16 0 m 10 0 l 18 0 m 10 0 l 18 0", stroke: "#0d0", "stroke-width": "6" }),
                msfsSdk.FSComponent.buildComponent("path", { class: 'arrow', d: "M 8 16 l 24 -12 l -6 12 l 6 12 Z", fill: "#0d0", stroke: "black", "stroke-width": "1" }),
                msfsSdk.FSComponent.buildComponent("path", { class: 'arrow', d: "M 36 16 l 24 -12 l -6 12 l 6 12 Z", fill: "#0d0", stroke: "black", "stroke-width": "1" })));
        }
    }
    /**
     * A component that displays a brake hydraulics status box.
     */
    class BrakeDisplay extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.el = msfsSdk.FSComponent.createRef();
            this.line = msfsSdk.FSComponent.createRef();
            this.accumulatorPsi = msfsSdk.FSComponent.createRef();
            this.psiFormatter = PsiFormatter.create(2420);
            this.psiFormatted = this.props.psi.map(this.psiFormatter);
        }
        /** @inheritdoc */
        onAfterRender() {
            this.props.psi.sub(this.onUpdated.bind(this), true);
            this.props.mainActive.sub(this.onUpdated.bind(this), true);
        }
        /**
         * Handles when the data is updated.
         */
        onUpdated() {
            if (this.props.mainActive.get() || this.props.psi.get() > 2420) {
                this.el.instance.classList.add('active');
            }
            else {
                this.el.instance.classList.remove('active');
            }
            if (this.props.psi.get() <= 2420) {
                this.accumulatorPsi.instance.classList.add('warning');
            }
            else {
                this.accumulatorPsi.instance.classList.remove('warning');
            }
            if (this.props.psi.get() > 2420) {
                this.line.instance.classList.add('active');
            }
            else {
                this.line.instance.classList.remove('active');
            }
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: `hyd-synoptic-brakedisplay ${this.props.side === 'A' ? 'left' : 'right'}`, ref: this.el },
                this.props.side === 'A' ? 'INBD BRAKES' : 'OUTBD BRAKES',
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-brakes-column' },
                    msfsSdk.FSComponent.buildComponent("div", null,
                        msfsSdk.FSComponent.buildComponent("div", null, "L"),
                        msfsSdk.FSComponent.buildComponent("div", null, this.props.side === 'A' ? this.props.brakeSystem.inboardLeftBrakePsi.value.map(PsiFormatter.create(0)) : this.props.brakeSystem.outboardLeftBrakePsi.value.map(PsiFormatter.create(0))),
                        msfsSdk.FSComponent.buildComponent("div", null, "PSI")),
                    msfsSdk.FSComponent.buildComponent("div", null,
                        msfsSdk.FSComponent.buildComponent("div", null, "R"),
                        msfsSdk.FSComponent.buildComponent("div", null, this.props.side === 'A' ? this.props.brakeSystem.inboardRightBrakePsi.value.map(PsiFormatter.create(0)) : this.props.brakeSystem.outboardRightBrakePsi.value.map(PsiFormatter.create(0))),
                        msfsSdk.FSComponent.buildComponent("div", null, "PSI"))),
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-brake-accumulator' },
                    msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-brake-line line', ref: this.line }),
                    msfsSdk.FSComponent.buildComponent(HydraulicAccumulatorIcon, { psi: this.props.psi })),
                msfsSdk.FSComponent.buildComponent("div", { class: 'hyd-synoptic-brake-psi' },
                    msfsSdk.FSComponent.buildComponent("span", { class: 'hyd-synoptic-psi', ref: this.accumulatorPsi }, this.psiFormatted),
                    " PSI")));
        }
    }
    /**
     * Creates a formatter for PSI values with rounding to nearest 100 and hysteresis of 70.
     */
    class PsiFormatter {
        /**
         * Creates a formatter for PSI values with rounding to nearest 100 and hysteresis of 70.
         * @param min The minimum PSI at or below which the formatter will report 0.
         * @returns The PSI formatter.
         */
        static create(min) {
            let currentVal = NaN;
            let currentValString = '';
            return (val) => {
                const valToOneHundred = Math.round(val / 100) * 100;
                if (isNaN(currentVal)) {
                    currentVal = valToOneHundred;
                    currentValString = currentVal.toFixed(0);
                }
                if (val <= min) {
                    if (currentVal !== 0) {
                        currentVal = 0;
                        currentValString = currentVal.toFixed(0);
                    }
                }
                else if (val >= currentVal + 70 || val <= currentVal - 70) {
                    currentVal = valToOneHundred;
                    currentValString = currentVal.toFixed(0);
                }
                return currentValString;
            };
        }
    }

    /**
     * A display pane view which displays the Pre-Flight Pane View.
     */
    class PreFlightSynopticsPane extends msfsWtg3000Common.DisplayPaneView {
        constructor() {
            super(...arguments);
            this.title = msfsSdk.Subject.create('Pre Flight');
            this.noTakeoffChecks = this.props.testSystem.noTakeoffChecks;
            this.tests = this.props.testSystem;
            this.inAir = msfsSdk.MappedSubject.create(([onGround, radioAlt]) => !onGround && radioAlt >= 100, msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('on_ground').whenChanged(), true), msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('radio_alt').withPrecision(-2), 0));
            this.leftRunning = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('n2_1'), 0).map(v => v > 58);
            this.rightRunning = msfsSdk.ConsumerSubject.create(this.props.bus.getSubscriber().on('n2_2'), 0).map(v => v > 58);
        }
        /**
         * Gets a CSS class for a test result.
         * @param sub The test result to get the class for.
         * @returns A subscribable of the CSS class.
         */
        getTestClass(sub) {
            return sub.map(v => {
                if (v === TestResult.Passed) {
                    return 'synoptic-preflight-pass';
                }
                else if (v === TestResult.Failed) {
                    return 'synoptic-preflight-fail';
                }
                else {
                    return '';
                }
            });
        }
        /**
         * Gets a CSS class for a no takeoff check.
         * @param sub The check to get the class for.
         * @returns A subscribable of the CSS class.
         */
        getCheckClass(sub) {
            return sub.map(v => {
                if (v) {
                    return 'synoptic-preflight-pass';
                }
                else {
                    return 'synoptic-preflight-fail';
                }
            });
        }
        /**
         * Gets the text for a no takeoff check.
         * @param sub The check to get the class for.
         * @param isPrevious Whether or not this is for the previous active check.
         * @returns A subscribable of the CSS class.
         */
        getCheckText(sub, isPrevious = false) {
            return sub.map(v => {
                if (v) {
                    return isPrevious ? '' : 'OK';
                }
                else {
                    return isPrevious ? '*' : 'CHECK';
                }
            });
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-preflight-container' },
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-preflight-o2-label' }, "O2 PRESSURE"),
                msfsSdk.FSComponent.buildComponent("div", { class: this.props.electrical.rMainBus.isActive.map(v => v ? 'o2press-container' : 'o2press-container visibility-hidden') },
                    msfsSdk.FSComponent.buildComponent("div", { class: "o2press-row" },
                        msfsSdk.FSComponent.buildComponent("div", { class: "o2-horizontal-gauge" },
                            msfsSdk.FSComponent.buildComponent("div", null),
                            msfsSdk.FSComponent.buildComponent("div", null)),
                        msfsSdk.FSComponent.buildComponent("div", { class: "o2-horizontal-gauge" },
                            msfsSdk.FSComponent.buildComponent("div", null),
                            msfsSdk.FSComponent.buildComponent("div", null))),
                    msfsSdk.FSComponent.buildComponent("div", { class: "o2press-row" },
                        msfsSdk.FSComponent.buildComponent("div", null,
                            "1800",
                            msfsSdk.FSComponent.buildComponent("span", null, " PSI")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            "1800",
                            msfsSdk.FSComponent.buildComponent("span", null, " PSI"))),
                    msfsSdk.FSComponent.buildComponent("div", { class: "o2press-left-pointer" },
                        msfsSdk.FSComponent.buildComponent("svg", { height: "14px", width: "14px" },
                            msfsSdk.FSComponent.buildComponent("path", { d: "M 0 0 l 14 0 l -7 13 z", fill: "green" }))),
                    msfsSdk.FSComponent.buildComponent("div", { class: "o2press-right-pointer" },
                        msfsSdk.FSComponent.buildComponent("svg", { height: "14px", width: "14px" },
                            msfsSdk.FSComponent.buildComponent("path", { d: "M 0 0 l 14 0 l -7 13 z", fill: "green" })))),
                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-preflight-propulsion' },
                    msfsSdk.FSComponent.buildComponent("h2", null, "PROPULSION"),
                    msfsSdk.FSComponent.buildComponent("table", null,
                        msfsSdk.FSComponent.buildComponent("thead", null,
                            msfsSdk.FSComponent.buildComponent("th", null),
                            msfsSdk.FSComponent.buildComponent("th", null, "L"),
                            msfsSdk.FSComponent.buildComponent("th", null, "R"),
                            msfsSdk.FSComponent.buildComponent("th", null)),
                        msfsSdk.FSComponent.buildComponent("tbody", null,
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "ENGINE SHUTDOWN"),
                                msfsSdk.FSComponent.buildComponent(EngineValue, { value: this.props.engineMonitor.leftEngineShutdownTime, engineRunning: this.leftRunning, type: 'shutdown' }),
                                msfsSdk.FSComponent.buildComponent(EngineValue, { value: this.props.engineMonitor.rightEngineShutdownTime, engineRunning: this.rightRunning, type: 'shutdown' }),
                                msfsSdk.FSComponent.buildComponent("td", null, "MIN")),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "DRY MOTOR"),
                                msfsSdk.FSComponent.buildComponent(EngineValue, { value: this.props.engineMonitor.leftTimeSinceDryMotor, engineRunning: this.leftRunning, type: 'drymotor' }),
                                msfsSdk.FSComponent.buildComponent(EngineValue, { value: this.props.engineMonitor.rightTimeSinceDryMotor, engineRunning: this.rightRunning, type: 'drymotor' }),
                                msfsSdk.FSComponent.buildComponent("td", null, "MIN"))))),
                msfsSdk.FSComponent.buildComponent("div", { class: this.inAir.map(v => v ? 'synoptic-preflight-auto-test visibility-hidden' : 'synoptic-preflight-auto-test') },
                    msfsSdk.FSComponent.buildComponent("h2", null, "AUTO TEST"),
                    msfsSdk.FSComponent.buildComponent("table", null,
                        msfsSdk.FSComponent.buildComponent("thead", null,
                            msfsSdk.FSComponent.buildComponent("th", null,
                                msfsSdk.FSComponent.buildComponent("span", null, "SYSTEM")),
                            msfsSdk.FSComponent.buildComponent("th", null, "STATUS")),
                        msfsSdk.FSComponent.buildComponent("tbody", null,
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "FUEL PRESSURE L"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.leftFuelSystemTest.testResult) }, this.tests.leftFuelSystemTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "FUEL PRESSURE R"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.rightFuelSystemTest.testResult) }, this.tests.rightFuelSystemTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "HYD PRESSURE A"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.hydPressureATest.testResult) }, this.tests.hydPressureATest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "HYD PRESSURE B"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.hydPressureBTest.testResult) }, this.tests.hydPressureBTest.testResult))))),
                msfsSdk.FSComponent.buildComponent("div", { class: this.inAir.map(v => v ? 'synoptic-preflight-power-on visibility-hidden' : 'synoptic-preflight-power-on') },
                    msfsSdk.FSComponent.buildComponent("h2", null, "POWER ON"),
                    msfsSdk.FSComponent.buildComponent("table", null,
                        msfsSdk.FSComponent.buildComponent("tbody", null,
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "BLEED LEAK"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.bleedLeakTest.testResult) }, this.tests.bleedLeakTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "CVR"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.cvrTest.testResult) }, this.tests.cvrTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "FLAPS"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.flapsTest.testResult) }, this.tests.flapsTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "FUEL LEVEL LOW"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.fuelLevelLowTest.testResult) }, this.tests.fuelLevelLowTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "ICE DETECTION"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.iceDetectorTest.testResult) }, this.tests.iceDetectorTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "PRESSURIZATION"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.pressurizationTest.testResult) }, this.tests.pressurizationTest.testResult))))),
                msfsSdk.FSComponent.buildComponent("div", { class: this.inAir.map(v => v ? 'synoptic-preflight-taxi visibility-hidden' : 'synoptic-preflight-taxi') },
                    msfsSdk.FSComponent.buildComponent("h2", null, "TAXI"),
                    msfsSdk.FSComponent.buildComponent("table", null,
                        msfsSdk.FSComponent.buildComponent("tbody", null,
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "SPOILERS"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.spoilersTest.testResult) }, this.tests.spoilersTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "TAIL DE-ICE"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.tailDeiceTest.testResult) }, this.tests.tailDeiceTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "WING ANTI-ICE"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.wingAiTest.testResult) }, this.tests.wingAiTest.testResult)),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "PROBE/CASE HEATERS"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getTestClass(this.tests.pitotHeatTest.testResult) }, this.tests.pitotHeatTest.testResult))))),
                msfsSdk.FSComponent.buildComponent("div", { class: this.inAir.map(v => v ? 'synoptic-preflight-no-takeoff visibility-hidden' : 'synoptic-preflight-no-takeoff') },
                    msfsSdk.FSComponent.buildComponent("h2", null, "NO TAKEOFF"),
                    msfsSdk.FSComponent.buildComponent("table", null,
                        msfsSdk.FSComponent.buildComponent("thead", null,
                            msfsSdk.FSComponent.buildComponent("th", null,
                                msfsSdk.FSComponent.buildComponent("div", { class: 'synoptic-preflight-message-input' }, "MESSAGE INPUT")),
                            msfsSdk.FSComponent.buildComponent("th", null,
                                "CURRENT",
                                msfsSdk.FSComponent.buildComponent("br", null),
                                "STATUS"),
                            msfsSdk.FSComponent.buildComponent("th", null,
                                "ACTIVE ON",
                                msfsSdk.FSComponent.buildComponent("br", null),
                                "PREVIOUS")),
                        msfsSdk.FSComponent.buildComponent("tbody", null,
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "PARK BRAKE"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.parkBrake) }, this.getCheckText(this.noTakeoffChecks.current.parkBrake)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.parkBrake, true))),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "PITCH/ROLL DISC"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.pitchRollDisc) }, this.getCheckText(this.noTakeoffChecks.current.pitchRollDisc)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.pitchRollDisc, true))),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "AILERON TRIM"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.aileronTrim) }, this.getCheckText(this.noTakeoffChecks.current.aileronTrim)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.aileronTrim, true))),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "STABILIZER TRIM"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.stabilizerTrim) }, this.getCheckText(this.noTakeoffChecks.current.stabilizerTrim)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.stabilizerTrim, true))),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "RUDDER TRIM"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.rudderTrim) }, this.getCheckText(this.noTakeoffChecks.current.rudderTrim)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.rudderTrim, true))),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "FLAPS"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.flaps) }, this.getCheckText(this.noTakeoffChecks.current.flaps)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.flaps, true))),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "SPOILERS"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.spoilers) }, this.getCheckText(this.noTakeoffChecks.current.spoilers)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.spoilers, true))),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "SPEEDBRAKE HANDLE"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.speedbrakeHandle) }, this.getCheckText(this.noTakeoffChecks.current.speedbrakeHandle)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.speedbrakeHandle, true))),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "CONTROL LOCK ON"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.controlLockOn) }, this.getCheckText(this.noTakeoffChecks.current.controlLockOn)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.controlLockOn, true))),
                            msfsSdk.FSComponent.buildComponent("tr", null,
                                msfsSdk.FSComponent.buildComponent("td", null, "CABIN DOOR OPEN"),
                                msfsSdk.FSComponent.buildComponent("td", { class: this.getCheckClass(this.noTakeoffChecks.current.cabinDoorOpen) }, this.getCheckText(this.noTakeoffChecks.current.cabinDoorOpen)),
                                msfsSdk.FSComponent.buildComponent("td", null, this.getCheckText(this.noTakeoffChecks.previous.cabinDoorOpen, true))))))));
        }
    }
    /**
     * Displays an engine monitor value.
     */
    class EngineValue extends msfsSdk.DisplayComponent {
        constructor() {
            super(...arguments);
            this.formatter = msfsSdk.NumberFormatter.create({ precision: 1, round: -1, nanString: '---' });
            this.minuteValue = this.props.value.map(v => Math.floor(msfsSdk.UnitType.MILLISECOND.convertTo(v, msfsSdk.UnitType.MINUTE)));
            this.displayValue = this.minuteValue.map(v => v >= 181 ? '180+' : this.formatter(v));
            this.classValue = msfsSdk.MappedSubject.create(([v, eng]) => {
                if (isNaN(v)) {
                    return 'synoptic-preflight-engine-value invalid';
                }
                else {
                    if ((this.props.type === 'shutdown' && eng) || (this.props.type === 'drymotor' && v >= 40)) {
                        return 'synoptic-preflight-engine-value visibility-hidden';
                    }
                    else {
                        return 'synoptic-preflight-engine-value';
                    }
                }
            }, this.minuteValue, this.props.engineRunning);
        }
        /** @inheritdoc */
        render() {
            return msfsSdk.FSComponent.buildComponent("td", { class: this.classValue }, this.displayValue);
        }
    }

    /**
     * A display pane view which displays the Fuel Synoptics Pane View.
     */
    class SummarySynopticsPane extends msfsWtg3000Common.DisplayPaneView {
        constructor() {
            super(...arguments);
            this.title = msfsSdk.Subject.create('Summary');
            this.basicFormatter = msfsSdk.NumberFormatter.create({ precision: 1 });
            this.settings = LongitudeUserSettings.getManager(this.props.bus);
            this.beaconLightsText = msfsSdk.MappedSubject.create(([mode, isOn]) => {
                switch (mode) {
                    case BeaconLightsMode.Normal:
                        return isOn ? 'ON' : 'OFF';
                    case BeaconLightsMode.On:
                        return 'ON';
                    case BeaconLightsMode.Off:
                        return 'OFF';
                }
            }, this.settings.getSetting('lightsBeaconMode'), this.props.lights.beaconLightsOn);
            this.beaconLightsClass = this.settings.getSetting('lightsBeaconMode')
                .map(v => v === BeaconLightsMode.Normal ? 'summary-synoptic-bcn-green' : '');
        }
        /** @inheritdoc */
        render() {
            return (msfsSdk.FSComponent.buildComponent("div", { class: "summary-synoptic-container" },
                msfsSdk.FSComponent.buildComponent("div", { class: "summary-block" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "summary-title" }, "ELECTRICAL"),
                    msfsSdk.FSComponent.buildComponent("div", { class: "elec-grid" },
                        msfsSdk.FSComponent.buildComponent("div", null, " "),
                        msfsSdk.FSComponent.buildComponent("div", null, "L"),
                        msfsSdk.FSComponent.buildComponent("div", null, "APU"),
                        msfsSdk.FSComponent.buildComponent("div", null, "R"),
                        msfsSdk.FSComponent.buildComponent("div", null, "GEN LOAD"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.leftGenerator.loadPct.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " %")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.apuGenerator.loadPct.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " %")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.rightGenerator.loadPct.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " %")),
                        msfsSdk.FSComponent.buildComponent("div", null, "GEN VOLTS"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.leftGenerator.volts.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " V")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.apuGenerator.volts.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " V")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.rightGenerator.volts.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " V")),
                        msfsSdk.FSComponent.buildComponent("div", null, "BATT AMPS"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.leftBattery.amps.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " A")),
                        msfsSdk.FSComponent.buildComponent("div", null),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.rightBattery.amps.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " A")),
                        msfsSdk.FSComponent.buildComponent("div", null, "BATT VOLTS"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.leftBattery.voltage.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " V")),
                        msfsSdk.FSComponent.buildComponent("div", null),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.rightBattery.voltage.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " V")),
                        msfsSdk.FSComponent.buildComponent("div", null, "BATT TEMP"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.leftBattery.temp.value.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.electrical.rightBattery.temp.value.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")))),
                msfsSdk.FSComponent.buildComponent("div", { class: "summary-block" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "summary-title" }, "HYDRAULICS"),
                    msfsSdk.FSComponent.buildComponent("div", { class: "hyd-grid" },
                        msfsSdk.FSComponent.buildComponent("div", null, " "),
                        msfsSdk.FSComponent.buildComponent("div", null, "A"),
                        msfsSdk.FSComponent.buildComponent("div", null, "B"),
                        msfsSdk.FSComponent.buildComponent("div", null, "PRESSURE"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.outputs.leftSystemPressure.value, precision: 100, warningRange: { low: 0, high: 2400 } }),
                            msfsSdk.FSComponent.buildComponent("span", null, " PSI")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.outputs.rightSystemPressure.value, precision: 100, warningRange: { low: 0, high: 2400 } }),
                            msfsSdk.FSComponent.buildComponent("span", null, " PSI")),
                        msfsSdk.FSComponent.buildComponent("div", null, "TEMP"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.hydraulics.outputs.leftSystemTemp.value.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.hydraulics.outputs.rightSystemTemp.value.map(this.basicFormatter),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null, "QTY"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.hydraulics.outputs.leftSystemTank.value.map(v => Math.round((v / 370) * 100)),
                            msfsSdk.FSComponent.buildComponent("span", null, " %")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.hydraulics.outputs.rightSystemTank.value.map(v => Math.round((v / 370) * 100)),
                            msfsSdk.FSComponent.buildComponent("span", null, " %")))),
                msfsSdk.FSComponent.buildComponent("div", { class: "summary-block" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "summary-title" }, "BRAKES"),
                    msfsSdk.FSComponent.buildComponent("div", { class: "brake-grid" },
                        msfsSdk.FSComponent.buildComponent("div", null, " "),
                        msfsSdk.FSComponent.buildComponent("div", null, "L OUTBD"),
                        msfsSdk.FSComponent.buildComponent("div", null, "L INBD"),
                        msfsSdk.FSComponent.buildComponent("div", null, "R INBD"),
                        msfsSdk.FSComponent.buildComponent("div", null, "R OUTBD"),
                        msfsSdk.FSComponent.buildComponent("div", null, "PRESSURE"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.hydraulics.brakeSystem.outboardLeftBrakePsi.value.map(SynopticNumberFormatter.create(100, 0)),
                            msfsSdk.FSComponent.buildComponent("span", null, " PSI")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.hydraulics.brakeSystem.inboardLeftBrakePsi.value.map(SynopticNumberFormatter.create(100, 0)),
                            msfsSdk.FSComponent.buildComponent("span", null, " PSI")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.hydraulics.brakeSystem.outboardRightBrakePsi.value.map(SynopticNumberFormatter.create(100, 0)),
                            msfsSdk.FSComponent.buildComponent("span", null, " PSI")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.hydraulics.brakeSystem.inboardRightBrakePsi.value.map(SynopticNumberFormatter.create(100, 0)),
                            msfsSdk.FSComponent.buildComponent("span", null, " PSI")),
                        msfsSdk.FSComponent.buildComponent("div", null, "TEMP"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.brakeSystem.outboardLeftBrakeTemp.value, warningRange: { low: 450, high: 9999 } }),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.brakeSystem.inboardLeftBrakeTemp.value, warningRange: { low: 450, high: 9999 } }),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.brakeSystem.outboardRightBrakeTemp.value, warningRange: { low: 450, high: 9999 } }),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            msfsSdk.FSComponent.buildComponent(ValueDisplay, { value: this.props.hydraulics.brakeSystem.outboardLeftBrakeTemp.value, warningRange: { low: 450, high: 9999 } }),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")))),
                msfsSdk.FSComponent.buildComponent("div", { class: "summary-block" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "summary-title" }, "ECS"),
                    msfsSdk.FSComponent.buildComponent("div", { class: "ecs-grid" },
                        msfsSdk.FSComponent.buildComponent("div", null, " "),
                        msfsSdk.FSComponent.buildComponent("div", null, "CABIN"),
                        msfsSdk.FSComponent.buildComponent("div", null, "COCKPIT"),
                        msfsSdk.FSComponent.buildComponent("div", null, "SELECTED"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.ecs.cabinSetTemp.map(SynopticNumberFormatter.create(1)),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.ecs.cockpitSetTemp.map(SynopticNumberFormatter.create(1)),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null, "CURRENT"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.ecs.cabinTemp.value.map(SynopticNumberFormatter.create(1)),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.ecs.cockpitTemp.value.map(SynopticNumberFormatter.create(1)),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null, "SUPPLY"),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.ecs.leftSupplyTemp.map(SynopticNumberFormatter.create(1)),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")),
                        msfsSdk.FSComponent.buildComponent("div", null,
                            this.props.ecs.rightSupplyTemp.map(SynopticNumberFormatter.create(1)),
                            msfsSdk.FSComponent.buildComponent("span", null, " \u00B0C")))),
                msfsSdk.FSComponent.buildComponent("div", { class: "summary-block" },
                    msfsSdk.FSComponent.buildComponent("div", { class: "summary-title" }, "LIGHTS"),
                    msfsSdk.FSComponent.buildComponent("div", { class: "lights-grid" },
                        msfsSdk.FSComponent.buildComponent("div", null, "SYSTEM"),
                        msfsSdk.FSComponent.buildComponent("div", null, "STATUS"),
                        msfsSdk.FSComponent.buildComponent("div", null, "NAV"),
                        msfsSdk.FSComponent.buildComponent("div", null, this.settings.getSetting('lightsNavigationOn').map(v => v ? 'ON' : 'OFF')),
                        msfsSdk.FSComponent.buildComponent("div", null, "BEACON"),
                        msfsSdk.FSComponent.buildComponent("div", { class: this.beaconLightsClass }, this.beaconLightsText),
                        msfsSdk.FSComponent.buildComponent("div", null, "PULSE WITH TCAS TA/RA"),
                        msfsSdk.FSComponent.buildComponent("div", null, this.settings.getSetting('lightsPulseTaRaOn').map(v => v ? 'ON' : 'OFF')))),
                msfsSdk.FSComponent.buildComponent("div", null,
                    msfsSdk.FSComponent.buildComponent("div", { class: "summary-title" }, "O2 PRESSURE"),
                    msfsSdk.FSComponent.buildComponent("div", { class: "o2press-container" },
                        msfsSdk.FSComponent.buildComponent("div", { class: "o2press-row" },
                            msfsSdk.FSComponent.buildComponent("div", { class: "o2-horizontal-gauge" },
                                msfsSdk.FSComponent.buildComponent("div", null),
                                msfsSdk.FSComponent.buildComponent("div", null)),
                            msfsSdk.FSComponent.buildComponent("div", { class: "o2-horizontal-gauge" },
                                msfsSdk.FSComponent.buildComponent("div", null),
                                msfsSdk.FSComponent.buildComponent("div", null))),
                        msfsSdk.FSComponent.buildComponent("div", { class: "o2press-row" },
                            msfsSdk.FSComponent.buildComponent("div", null,
                                "1800",
                                msfsSdk.FSComponent.buildComponent("span", null, " PSI")),
                            msfsSdk.FSComponent.buildComponent("div", null,
                                "1800",
                                msfsSdk.FSComponent.buildComponent("span", null, " PSI"))),
                        msfsSdk.FSComponent.buildComponent("div", { class: "o2press-left-pointer" },
                            msfsSdk.FSComponent.buildComponent("svg", { height: "14px", width: "14px" },
                                msfsSdk.FSComponent.buildComponent("path", { d: "M 0 0 l 14 0 l -7 13 z", fill: "green" }))),
                        msfsSdk.FSComponent.buildComponent("div", { class: "o2press-right-pointer" },
                            msfsSdk.FSComponent.buildComponent("svg", { height: "14px", width: "14px" },
                                msfsSdk.FSComponent.buildComponent("path", { d: "M 0 0 l 14 0 l -7 13 z", fill: "green" })))))));
        }
    }

    /**
     * A battery in the electrical system.
     */
    class ElectricalBattery {
        /**
         * Creates an instance of an ElectricalBattery.
         * @param bus The event bus to use with this instance.
         * @param batteryIndex The index of the battery.
         * @param batteryBusIndex The index of the battery's hot battery bus.
         * @param emerBusIndex The index of the emergency bus the battery will connect to when connected.
         * @param connectionSimVar The simvar that indicates if this battery's hot bus is connected to the main bus.
         */
        constructor(bus, batteryIndex, batteryBusIndex, emerBusIndex, connectionSimVar) {
            this.bus = bus;
            this.batteryIndex = batteryIndex;
            this.batteryBusIndex = batteryBusIndex;
            this.emerBusIndex = emerBusIndex;
            this.connectionSimVar = connectionSimVar;
            /** The current battery voltage. */
            this.voltage = msfsSdk.Subject.create(0);
            /** The current amps at the battery. */
            this.amps = msfsSdk.Subject.create(0);
            /** The current temperature of the battery. */
            this.temp = new msfsSdk.TemperatureSystem(500);
            /** Whether or not the battery is connected. */
            this.isConnected = msfsSdk.Subject.create(false);
            this.batAmbientTemp = 0;
            this.tempIsInitialized = false;
            this.simAmps = 0;
            this.soc = 0;
            this.socSimvar = `ELECTRICAL BATTERY ESTIMATED CAPACITY PCT:${batteryIndex}`;
            this.busVoltsSimvar = `ELECTRICAL MAIN BUS VOLTAGE:${batteryBusIndex}`;
            this.busAmpsSimvar = `ELECTRICAL BATTERY LOAD:${batteryIndex}`;
            this.batteryVoltsSimvar = `ELECTRICAL BATTERY VOLTAGE:${batteryIndex}`;
            this.temp.addSource({ temperature: 0, conductivity: 2 });
            this.temp.addSource({ temperature: 0, conductivity: 0 });
        }
        /**
         * Updates the state of the battery.
         * @param deltaTime The delta time, in millliseconds simtime.
         */
        update(deltaTime) {
            this.updateSimvars();
            this.calculateCurrent();
            this.calculateCurrentHeating(deltaTime);
        }
        /**
         * Sets the ambient temperature the battery is seeing.
         * @param temp The temperature to set.
         */
        setBatteryAmbientTemp(temp) {
            this.batAmbientTemp = temp;
            this.temp.setSourceTemp(0, temp);
            if (!this.tempIsInitialized) {
                this.temp.set(temp);
                this.tempIsInitialized = true;
            }
        }
        /**
         * Sets the sim bus connection state.
         * @param manager The key event manager to use.
         * @param isConnected Whether or not the battery bus should be connected.
         */
        setSimConnection(manager, isConnected) {
            const connected = SimVar.GetSimVarValue(this.connectionSimVar, msfsSdk.SimVarValueType.Number) === 1;
            if (isConnected !== connected) {
                manager.triggerKey('ELECTRICAL_BUS_TO_BUS_CONNECTION_TOGGLE', true, this.batteryBusIndex, this.emerBusIndex);
            }
        }
        /**
         * Updates the simvars for the battery.
         */
        updateSimvars() {
            this.isConnected.set(SimVar.GetSimVarValue(this.connectionSimVar, msfsSdk.SimVarValueType.Number) === 1);
            this.voltage.set(this.isConnected.get()
                ? SimVar.GetSimVarValue(this.busVoltsSimvar, msfsSdk.SimVarValueType.Volts)
                : SimVar.GetSimVarValue(this.batteryVoltsSimvar, msfsSdk.SimVarValueType.Volts));
            this.simAmps = SimVar.GetSimVarValue(this.busAmpsSimvar, msfsSdk.SimVarValueType.Amps);
            this.soc = SimVar.GetSimVarValue(this.socSimvar, msfsSdk.SimVarValueType.Percent);
        }
        /**
         * Calculates the current seen on the battery.
         */
        calculateCurrent() {
            const battCurrentSource = this.simAmps;
            let battCurrent = 0;
            if (battCurrentSource < 0) {
                const chargingVolts = Math.max(this.voltage.get(), ElectricalBattery.V_MAX);
                const soc = this.soc;
                const ocv = soc / 100 * (chargingVolts - ElectricalBattery.V_MIN) + ElectricalBattery.V_MIN;
                const chargingPotential = chargingVolts - ocv;
                const chargingCurrent = chargingPotential / ElectricalBattery.R;
                battCurrent = -chargingCurrent;
            }
            else {
                battCurrent = battCurrentSource;
            }
            this.amps.set(-battCurrent);
        }
        /**
         * Calculates heating provided by current flow.
         * @param deltaTime The delta time, in millliseconds simtime.
         */
        calculateCurrentHeating(deltaTime) {
            const heatScalar = Math.min(Math.abs(this.amps.get()), 20) / 20;
            const spread = 52 - this.batAmbientTemp;
            this.temp.setSourceConductivity(1, (10 + (this.batteryIndex / 2)) * heatScalar);
            this.temp.setSourceTemp(1, Math.max(this.batAmbientTemp + (spread * heatScalar), this.temp.value.get()));
            this.temp.update(msfsSdk.MathUtils.clamp(deltaTime, 0, 10000));
        }
    }
    ElectricalBattery.V_MAX = 26.4;
    ElectricalBattery.V_MIN = 23;
    ElectricalBattery.R = 0.05;

    /**
     * An electrical bus within the electrical system.
     */
    class ElectricalBus {
        /**
         * Creates an instance of an ElectricalBus.
         * @param busIndex The index of the bus.
         */
        constructor(busIndex) {
            this.busIndex = busIndex;
            this._isActive = msfsSdk.Subject.create(false);
            this.simvar = `ELECTRICAL MAIN BUS VOLTAGE:${busIndex}`;
        }
        /**
         * Gets the active status of the bus.
         * @returns The active status of the bus.
         */
        get isActive() {
            return this._isActive;
        }
        /**
         * Updates the electrical bus.
         */
        update() {
            this._isActive.set(SimVar.GetSimVarValue(this.simvar, msfsSdk.SimVarValueType.Volts) > 24);
        }
    }

    /**
     * An electrical connection in the electrical system.
     */
    class ElectricalBusConnection {
        /**
         * Creates an instance of an ElectricalConnection.
         * @param sourceIndex The source bus index.
         * @param destIndex The dest bus index.
         * @param connectionSimVar The optional simvar to automatically set the connected status from.
         * @param isPrimary Whether this instance is a primary sim-controlling instance.
         */
        constructor(sourceIndex, destIndex, connectionSimVar, isPrimary) {
            this.sourceIndex = sourceIndex;
            this.destIndex = destIndex;
            this.connectionSimVar = connectionSimVar;
            this.isPrimary = isPrimary;
            /** Whether or not the connection is connected. */
            this.isConnected = msfsSdk.Subject.create(false);
            /** Whether the connection has active power flowing. */
            this.isActive = msfsSdk.Subject.create(false);
            this.stateChangeTime = -1;
        }
        /**
         * Updates the connection.
         * @param deltaTime The delta time, in milliseconds simtime.
         */
        update(deltaTime) {
            var _a;
            this.isConnected.set(SimVar.GetSimVarValue(this.connectionSimVar, msfsSdk.SimVarValueType.Number) === 1);
            if (this.isPrimary && this.stateChangeTime !== -1) {
                this.stateChangeTime -= deltaTime;
                if (this.stateChangeTime < 0) {
                    this.toggleSimConnection((_a = this.connectedSignal) !== null && _a !== void 0 ? _a : false);
                    this.stateChangeTime = -1;
                }
            }
        }
        /**
         * Sets the sim key event manager to use.
         * @param keyEventManager The key event manager.
         */
        setKeyEventManager(keyEventManager) {
            this.keyEventManager = keyEventManager;
        }
        /**
         * Sets the signal that this generator should be connected to the bus.
         * @param connected Whether or not the generator should be connected.
         */
        setConnected(connected) {
            if (this.connectedSignal !== connected) {
                this.connectedSignal = connected;
                this.stateChangeTime = 1000;
            }
        }
        /**
         * Sets the generator to bus connection in the sim.
         * @param connected Whether or not the generator is connected.
         */
        toggleSimConnection(connected) {
            var _a;
            const simConnected = SimVar.GetSimVarValue(this.connectionSimVar, msfsSdk.SimVarValueType.Number) === 1;
            if (connected !== simConnected) {
                (_a = this.keyEventManager) === null || _a === void 0 ? void 0 : _a.triggerKey('ELECTRICAL_BUS_TO_BUS_CONNECTION_TOGGLE', true, this.sourceIndex, this.destIndex);
            }
        }
    }

    /**
     * An electrical generator.
     */
    class ElectricalGenerator {
        /**
         * Creates an instance of en ElectricalGenerator.
         * @param bus The event bus to use with this instance.
         * @param index The index of the generator.
         * @param busIndex The index of the bus the generator is connected to.
         * @param connectionSimVar The simvar that indicates if the generator is connected to the bus.
         * @param isPrimary Whether this instance is a primary sim-controlling instance.
         */
        constructor(bus, index, busIndex, connectionSimVar, isPrimary) {
            this.bus = bus;
            this.index = index;
            this.busIndex = busIndex;
            this.connectionSimVar = connectionSimVar;
            this.isPrimary = isPrimary;
            /** Whether the generator switch is on. */
            this.switchOn = msfsSdk.Subject.create(true);
            /** Whether the generator is connected to the bus. */
            this.isConnected = msfsSdk.Subject.create(false);
            /** Whether the generator is available for power. */
            this.isAvailable = msfsSdk.Subject.create(false);
            /** The voltage output by this generator. */
            this.volts = msfsSdk.Subject.create(0);
            /** The percentage of available load consumed from the generator. */
            this.loadPct = msfsSdk.Subject.create(0);
            this.stateChangeTime = -1;
            this.voltSimvar = `ELECTRICAL GENALT BUS VOLTAGE:${index}`;
            this.loadSimvar = `ELECTRICAL GENALT LOAD:${index}`;
        }
        /**
         * Updates the generator.
         * @param deltaTime The delta time, in milliseconds simtime.
         */
        update(deltaTime) {
            var _a;
            this.volts.set(SimVar.GetSimVarValue(this.voltSimvar, msfsSdk.SimVarValueType.Volts));
            this.isConnected.set(SimVar.GetSimVarValue(this.connectionSimVar, msfsSdk.SimVarValueType.Number) === 1);
            if (this.volts.get() > 1) {
                this.loadPct.set(this.isConnected.get() ? SimVar.GetSimVarValue(this.loadSimvar, msfsSdk.SimVarValueType.Percent) : 0);
            }
            else {
                this.loadPct.set(0);
            }
            if (this.isPrimary && this.stateChangeTime !== -1) {
                this.stateChangeTime -= deltaTime;
                if (this.stateChangeTime < 0) {
                    this.toggleSimConnection((_a = this.connectedSignal) !== null && _a !== void 0 ? _a : false);
                    this.stateChangeTime = -1;
                }
            }
        }
        /**
         * Sets the sim key event manager to use.
         * @param keyEventManager The key event manager.
         */
        setKeyEventManager(keyEventManager) {
            this.keyEventManager = keyEventManager;
        }
        /**
         * Sets the signal that this generator should be connected to the bus.
         * @param connected Whether or not the generator should be connected.
         */
        setConnected(connected) {
            if (this.connectedSignal !== connected) {
                this.connectedSignal = connected;
                this.stateChangeTime = 1000;
            }
        }
        /**
         * Sets the generator to bus connection in the sim.
         * @param connected Whether or not the generator is connected.
         */
        toggleSimConnection(connected) {
            var _a;
            const simConnected = SimVar.GetSimVarValue(this.connectionSimVar, msfsSdk.SimVarValueType.Number) === 1;
            if (connected !== simConnected) {
                (_a = this.keyEventManager) === null || _a === void 0 ? void 0 : _a.triggerKey('ELECTRICAL_BUS_TO_ALTERNATOR_CONNECTION_TOGGLE', true, this.busIndex, this.index);
            }
        }
    }

    /**
     * The hydraulic electrical generator.
     */
    class HydraulicGenerator {
        constructor() {
            /** Whether the generator is available for power. */
            this.isAvailable = msfsSdk.Subject.create(false);
            /** The voltage output by this generator. */
            this.volts = msfsSdk.Subject.create(0);
            /** The percentage of available load consumed from the generator. */
            this.loadPct = msfsSdk.Subject.create(0);
        }
        /**
         * Updates the generator.
         */
        update() {
            const volts1 = SimVar.GetSimVarValue('ELECTRICAL GENALT BUS VOLTAGE:4', msfsSdk.SimVarValueType.Volts);
            const volts2 = SimVar.GetSimVarValue('ELECTRICAL GENALT BUS VOLTAGE:5', msfsSdk.SimVarValueType.Volts);
            const load1 = SimVar.GetSimVarValue('ELECTRICAL GENALT LOAD:4', msfsSdk.SimVarValueType.Percent);
            const load2 = SimVar.GetSimVarValue('ELECTRICAL GENALT LOAD:5', msfsSdk.SimVarValueType.Percent);
            const isOn = SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:4', msfsSdk.SimVarValueType.Bool) === 1
                || SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:5', msfsSdk.SimVarValueType.Bool) === 1;
            this.loadPct.set(isOn ? Math.max(load1, load2) : 0);
            this.volts.set(isOn ? Math.max(volts1, volts2) : 0);
            this.isAvailable.set(isOn);
        }
    }

    /**
     * The Longitude electrical system.
     */
    class LongitudeElectricalSystem {
        /**
         * Creates an instance of the LongitudeElectricalSystem.
         * @param bus The event bus to use with this instance.
         * @param ecs The ECS system to read for temperatures.
         * @param isPrimary Whether or not this is the primary sim-controlling instance.
         */
        constructor(bus, ecs, isPrimary) {
            this.bus = bus;
            this.ecs = ecs;
            this.isPrimary = isPrimary;
            this.leftBattery = new ElectricalBattery(this.bus, 1, 3, 5, 'L:WT_LNG_L_EMER_BATT_CONN');
            this.rightBattery = new ElectricalBattery(this.bus, 2, 4, 6, 'L:WT_LNG_R_EMER_BATT_CONN');
            this.leftGenerator = new ElectricalGenerator(this.bus, 1, 1, 'L:WT_LNG_L_MISSION_GEN_CONN', this.isPrimary);
            this.rightGenerator = new ElectricalGenerator(this.bus, 2, 2, 'L:WT_LNG_R_MISSION_GEN_CONN', this.isPrimary);
            this.apuGenerator = new ElectricalGenerator(this.bus, 3, 5, 'L:WT_LNG_L_EMER_GEN_CONN', this.isPrimary);
            this.hydraulicGenerator = new HydraulicGenerator();
            this.busTieConn = new ElectricalBusConnection(5, 6, 'L:WT_LNG_BUS_TIE_CONN', this.isPrimary);
            this.extPowerConn = msfsSdk.Subject.create(false);
            this.lMainMissionConn = new ElectricalBusConnection(7, 1, 'L:WT_LNG_L_MAIN_MISSION_CONN', this.isPrimary);
            this.lInt1MissionConn = new ElectricalBusConnection(9, 1, 'L:WT_LNG_L_INT1_MISSION_CONN', this.isPrimary);
            this.lInt2MissionConn = new ElectricalBusConnection(10, 1, 'L:WT_LNG_L_INT2_MISSION_CONN', this.isPrimary);
            this.lMissionEmerConn = new ElectricalBusConnection(1, 5, 'L:WT_LNG_L_MISSION_EMER_CONN', this.isPrimary);
            this.rMainMissionConn = new ElectricalBusConnection(8, 2, 'L:WT_LNG_R_MAIN_MISSION_CONN', this.isPrimary);
            this.rInt1MissionConn = new ElectricalBusConnection(11, 2, 'L:WT_LNG_R_INT1_MISSION_CONN', this.isPrimary);
            this.rInt2MissionConn = new ElectricalBusConnection(12, 2, 'L:WT_LNG_R_INT2_MISSION_CONN', this.isPrimary);
            this.rMissionEmerConn = new ElectricalBusConnection(2, 6, 'L:WT_LNG_R_MISSION_EMER_CONN', this.isPrimary);
            this.lMissionBus = new ElectricalBus(1);
            this.rMissionBus = new ElectricalBus(2);
            this.lEmerBus = new ElectricalBus(5);
            this.rEmerBus = new ElectricalBus(6);
            this.lMainBus = new ElectricalBus(7);
            this.rMainBus = new ElectricalBus(8);
            this.lInt1Bus = new ElectricalBus(9);
            this.lInt2Bus = new ElectricalBus(10);
            this.rInt1Bus = new ElectricalBus(11);
            this.rInt2Bus = new ElectricalBus(12);
            this.onGround = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('on_ground'), true);
            this.leftN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_1'), 0);
            this.rightN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_2'), 0);
            this.apuRpmPct = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('apu_pct'), 0);
            this.avionicsPower = msfsSdk.Subject.create(false);
            this.bothBatteriesWereOn = false;
            this.previousTimestamp = -1;
            if (this.isPrimary) {
                this.initPrimary();
                this.bus.getSubscriber().on('key_intercept').handle(this.onKeyIntercepted.bind(this));
            }
            let previousState = undefined;
            const apuSub = msfsSdk.GameStateProvider.get().sub(state => {
                var _a;
                if (previousState === GameState.briefing && state === GameState.ingame) {
                    (_a = this.keyEventManager) === null || _a === void 0 ? void 0 : _a.triggerKey('APU_OFF_SWITCH', true);
                    apuSub.destroy();
                }
                previousState = state;
            }, false, true);
            apuSub.resume(true);
            msfsSdk.Wait.awaitSubscribable(msfsSdk.GameStateProvider.get(), state => state === GameState.ingame, true).then(() => {
                this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
            });
        }
        /**
         * Initializes the primary instance.
         */
        initPrimary() {
            msfsSdk.KeyEventManager.getManager(this.bus).then(keyEventManager => {
                keyEventManager.interceptKey('BATTERY1_SET', false);
                keyEventManager.interceptKey('BATTERY2_SET', false);
                keyEventManager.interceptKey('MASTER_BATTERY_OFF', false);
                keyEventManager.interceptKey('MASTER_BATTERY_ON', false);
                keyEventManager.interceptKey('MASTER_BATTERY_SET', false);
                keyEventManager.interceptKey('TOGGLE_MASTER_BATTERY', false);
                keyEventManager.interceptKey('ALTERNATOR_OFF', false);
                keyEventManager.interceptKey('ALTERNATOR_ON', false);
                keyEventManager.interceptKey('ALTERNATOR_SET', false);
                keyEventManager.interceptKey('TOGGLE_ALTERNATOR1', false);
                keyEventManager.interceptKey('TOGGLE_ALTERNATOR2', false);
                keyEventManager.interceptKey('TOGGLE_MASTER_ALTERNATOR', false);
                keyEventManager.interceptKey('ELECTRICAL_BUS_TO_BUS_CONNECTION_TOGGLE', false);
                keyEventManager.interceptKey('APU_GENERATOR_SWITCH_TOGGLE', false);
                keyEventManager.interceptKey('APU_GENERATOR_SWITCH_SET', false);
                this.keyEventManager = keyEventManager;
                this.leftGenerator.setKeyEventManager(keyEventManager);
                this.rightGenerator.setKeyEventManager(keyEventManager);
                this.apuGenerator.setKeyEventManager(keyEventManager);
                this.busTieConn.setKeyEventManager(keyEventManager);
                this.avionicsPower.sub(v => SimVar.SetSimVarValue('L:WT_LNG_AVIONICS_POWER_ACTIVE', msfsSdk.SimVarValueType.Number, v ? 1 : 0));
            });
        }
        /**
         * Updates the electrical system.
         * @param timestamp The timestamp, in milliseconds simtime.
         */
        update(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
            }
            const deltaTime = msfsSdk.NavMath.clamp(timestamp - this.previousTimestamp, 0, 10000);
            this.leftBattery.setBatteryAmbientTemp(this.ecs.cabinTemp.value.get());
            this.leftBattery.update(deltaTime);
            this.rightBattery.setBatteryAmbientTemp(this.ecs.cabinTemp.value.get());
            this.rightBattery.update(deltaTime);
            this.updateBuses();
            this.updateConnections(deltaTime);
            this.updateGenerators(deltaTime);
            const extPowerOn = SimVar.GetSimVarValue('EXTERNAL POWER ON', msfsSdk.SimVarValueType.Bool) === 1;
            const extPowerAvailable = SimVar.GetSimVarValue('EXTERNAL POWER AVAILABLE', msfsSdk.SimVarValueType.Bool) === 1;
            this.extPowerConn.set(extPowerOn && extPowerAvailable);
            this.updateBusTie(deltaTime);
            this.previousTimestamp = timestamp;
        }
        /**
         * Updates the generator to bus connections.
         * @param deltaTime The delta time, in milliseconds simtime.
         */
        updateGenerators(deltaTime) {
            this.leftGenerator.update(deltaTime);
            this.rightGenerator.update(deltaTime);
            this.apuGenerator.update(deltaTime);
            this.hydraulicGenerator.update();
            this.leftGenerator.isAvailable.set(this.leftGenerator.volts.get() > 27.9 && this.leftN2.get() > 58);
            this.rightGenerator.isAvailable.set(this.rightGenerator.volts.get() > 27.9 && this.rightN2.get() > 58);
            this.apuGenerator.isAvailable.set(this.apuGenerator.volts.get() > 27.9 && this.apuRpmPct.get() > 99.5);
            if (this.leftGenerator.switchOn.get() && this.leftGenerator.isAvailable.get()) {
                this.leftGenerator.setConnected(true);
            }
            else {
                this.leftGenerator.setConnected(false);
            }
            if (this.rightGenerator.switchOn.get() && this.rightGenerator.isAvailable.get()) {
                this.rightGenerator.setConnected(true);
            }
            else {
                this.rightGenerator.setConnected(false);
            }
            if (this.apuGenerator.switchOn.get() && this.apuGenerator.isAvailable.get()) {
                this.apuGenerator.setConnected(true);
            }
            else {
                this.apuGenerator.setConnected(false);
            }
        }
        /**
         * Updates the automatic bus tie.
         * @param deltaTime The delta time, in milliseconds simtime.
         */
        updateBusTie(deltaTime) {
            if (this.isPrimary && this.keyEventManager !== undefined) {
                let busTieClosed = false;
                if (this.onGround.get()) {
                    const hasLeftPower = this.apuGenerator.isConnected.get() || this.leftGenerator.isConnected.get();
                    const hasRightPower = this.extPowerConn.get() || this.rightGenerator.isConnected.get() || this.hydraulicGenerator.isAvailable.get();
                    const apuStartRequested = SimVar.GetSimVarValue('APU PCT STARTER', msfsSdk.SimVarValueType.Percent) !== 0;
                    const singleBatteryOn = (this.leftBattery.isConnected.get() || this.rightBattery.isConnected.get())
                        && !(this.leftBattery.isConnected.get() && this.rightBattery.isConnected.get());
                    if ((hasLeftPower || hasRightPower) && !(hasLeftPower && hasRightPower)) {
                        busTieClosed = true;
                    }
                    else if (!this.bothBatteriesWereOn && singleBatteryOn && !this.extPowerConn.get()
                        && !this.leftGenerator.isConnected.get() && !this.rightGenerator.isConnected.get()) {
                        busTieClosed = true;
                    }
                    else if (apuStartRequested) {
                        busTieClosed = true;
                    }
                    this.busTieConn.setConnected(busTieClosed);
                }
                if (this.leftBattery.isConnected.get() && this.rightBattery.isConnected.get()) {
                    this.bothBatteriesWereOn = true;
                }
                else if (!this.leftBattery.isConnected.get() && !this.rightBattery.isConnected.get()) {
                    this.bothBatteriesWereOn = false;
                }
            }
            if ((this.lEmerBus.isActive.get() || this.rEmerBus.isActive.get()) && this.busTieConn.isConnected.get()) {
                this.busTieConn.isActive.set(true);
            }
            else {
                this.busTieConn.isActive.set(false);
            }
            this.busTieConn.update(deltaTime);
        }
        /**
         * Updates the status of the buses.
         */
        updateBuses() {
            this.lMissionBus.update();
            this.rMissionBus.update();
            this.lEmerBus.update();
            this.rEmerBus.update();
            this.lMainBus.update();
            this.rMainBus.update();
            this.lInt1Bus.update();
            this.lInt2Bus.update();
            this.rInt1Bus.update();
            this.rInt2Bus.update();
            this.avionicsPower.set(this.lEmerBus.isActive.get() || this.rMissionBus.isActive.get());
            //Somewhat hack: if L EMER bus is active, just fully charge the standby instruments battery
            if (this.lEmerBus.isActive.get()) {
                SimVar.SetSimVarValue('ELECTRICAL BATTERY VOLTAGE:3', msfsSdk.SimVarValueType.Volts, 26.4);
            }
        }
        /**
         * Updates the bus connections.
         * @param deltaTime The delta time, in milliseconds simtime.
         */
        updateConnections(deltaTime) {
            this.updateConnection(deltaTime, this.lMainMissionConn, this.lMainBus, this.lMissionBus);
            this.updateConnection(deltaTime, this.lInt1MissionConn, this.lInt1Bus, this.lMissionBus);
            this.updateConnection(deltaTime, this.lInt2MissionConn, this.lInt2Bus, this.lMissionBus);
            this.updateConnection(deltaTime, this.lMissionEmerConn, this.lMissionBus, this.lEmerBus);
            this.updateConnection(deltaTime, this.rMainMissionConn, this.rMainBus, this.rMissionBus);
            this.updateConnection(deltaTime, this.rInt1MissionConn, this.rInt1Bus, this.rMissionBus);
            this.updateConnection(deltaTime, this.rInt2MissionConn, this.rInt2Bus, this.rMissionBus);
            this.updateConnection(deltaTime, this.rMissionEmerConn, this.rMissionBus, this.rEmerBus);
        }
        /**
         * Updates a single connection.
         * @param deltaTime The delta time, in milliseconds simtime.
         * @param conn The connection to update.
         * @param source The source bus.
         * @param dest The destination bus.
         */
        updateConnection(deltaTime, conn, source, dest) {
            conn.update(deltaTime);
            if (source.isActive.get() && dest.isActive.get() && conn.isConnected.get()) {
                conn.isActive.set(true);
            }
            else {
                conn.isActive.set(false);
            }
        }
        /**
         * Handles when a key is intercepted.
         * @param data The event data.
         * @param data.key The key that was intercepted.
         * @param data.value0 The value that was sent.
         * @param data.value1 The index that was sent.
         */
        onKeyIntercepted({ key, value0: value, value1: index }) {
            if (this.isPrimary && this.keyEventManager !== undefined) {
                switch (key) {
                    case 'BATTERY1_SET':
                        this.leftBattery.setSimConnection(this.keyEventManager, value === 1);
                        break;
                    case 'BATTERY2_SET':
                        this.rightBattery.setSimConnection(this.keyEventManager, value === 1);
                        break;
                    case 'MASTER_BATTERY_OFF':
                        this.leftBattery.setSimConnection(this.keyEventManager, false);
                        this.rightBattery.setSimConnection(this.keyEventManager, false);
                        break;
                    case 'MASTER_BATTERY_ON':
                        this.leftBattery.setSimConnection(this.keyEventManager, true);
                        this.rightBattery.setSimConnection(this.keyEventManager, true);
                        break;
                    case 'MASTER_BATTERY_SET':
                        this.leftBattery.setSimConnection(this.keyEventManager, value === 1);
                        this.rightBattery.setSimConnection(this.keyEventManager, value === 1);
                        break;
                    case 'TOGGLE_MASTER_BATTERY':
                        if (value === 0) {
                            this.leftBattery.setSimConnection(this.keyEventManager, !this.leftBattery.isConnected.get());
                            this.rightBattery.setSimConnection(this.keyEventManager, !this.rightBattery.isConnected.get());
                        }
                        else if (value === 1) {
                            this.leftBattery.setSimConnection(this.keyEventManager, !this.leftBattery.isConnected.get());
                        }
                        else if (value === 2) {
                            this.rightBattery.setSimConnection(this.keyEventManager, !this.rightBattery.isConnected.get());
                        }
                        else if (value === 3) {
                            this.keyEventManager.triggerKey('TOGGLE_MASTER_BATTERY', true, value);
                        }
                        break;
                    case 'ELECTRICAL_BUS_TO_BUS_CONNECTION_TOGGLE':
                        if (!(value === 5 && index === 6 && this.onGround.get())) {
                            this.keyEventManager.triggerKey('ELECTRICAL_BUS_TO_BUS_CONNECTION_TOGGLE', true, value, index);
                        }
                        break;
                    case 'ALTERNATOR_OFF':
                        this.setGeneratorSwitch(value, false);
                        break;
                    case 'ALTERNATOR_ON':
                        this.setGeneratorSwitch(value, true);
                        break;
                    case 'ALTERNATOR_SET':
                        this.setGeneratorSwitch(index, value === 1);
                        break;
                    case 'TOGGLE_ALTERNATOR1':
                        this.setGeneratorSwitch(1);
                        break;
                    case 'TOGGLE_ALTERNATOR2':
                        this.setGeneratorSwitch(2);
                        break;
                    case 'APU_GENERATOR_SWITCH_TOGGLE':
                        this.setGeneratorSwitch(3);
                        break;
                    case 'APU_GENERATOR_SWITCH_SET':
                        this.setGeneratorSwitch(3, value === 1);
                        break;
                    case 'TOGGLE_MASTER_ALTERNATOR':
                        this.setGeneratorSwitch(value);
                        break;
                }
            }
        }
        /**
         * Sets a generator switch state.
         * @param index The index of the generator event.
         * @param isOn Whether or not to set the generator switch as on.
         */
        setGeneratorSwitch(index, isOn) {
            if (index === 0) {
                this.leftGenerator.switchOn.set(isOn !== null && isOn !== void 0 ? isOn : !this.leftGenerator.switchOn.get());
                this.rightGenerator.switchOn.set(isOn !== null && isOn !== void 0 ? isOn : !this.rightGenerator.switchOn.get());
                this.apuGenerator.switchOn.set(isOn !== null && isOn !== void 0 ? isOn : !this.apuGenerator.switchOn.get());
            }
            else if (index === 1) {
                this.leftGenerator.switchOn.set(isOn !== null && isOn !== void 0 ? isOn : !this.leftGenerator.switchOn.get());
            }
            else if (index === 2) {
                this.rightGenerator.switchOn.set(isOn !== null && isOn !== void 0 ? isOn : !this.rightGenerator.switchOn.get());
            }
            else if (index === 3) {
                this.apuGenerator.switchOn.set(isOn !== null && isOn !== void 0 ? isOn : !this.apuGenerator.switchOn.get());
            }
        }
    }

    /**
     * An engine driven hydraulic pump.
     */
    class EngineHydraulicPump {
        /**
         * Creates an instance of a EngineHydraulicPump.
         * @param inputs The hydraulic system inputs.
         * @param side The system side.
         */
        constructor(inputs, side) {
            this.outputPressure = 0;
            this.isActive = msfsSdk.Subject.create(false);
            if (side === 'A') {
                this.runStopState = inputs.leftEngineRunStopState;
                this.n2 = inputs.leftN2;
                this.switchState = inputs.leftSystemSwitch;
            }
            else {
                this.runStopState = inputs.rightEngineRunStopState;
                this.n2 = inputs.rightN2;
                this.switchState = inputs.rightSystemSwitch;
            }
        }
        /**
         * Updates the engine driven hydraulic pump.
         */
        update() {
            let outputPressure = 0;
            let isActive = false;
            if (this.runStopState.get() && this.n2.get() > 58) {
                switch (this.switchState.get()) {
                    case HydraulicPumpSwitch.Norm:
                        outputPressure = 3000;
                        isActive = true;
                        break;
                    case HydraulicPumpSwitch.Min:
                        outputPressure = 1200;
                        isActive = true;
                        break;
                }
            }
            this.outputPressure = outputPressure;
            this.isActive.set(isActive);
        }
    }

    /**
     * Tracks a hydraulic pressure value.
     */
    class HydraulicComponentValue {
        /**
         * Creates an instance of a HydraulicValueTracker
         * @param min The minimum output value.
         * @param max The maximum output value.
         * @param gain The rate of change per second when the slope is equal to 1.
         * @param slope An optional slope function.
         * the minimum to the maximum.
         */
        constructor(min, max, gain, slope = HydraulicComponentValue.LinearSlope) {
            this.min = min;
            this.max = max;
            this.gain = gain;
            this.slope = slope;
            this._value = msfsSdk.Subject.create(this.min);
            this.currentTarget = this.min;
        }
        /**
         * Gets the current value.
         * @returns The current value.
         */
        get value() {
            return this._value;
        }
        /**
         * Sets the target component value.
         * @param target The target value to set.
         */
        setTarget(target) {
            this.currentTarget = msfsSdk.NavMath.clamp(target, this.min, this.max);
        }
        /**
         * Directly sets the output value.
         * @param value The value to set.
         */
        setValue(value) {
            this._value.set(value);
        }
        /**
         * Updates the output value.
         * @param deltaTime The number of milliseconds of passed simtime.
         */
        update(deltaTime) {
            if (isNaN(this.currentTarget)) {
                this._value.set(NaN);
            }
            if (isNaN(this._value.get())) {
                return;
            }
            const error = this.currentTarget - this._value.get();
            const absError = Math.abs(error);
            const errorSign = Math.sign(error);
            const currentPct = (this._value.get() - this.min) / (this.max - this.min);
            const currentGain = this.slope(currentPct, errorSign, absError) * this.gain;
            const change = (currentGain / 1000) * Math.max(deltaTime, 0);
            if (change >= absError) {
                this._value.set(this.currentTarget);
            }
            else {
                this._value.set(this._value.get() + (currentGain / 1000) * Math.max(deltaTime, 0) * errorSign);
            }
        }
    }
    HydraulicComponentValue.LinearSlope = () => 1;
    HydraulicComponentValue.SinSlope = (currentValue) => Math.max(Math.sin(currentValue * Math.PI), 0.15);

    /**
     * A hydraulic accumulator in the system.
     */
    class HydraulicAccumulator {
        constructor() {
            this.componentValue = new HydraulicComponentValue(2419, 3000, 3000, HydraulicComponentValue.SinSlope);
            this.pressure = this.componentValue.value;
        }
        /**
         * Gets the current fluid volume contained in the accumulator.
         * @returns the current fluid volume contained in the accumulator, in cubic inches.
         */
        get volume() {
            return Math.max(122.163 - this.calcVolume(this.pressure.get()), 0);
        }
        /**
         * Charges the accumulator to a specified pressure.
         * @param pressure The pressure to charge to.
         */
        charge(pressure) {
            if (pressure > this.componentValue.value.get() || isNaN(this.componentValue.value.get())) {
                this.componentValue.setTarget(pressure);
            }
        }
        /**
         * Discharges the accumulator by a specified amount.
         * @param amount The amount of pressure, in PSI to discharge.
         */
        discharge(amount) {
            const gasVolume = this.calcVolume(this.componentValue.value.get());
            const targetGasVolume = Math.min(gasVolume + amount, 122.653);
            this.componentValue.setTarget(this.calcPressure(targetGasVolume));
        }
        /**
         * Updates the accumulator.
         * @param deltaTime The delta time in milliseconds of sim time.
         */
        update(deltaTime) {
            if (isNaN(this.componentValue.value.get())) {
                this.componentValue.setValue(2419);
            }
            this.componentValue.update(deltaTime);
        }
        /**
         * Calculates the charge gas volume for a given charge gas pressure.
         * @param pressure The pressure, in PSI.
         * @returns The charge gas volume, in cubic inches.
         */
        calcVolume(pressure) {
            const volume = (HydraulicAccumulator.STATIC_CHARGE * HydraulicAccumulator.IDEAL_GAS_CONSTANT * HydraulicAccumulator.TEMP_KELVIN)
                / (pressure / 0.00014504);
            return volume * 61023.7441;
        }
        /**
         * Calculates the charge gas pressure for a given charge gas volume.
         * @param volume The volume, in cubic inches.
         * @returns The charge gas pressure, in PSI.
         */
        calcPressure(volume) {
            const pressure = (HydraulicAccumulator.STATIC_CHARGE * HydraulicAccumulator.IDEAL_GAS_CONSTANT * HydraulicAccumulator.TEMP_KELVIN)
                / (volume / 61023.7441);
            return pressure * 0.00014504;
        }
    }
    HydraulicAccumulator.STATIC_CHARGE = 13.7563002; //Moles of 122.653in^3 of helium at 2419PSI and 68F
    HydraulicAccumulator.IDEAL_GAS_CONSTANT = 8.31446261815324;
    HydraulicAccumulator.TEMP_KELVIN = 293.15; //68F to K

    var BrakeControlSystemSimVars;
    (function (BrakeControlSystemSimVars) {
        BrakeControlSystemSimVars["LeftBrakeInput"] = "L:WT_LNG_LEFT_BRAKE_INPUT";
        BrakeControlSystemSimVars["RightBrakeInput"] = "L:WT_LNG_RIGHT_BRAKE_INPUT";
        BrakeControlSystemSimVars["ParkingBrake"] = "L:WT_LNG_PARKING_BRAKE";
    })(BrakeControlSystemSimVars || (BrakeControlSystemSimVars = {}));
    /**
     * A class that handles the sim interface brake control system loop.
     */
    class BrakeControlSystem {
        /**
         * Creates an instance of the BrakeControlSystem.
         * @param bus The event bus to use with this instance,.
         * @param isPrimary Whether or not this is the primary sim interfacing instance.
         */
        constructor(bus, isPrimary) {
            this.bus = bus;
            this.isPrimary = isPrimary;
            this.brakeGain = 1;
            this.brakeInputsIgnored = false;
            this.parkingBrakeEnabled = true;
            this._leftBrakeInput = msfsSdk.Subject.create(0);
            this._rightBrakeInput = msfsSdk.Subject.create(0);
            this._parkingBrakeOn = msfsSdk.Subject.create(false);
            this.leftBrakeOutput = msfsSdk.Subject.create(0);
            this.rightBrakeOutput = msfsSdk.Subject.create(0);
            this.parkingBrakeOutput = msfsSdk.Subject.create(false);
            this.leftBrakeButtonTimeout = -1;
            this.rightBrakeButtonTimeout = -1;
            this.previousTimestamp = -1;
            msfsSdk.GameStateProvider.get().sub(state => {
                if (state === GameState.ingame) {
                    msfsSdk.KeyEventManager.getManager(this.bus).then(manager => this.isPrimary && this.initPrimary(manager));
                }
            }, true);
        }
        /**
         * The current left brake input percent.
         * @returns The current left brake input percent.
         */
        get leftBrakeInput() {
            return this._leftBrakeInput;
        }
        /**
         * The current right brake input percent.
         * @returns The current right brake input percent.
         */
        get rightBrakeInput() {
            return this._rightBrakeInput;
        }
        /**
         * The current parking brake status.
         * @returns True if the parking brake level is pulled, false otherwise.
         */
        get parkingBrakeOn() {
            return this._parkingBrakeOn;
        }
        /**
         * Initializes the primary brake control system.
         * @param manager The key manager to use with this system.
         */
        initPrimary(manager) {
            //Normal brake events
            manager.interceptKey('AXIS_LEFT_BRAKE_LINEAR_SET', false);
            manager.interceptKey('AXIS_LEFT_BRAKE_SET', false);
            manager.interceptKey('AXIS_RIGHT_BRAKE_LINEAR_SET', false);
            manager.interceptKey('AXIS_RIGHT_BRAKE_SET', false);
            manager.interceptKey('BRAKES', false);
            manager.interceptKey('BRAKES_LEFT', false);
            manager.interceptKey('BRAKES_RIGHT', false);
            //Parking brake events
            manager.interceptKey('PARKING_BRAKES', false);
            manager.interceptKey('PARKING_BRAKE_SET', false);
            this.bus.getSubscriber().on('key_intercept').handle(this.onKeyIntercepted.bind(this));
            this._leftBrakeInput.set(SimVar.GetSimVarValue('BRAKE LEFT POSITION EX1', msfsSdk.SimVarValueType.Number));
            this._rightBrakeInput.set(SimVar.GetSimVarValue('BRAKE RIGHT POSITION EX1', msfsSdk.SimVarValueType.Number));
            this._parkingBrakeOn.set(SimVar.GetSimVarValue('BRAKE PARKING INDICATOR', msfsSdk.SimVarValueType.Bool) === 1);
            this._leftBrakeInput.sub(v => SimVar.SetSimVarValue(BrakeControlSystemSimVars.LeftBrakeInput, msfsSdk.SimVarValueType.Percent, v));
            this._rightBrakeInput.sub(v => SimVar.SetSimVarValue(BrakeControlSystemSimVars.RightBrakeInput, msfsSdk.SimVarValueType.Percent, v));
            this._parkingBrakeOn.sub(v => SimVar.SetSimVarValue(BrakeControlSystemSimVars.ParkingBrake, msfsSdk.SimVarValueType.Bool, v));
            this.leftBrakeOutput.sub(v => manager.triggerKey('AXIS_LEFT_BRAKE_SET', true, this.pctToInput(v)));
            this.rightBrakeOutput.sub(v => manager.triggerKey('AXIS_RIGHT_BRAKE_SET', true, this.pctToInput(v)));
            this.parkingBrakeOutput.sub(v => manager.triggerKey('PARKING_BRAKE_SET', true, v ? 1 : 0));
            setInterval(() => this.updatePrimary(), 0);
        }
        /**
         * Updates the primary control instance.
         */
        updatePrimary() {
            const timestamp = Date.now();
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
            }
            const deltaTime = timestamp - this.previousTimestamp;
            if (this.leftBrakeButtonTimeout !== -1) {
                this.leftBrakeButtonTimeout -= deltaTime;
                if (this.leftBrakeButtonTimeout <= 0) {
                    this._leftBrakeInput.set(0);
                    this.leftBrakeButtonTimeout = -1;
                }
            }
            if (this.rightBrakeButtonTimeout !== -1) {
                this.rightBrakeButtonTimeout -= deltaTime;
                if (this.rightBrakeButtonTimeout <= 0) {
                    this._rightBrakeInput.set(0);
                    this.rightBrakeButtonTimeout = -1;
                }
            }
            if (!this.brakeInputsIgnored) {
                this.leftBrakeOutput.set(this._leftBrakeInput.get() * this.brakeGain);
                this.rightBrakeOutput.set(this._rightBrakeInput.get() * this.brakeGain);
            }
            this.parkingBrakeOutput.set(this._parkingBrakeOn.get() && this.parkingBrakeEnabled);
            this.previousTimestamp = timestamp;
        }
        /**
         * Updates the control system instance.
         */
        update() {
            if (!this.isPrimary) {
                this._leftBrakeInput.set(SimVar.GetSimVarValue(BrakeControlSystemSimVars.LeftBrakeInput, msfsSdk.SimVarValueType.Percent));
                this._rightBrakeInput.set(SimVar.GetSimVarValue(BrakeControlSystemSimVars.RightBrakeInput, msfsSdk.SimVarValueType.Percent));
                this._parkingBrakeOn.set(SimVar.GetSimVarValue(BrakeControlSystemSimVars.ParkingBrake, msfsSdk.SimVarValueType.Bool) === 1);
            }
        }
        /**
         * Sets whether or not the user brake inputs will be ignored.
         * @param ignored True if the user inputs are to be ignored, false if they are to be used.
         */
        setBrakeInputsIgnored(ignored) {
            if (this.brakeInputsIgnored !== ignored) {
                this.brakeInputsIgnored = ignored;
                if (ignored) {
                    this.leftBrakeOutput.set(0);
                    this.rightBrakeOutput.set(0);
                }
            }
        }
        /**
         * Sets the gain ratio of input brake percentage to output brake percentage that will be sent to the sim.
         * @param gain The gain, from 0 to 1.
         */
        setBrakeGain(gain) {
            this.brakeGain = msfsSdk.NavMath.clamp(gain, 0, 1);
        }
        /**
         * Sets the output of the left brake system;
         * @param pct The percentage of brake to apply.
         */
        setLeftBrakeOutput(pct) {
            this.leftBrakeOutput.set(pct);
        }
        /**
         * Sets the output of the right brake system;
         * @param pct The percentage of brake to apply.
         */
        setRightBrakeOutput(pct) {
            this.rightBrakeOutput.set(pct);
        }
        /**
         * Sets whether the parking brake will have any effect in the sim.
         * @param enabled True if the parking brake will have a sim effect, false otherwise.
         */
        setParkingBrakeEnabled(enabled) {
            this.parkingBrakeEnabled = enabled;
        }
        /**
         * Converts a brake input value to a one based percentage.
         * @param input The input to convert.
         * @returns A one based percentage.
         */
        inputToPct(input) {
            if (input === undefined) {
                input = 0;
            }
            return (input + 16383) / 32766;
        }
        /**
         * Converts a one based percentage to a brake input value.
         * @param pct The percentage to convert.
         * @returns The brake input value.
         */
        pctToInput(pct) {
            return (pct * 32766) - 16383;
        }
        /**
         * Handles when a key is intercepted.
         * @param data The event data.
         * @param data.key The key that was intercepted.
         * @param data.value0 The value that was sent.
         */
        onKeyIntercepted({ key, value0: value }) {
            switch (key) {
                case 'AXIS_LEFT_BRAKE_SET':
                case 'AXIS_LEFT_BRAKE_LINEAR_SET':
                    this._leftBrakeInput.set(this.inputToPct(value));
                    break;
                case 'AXIS_RIGHT_BRAKE_SET':
                case 'AXIS_RIGHT_BRAKE_LINEAR_SET':
                    this._rightBrakeInput.set(this.inputToPct(value));
                    break;
                case 'BRAKES':
                    this._leftBrakeInput.set(Math.min(this._leftBrakeInput.get() + 0.1, 1));
                    this._rightBrakeInput.set(Math.min(this._rightBrakeInput.get() + 0.1, 1));
                    this.leftBrakeButtonTimeout = 350;
                    this.rightBrakeButtonTimeout = 350;
                    break;
                case 'BRAKES_LEFT':
                    this._leftBrakeInput.set(Math.min(this._leftBrakeInput.get() + 0.1, 1));
                    this.leftBrakeButtonTimeout = 350;
                    break;
                case 'BRAKES_RIGHT':
                    this._rightBrakeInput.set(Math.min(this._rightBrakeInput.get() + 0.1, 1));
                    this.rightBrakeButtonTimeout = 350;
                    break;
                case 'PARKING_BRAKES':
                    this._parkingBrakeOn.set(!this._parkingBrakeOn.get());
                    break;
                case 'PARKING_BRAKE_SET':
                    this._parkingBrakeOn.set(value === 1);
                    break;
            }
        }
    }

    /**
     * A system that handles the hydraulic brakes.
     */
    class LongitudeBrakeSystem {
        /**
         * Creates an instance of the BrakeSystem.
         * @param bus The event bus to use with this instance.
         * @param leftAccumulator The left side brake accumulator.
         * @param rightAccumulator The right side brake accumulator.
         * @param outputs The hydraulic system outputs to read.
         * @param isPrimary Whether this instance is the primary instance controlling the sim.
         */
        constructor(bus, leftAccumulator, rightAccumulator, outputs, isPrimary) {
            this.bus = bus;
            this.leftAccumulator = leftAccumulator;
            this.rightAccumulator = rightAccumulator;
            this.outputs = outputs;
            this.isPrimary = isPrimary;
            this.inboardLeftBrakePsi = new HydraulicComponentValue(0, 3000, 3000);
            this.inboardLeftBrakeTemp = new msfsSdk.TemperatureSystem(921);
            this.inboardRightBrakePsi = new HydraulicComponentValue(0, 3000, 3000);
            this.inboardRightBrakeTemp = new msfsSdk.TemperatureSystem(921);
            this.outboardLeftBrakePsi = new HydraulicComponentValue(0, 3000, 3000);
            this.outboardLeftBrakeTemp = new msfsSdk.TemperatureSystem(921);
            this.outboardRightBrakePsi = new HydraulicComponentValue(0, 3000, 3000);
            this.outboardRightBrakeTemp = new msfsSdk.TemperatureSystem(921);
            this.brakeTempsInitialized = false;
            this.groundSpeed = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ground_speed'), 0);
            this.onGround = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('on_ground'), true);
            this.gearPosition = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('gear_position_0'), 0).map(v => Math.round(v * 100) / 100);
            this.oat = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ambient_temp_c'), 0);
            this.brakeControlSystem = new BrakeControlSystem(this.bus, this.isPrimary);
            this.autoSpinDownPct = 0;
            this.inboardLeftBrakePsi.setValue(0);
            this.inboardRightBrakePsi.setValue(0);
            this.outboardLeftBrakePsi.setValue(0);
            this.outboardRightBrakePsi.setValue(0);
            this.brakeControlSystem.parkingBrakeOn.sub(this.handleParkingBrakeChanged.bind(this));
            this.initTempSystem(this.inboardLeftBrakeTemp);
            this.initTempSystem(this.inboardRightBrakeTemp);
            this.initTempSystem(this.outboardLeftBrakeTemp);
            this.initTempSystem(this.outboardRightBrakeTemp);
        }
        /**
         * Initializes a temperature system for the brakes.
         * @param system The system to initialize.
         */
        initTempSystem(system) {
            system.addSource({ temperature: 0, conductivity: 200 });
            system.addSource({ temperature: 0, conductivity: 200 });
        }
        /**
         * Handles when the parking brake state changes.
         * @param isOn Whether or not the parking brake is on.
         */
        handleParkingBrakeChanged(isOn) {
            if (isOn) {
                this.leftAccumulator.discharge(4);
                this.rightAccumulator.discharge(4);
            }
        }
        /**
         * Updates the brake system.
         * @param deltaTime The delta time in milliseconds of sim time.
         */
        update(deltaTime) {
            this.setBrakeControlSystem();
            this.handleGearUpSpinDown();
            this.updateSystemPressures(deltaTime);
            this.updateSystemTemperatures(deltaTime);
        }
        /**
         * Updates the pressures seen by the brake system.
         * @param deltaTime The deltatime, in milliseconds simtime.
         */
        updateSystemPressures(deltaTime) {
            if (this.brakeControlSystem.parkingBrakeOn.get()) {
                const leftAccumulatorPressure = this.leftAccumulator.pressure.get() < 2420 ? 0 : this.leftAccumulator.pressure.get();
                this.inboardLeftBrakePsi.setTarget(Math.max(leftAccumulatorPressure, this.outputs.leftSystemPressure.value.get()));
                this.inboardRightBrakePsi.setTarget(Math.max(leftAccumulatorPressure, this.outputs.leftSystemPressure.value.get()));
                const rightAccumulatorPressure = this.rightAccumulator.pressure.get() < 2420 ? 0 : this.rightAccumulator.pressure.get();
                this.outboardLeftBrakePsi.setTarget(Math.max(rightAccumulatorPressure, this.outputs.rightSystemPressure.value.get()));
                this.outboardRightBrakePsi.setTarget(Math.max(rightAccumulatorPressure, this.outputs.rightSystemPressure.value.get()));
            }
            else {
                const leftBrakePct = this.gearPosition.get() >= 0.95 ? this.brakeControlSystem.leftBrakeInput.get() : this.autoSpinDownPct;
                const rightbrakePct = this.gearPosition.get() >= 0.95 ? this.brakeControlSystem.rightBrakeInput.get() : this.autoSpinDownPct;
                this.inboardLeftBrakePsi.setTarget(Math.min(this.getAntiSkidPsi(leftBrakePct), this.outputs.leftSystemPressure.value.get()));
                this.inboardRightBrakePsi.setTarget(Math.min(this.getAntiSkidPsi(rightbrakePct), this.outputs.leftSystemPressure.value.get()));
                this.outboardLeftBrakePsi.setTarget(Math.min(this.getAntiSkidPsi(leftBrakePct), this.outputs.rightSystemPressure.value.get()));
                this.outboardRightBrakePsi.setTarget(Math.min(this.getAntiSkidPsi(rightbrakePct), this.outputs.rightSystemPressure.value.get()));
            }
            this.inboardLeftBrakePsi.update(deltaTime);
            this.inboardRightBrakePsi.update(deltaTime);
            this.outboardLeftBrakePsi.update(deltaTime);
            this.outboardRightBrakePsi.update(deltaTime);
        }
        /**
         * Updates the brake system temperatures.
         * @param deltaTime The delta time, in milliseconds sim time.
         */
        updateSystemTemperatures(deltaTime) {
            if (!this.brakeTempsInitialized) {
                this.inboardLeftBrakeTemp.set(this.oat.get());
                this.inboardRightBrakeTemp.set(this.oat.get());
                this.outboardLeftBrakeTemp.set(this.oat.get());
                this.outboardRightBrakeTemp.set(this.oat.get());
                this.brakeTempsInitialized = true;
            }
            const leftWheelRpm = SimVar.GetSimVarValue('WHEEL RPM:1', msfsSdk.SimVarValueType.RPM);
            const rightWheelRpm = SimVar.GetSimVarValue('WHEEL RPM:2', msfsSdk.SimVarValueType.RPM);
            this.inboardLeftBrakeTemp.setSourceTemp(0, this.oat.get());
            this.inboardLeftBrakeTemp.setSourceTemp(1, this.getPadTemp(leftWheelRpm, this.inboardLeftBrakePsi.value.get(), this.inboardRightBrakeTemp));
            this.inboardLeftBrakeTemp.setSourceConductivity(0, Math.max(2, Math.min(leftWheelRpm / 210, 43)));
            this.inboardLeftBrakeTemp.setSourceConductivity(1, leftWheelRpm / 100);
            this.inboardRightBrakeTemp.setSourceTemp(0, this.oat.get());
            this.inboardRightBrakeTemp.setSourceTemp(1, this.getPadTemp(rightWheelRpm, this.inboardRightBrakePsi.value.get(), this.inboardRightBrakeTemp));
            this.inboardRightBrakeTemp.setSourceConductivity(0, Math.max(2, Math.min(rightWheelRpm / 190, 45)));
            this.inboardRightBrakeTemp.setSourceConductivity(1, rightWheelRpm / 100);
            this.outboardLeftBrakeTemp.setSourceTemp(0, this.oat.get());
            this.outboardLeftBrakeTemp.setSourceTemp(1, this.getPadTemp(leftWheelRpm, this.outboardLeftBrakePsi.value.get(), this.outboardLeftBrakeTemp));
            this.outboardLeftBrakeTemp.setSourceConductivity(0, Math.max(2, Math.min(leftWheelRpm / 195, 40)));
            this.outboardLeftBrakeTemp.setSourceConductivity(1, leftWheelRpm / 100);
            this.outboardRightBrakeTemp.setSourceTemp(0, this.oat.get());
            this.outboardRightBrakeTemp.setSourceTemp(1, this.getPadTemp(rightWheelRpm, this.outboardRightBrakePsi.value.get(), this.outboardRightBrakeTemp));
            this.outboardRightBrakeTemp.setSourceConductivity(0, Math.max(2, Math.min(rightWheelRpm / 205, 38)));
            this.outboardRightBrakeTemp.setSourceConductivity(1, rightWheelRpm / 100);
            this.inboardLeftBrakeTemp.update(deltaTime);
            this.inboardRightBrakeTemp.update(deltaTime);
            this.outboardLeftBrakeTemp.update(deltaTime);
            this.outboardRightBrakeTemp.update(deltaTime);
        }
        /**
         * Gets the brake pad temp given a wheelspeed and brake pressure.
         * @param rpm The wheel speed.
         * @param pressure The brake pressure.
         * @param tempSystem The temperature system to which this pad temp is being applied.
         * @returns A brake pad temp.
         */
        getPadTemp(rpm, pressure, tempSystem) {
            let spread = 845 - this.oat.get();
            if (pressure > 400) {
                spread = 1200 - this.oat.get();
            }
            const addTemp = spread * Math.min(pressure / 600, 1);
            return Math.max(this.oat.get() + addTemp, tempSystem.value.get());
        }
        /**
         * Handles the automatic wheel spin-down brake application when the gear is retracted.
         */
        handleGearUpSpinDown() {
            const gearPosition = this.gearPosition.get();
            if (gearPosition < 0.95) {
                this.brakeControlSystem.setBrakeInputsIgnored(true);
            }
            else {
                this.brakeControlSystem.setBrakeInputsIgnored(false);
            }
            if (gearPosition < 0.95 && gearPosition > 0.05) {
                if (gearPosition < 0.95) {
                    if (gearPosition >= 0.6) {
                        const val = (0.95 - gearPosition) / 0.25;
                        this.brakeControlSystem.setLeftBrakeOutput(val);
                        this.brakeControlSystem.setRightBrakeOutput(val);
                        this.autoSpinDownPct = val * 0.1;
                    }
                    else if (gearPosition < 0.7 && gearPosition > 0.3) {
                        this.brakeControlSystem.setLeftBrakeOutput(1);
                        this.brakeControlSystem.setRightBrakeOutput(1);
                        this.autoSpinDownPct = 0.1;
                    }
                    else if (gearPosition <= 0.3 && gearPosition > 0.05) {
                        const val = (gearPosition - 0.05) / 0.25;
                        this.brakeControlSystem.setLeftBrakeOutput(val);
                        this.brakeControlSystem.setRightBrakeOutput(val);
                        this.autoSpinDownPct = val * 0.1;
                    }
                }
            }
        }
        /**
         * Sets the brake control system gains and settings.
         */
        setBrakeControlSystem() {
            const totalSystemPressure = this.outputs.leftSystemPressure.value.get() + this.outputs.rightSystemPressure.value.get();
            this.brakeControlSystem.setBrakeGain(totalSystemPressure / 6000);
            if (this.leftAccumulator.pressure.get() < 2500 && this.rightAccumulator.pressure.get() < 2500) {
                this.brakeControlSystem.setParkingBrakeEnabled(false);
            }
            else {
                this.brakeControlSystem.setParkingBrakeEnabled(true);
            }
            this.brakeControlSystem.update();
        }
        /**
         * Gets the anti-skid brake PSI based on the current braking percentage.
         * @param pct The current braking percentage.
         * @returns The anti-skid brake PSI.
         */
        getAntiSkidPsi(pct) {
            if (this.gearPosition.get() < 0.05) {
                return 0;
            }
            if (this.onGround.get()) {
                const gs = this.groundSpeed.get();
                if (gs > 140) {
                    return pct * 600;
                }
                else if (gs <= 140 && gs >= 120) {
                    return pct * (600 - (((140 - gs) / 20) * 200));
                }
                else if (gs < 120 && gs >= 5) {
                    return pct * (400 + (((120 - gs) / 115) * 50));
                }
                else {
                    return pct * (450 + (((5 - gs) / 5) * 2550));
                }
            }
            else {
                return pct * 3000;
            }
        }
    }

    /**
     * The rudder control system for the Longitude.
     */
    class RudderControlSystem {
        /**
         * Creates an instance of the RudderControlSystem.
         * @param bus The event bus to use with this instance.
         * @param isPrimary Whether or not this is the primary sim-controlling instance.
         */
        constructor(bus, isPrimary) {
            this.bus = bus;
            this.isPrimary = isPrimary;
            this._rudderInput = msfsSdk.Subject.create(0);
            this.rudderInputPlus = 0;
            this.rudderInputMinus = 0;
            this.rudderOutput = msfsSdk.Subject.create(0);
            this.rudderGain = new HydraulicComponentValue(0, 1, 1);
            this.previousTimestamp = -1;
            if (isPrimary) {
                msfsSdk.Wait.awaitSubscribable(msfsSdk.GameStateProvider.get(), s => s === GameState.ingame, true)
                    .then(() => msfsSdk.KeyEventManager.getManager(this.bus))
                    .then(keyEventManager => this.initPrimary(keyEventManager));
            }
        }
        /**
         * Initializes the primary instance.
         * @param keyEventManager The key event manager to use.
         */
        initPrimary(keyEventManager) {
            keyEventManager.interceptKey('AXIS_RUDDER_SET', false);
            keyEventManager.interceptKey('RUDDER_AXIS_MINUS', false);
            keyEventManager.interceptKey('RUDDER_AXIS_PLUS', false);
            keyEventManager.interceptKey('RUDDER_CENTER', false);
            keyEventManager.interceptKey('RUDDER_LEFT', false);
            keyEventManager.interceptKey('RUDDER_RIGHT', false);
            keyEventManager.interceptKey('RUDDER_SET', false);
            keyEventManager.interceptKey('CENTER_AILER_RUDDER', false);
            this.rudderOutput.sub(v => keyEventManager.triggerKey('AXIS_RUDDER_SET', true, this.pctToInput(v)));
            this._rudderInput.sub(v => SimVar.SetSimVarValue(RudderControlSystem.RUDDER_INPUT_SIMVAR, msfsSdk.SimVarValueType.Percent, v));
            this.bus.getSubscriber().on('key_intercept').handle(this.onKeyIntercepted.bind(this));
            this.bus.getSubscriber().on('simTimeHiFreq').handle(this.updatePrimary.bind(this));
        }
        /**
         * Updates the primary sim-controlling instance.
         * @param timestamp The timestamp, in milliseconds simtime
         */
        updatePrimary(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
            }
            const deltaTime = msfsSdk.NavMath.clamp(timestamp - this.previousTimestamp, 0, 10000);
            this.rudderGain.update(deltaTime);
            this.rudderOutput.set(this._rudderInput.get() * this.rudderGain.value.get());
            this.previousTimestamp = timestamp;
        }
        /**
         * Updates the rudder control system.
         */
        update() {
            if (!this.isPrimary) {
                this._rudderInput.set(SimVar.GetSimVarValue(RudderControlSystem.RUDDER_INPUT_SIMVAR, msfsSdk.SimVarValueType.Percent));
            }
        }
        /**
         * Sets the rudder control gain.
         * @param gain The gain to set.
         */
        setRudderGain(gain) {
            this.rudderGain.setTarget(msfsSdk.NavMath.clamp(gain, 0, 1));
        }
        /**
         * Converts a rudder input value to a one based percentage.
         * @param input The input to convert.
         * @returns A one based percentage.
         */
        inputToPct(input) {
            if (input === undefined) {
                input = 0;
            }
            return input / 16383;
        }
        /**
         * Converts a one based percentage to a rudder input value.
         * @param pct The percentage to convert.
         * @returns The rudder input value.
         */
        pctToInput(pct) {
            return pct * 16383;
        }
        /**
         * Handles when a key is intercepted.
         * @param data The event data.
         * @param data.key The key that was intercepted.
         * @param data.value0 The value that was sent.
         */
        onKeyIntercepted({ key, value0: value }) {
            switch (key) {
                case 'AXIS_RUDDER_SET':
                case 'RUDDER_SET':
                    this._rudderInput.set(this.inputToPct(value));
                    break;
                case 'RUDDER_AXIS_MINUS':
                    this.rudderInputMinus = this.inputToPct(value);
                    this._rudderInput.set(this.rudderInputMinus + this.rudderInputPlus);
                    break;
                case 'RUDDER_LEFT':
                    this._rudderInput.set(msfsSdk.NavMath.clamp(this._rudderInput.get() + 0.05, -1, 1));
                    break;
                case 'RUDDER_AXIS_PLUS':
                    this.rudderInputPlus = this.inputToPct(value) * -1;
                    this._rudderInput.set(this.rudderInputMinus + this.rudderInputPlus);
                    break;
                case 'RUDDER_RIGHT':
                    this._rudderInput.set(msfsSdk.NavMath.clamp(this._rudderInput.get() - 0.05, -1, 1));
                    break;
                case 'RUDDER_CENTER':
                case 'CENTER_AILER_RUDDER':
                    this._rudderInput.set(0);
                    break;
            }
        }
    }
    RudderControlSystem.RUDDER_INPUT_SIMVAR = 'L:WT_LNG_RUDDER_INPUT';

    /**
     * The hydraulic rudder system of the Longitude.
     */
    class HydraulicRudderSystem {
        /**
         * Creates an instance of the HydraulicRudderSystem.
         * @param bus The event bus to use with this instance.
         * @param inputs The hydraulic system inputs.
         * @param outputs The hydraulic system outputs.
         * @param isPrimary Whether or not this is the primary sim-controlling instance.
         */
        constructor(bus, inputs, outputs, isPrimary) {
            this.bus = bus;
            this.inputs = inputs;
            this.outputs = outputs;
            this.isPrimary = isPrimary;
            this.isOnGround = msfsSdk.ConsumerValue.create(this.bus.getSubscriber().on('on_ground'), false);
            this.isYdOn = msfsSdk.ConsumerValue.create(this.bus.getSubscriber().on('ap_yd_status'), false);
            this.controlSystem = new RudderControlSystem(this.bus, this.isPrimary);
            this._isRudderStandbyActive = msfsSdk.Subject.create(false);
            /**
             * Whether the rudder standby system is active and providing power to rudder power control unit A independently of
             * hydraulic system A.
             */
            this.isRudderStandbyActive = this._isRudderStandbyActive;
            this._isRudderStandbyFailed = msfsSdk.Subject.create(false);
            /** Whether the rudder standby system is in a failed state. */
            this.isRudderStandbyFailed = this._isRudderStandbyFailed;
            this._isRudderStandbyButtonOff = msfsSdk.Subject.create(false);
            /** Whether the rudder standby system button is in the OFF position. */
            this.isRudderStandbyButtonOff = this._isRudderStandbyButtonOff;
            this._isPcuAPowered = msfsSdk.Subject.create(false);
            /** Whether hydraulic power to rudder power control unit A (lower PCU) is available. */
            this.isPcuAPowered = this._isPcuAPowered;
            this._isPcuBPowered = msfsSdk.Subject.create(false);
            /** Whether hydraulic power to rudder power control unit B (upper PCU) is available. */
            this.isPcuBPowered = this._isPcuBPowered;
            this.rssEngineRunTime = 0;
            this.rssActivateTime = 0;
            this.rssFailedTime = 0;
            if (isPrimary) {
                msfsSdk.KeyEventManager.getManager(bus).then(manager => this.keyEventManager = manager);
            }
        }
        /**
         * Updates the rudder system.
         * @param deltaTime The amount of simulation time elapsed since the last update, in milliseconds.
         */
        update(deltaTime) {
            this._isRudderStandbyButtonOff.set(SimVar.GetSimVarValue(HydraulicRudderSystem.RSS_BUTTON_SIMVAR, msfsSdk.SimVarValueType.Number) === 1);
            this.updateStandbySystem(deltaTime);
            const isPcuAPowered = this.outputs.leftSystemPressure.value.get() >= HydraulicRudderSystem.MIN_PRESSURE
                || this._isRudderStandbyActive.get();
            const isPcuBPowered = this.outputs.rightSystemPressure.value.get() >= HydraulicRudderSystem.MIN_PRESSURE;
            const isPowered = isPcuAPowered || isPcuBPowered;
            if (isPowered) {
                this.controlSystem.setRudderGain(1);
            }
            else {
                this.controlSystem.setRudderGain(0);
            }
            this.controlSystem.update();
            if (this.isPrimary) {
                const isYdOn = this.isYdOn.get();
                if (!isYdOn && isPowered) {
                    SimVar.SetSimVarValue('K:YAW_DAMPER_ON', msfsSdk.SimVarValueType.Number, 1);
                }
                else if (isYdOn && !isPowered) {
                    SimVar.SetSimVarValue('K:YAW_DAMPER_OFF', msfsSdk.SimVarValueType.Number, 1);
                }
            }
            this._isPcuAPowered.set(isPcuAPowered);
            this._isPcuBPowered.set(isPcuBPowered);
        }
        /**
         * Updates the rudder standby system.
         * @param deltaTime The amount of simulation time elapsed since the last update, in milliseconds.
         */
        updateStandbySystem(deltaTime) {
            let isRssCircuitSwitchOn;
            if (this.isPrimary) {
                if (this.inputs.leftN2.get() > 58) {
                    this.rssEngineRunTime += deltaTime;
                }
                else {
                    this.rssEngineRunTime = 0;
                }
                // RSS should activate if not disabled AND all of the following are true:
                // - system A pressure is low
                // - system B pressure is low
                // - airplane is not on the ground OR left engine has been running for at least 2 seconds.
                let shouldActivate = !this._isRudderStandbyButtonOff.get()
                    && this.outputs.leftSystemPressure.value.get() < HydraulicRudderSystem.MIN_PRESSURE
                    && this.outputs.rightSystemPressure.value.get() < HydraulicRudderSystem.MIN_PRESSURE
                    && (!this.isOnGround.get()
                        || this.rssEngineRunTime >= HydraulicRudderSystem.RSS_ENGINE_START_DELAY);
                if (shouldActivate) {
                    if (this.rssActivateTime < HydraulicRudderSystem.RSS_ACTIVATE_DELAY) {
                        shouldActivate = false;
                        this.rssActivateTime += deltaTime;
                    }
                }
                else {
                    this.rssActivateTime = 0;
                }
                // Check if the RSS circuit switch state matches what it should be. If not, send a key event to set the correct
                // circuit switch state.
                if (this.keyEventManager) {
                    isRssCircuitSwitchOn = SimVar.GetSimVarValue(HydraulicRudderSystem.RSS_CIRCUIT_SWITCH_SIMVAR, msfsSdk.SimVarValueType.Bool) !== 0;
                    if (isRssCircuitSwitchOn !== shouldActivate) {
                        this.keyEventManager.triggerKey('ELECTRICAL_EXECUTE_PROCEDURE', false, HydraulicRudderSystem.RSS_CIRCUIT_PROCEDURE_INDEX, shouldActivate ? 1 : 0);
                    }
                }
            }
            isRssCircuitSwitchOn !== null && isRssCircuitSwitchOn !== void 0 ? isRssCircuitSwitchOn : (isRssCircuitSwitchOn = SimVar.GetSimVarValue(HydraulicRudderSystem.RSS_CIRCUIT_SWITCH_SIMVAR, msfsSdk.SimVarValueType.Bool) !== 0);
            const isRssCircuitPowered = SimVar.GetSimVarValue(HydraulicRudderSystem.RSS_CIRCUIT_SIMVAR, msfsSdk.SimVarValueType.Bool) !== 0;
            let isRssFailed = isRssCircuitSwitchOn && !isRssCircuitPowered;
            if (isRssFailed) {
                if (this.rssFailedTime < HydraulicRudderSystem.RSS_FAILED_DELAY) {
                    isRssFailed = false;
                    this.rssFailedTime += deltaTime;
                }
            }
            else {
                this.rssFailedTime = 0;
            }
            this._isRudderStandbyActive.set(isRssCircuitPowered);
            this._isRudderStandbyFailed.set(isRssFailed);
        }
    }
    HydraulicRudderSystem.RSS_BUTTON_SIMVAR = 'L:WT_LNG_RUDDER_STANDBY_OFF';
    HydraulicRudderSystem.RSS_CIRCUIT_SWITCH_SIMVAR = 'CIRCUIT SWITCH ON:70';
    HydraulicRudderSystem.RSS_CIRCUIT_SIMVAR = 'CIRCUIT ON:70';
    HydraulicRudderSystem.RSS_CIRCUIT_PROCEDURE_INDEX = 1;
    HydraulicRudderSystem.MIN_PRESSURE = 2400;
    HydraulicRudderSystem.RSS_ENGINE_START_DELAY = 2000; // milliseconds
    HydraulicRudderSystem.RSS_ACTIVATE_DELAY = 1000; // milliseconds
    HydraulicRudderSystem.RSS_FAILED_DELAY = 1000; // milliseconds

    var SpoilerControlSystemSimVars;
    (function (SpoilerControlSystemSimVars) {
        SpoilerControlSystemSimVars["AileronsInput"] = "L:WT_LNG_AILERONS_INPUT";
        SpoilerControlSystemSimVars["SpoilersInput"] = "L:WT_LNG_SPOILERS_INPUT";
        SpoilerControlSystemSimVars["SpoilersGain"] = "L:WT_LNG_SPOILERS_GAIN";
    })(SpoilerControlSystemSimVars || (SpoilerControlSystemSimVars = {}));
    /**
     * A class that handles the sim interface brake control system loop.
     */
    class SpoilerControlSystem {
        /**
         * Creates an instance of the BrakeControlSystem.
         * @param bus The event bus to use with this instance.
         * @param isPrimary Whether or not this is the primary sim interfacing instance.
         */
        constructor(bus, isPrimary) {
            this.bus = bus;
            this.isPrimary = isPrimary;
            this.spoilerGain = new HydraulicComponentValue(0, 1, 1);
            this.groundSpoilersOn = false;
            this.groundSpoilersTransitioning = false;
            this.aileronGain = 1;
            this.previousTimestamp = -1;
            this._aileronsInput = msfsSdk.Subject.create(0);
            this._spoilersInput = msfsSdk.Subject.create(0);
            this.aileronsOutput = msfsSdk.Subject.create(0);
            this.spoilersOutput = msfsSdk.Subject.create(0);
            if (isPrimary) {
                msfsSdk.Wait.awaitSubscribable(msfsSdk.GameStateProvider.get(), s => s === GameState.ingame, true)
                    .then(() => msfsSdk.KeyEventManager.getManager(this.bus))
                    .then(keyEventManager => this.initPrimary(keyEventManager));
            }
        }
        /**
         * The current ailerons input percent.
         * @returns The current ailerons input percent.
         */
        get aileronsInput() {
            return this._aileronsInput;
        }
        /**
         * The current spoilers input percent.
         * @returns The current spoilers input percent.
         */
        get spoilersInput() {
            return this._spoilersInput;
        }
        /**
         * Initializes the primary brake control system.
         * @param manager The key manager to use with this system.
         */
        initPrimary(manager) {
            //Aileron events
            manager.interceptKey('AILERON_SET', false);
            manager.interceptKey('AILERON_LEFT', false);
            manager.interceptKey('AILERONS_LEFT', false);
            manager.interceptKey('AILERON_RIGHT', false);
            manager.interceptKey('AILERONS_RIGHT', false);
            manager.interceptKey('AXIS_AILERONS_SET', false);
            manager.interceptKey('CENTER_AILER_RUDDER', false);
            //Spoiler events
            manager.interceptKey('AXIS_SPOILER_SET', false);
            manager.interceptKey('SPOILERS_ARM_OFF', false);
            manager.interceptKey('SPOILERS_ARM_ON', false);
            manager.interceptKey('SPOILERS_ARM_SET', false);
            manager.interceptKey('SPOILERS_ARM_TOGGLE', false);
            manager.interceptKey('SPOILERS_OFF', false);
            manager.interceptKey('SPOILERS_ON', false);
            manager.interceptKey('SPOILERS_SET', false);
            manager.interceptKey('SPOILERS_TOGGLE', false);
            this.bus.getSubscriber().on('key_intercept').handle(this.onKeyIntercepted.bind(this));
            this.bus.getSubscriber().on('simTimeHiFreq').handle(this.updatePrimary.bind(this));
            this._aileronsInput.sub(v => SimVar.SetSimVarValue(SpoilerControlSystemSimVars.AileronsInput, msfsSdk.SimVarValueType.Percent, v));
            this._spoilersInput.sub(v => SimVar.SetSimVarValue(SpoilerControlSystemSimVars.SpoilersInput, msfsSdk.SimVarValueType.Percent, v));
            this.spoilerGain.value.sub(v => SimVar.SetSimVarValue(SpoilerControlSystemSimVars.SpoilersGain, msfsSdk.SimVarValueType.Percent, v));
            this.aileronsOutput.sub(v => manager.triggerKey('AXIS_AILERONS_SET', true, this.pctToInput(v)));
            this.spoilersOutput.sub(v => manager.triggerKey('AXIS_SPOILER_SET', true, (this.pctToInput(v) * 2) - 16383));
        }
        /**
         * Updates the primary control instance.
         * @param timestamp The current sim timestamp.
         */
        updatePrimary(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
                return;
            }
            const deltaTime = Math.max(timestamp - this.previousTimestamp, 0);
            this.aileronsOutput.set(this._aileronsInput.get() * this.aileronGain);
            if (!this.groundSpoilersOn && !this.groundSpoilersTransitioning) {
                this.spoilersOutput.set(this._spoilersInput.get() * this.spoilerGain.value.get());
            }
            if (this.groundSpoilersOn) {
                this.groundSpoilersTransitioning = true;
                SimVar.SetSimVarValue('L:WT_LNG_GROUND_SPOILERS', msfsSdk.SimVarValueType.Number, 1);
                this.spoilersOutput.set(Math.min(this.spoilersOutput.get() + (deltaTime / 1500), 1));
            }
            else if (this.groundSpoilersTransitioning) {
                const target = this.spoilersOutput.get() - (deltaTime / 1500);
                const totalInput = this.spoilersInput.get() * this.spoilerGain.value.get();
                if (target <= totalInput) {
                    this.spoilersOutput.set(totalInput);
                    this.groundSpoilersTransitioning = false;
                    SimVar.SetSimVarValue('L:WT_LNG_GROUND_SPOILERS', msfsSdk.SimVarValueType.Number, 0);
                }
                else {
                    this.spoilersOutput.set(target);
                }
            }
            this.spoilerGain.update(deltaTime);
            this.previousTimestamp = timestamp;
        }
        /**
         * Updates the control system instance.
         */
        update() {
            if (!this.isPrimary) {
                this._aileronsInput.set(SimVar.GetSimVarValue(SpoilerControlSystemSimVars.AileronsInput, msfsSdk.SimVarValueType.Percent));
                this._spoilersInput.set(SimVar.GetSimVarValue(SpoilerControlSystemSimVars.SpoilersInput, msfsSdk.SimVarValueType.Percent));
            }
        }
        /**
         * Sets the gain ratio of input aileron percentage to output aileron percentage that will be sent to the sim.
         * @param gain The gain, from 0 to 1.
         */
        setAileronGain(gain) {
            this.aileronGain = msfsSdk.NavMath.clamp(gain, 0, 1);
        }
        /**
         * Sets the gain ratio of input spoiler percentage to output spoiler percentage that will be sent to the sim.
         * @param gain The gain, from 0 to 1.
         */
        setSpoilerGain(gain) {
            this.spoilerGain.setTarget(msfsSdk.NavMath.clamp(gain, 0, 1));
        }
        /**
         * Sets the ground spoiler state.
         * @param on Whether or not the ground spoilers are on.
         */
        setGroundSpoilers(on) {
            this.groundSpoilersOn = on;
        }
        /**
         * Converts a aileron/spoiler input value to a one based percentage.
         * @param input The input to convert.
         * @returns A one based percentage.
         */
        inputToPct(input) {
            if (input === undefined) {
                input = 0;
            }
            return input / 16383;
        }
        /**
         * Converts a one based percentage to a aileron/spoiler input value.
         * @param pct The percentage to convert.
         * @returns The aileron/spoiler input value.
         */
        pctToInput(pct) {
            return pct * 16383;
        }
        /**
         * Handles when a key is intercepted.
         * @param data The event data.
         * @param data.key The key that was intercepted.
         * @param data.value0 The value that was sent.
         */
        onKeyIntercepted({ key, value0: value }) {
            switch (key) {
                case 'AILERON_SET':
                case 'AXIS_AILERONS_SET':
                    this._aileronsInput.set(this.inputToPct(value));
                    break;
                case 'AILERON_LEFT':
                case 'AILERONS_LEFT':
                    this._aileronsInput.set(msfsSdk.NavMath.clamp(this._aileronsInput.get() + 0.1, -1, 1));
                    break;
                case 'AILERON_RIGHT':
                case 'AILERONS_RIGHT':
                    this._aileronsInput.set(msfsSdk.NavMath.clamp(this._aileronsInput.get() - 0.1, -1, 1));
                    break;
                case 'CENTER_AILER_RUDDER':
                    this._aileronsInput.set(0);
                    break;
                case 'AXIS_SPOILER_SET':
                    this._spoilersInput.set(this.inputToPct(((value !== null && value !== void 0 ? value : 0) + 16383)) / 2);
                    break;
                case 'SPOILERS_OFF':
                    this._spoilersInput.set(0);
                    break;
                case 'SPOILERS_ON':
                    this._spoilersInput.set(1);
                    break;
                case 'SPOILERS_SET':
                    this._spoilersInput.set(this.inputToPct(value));
                    break;
                case 'SPOILERS_TOGGLE':
                    this._spoilersInput.set(this._spoilersInput.get() !== 1 ? 1 : 0);
                    break;
            }
        }
    }

    /**
     * The Longitude hydraulic spoiler actuation system.
     */
    class HydraulicSpoilerSystem {
        /**
         * Creates an instance of the HydraulicSpoilerSystem.
         * @param bus The event bus to use with this instance.
         * @param outputs The hydraulic system outputs.
         * @param leftIbdAccumulator The left inboard spoiler accumulator.
         * @param rightIbdAccumulator The right inboard spoiler accumulator.
         * @param outboardAccumulator The outboard spoilers accumulator.
         * @param midAccumulator The mid spoilers accumulator.
         * @param isPrimary Whether this instance is the primary instance controlling the sim.
         */
        constructor(bus, outputs, leftIbdAccumulator, rightIbdAccumulator, outboardAccumulator, midAccumulator, isPrimary) {
            this.bus = bus;
            this.outputs = outputs;
            this.leftIbdAccumulator = leftIbdAccumulator;
            this.rightIbdAccumulator = rightIbdAccumulator;
            this.outboardAccumulator = outboardAccumulator;
            this.midAccumulator = midAccumulator;
            this.isPrimary = isPrimary;
            this.speedbrakesStowedArmTimeRemaining = -1;
            this.spoilersTesting = false;
            this.groundSpeed = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ground_speed'), 0);
            this.onGround = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('on_ground'), true);
            this.aoa = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('aoa'), 0);
            this.leftThrottlePos = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('v_throttle_lever_pos_1'), 0);
            this.rightThrottlePos = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('v_throttle_lever_pos_1'), 0);
            this.controlSystem = new SpoilerControlSystem(this.bus, this.isPrimary);
            this.speedbrakesStowed = msfsSdk.Subject.create(false);
            this.groundSpoilersOn = msfsSdk.Subject.create(false);
        }
        /**
         * Updates the spoiler system.
         * @param deltaTime The update delta time, in milliseconds simtime.
         */
        update(deltaTime) {
            this.controlSystem.update();
            this.updateGroundSpoilers();
            const pctSystemPressure = (this.outputs.leftSystemPressure.value.get() + this.outputs.rightSystemPressure.value.get()) / 6000;
            if (this.speedbrakesStowedArmTimeRemaining > 0) {
                this.speedbrakesStowedArmTimeRemaining -= deltaTime;
                if (this.speedbrakesStowedArmTimeRemaining <= 0) {
                    this.speedbrakesStowed.set(true);
                    this.speedbrakesStowedArmTimeRemaining = -1;
                }
            }
            if (this.speedbrakesStowed.get() && this.controlSystem.spoilersInput.get() < 0.025) {
                this.speedbrakesStowed.set(false);
            }
            if (this.speedbrakesStowed.get()) {
                this.controlSystem.setSpoilerGain(0);
            }
            else if (this.groundSpoilersOn.get()) {
                this.controlSystem.setSpoilerGain(1);
            }
            else {
                this.controlSystem.setSpoilerGain(pctSystemPressure * (this.onGround.get() ? 0.58 : 1));
            }
            if (this.controlSystem.spoilersInput.get() > 0.025) {
                if (this.leftThrottlePos.get() > HydraulicSpoilerSystem.AUTOSTOW_MAX_THROTTLE
                    || this.rightThrottlePos.get() > HydraulicSpoilerSystem.AUTOSTOW_MAX_THROTTLE
                    || this.aoa.get() > 9.6) {
                    if (this.speedbrakesStowedArmTimeRemaining === -1) {
                        this.speedbrakesStowedArmTimeRemaining = 5000;
                    }
                }
                else {
                    this.speedbrakesStowedArmTimeRemaining = -1;
                }
            }
            this.controlSystem.setAileronGain(1 - ((1 - pctSystemPressure) * 0.50));
        }
        /**
         * Sets whether the spoilers are testing.
         * @param areTesting Whether or not the spoilers are testing.
         */
        setSpoilersTesting(areTesting) {
            this.spoilersTesting = areTesting;
        }
        /**
         * Updates the ground spoilers function.
         */
        updateGroundSpoilers() {
            if (!this.onGround.get()) {
                this.controlSystem.setGroundSpoilers(false);
                this.groundSpoilersOn.set(false);
                return;
            }
            if (!this.groundSpoilersOn.get()) {
                if ((this.groundSpeed.get() > 35 && Math.min(this.leftThrottlePos.get(), this.rightThrottlePos.get()) < 0.025 && this.getBestAccumulatorPressure() > 2500)
                    || this.spoilersTesting) {
                    this.controlSystem.setGroundSpoilers(true);
                    this.groundSpoilersOn.set(true);
                    this.dischargeAccumulators();
                }
            }
            else {
                if ((this.groundSpeed.get() < 30 || Math.min(this.leftThrottlePos.get(), this.rightThrottlePos.get()) > 0.025) && !this.spoilersTesting) {
                    this.controlSystem.setGroundSpoilers(false);
                    this.groundSpoilersOn.set(false);
                }
            }
        }
        /**
         * Gets the best available accumulator pressure.
         * @returns The maximum of all available accumulators' pressures
         */
        getBestAccumulatorPressure() {
            return Math.max(this.leftIbdAccumulator.pressure.get(), this.rightIbdAccumulator.pressure.get(), this.outboardAccumulator.pressure.get(), this.midAccumulator.pressure.get());
        }
        /**
         * Discharges the accumulators one full ground spoiler cycle.
         */
        dischargeAccumulators() {
            this.leftIbdAccumulator.discharge(10);
            this.rightIbdAccumulator.discharge(10);
            this.outboardAccumulator.discharge(10);
            this.midAccumulator.discharge(10);
        }
    }
    HydraulicSpoilerSystem.AUTOSTOW_MAX_THROTTLE = 0.85;

    /**
     * A collection of inputs required by hydraulic system components.
     */
    class HydraulicSystemInputs {
        /**
         * Creates an instance of HydraulicSystemInputs.
         * @param bus The event bus to use with this instance.
         */
        constructor(bus) {
            this.bus = bus;
            this.leftEngineRunStopState = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_1'), false);
            this.rightEngineRunStopState = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_2'), false);
            this.leftN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_1'), 0);
            this.rightN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_2'), 0);
            this.onGround = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('on_ground'), true);
            this.oat = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ambient_temp_c'), 0);
            this.parkingBrake = msfsSdk.Subject.create(false);
            this.leftSystemSwitch = msfsSdk.Subject.create(HydraulicPumpSwitch.Norm);
            this.rightSystemSwitch = msfsSdk.Subject.create(HydraulicPumpSwitch.Norm);
            this.ptcuSwitch = PtcuSwitch.Norm;
            this.rudderStandbySwitch = RudderStandbySwitch.Norm;
        }
    }

    /**
     * A collection of outputs of the hydraulic system.
     */
    class HydraulicSystemOutputs {
        constructor() {
            this.leftPumpOn = msfsSdk.Subject.create(false);
            this.rightPumpOn = msfsSdk.Subject.create(false);
            this.leftSystemActive = msfsSdk.Subject.create(false);
            this.rightSystemActive = msfsSdk.Subject.create(false);
            this.leftSystemPressure = new HydraulicComponentValue(0, 3000, 1500, HydraulicComponentValue.SinSlope);
            this.rightSystemPressure = new HydraulicComponentValue(0, 3000, 1500, HydraulicComponentValue.SinSlope);
            this.leftSystemTank = new HydraulicComponentValue(0, 375, 125, HydraulicComponentValue.SinSlope);
            this.rightSystemTank = new HydraulicComponentValue(0, 375, 125, HydraulicComponentValue.SinSlope);
            this.leftSystemTemp = new msfsSdk.TemperatureSystem(2000);
            this.rightSystemTemp = new msfsSdk.TemperatureSystem(2000);
            this.ptcuMode = msfsSdk.Subject.create(PtcuMode.Off);
        }
    }

    /**
     * The Longitude hydraulic PTCU.
     */
    class PowerTransferControlUnit {
        /**
         * Creates an instance of the PowerTransferControlUnit.
         * @param inputs The hydraulic system inputs.
         * @param outputs The hydraulic system outputs.
         * @param leftBrakeAccumulator The left brake system accumulator.
         * @param rightBrakeAccumulator The right brake system accumulator.
         * @param leftPump The left engine driven pump.
         * @param rightPump The right engine driven pump.
         */
        constructor(inputs, outputs, leftBrakeAccumulator, rightBrakeAccumulator, leftPump, rightPump) {
            this.inputs = inputs;
            this.outputs = outputs;
            this.leftBrakeAccumulator = leftBrakeAccumulator;
            this.rightBrakeAccumulator = rightBrakeAccumulator;
            this.leftPump = leftPump;
            this.rightPump = rightPump;
            this.requestedMode = PtcuMode.Off;
            this.cycleExpirationTime = -1;
            /** The current PTCU operating mode. */
            this.mode = msfsSdk.Subject.create(PtcuMode.Off);
        }
        /**
         * Updates the PTCU.
         * @param deltaTime The current delta time in milliseconds simtime.
         */
        update(deltaTime) {
            if (this.cycleExpirationTime !== -1) {
                this.cycleExpirationTime -= deltaTime;
                if (this.cycleExpirationTime < 0) {
                    this.cycleExpirationTime === -1;
                    this.mode.set(this.requestedMode);
                }
                else {
                    return;
                }
            }
            let targetNormPtcuMode = PtcuMode.Off;
            let targetPtcuMode = PtcuMode.Off;
            const leftEngineRunning = this.inputs.leftEngineRunStopState.get() && this.inputs.leftN2.get() >= 58;
            const rightEngineRunning = this.inputs.rightEngineRunStopState.get() && this.inputs.rightN2.get() >= 58;
            const leftEngineStarting = this.inputs.leftEngineRunStopState.get() && this.inputs.leftN2.get() < 58;
            const rightEngineStarting = this.inputs.rightEngineRunStopState.get() && this.inputs.rightN2.get() < 58;
            const bothPumpsOn = this.outputs.leftPumpOn.get() || this.outputs.rightPumpOn.get();
            //Get the mode for norm operation
            if (this.inputs.parkingBrake.get() && this.inputs.onGround.get() && !leftEngineRunning && !rightEngineRunning) {
                if (this.rightBrakeAccumulator.pressure.get() !== 3000) {
                    targetNormPtcuMode = PtcuMode.AuxB;
                }
                else if (this.leftBrakeAccumulator.pressure.get() !== 3000) {
                    targetNormPtcuMode = PtcuMode.AuxA;
                }
            }
            else if (leftEngineStarting) {
                targetNormPtcuMode = PtcuMode.AuxA;
            }
            else if (rightEngineStarting) {
                targetNormPtcuMode = PtcuMode.AuxB;
            }
            else if (!this.inputs.onGround.get() || (!this.inputs.parkingBrake.get() && bothPumpsOn)) {
                const direction = this.leftPump.outputPressure - this.rightPump.outputPressure;
                if (direction < 0) {
                    targetNormPtcuMode = PtcuMode.PtuA;
                }
                else if (direction > 0) {
                    targetNormPtcuMode = PtcuMode.PtuB;
                }
                else {
                    targetNormPtcuMode = PtcuMode.PtuStandby;
                }
            }
            this.inputs.ptcuSwitch = SimVar.GetSimVarValue('L:WT_LNG_PTCU_MODE', 'number');
            switch (this.inputs.ptcuSwitch) {
                case PtcuSwitch.AuxA:
                    targetPtcuMode = this.leftPump.outputPressure !== 3000 ? PtcuMode.AuxA : targetNormPtcuMode;
                    break;
                case PtcuSwitch.AuxB:
                    targetPtcuMode = this.rightPump.outputPressure !== 3000 ? PtcuMode.AuxB : targetNormPtcuMode;
                    break;
                case PtcuSwitch.HydGen:
                    targetPtcuMode = PtcuMode.HydGenB;
                    break;
                case PtcuSwitch.Off:
                    targetPtcuMode = PtcuMode.Off;
                    break;
                default:
                    targetPtcuMode = targetNormPtcuMode;
            }
            //If going from mode to mode (other than PTU modes), go to an off cycle first
            if (this.mode.get() !== targetPtcuMode && !(this.isPtuMode(this.mode.get()) && this.isPtuMode(targetPtcuMode)) && this.mode.get() !== PtcuMode.Off) {
                targetPtcuMode = PtcuMode.Off;
            }
            if (this.mode.get() !== targetPtcuMode && this.requestedMode !== targetPtcuMode) {
                this.cycleExpirationTime = PowerTransferControlUnit.MIN_CYCLE_TIME;
                this.requestedMode = targetPtcuMode;
            }
        }
        /**
         * Checks if a given mode is a PTU mode.
         * @param mode The mode to check.
         * @returns True if a PTU mode, false otherwise.
         */
        isPtuMode(mode) {
            return mode === PtcuMode.PtuA || mode === PtcuMode.PtuB || mode === PtcuMode.PtuStandby;
        }
    }
    PowerTransferControlUnit.MIN_CYCLE_TIME = 1000;

    /**
     * The Longitude hydraulic system.
     */
    class LongitudeHydraulicSystem {
        /**
         * Creates an instance of a LongitudeHydraulicSystem.
         * @param bus The event bus to use with this instance.
         * @param isPrimary Whether this instance is the primary sim controlling instance.
         */
        constructor(bus, isPrimary) {
            this.bus = bus;
            this.isPrimary = isPrimary;
            this.inputs = new HydraulicSystemInputs(this.bus);
            this.outputs = new HydraulicSystemOutputs();
            this.temperaturesSet = false;
            this.leftEnginePump = new EngineHydraulicPump(this.inputs, 'A');
            this.rightEnginePump = new EngineHydraulicPump(this.inputs, 'B');
            this.accumulators = new Map([
                [AccumulatorType.LeftSpoiler, new HydraulicAccumulator()],
                [AccumulatorType.RightSpoiler, new HydraulicAccumulator()],
                [AccumulatorType.OutboardSpoilers, new HydraulicAccumulator()],
                [AccumulatorType.MidSpoilers, new HydraulicAccumulator()],
                [AccumulatorType.InboardBrakes, new HydraulicAccumulator()],
                [AccumulatorType.OutboardBrakes, new HydraulicAccumulator()]
            ]);
            this.ptcu = new PowerTransferControlUnit(this.inputs, this.outputs, this.getAccumulator(AccumulatorType.InboardBrakes), this.getAccumulator(AccumulatorType.OutboardBrakes), this.leftEnginePump, this.rightEnginePump);
            this.brakeSystem = new LongitudeBrakeSystem(this.bus, this.getAccumulator(AccumulatorType.InboardBrakes), this.getAccumulator(AccumulatorType.OutboardBrakes), this.outputs, this.isPrimary);
            this.spoilerSystem = new HydraulicSpoilerSystem(this.bus, this.outputs, this.getAccumulator(AccumulatorType.LeftSpoiler), this.getAccumulator(AccumulatorType.RightSpoiler), this.getAccumulator(AccumulatorType.OutboardSpoilers), this.getAccumulator(AccumulatorType.MidSpoilers), this.isPrimary);
            this.rudderSystem = new HydraulicRudderSystem(this.bus, this.inputs, this.outputs, this.isPrimary);
            this.previousTimestamp = -1;
            this.leftGenOn = false;
            this.rightGenOn = false;
            this.outputs.leftSystemTank.setValue(375);
            this.outputs.rightSystemTank.setValue(375);
            this.outputs.rightSystemPressure.setValue(0);
            this.outputs.leftSystemPressure.setValue(0);
            msfsSdk.Wait.awaitSubscribable(msfsSdk.GameStateProvider.get(), s => s === GameState.ingame, true).then(() => {
                if (this.isPrimary) {
                    msfsSdk.KeyEventManager.getManager(this.bus).then(m => this.keyEventManager = m);
                }
                this.leftGenOn = SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:4', msfsSdk.SimVarValueType.Number) === 1;
                this.rightGenOn = SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:5', msfsSdk.SimVarValueType.Number) === 1;
                this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
            });
        }
        /**
         * Updates the hydraulic system.
         * @param timestamp The current simtime timestamp.
         */
        update(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
            }
            const deltaTime = msfsSdk.NavMath.clamp(timestamp - this.previousTimestamp, 0, 10000);
            this.syncSimvars();
            this.leftEnginePump.update();
            this.rightEnginePump.update();
            this.outputs.leftSystemPressure.setTarget(this.leftEnginePump.outputPressure);
            this.outputs.rightSystemPressure.setTarget(this.rightEnginePump.outputPressure);
            this.outputs.leftPumpOn.set(this.leftEnginePump.isActive.get());
            this.outputs.rightPumpOn.set(this.rightEnginePump.isActive.get());
            let leftSystemActive = this.leftEnginePump.isActive.get();
            let rightSystemActive = this.rightEnginePump.isActive.get();
            for (const accumulator of this.accumulators.values()) {
                accumulator.update(deltaTime);
            }
            this.ptcu.update(deltaTime);
            switch (this.ptcu.mode.get()) {
                case PtcuMode.AuxA:
                    this.outputs.leftSystemPressure.setTarget(3000);
                    leftSystemActive = true;
                    break;
                case PtcuMode.AuxB:
                    this.outputs.rightSystemPressure.setTarget(3000);
                    rightSystemActive = true;
                    break;
                case PtcuMode.PtuA:
                    this.outputs.leftSystemPressure.setTarget(this.outputs.rightSystemPressure.value.get());
                    leftSystemActive = true;
                    break;
                case PtcuMode.PtuB:
                    this.outputs.rightSystemPressure.setTarget(this.outputs.leftSystemPressure.value.get());
                    rightSystemActive = true;
                    break;
            }
            this.outputs.leftSystemActive.set(leftSystemActive);
            this.outputs.rightSystemActive.set(rightSystemActive);
            this.outputs.ptcuMode.set(this.ptcu.mode.get());
            this.tryRunHydGen();
            this.outputs.leftSystemPressure.update(deltaTime);
            this.outputs.rightSystemPressure.update(deltaTime);
            this.getAccumulator(AccumulatorType.LeftSpoiler).charge(this.outputs.leftSystemPressure.value.get());
            this.getAccumulator(AccumulatorType.RightSpoiler).charge(this.outputs.leftSystemPressure.value.get());
            this.getAccumulator(AccumulatorType.OutboardSpoilers).charge(this.outputs.leftSystemPressure.value.get());
            this.getAccumulator(AccumulatorType.InboardBrakes).charge(this.outputs.leftSystemPressure.value.get());
            this.getAccumulator(AccumulatorType.MidSpoilers).charge(this.outputs.rightSystemPressure.value.get());
            this.getAccumulator(AccumulatorType.OutboardBrakes).charge(this.outputs.rightSystemPressure.value.get());
            let leftTankVolume = 375;
            leftTankVolume -= this.getAccumulator(AccumulatorType.LeftSpoiler).volume;
            leftTankVolume -= this.getAccumulator(AccumulatorType.RightSpoiler).volume;
            leftTankVolume -= this.getAccumulator(AccumulatorType.OutboardSpoilers).volume;
            leftTankVolume -= this.getAccumulator(AccumulatorType.InboardBrakes).volume;
            let rightTankVolume = 375;
            rightTankVolume -= this.getAccumulator(AccumulatorType.MidSpoilers).volume;
            rightTankVolume -= this.getAccumulator(AccumulatorType.OutboardBrakes).volume;
            this.outputs.leftSystemTank.setTarget(leftTankVolume);
            this.outputs.leftSystemTank.update(deltaTime);
            this.outputs.rightSystemTank.setTarget(rightTankVolume);
            this.outputs.rightSystemTank.update(deltaTime);
            this.brakeSystem.update(deltaTime);
            this.spoilerSystem.update(deltaTime);
            this.rudderSystem.update(deltaTime);
            this.calculateTemperatures(deltaTime);
            this.previousTimestamp = timestamp;
        }
        /**
         * Tries to run the Hyd Gen generator if necessary.
         */
        tryRunHydGen() {
            if (this.isPrimary && this.keyEventManager !== undefined) {
                let leftGenShouldGoOn = false;
                let rightGenShouldGoOn = false;
                if (this.outputs.ptcuMode.get() === PtcuMode.HydGenA || this.outputs.ptcuMode.get() === PtcuMode.HydGenB) {
                    if (this.inputs.leftEngineRunStopState.get()) {
                        leftGenShouldGoOn = true;
                    }
                    else if (this.inputs.rightEngineRunStopState.get()) {
                        rightGenShouldGoOn = true;
                    }
                }
                if (this.leftGenOn !== leftGenShouldGoOn) {
                    this.keyEventManager.triggerKey('ALTERNATOR_SET', true, leftGenShouldGoOn ? 1 : 0, 4);
                    this.leftGenOn = leftGenShouldGoOn;
                }
                if (this.rightGenOn !== rightGenShouldGoOn) {
                    this.keyEventManager.triggerKey('ALTERNATOR_SET', true, rightGenShouldGoOn ? 1 : 0, 5);
                    this.rightGenOn = rightGenShouldGoOn;
                }
            }
        }
        /**
         * Gets a hydraulic accumulator from the system.
         * @param type The type of hydraulic accumulator.
         * @throws An error if the accumulator could not be found.
         * @returns The requested hydraulic accumulator.
         */
        getAccumulator(type) {
            const accumulator = this.accumulators.get(type);
            if (accumulator === undefined) {
                throw new Error(`Accumulator of type ${type} was not found.`);
            }
            return accumulator;
        }
        /**
         * Sets the initial hydraulic pressure temperatures.
         * @param deltaTime The delta time, in milliseconds simtime.
         */
        calculateTemperatures(deltaTime) {
            const oat = this.inputs.oat.get();
            if (!this.temperaturesSet) {
                this.outputs.leftSystemTemp.set(oat);
                this.outputs.leftSystemTemp.addSource({ temperature: oat, conductivity: 55 });
                this.outputs.leftSystemTemp.addSource({ temperature: oat, conductivity: 30 });
                this.outputs.rightSystemTemp.set(oat);
                this.outputs.rightSystemTemp.addSource({ temperature: oat, conductivity: 55 });
                this.outputs.rightSystemTemp.addSource({ temperature: oat, conductivity: 30 });
                this.temperaturesSet = true;
            }
            const leftContribution = Math.pow(this.outputs.leftSystemPressure.value.get() / 3000, 0.5);
            this.outputs.leftSystemTemp.setSourceTemp(0, oat + ((120 - oat) * leftContribution));
            this.outputs.leftSystemTemp.setSourceTemp(1, oat);
            this.outputs.leftSystemTemp.setSourceConductivity(0, 10 + (46 * leftContribution));
            //Close temp valves to heat exchanger under 24
            if (this.outputs.leftSystemTemp.value.get() < 24) {
                this.outputs.leftSystemTemp.setSourceConductivity(1, 0);
            }
            else {
                this.outputs.leftSystemTemp.setSourceConductivity(1, 5 + (27 * leftContribution));
            }
            const rightContribution = Math.pow(this.outputs.rightSystemPressure.value.get() / 3000, 0.5);
            this.outputs.rightSystemTemp.setSourceTemp(0, oat + ((120 - oat) * rightContribution));
            this.outputs.rightSystemTemp.setSourceTemp(1, oat);
            this.outputs.rightSystemTemp.setSourceConductivity(0, 10 + (44 * rightContribution));
            //Close temp valves to heat exchanger under 24
            if (this.outputs.rightSystemTemp.value.get() < 24) {
                this.outputs.rightSystemTemp.setSourceConductivity(1, 0);
            }
            else {
                this.outputs.rightSystemTemp.setSourceConductivity(1, 5 + (27 * rightContribution));
            }
            this.outputs.leftSystemTemp.update(deltaTime);
            this.outputs.rightSystemTemp.update(deltaTime);
        }
        /**
         * Syncs relevant simvars from the sim.
         */
        syncSimvars() {
            this.inputs.parkingBrake.set(SimVar.GetSimVarValue('BRAKE PARKING INDICATOR', msfsSdk.SimVarValueType.Bool) === 1);
            this.inputs.leftSystemSwitch.set(SimVar.GetSimVarValue('L:WT_LNG_HYDRAULICS_PUMP_1', msfsSdk.SimVarValueType.Number));
            this.inputs.rightSystemSwitch.set(SimVar.GetSimVarValue('L:WT_LNG_HYDRAULICS_PUMP_2', msfsSdk.SimVarValueType.Number));
            this.leftGenOn = SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:4', msfsSdk.SimVarValueType.Number) === 1;
            this.rightGenOn = SimVar.GetSimVarValue('GENERAL ENG MASTER ALTERNATOR:5', msfsSdk.SimVarValueType.Number) === 1;
        }
    }

    var PitotHeatMode;
    (function (PitotHeatMode) {
        PitotHeatMode[PitotHeatMode["Norm"] = 0] = "Norm";
        PitotHeatMode[PitotHeatMode["Off"] = 1] = "Off";
    })(PitotHeatMode || (PitotHeatMode = {}));
    var WingAiMode;
    (function (WingAiMode) {
        WingAiMode[WingAiMode["Off"] = 0] = "Off";
        WingAiMode[WingAiMode["On"] = 1] = "On";
    })(WingAiMode || (WingAiMode = {}));
    var IcingState;
    (function (IcingState) {
        IcingState[IcingState["None"] = 0] = "None";
        IcingState[IcingState["Warning"] = 1] = "Warning";
        IcingState[IcingState["AllActive"] = 2] = "AllActive";
    })(IcingState || (IcingState = {}));
    var AiSimVars;
    (function (AiSimVars) {
        AiSimVars["WingAi"] = "L:WT_LNG_WING_AI_MODE";
        AiSimVars["PitotHeat"] = "L:WT_LNG_PITOT_HEAT";
        AiSimVars["LeftEngineAi"] = "L:WT_LNG_LEFT_ENGINE_AI";
        AiSimVars["RightEngineAi"] = "L:WT_LNG_RIGHT_ENGINE_AI";
        AiSimVars["StabAi"] = "L:WT_LNG_STAB_AI";
    })(AiSimVars || (AiSimVars = {}));
    /**
     * The Longitude anti-ice system.
     */
    class LongitudeAntiIceSystem {
        /**
         * Creates an instance of the LongitudeAntiIceSystem.
         * @param bus The event bus to use with this instance.
         * @param bleedAir The bleed air system to read state from.
         * @param electrical The electrical system to read power from.
         * @param isPrimary Whether this is the primary sim controlling instance.
         */
        constructor(bus, bleedAir, electrical, isPrimary) {
            this.bus = bus;
            this.bleedAir = bleedAir;
            this.electrical = electrical;
            this.isPrimary = isPrimary;
            this.leftN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_1'), 0);
            this.rightN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_2'), 0);
            this.rat = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ram_air_temp_c'), 0);
            this.onGround = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('on_ground'), true);
            this.groundSpeed = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ground_speed'), 0);
            this.ias = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ias'), 0);
            this.leftRunStop = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_1'), false);
            this.rightRunStop = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_2'), false);
            this.leftAiActive = msfsSdk.Subject.create(false);
            this.rightAiActive = msfsSdk.Subject.create(false);
            this.leftEngineAiActive = msfsSdk.Subject.create(false);
            this.rightEngineAiActive = msfsSdk.Subject.create(false);
            this.stabAiActive = msfsSdk.Subject.create(false);
            this.pitotHeatActive = msfsSdk.Subject.create(false);
            this.windshieldHeatActive = msfsSdk.Subject.create(false);
            this.leftRootTemp = new msfsSdk.TemperatureSystem(500);
            this.rightRootTemp = new msfsSdk.TemperatureSystem(500);
            this.leftWingTemp = new msfsSdk.TemperatureSystem(500);
            this.rightWingTemp = new msfsSdk.TemperatureSystem(500);
            this.l1Temp = new msfsSdk.TemperatureSystem(500);
            this.l2Temp = new msfsSdk.TemperatureSystem(500);
            this.r1Temp = new msfsSdk.TemperatureSystem(500);
            this.r2Temp = new msfsSdk.TemperatureSystem(500);
            this.windshieldTemp = new msfsSdk.TemperatureSystem(60);
            this.icingState = msfsSdk.Subject.create(IcingState.None);
            this.leftBleedTemp = 184;
            this.rightBleedTemp = 181;
            this.simStructuralDeiceOn = false;
            this.wingAiOn = false;
            this.leftEngineAiOn = false;
            this.rightEngineAiOn = false;
            this.pitotHeatOn = false;
            this.isInitComplete = false;
            this.previousTimestamp = -1;
            this.leftAiSpoolTime = -1;
            this.rightAiSpoolTime = -1;
            this.publisher = this.bus.getPublisher();
            this.leftN1Loss = msfsSdk.Subject.create(0);
            this.rightN1Loss = msfsSdk.Subject.create(0);
            this.leftFuelEffLoss = msfsSdk.Subject.create(0);
            this.rightFuelEffLoss = msfsSdk.Subject.create(0);
            this.leftIttEffLoss = msfsSdk.Subject.create(0);
            this.rightIttEffLoss = msfsSdk.Subject.create(0);
            this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
            if (this.isPrimary) {
                this.initPrimary();
            }
        }
        /**
         * Gets whether or not the wing anti-ice switch is on.
         * @returns True if on, false if off.
         */
        get isWingAiOn() {
            return this.wingAiOn;
        }
        /**
         * Gets whether or not the pitot heat switch is on.
         * @returns True if on, false if norm.
         */
        get isPitotHeatOn() {
            return this.pitotHeatOn;
        }
        /**
         * Initializes the primary instance.
         */
        initPrimary() {
            msfsSdk.KeyEventManager.getManager(this.bus).then(keyEventManager => {
                keyEventManager.interceptKey('TOGGLE_STRUCTURAL_DEICE', false);
                keyEventManager.interceptKey('WINDSHIELD_DEICE_OFF', false);
                keyEventManager.interceptKey('WINDSHIELD_DEICE_ON', false);
                keyEventManager.interceptKey('WINDSHIELD_DEICE_SET', false);
                keyEventManager.interceptKey('WINDSHIELD_DEICE_TOGGLE', false);
                keyEventManager.interceptKey('PITOT_HEAT_OFF', false);
                keyEventManager.interceptKey('PITOT_HEAT_ON', false);
                keyEventManager.interceptKey('PITOT_HEAT_SET', false);
                keyEventManager.interceptKey('PITOT_HEAT_TOGGLE', false);
                keyEventManager.interceptKey('ANTI_ICE_GRADUAL_SET', false);
                keyEventManager.interceptKey('ANTI_ICE_GRADUAL_SET_ENG1', false);
                keyEventManager.interceptKey('ANTI_ICE_GRADUAL_SET_ENG2', false);
                keyEventManager.interceptKey('ANTI_ICE_GRADUAL_SET_ENG3', false);
                keyEventManager.interceptKey('ANTI_ICE_GRADUAL_SET_ENG4', false);
                keyEventManager.interceptKey('ANTI_ICE_ON', false);
                keyEventManager.interceptKey('ANTI_ICE_OFF', false);
                keyEventManager.interceptKey('ANTI_ICE_SET', false);
                keyEventManager.interceptKey('ANTI_ICE_SET_ENG1', false);
                keyEventManager.interceptKey('ANTI_ICE_SET_ENG2', false);
                keyEventManager.interceptKey('ANTI_ICE_SET_ENG3', false);
                keyEventManager.interceptKey('ANTI_ICE_SET_ENG4', false);
                keyEventManager.interceptKey('ANTI_ICE_TOGGLE', false);
                keyEventManager.interceptKey('ANTI_ICE_TOGGLE_ENG1', false);
                keyEventManager.interceptKey('ANTI_ICE_TOGGLE_ENG2', false);
                keyEventManager.interceptKey('ANTI_ICE_TOGGLE_ENG3', false);
                keyEventManager.interceptKey('ANTI_ICE_TOGGLE_ENG4', false);
                msfsSdk.MappedSubject.create(([left, right]) => left || right, this.leftAiActive, this.rightAiActive).sub(v => {
                    if (v !== this.simStructuralDeiceOn) {
                        keyEventManager.triggerKey('TOGGLE_STRUCTURAL_DEICE', true);
                        this.simStructuralDeiceOn = v;
                    }
                });
                this.leftEngineAiActive.sub(v => keyEventManager.triggerKey('ANTI_ICE_SET_ENG1', true, v ? 1 : 0), true);
                this.rightEngineAiActive.sub(v => keyEventManager.triggerKey('ANTI_ICE_SET_ENG2', true, v ? 1 : 0), true);
                this.pitotHeatActive.sub(v => keyEventManager.triggerKey('PITOT_HEAT_SET', true, v ? 1 : 0), true);
                this.windshieldHeatActive.sub(v => keyEventManager.triggerKey('WINDSHIELD_DEICE_SET', true, v ? 1 : 0), true);
                this.leftN1Loss.sub(v => SimVar.SetSimVarValue('TURB ENG N1 LOSS:1', msfsSdk.SimVarValueType.Percent, v));
                this.rightN1Loss.sub(v => SimVar.SetSimVarValue('TURB ENG N1 LOSS:2', msfsSdk.SimVarValueType.Percent, v));
                this.leftFuelEffLoss.sub(v => SimVar.SetSimVarValue('TURB ENG FUEL EFFICIENCY LOSS:1', msfsSdk.SimVarValueType.Percent, v));
                this.rightFuelEffLoss.sub(v => SimVar.SetSimVarValue('TURB ENG FUEL EFFICIENCY LOSS:2', msfsSdk.SimVarValueType.Percent, v));
                this.leftIttEffLoss.sub(v => SimVar.SetSimVarValue('TURB ENG ITT COOLING EFFICIENCY LOSS:1', msfsSdk.SimVarValueType.Percent, v));
                this.rightIttEffLoss.sub(v => SimVar.SetSimVarValue('TURB ENG ITT COOLING EFFICIENCY LOSS:2', msfsSdk.SimVarValueType.Percent, v));
                this.bus.getSubscriber().on('key_intercept').handle(this.onKeyIntercepted.bind(this));
            });
        }
        /**
         * Handles when a key is intercepted.
         * @param data The event data.
         * @param data.key The key that was intercepted.
         * @param data.value0 The value that was sent.
         */
        onKeyIntercepted({ key, value0: value }) {
            switch (key) {
                case 'TOGGLE_STRUCTURAL_DEICE':
                    this.wingAiOn = !this.wingAiOn;
                    SimVar.SetSimVarValue(AiSimVars.WingAi, msfsSdk.SimVarValueType.Number, this.wingAiOn ? 1 : 0);
                    break;
                case 'PITOT_HEAT_OFF':
                    this.pitotHeatOn = false;
                    SimVar.SetSimVarValue(AiSimVars.PitotHeat, msfsSdk.SimVarValueType.Number, this.pitotHeatOn ? 1 : 0);
                    break;
                case 'PITOT_HEAT_ON':
                    this.pitotHeatOn = true;
                    SimVar.SetSimVarValue(AiSimVars.PitotHeat, msfsSdk.SimVarValueType.Number, this.pitotHeatOn ? 1 : 0);
                    break;
                case 'PITOT_HEAT_SET':
                    this.pitotHeatOn = value === 1;
                    SimVar.SetSimVarValue(AiSimVars.PitotHeat, msfsSdk.SimVarValueType.Number, this.pitotHeatOn ? 1 : 0);
                    break;
                case 'PITOT_HEAT_TOGGLE':
                    this.pitotHeatOn = !this.pitotHeatOn;
                    SimVar.SetSimVarValue(AiSimVars.PitotHeat, msfsSdk.SimVarValueType.Number, this.pitotHeatOn ? 1 : 0);
                    break;
                case 'ANTI_ICE_GRADUAL_SET':
                    this.handleEngineAiEvent(SimVar.GetSimVarValue('ENGINE CONTROL SELECT', msfsSdk.SimVarValueType.Number), value !== 0);
                    break;
                case 'ANTI_ICE_GRADUAL_SET_ENG1':
                    this.handleEngineAiEvent(1, value !== 0);
                    break;
                case 'ANTI_ICE_GRADUAL_SET_ENG2':
                    this.handleEngineAiEvent(2, value !== 0);
                    break;
                case 'ANTI_ICE_ON':
                    this.handleEngineAiEvent(SimVar.GetSimVarValue('ENGINE CONTROL SELECT', msfsSdk.SimVarValueType.Number), true);
                    break;
                case 'ANTI_ICE_OFF':
                    this.handleEngineAiEvent(SimVar.GetSimVarValue('ENGINE CONTROL SELECT', msfsSdk.SimVarValueType.Number), false);
                    break;
                case 'ANTI_ICE_SET':
                    this.handleEngineAiEvent(SimVar.GetSimVarValue('ENGINE CONTROL SELECT', msfsSdk.SimVarValueType.Number), value === 1);
                    break;
                case 'ANTI_ICE_SET_ENG1':
                    this.handleEngineAiEvent(1, value === 1);
                    break;
                case 'ANTI_ICE_SET_ENG2':
                    this.handleEngineAiEvent(2, value === 1);
                    break;
                case 'ANTI_ICE_TOGGLE':
                    this.handleEngineAiEvent(SimVar.GetSimVarValue('ENGINE CONTROL SELECT', msfsSdk.SimVarValueType.Number));
                    break;
                case 'ANTI_ICE_TOGGLE_ENG1':
                    this.handleEngineAiEvent(1);
                    break;
                case 'ANTI_ICE_TOGGLE_ENG2':
                    this.handleEngineAiEvent(2);
                    break;
            }
        }
        /**
         * Handles an engine anti-ice event.
         * @param engineFlags The engine flags to control.
         * @param isOn Whether or not the anti-ice is on.
         */
        handleEngineAiEvent(engineFlags, isOn) {
            if (msfsSdk.BitFlags.isAll(engineFlags, 1)) {
                this.leftEngineAiOn = isOn !== undefined ? isOn : !this.leftEngineAiOn;
                SimVar.SetSimVarValue(AiSimVars.LeftEngineAi, msfsSdk.SimVarValueType.Number, this.leftEngineAiOn ? 1 : 0);
            }
            if (msfsSdk.BitFlags.isAll(engineFlags, 2)) {
                this.rightEngineAiOn = isOn !== undefined ? isOn : !this.rightEngineAiOn;
                SimVar.SetSimVarValue(AiSimVars.RightEngineAi, msfsSdk.SimVarValueType.Number, this.rightEngineAiOn ? 1 : 0);
            }
        }
        /**
         * Updates the anti-ice system.
         * @param timestamp The timestamp, in milliseconds simtime.
         */
        update(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
            }
            const deltaTime = msfsSdk.NavMath.clamp(timestamp - this.previousTimestamp, 0, 10000);
            if (!this.isInitComplete) {
                this.initTemps();
                this.isInitComplete = true;
            }
            if (!this.isPrimary) {
                this.wingAiOn = SimVar.GetSimVarValue(AiSimVars.WingAi, msfsSdk.SimVarValueType.Number) === 1;
                this.leftEngineAiOn = SimVar.GetSimVarValue(AiSimVars.LeftEngineAi, msfsSdk.SimVarValueType.Number) === 1;
                this.rightEngineAiOn = SimVar.GetSimVarValue(AiSimVars.RightEngineAi, msfsSdk.SimVarValueType.Number) === 1;
                this.pitotHeatOn = SimVar.GetSimVarValue(AiSimVars.PitotHeat, msfsSdk.SimVarValueType.Number) === 1;
            }
            this.updateEngineAi();
            this.updateStateTransition(deltaTime);
            if (this.isPrimary) {
                this.updateEngineLoad();
            }
            this.updateWindshieldHeat();
            this.updateWingAi();
            this.updatePitotHeat();
            this.updateTemps(deltaTime);
            this.updateIcingState();
            this.previousTimestamp = timestamp;
        }
        /**
         * Updates the engine anti-ice systems.
         */
        updateEngineAi() {
            if (this.leftEngineAiOn && this.leftN2.get() > 58) {
                this.leftEngineAiActive.set(true);
            }
            else {
                this.leftEngineAiActive.set(false);
            }
            if (this.rightEngineAiOn && this.rightN2.get() > 58) {
                this.rightEngineAiActive.set(true);
            }
            else {
                this.rightEngineAiActive.set(false);
            }
        }
        /**
         * Updates the wing anti-ice systems.
         */
        updateWingAi() {
            const leftEngineStarting = this.leftN2.get() < 58 && this.leftRunStop.get();
            const rightEngineStarting = this.rightN2.get() < 58 && this.rightRunStop.get();
            const xFlowActive = this.bleedAir.getValve(BleedValvePosition.WingXFlow).isActive.get();
            const leftHasFlow = this.leftN2.get() > 58 && (this.bleedAir.getValve(BleedValvePosition.LeftWingIsolation).isActive.get() || xFlowActive);
            if (this.wingAiOn && leftHasFlow && !(leftEngineStarting || rightEngineStarting)) {
                if (!this.leftAiActive.get() && this.leftAiSpoolTime === -1) {
                    this.leftAiSpoolTime = xFlowActive ? 0 : 4000;
                }
            }
            else {
                this.leftAiSpoolTime = -1;
                this.leftAiActive.set(false);
            }
            const rightHasPrimaryFlow = this.rightN2.get() > 58 && (this.bleedAir.getValve(BleedValvePosition.RightWingIsolation).isActive.get() || xFlowActive);
            if (this.wingAiOn && rightHasPrimaryFlow && !(leftEngineStarting || rightEngineStarting)) {
                if (!this.rightAiActive.get() && this.rightAiSpoolTime === -1) {
                    this.rightAiSpoolTime = xFlowActive ? 0 : 4000;
                }
            }
            else {
                this.rightAiSpoolTime = -1;
                this.rightAiActive.set(false);
            }
        }
        /**
         * Updates the engine anti-ice bleed air load.
         */
        updateEngineLoad() {
            const leftEngineOn = this.leftN2.get() > 58;
            const rightEngineOn = this.rightN2.get() > 58;
            let numEnginesOn = 0;
            if (leftEngineOn && rightEngineOn) {
                numEnginesOn = 2;
            }
            else if (leftEngineOn || rightEngineOn) {
                numEnginesOn = 1;
            }
            let load = 0;
            if (this.leftEngineAiActive.get()) {
                load += 0.3;
            }
            if (this.rightEngineAiActive.get()) {
                load += 0.3;
            }
            if (this.leftAiActive.get()) {
                load += 1.0;
            }
            if (this.rightAiActive.get()) {
                load += 1.0;
            }
            const loadPerEngine = load / numEnginesOn;
            this.leftN1Loss.set(loadPerEngine / 52);
            this.rightN1Loss.set(loadPerEngine / 52);
            this.leftFuelEffLoss.set(loadPerEngine / 20);
            this.rightFuelEffLoss.set(loadPerEngine / 20);
            this.leftIttEffLoss.set(loadPerEngine / 10);
            this.rightIttEffLoss.set(loadPerEngine / 10);
        }
        /**
         * Updates the pitot heat system.
         */
        updatePitotHeat() {
            if (this.pitotHeatOn) {
                this.pitotHeatActive.set(true);
            }
            else {
                // Turn Pitot heat on if we are in the air or if at least one engine is running and our ground speed is greater
                // than 15 knots.
                if (!this.onGround.get()
                    || ((this.leftN2.get() > 40 || this.rightN2.get() > 40) && (this.groundSpeed.get() > 15))) {
                    this.pitotHeatActive.set(true);
                }
            }
        }
        /**
         * Updates the wing A/I state transition.
         * @param deltaTime The delta time, in milliseconds simtime.
         */
        updateStateTransition(deltaTime) {
            if (this.leftAiSpoolTime !== -1) {
                this.leftAiSpoolTime -= deltaTime;
                if (this.leftAiSpoolTime <= 0) {
                    this.leftAiSpoolTime = -1;
                    this.leftAiActive.set(true);
                    this.isPrimary && this.publisher.pub('ai_n1_boost_1', 0, true, true);
                }
                else {
                    this.isPrimary && this.publisher.pub('ai_n1_boost_1', 1, true, true);
                }
            }
            if (this.rightAiSpoolTime !== -1) {
                this.rightAiSpoolTime -= deltaTime;
                if (this.rightAiSpoolTime <= 0) {
                    this.rightAiSpoolTime = -1;
                    this.rightAiActive.set(true);
                    this.isPrimary && this.publisher.pub('ai_n1_boost_2', 0, true, true);
                }
                else {
                    this.isPrimary && this.publisher.pub('ai_n1_boost_2', 1, true, true);
                }
            }
        }
        /**
         * Updates the windshield heating element.
         */
        updateWindshieldHeat() {
            if ((this.electrical.lEmerBus.isActive.get() || this.electrical.rEmerBus.isActive.get()) && this.rat.get() < 41) {
                this.windshieldHeatActive.set(true);
            }
            else {
                this.windshieldHeatActive.set(false);
            }
        }
        /**
         * Updates the system ice detection/prevention state.
         */
        updateIcingState() {
            const icingPct = SimVar.GetSimVarValue('STRUCTURAL ICE PCT', msfsSdk.SimVarValueType.Percent);
            this.stabAiActive.set(SimVar.GetSimVarValue(AiSimVars.StabAi, msfsSdk.SimVarValueType.Number) === 1);
            let icingState = IcingState.None;
            if (icingPct >= 33) {
                icingState = IcingState.Warning;
                if (this.leftAiActive.get() && this.rightAiActive.get() && this.stabAiActive.get() && this.leftEngineAiActive.get() && this.rightEngineAiActive.get()) {
                    icingState = IcingState.AllActive;
                }
            }
            this.icingState.set(icingState);
        }
        /**
         * Initializes all the temperature systems.
         */
        initTemps() {
            this.initTempSource(this.leftRootTemp, 1000);
            this.initTempSource(this.rightRootTemp, 1000);
            this.initTempSource(this.leftWingTemp, 500);
            this.initTempSource(this.rightWingTemp, 500);
            this.initTempSource(this.l1Temp, 375);
            this.initTempSource(this.l2Temp, 250);
            this.initTempSource(this.r1Temp, 375);
            this.initTempSource(this.r2Temp, 250);
            this.windshieldTemp.addSource({ conductivity: 1, temperature: this.rat.get() });
            this.windshieldTemp.set(this.rat.get());
        }
        /**
         * Initializes a temperature system.
         * @param tempSystem The temperature system to initialize.
         * @param bleedConductivity The bleed air conductivity to use.
         */
        initTempSource(tempSystem, bleedConductivity) {
            tempSystem.addSource({ conductivity: bleedConductivity, temperature: this.rat.get() });
            tempSystem.addSource({ conductivity: 20, temperature: this.rat.get() });
            tempSystem.set(this.rat.get());
        }
        /**
         * Updates the temperature systems.
         * @param deltaTime The delta time, in milliseconds simtime.
         */
        updateTemps(deltaTime) {
            const leftRootHasFlow = this.leftAiActive.get() && this.leftN2.get() > 58 && this.bleedAir.leftCheckValve.isActive.get();
            this.updateTempSource(deltaTime, this.leftRootTemp, this.leftBleedTemp, leftRootHasFlow ? 1000 : 0);
            const rightRootHasFlow = this.rightAiActive.get() && this.rightN2.get() > 58 && this.bleedAir.rightCheckValve.isActive.get();
            this.updateTempSource(deltaTime, this.rightRootTemp, this.rightBleedTemp, rightRootHasFlow ? 1000 : 0);
            this.updateTempSource(deltaTime, this.leftWingTemp, this.leftBleedTemp, this.leftAiActive.get() ? 18 : 0);
            this.updateTempSource(deltaTime, this.rightWingTemp, this.rightBleedTemp, this.rightAiActive.get() ? 18 : 0);
            this.updateTempSource(deltaTime, this.l1Temp, this.leftBleedTemp, this.leftAiActive.get() ? 6 : 0);
            this.updateTempSource(deltaTime, this.l2Temp, this.leftBleedTemp, this.leftAiActive.get() ? 5 : 0);
            this.updateTempSource(deltaTime, this.r1Temp, this.rightBleedTemp, this.rightAiActive.get() ? 6 : 0);
            this.updateTempSource(deltaTime, this.r2Temp, this.rightBleedTemp, this.rightAiActive.get() ? 5 : 0);
            this.windshieldTemp.setSourceTemp(0, this.windshieldHeatActive.get() ? 41 : this.rat.get());
            this.windshieldTemp.update(deltaTime);
        }
        /**
         * Updates an individual temperature system.
         * @param deltaTime The delta time, in milliseconds simtime.
         * @param tempSystem The temperature system to update.
         * @param temp The bleed air temperature to apply.
         * @param bleedConductivity The bleed air conductivity to apply.
         */
        updateTempSource(deltaTime, tempSystem, temp, bleedConductivity) {
            tempSystem.setSourceTemp(0, temp);
            tempSystem.setSourceConductivity(0, bleedConductivity);
            tempSystem.setSourceTemp(1, this.rat.get());
            tempSystem.setSourceConductivity(1, (Math.min(this.ias.get() / 60, 1) * 8.5) + 0.5);
            tempSystem.update(deltaTime);
        }
    }

    /**
     * A temperature controller for the supply temperature.
     */
    class SupplyTempController {
        /**
         * Creates an instance of a SupplyTempController.
         * @param inputTemp The input temperature to read.
         * @param setTemp The set temperature to target.
         * @param highFlow Whether or not the ECS is in high flow mode.
         */
        constructor(inputTemp, setTemp, highFlow) {
            this.inputTemp = inputTemp;
            this.setTemp = setTemp;
            this.highFlow = highFlow;
            this.previousTimestamp = -1;
            this.previousInputTemp = NaN;
            this.pid = new msfsSdk.PidController(1, 0, 0, 100, -100);
            /**
             * The output supply temperature.
             */
            this.supplyTemp = msfsSdk.Subject.create(NaN);
            /**
             * A manual temperature to set, if not NaN.
             */
            this.manualTemp = NaN;
        }
        /**
         * Updates the supply temp controller.
         * @param timestamp The current timestamp.
         */
        update(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
                this.previousInputTemp = this.inputTemp.get();
            }
            const deltaTime = msfsSdk.MathUtils.clamp(timestamp - this.previousTimestamp, 0, 10000);
            if (deltaTime === 0) {
                return;
            }
            const supplyChangeRate = this.highFlow.get() ? 1 : 0.5;
            if (isNaN(this.manualTemp)) {
                const tempChangeRate = ((this.inputTemp.get() - this.previousInputTemp) / deltaTime) * 1000;
                const setTemp = this.setTemp.get();
                const tempError = setTemp - this.inputTemp.get();
                const targetRate = (Math.min(Math.abs(tempError), supplyChangeRate) * Math.sign(tempError)) / 5;
                const targetRateError = targetRate - tempChangeRate;
                if (tempError < 0 && this.supplyTemp.get() > setTemp) {
                    // Do not adjust supply temp past the set temp because with large elapsed time (e.g. with high sim rate) this can
                    // cause the supply temp to bounce back and forth as it overshoots.
                    this.supplyTemp.set(msfsSdk.MathUtils.clamp(this.supplyTemp.get() - ((deltaTime / 1000) * supplyChangeRate), setTemp, 45));
                }
                else if (tempError > 0 && this.supplyTemp.get() < setTemp) {
                    // Do not adjust supply temp past the set temp because with large elapsed time (e.g. with high sim rate) this can
                    // cause the supply temp to bounce back and forth as it overshoots.
                    this.supplyTemp.set(msfsSdk.MathUtils.clamp(this.supplyTemp.get() + ((deltaTime / 1000) * supplyChangeRate), 4, setTemp));
                }
                else {
                    this.supplyTemp.set(msfsSdk.MathUtils.clamp(this.supplyTemp.get() + this.pid.getOutput(deltaTime, targetRateError), 4, 45));
                }
            }
            else {
                const tempError = this.manualTemp - this.supplyTemp.get();
                const deltaTemp = (deltaTime / 1000) * supplyChangeRate * Math.sign(tempError);
                if (Math.abs(deltaTemp) >= Math.abs(tempError)) {
                    this.supplyTemp.set(this.manualTemp);
                }
                else {
                    this.supplyTemp.set(this.supplyTemp.get() + deltaTemp);
                }
            }
            this.previousInputTemp = this.inputTemp.get();
            this.previousTimestamp = timestamp;
        }
    }
    /**
     * The Longitude ECS system.
     */
    class LongitudeEcsSystem {
        /**
         * Creates an instance of the LongitudeEcsSystem.
         * @param bleedAir The bleed air system to use with this instance.
         * @param bus The event bus to use with this instance.
         * @param isPrimary If this is the primary controlling instance.
         */
        constructor(bleedAir, bus, isPrimary) {
            this.bleedAir = bleedAir;
            this.bus = bus;
            this.isPrimary = isPrimary;
            this.settings = LongitudeUserSettings.getManager(this.bus);
            this.outsideAirTemp = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ram_air_temp_c'), NaN);
            this.recircValveAnimator = new msfsSdk.Animator();
            this.cabinManualHeatModeOn = false;
            this.cockpitManualHeatModeOn = false;
            this.previousTimestamp = -1;
            /** The current recirc fan speed. */
            this.recircFanSpeed = msfsSdk.Subject.create(RecircFanSpeed.Off);
            /** The current cabin set temperature. */
            this.cabinSetTemp = msfsSdk.Subject.create(0);
            /** The current cockpit set temperature. */
            this.cockpitSetTemp = msfsSdk.Subject.create(0);
            /** The current cabin temperature. */
            this.cockpitTemp = new msfsSdk.TemperatureSystem(1.0035);
            /** The current cockpit temperature. */
            this.cabinTemp = new msfsSdk.TemperatureSystem(1.0035);
            this.cockpitTempController = new SupplyTempController(this.cockpitTemp.value, this.cockpitSetTemp, this.bleedAir.highFlow);
            this.cabinTempController = new SupplyTempController(this.cabinTemp.value, this.cabinSetTemp, this.bleedAir.highFlow);
            /** The current left supply temperature. */
            this.leftSupplyTemp = this.cabinTempController.supplyTemp;
            /** The current right supply temperature. */
            this.rightSupplyTemp = this.cockpitTempController.supplyTemp;
            this.tempsInited = false;
            if (this.isPrimary) {
                // Need to initialize cockpit/cabin temperature selections to the correct units.
                this.resetCockpitCabinSetTemperatures();
                this.bus.getSubscriber().on('avionics_global_power').handle(this.onGlobalPowerChanged.bind(this));
            }
            this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
            if (this.isPrimary) {
                const publisher = this.bus.getPublisher();
                this.leftSupplyTemp.sub(v => !isNaN(v) && publisher.pub('ecs-cabin-supply-temp', v, true, true), true);
                this.rightSupplyTemp.sub(v => !isNaN(v) && publisher.pub('ecs-cockpit-supply-temp', v, true, true), true);
                this.cabinTemp.value.sub(v => !isNaN(v) && publisher.pub('ecs-cabin-current-temp', v, true, true), true);
                this.cockpitTemp.value.sub(v => !isNaN(v) && publisher.pub('ecs-cockpit-current-temp', v, true, true), true);
                msfsSdk.MappedSubject.create(([acm, heatExchange]) => SimVar.SetSimVarValue('L:WT_LNG_ECS_ACTIVE', msfsSdk.SimVarValueType.Number, (acm || heatExchange) ? 1 : 0), this.bleedAir.getLine(BleedLine.Acm).isActive, this.bleedAir.getLine(BleedLine.HeatExchange).isActive);
            }
            this.recircFanSpeed.sub(this.onRecircFanSpeedChanged.bind(this), true);
            this.cockpitTemp.addSource({ conductivity: 0.002, temperature: this.outsideAirTemp.get() });
            this.cockpitTemp.addSource({ conductivity: 0.075, temperature: this.outsideAirTemp.get() });
            this.cabinTemp.addSource({ conductivity: 0.002, temperature: this.outsideAirTemp.get() });
            this.cabinTemp.addSource({ conductivity: 0.075, temperature: this.outsideAirTemp.get() });
        }
        /**
         * Gets the percentage open the recirc valve is.
         * @returns A subscribable of the value.
         */
        get recircPercentOpen() {
            return this.recircValveAnimator.value;
        }
        /**
         * Resets the cockpit and cabin temperature selections to their default values (21 degrees C / 70 degrees F).
         */
        resetCockpitCabinSetTemperatures() {
            const units = this.settings.getSetting('temperatureControlUnits').value;
            if (units === EcsTemperatureUnits.Fahrenheit) {
                this.settings.getSetting('cockpitSetTemperature').value = 70;
                this.settings.getSetting('cabinSetTemperature').value = 70;
            }
            else {
                this.settings.getSetting('cockpitSetTemperature').value = 21;
                this.settings.getSetting('cabinSetTemperature').value = 21;
            }
        }
        /**
         * Handles when the avionics global power state changes.
         * @param event The avionics global power state change event.
         */
        onGlobalPowerChanged(event) {
            if (event.current === true) {
                this.resetCockpitCabinSetTemperatures();
            }
        }
        /**
         * Handles when the recirc fan speed changes.
         * @param speed The recirc fan speed.
         */
        onRecircFanSpeedChanged(speed) {
            if (speed === RecircFanSpeed.Low || speed === RecircFanSpeed.High) {
                this.recircValveAnimator.set(1);
            }
            else {
                this.recircValveAnimator.set(0);
            }
        }
        /**
         * Updates the ECS system.
         * @param timestamp The current simtime timestamp.
         */
        update(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
            }
            const deltaTime = msfsSdk.MathUtils.clamp(timestamp - this.previousTimestamp, 0, 10000);
            const heatExchanger = this.bleedAir.getLine(BleedLine.HeatExchange);
            const acm = this.bleedAir.getLine(BleedLine.Acm);
            this.setInitialTemperatures();
            this.cabinManualHeatModeOn = SimVar.GetSimVarValue('L:WT_LNG_CABIN_TEMP_MANUAL', msfsSdk.SimVarValueType.Number) === 1;
            this.cockpitManualHeatModeOn = SimVar.GetSimVarValue('L:WT_LNG_COCKPIT_TEMP_MANUAL', msfsSdk.SimVarValueType.Number) === 1;
            const units = this.settings.getSetting('temperatureControlUnits').get() === EcsTemperatureUnits.Celsius
                ? msfsSdk.UnitType.CELSIUS
                : msfsSdk.UnitType.FAHRENHEIT;
            if (this.cabinManualHeatModeOn) {
                this.cabinTempController.manualTemp = this.getManualSupplyTemp('L:WT_LNG_CABIN_MANUAL_PCT');
            }
            else {
                this.cabinTempController.manualTemp = NaN;
            }
            if (this.cockpitManualHeatModeOn) {
                this.cockpitTempController.manualTemp = this.getManualSupplyTemp('L:WT_LNG_COCKPIT_MANUAL_PCT');
            }
            else {
                this.cockpitTempController.manualTemp = NaN;
            }
            this.cabinSetTemp.set(units.convertTo(this.settings.getSetting('cabinSetTemperature').get(), msfsSdk.UnitType.CELSIUS));
            this.cockpitSetTemp.set(units.convertTo(this.settings.getSetting('cockpitSetTemperature').get(), msfsSdk.UnitType.CELSIUS));
            if (acm.isActive.get() || heatExchanger.isActive.get()) {
                this.cockpitTemp.setSourceTemp(0, this.outsideAirTemp.get());
                this.cockpitTemp.setSourceConductivity(1, this.bleedAir.highFlow.get() ? 0.030 : 0.015);
                this.cabinTemp.setSourceTemp(0, this.outsideAirTemp.get());
                this.cabinTemp.setSourceConductivity(1, this.bleedAir.highFlow.get() ? 0.025 : 0.0125);
                this.cabinTempController.update(timestamp);
                this.cockpitTempController.update(timestamp);
                this.cabinTemp.setSourceTemp(1, this.leftSupplyTemp.get());
                this.cockpitTemp.setSourceTemp(1, this.rightSupplyTemp.get());
            }
            else {
                this.cockpitTemp.setSourceTemp(0, this.outsideAirTemp.get());
                this.cockpitTemp.setSourceConductivity(1, 0);
                this.cabinTemp.setSourceTemp(0, this.outsideAirTemp.get());
                this.cabinTemp.setSourceConductivity(1, 0);
            }
            this.cockpitTemp.update(deltaTime);
            this.cabinTemp.update(deltaTime);
            const recircFanSpeedSetting = this.settings.getSetting('recircFanSpeed').get();
            if (this.bleedAir.highFlow.get()) {
                this.recircFanSpeed.set(RecircFanSpeed.High);
            }
            else {
                this.recircFanSpeed.set(recircFanSpeedSetting);
            }
            this.previousTimestamp = timestamp;
        }
        /**
         * Sets the intial temperatures of the system.
         */
        setInitialTemperatures() {
            if (!this.tempsInited && !isNaN(this.outsideAirTemp.get())) {
                this.leftSupplyTemp.set(this.outsideAirTemp.get());
                this.rightSupplyTemp.set(this.outsideAirTemp.get());
                this.cockpitTemp.set(this.outsideAirTemp.get());
                this.cockpitTemp.setSourceTemp(0, this.outsideAirTemp.get());
                this.cockpitTemp.setSourceTemp(1, this.outsideAirTemp.get());
                this.cabinTemp.set(this.outsideAirTemp.get());
                this.cabinTemp.setSourceTemp(0, this.outsideAirTemp.get());
                this.cabinTemp.setSourceTemp(1, this.outsideAirTemp.get());
                this.tempsInited = true;
            }
        }
        /**
         * Gets the manual supply temp from a cockpit temperature knob.
         * @param simvar The simvar representing the knob setting.
         * @returns The target temperature.
         */
        getManualSupplyTemp(simvar) {
            const cockpitTempPercent = SimVar.GetSimVarValue(simvar, msfsSdk.SimVarValueType.Number);
            return ((LongitudeEcsSystem.MAX_SUPPLY_TEMP - LongitudeEcsSystem.MIN_SUPPLY_TEMP) * cockpitTempPercent) + LongitudeEcsSystem.MIN_SUPPLY_TEMP;
        }
    }
    LongitudeEcsSystem.MIN_SUPPLY_TEMP = 5;
    LongitudeEcsSystem.MAX_SUPPLY_TEMP = 45;

    var InhibitStates;
    (function (InhibitStates) {
        InhibitStates["LOPI"] = "landing-op-inhibit";
        InhibitStates["TOPI"] = "takeoff-op-inhibit";
        InhibitStates["ESDI"] = "engine-shutdown-inhibit";
        InhibitStates["InAir"] = "in-air-inhibit";
        InhibitStates["OnGround"] = "on-ground-inhibit";
        InhibitStates["EmerBusLeft"] = "emer-bus-left";
        InhibitStates["EmerBusRight"] = "emer-bus-right";
        InhibitStates["MainBusLeft"] = "main-bus-left";
        InhibitStates["MainBusRight"] = "main-bus-right";
        InhibitStates["MissionBusLeft"] = "mission-bus-left";
        InhibitStates["MissionBusRight"] = "mission-bus-right";
    })(InhibitStates || (InhibitStates = {}));
    var AlertSuffixes;
    (function (AlertSuffixes) {
        AlertSuffixes["L"] = "L";
        AlertSuffixes["R"] = "R";
        AlertSuffixes["APU"] = "APU";
        AlertSuffixes["HYD"] = "HYD";
        AlertSuffixes["N"] = "N";
        AlertSuffixes["A"] = "A";
        AlertSuffixes["B"] = "B";
    })(AlertSuffixes || (AlertSuffixes = {}));

    /** Engine monitor alerts. */
    var EngineMonitorAlerts;
    (function (EngineMonitorAlerts) {
        EngineMonitorAlerts["EngineDryMotorProc"] = "lng-eng-eng-dry-motor-proc";
        EngineMonitorAlerts["EngineShutdown"] = "lng-eng-eng-shutdown";
    })(EngineMonitorAlerts || (EngineMonitorAlerts = {}));
    /**
     * Monitors the Longitude engines.
     */
    class LongitudeEngineMonitor {
        /**
         * Creates an instance of the LongitudeEngineMonitor.
         * @param bus The event bus to use with this instance.
         * @param electrical The electrical system to monitor.
         * @param isPrimary Whether or not this is the primary instance.
         */
        constructor(bus, electrical, isPrimary) {
            this.bus = bus;
            this.electrical = electrical;
            this.isPrimary = isPrimary;
            this.engines = [
                {
                    n2: msfsSdk.ConsumerValue.create(this.bus.getSubscriber().on('n2_1'), 0),
                    starter: msfsSdk.ConsumerValue.create(this.bus.getSubscriber().on('eng_starter_on_1'), false),
                    dryMotorAlert: msfsSdk.CasAlertTransporter.create(this.bus, EngineMonitorAlerts.EngineDryMotorProc, msfsSdk.AnnunciationType.SafeOp, AlertSuffixes.L),
                    shutdownAlert: msfsSdk.CasAlertTransporter.create(this.bus, EngineMonitorAlerts.EngineShutdown, msfsSdk.AnnunciationType.SafeOp, AlertSuffixes.L),
                    engineWasOn: false,
                    dryMotorRunTime: 0,
                    timeSinceDryMotor: msfsSdk.Subject.create(NaN, msfsSdk.SubscribableUtils.NUMERIC_NAN_EQUALITY),
                    dryMotorComplete: false,
                    shutdownTime: msfsSdk.Subject.create(NaN, msfsSdk.SubscribableUtils.NUMERIC_NAN_EQUALITY)
                },
                {
                    n2: msfsSdk.ConsumerValue.create(this.bus.getSubscriber().on('n2_2'), 0),
                    starter: msfsSdk.ConsumerValue.create(this.bus.getSubscriber().on('eng_starter_on_2'), false),
                    dryMotorAlert: msfsSdk.CasAlertTransporter.create(this.bus, EngineMonitorAlerts.EngineDryMotorProc, msfsSdk.AnnunciationType.SafeOp, AlertSuffixes.R),
                    shutdownAlert: msfsSdk.CasAlertTransporter.create(this.bus, EngineMonitorAlerts.EngineShutdown, msfsSdk.AnnunciationType.SafeOp, AlertSuffixes.R),
                    engineWasOn: false,
                    dryMotorRunTime: 0,
                    timeSinceDryMotor: msfsSdk.Subject.create(NaN, msfsSdk.SubscribableUtils.NUMERIC_NAN_EQUALITY),
                    dryMotorComplete: false,
                    shutdownTime: msfsSdk.Subject.create(NaN, msfsSdk.SubscribableUtils.NUMERIC_NAN_EQUALITY)
                },
            ];
            this.leftEngineShutdownTime = this.engines[0].shutdownTime;
            this.rightEngineShutdownTime = this.engines[1].shutdownTime;
            this.leftTimeSinceDryMotor = this.engines[0].timeSinceDryMotor;
            this.rightTimeSinceDryMotor = this.engines[1].timeSinceDryMotor;
            this.previousTimestamp = -1;
            const cas = this.bus.getPublisher();
            const lopiTopiInAir = [InhibitStates.LOPI, InhibitStates.TOPI, InhibitStates.InAir];
            const lr = [AlertSuffixes.L, AlertSuffixes.R];
            cas.pub('cas_register_alert', { uuid: EngineMonitorAlerts.EngineDryMotorProc, message: 'ENG DRY MTR PROC', inhibitedBy: lopiTopiInAir, suffixes: lr }, true, false);
            cas.pub('cas_register_alert', { uuid: EngineMonitorAlerts.EngineShutdown, message: 'ENGINE SHUTDOWN', suffixes: lr }, true, false);
            const sub = msfsSdk.GameStateProvider.get().sub(state => {
                if (state === GameState.ingame) {
                    this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
                    sub.destroy();
                }
            }, false, true);
            sub.resume(true);
        }
        /**
         * Updates the engine monitor
         * @param timestamp The timestamp, in milliseconds simtime.
         */
        update(timestamp) {
            if (this.previousTimestamp === -1) {
                this.previousTimestamp = timestamp;
            }
            const deltaTime = msfsSdk.NavMath.clamp(timestamp - this.previousTimestamp, 0, 10000);
            if (!this.electrical.lEmerBus.isActive.get() && !this.electrical.rEmerBus.isActive.get()) {
                this.engines[0].engineWasOn = false;
                this.engines[1].engineWasOn = false;
            }
            for (let i = 0; i < this.engines.length; i++) {
                const engine = this.engines[i];
                if (engine.n2.get() > 58) {
                    engine.engineWasOn = true;
                    engine.dryMotorComplete = false;
                    engine.timeSinceDryMotor.set(NaN);
                    engine.shutdownTime.set(0);
                    if (this.isPrimary) {
                        engine.shutdownAlert.set(false);
                    }
                }
                if (engine.engineWasOn && engine.n2.get() < 58) {
                    if (isNaN(engine.shutdownTime.get())) {
                        engine.shutdownTime.set(0);
                    }
                    engine.shutdownTime.set(engine.shutdownTime.get() + deltaTime);
                }
                if (engine.n2.get() < 58 && this.isPrimary) {
                    engine.shutdownAlert.set(true);
                }
                if (engine.shutdownTime.get() >= LongitudeEngineMonitor.DRY_MOTOR_TIME_MIN && engine.shutdownTime.get() <= LongitudeEngineMonitor.DRY_MOTOR_TIME_MAX) {
                    if (!isNaN(engine.timeSinceDryMotor.get()) && !engine.starter.get()) {
                        engine.timeSinceDryMotor.set(engine.timeSinceDryMotor.get() + deltaTime);
                        if (engine.timeSinceDryMotor.get() >= LongitudeEngineMonitor.DRY_MOTOR_EXP_TIME) {
                            engine.dryMotorComplete = true;
                        }
                    }
                    if (engine.starter.get()) {
                        engine.dryMotorRunTime += deltaTime;
                        if (engine.n2.get() >= 19 || engine.dryMotorRunTime >= 15000) {
                            engine.timeSinceDryMotor.set(0);
                        }
                        else {
                            engine.timeSinceDryMotor.set(NaN);
                        }
                    }
                    else {
                        engine.dryMotorRunTime = 0;
                    }
                    if (this.isPrimary) {
                        engine.dryMotorAlert.set(!engine.dryMotorComplete);
                    }
                }
                else {
                    if (this.isPrimary) {
                        engine.dryMotorAlert.set(false);
                    }
                }
            }
            this.previousTimestamp = timestamp;
        }
    }
    LongitudeEngineMonitor.DRY_MOTOR_TIME_MIN = msfsSdk.UnitType.MINUTE.convertTo(15, msfsSdk.UnitType.MILLISECOND);
    LongitudeEngineMonitor.DRY_MOTOR_TIME_MAX = msfsSdk.UnitType.MINUTE.convertTo(180, msfsSdk.UnitType.MILLISECOND);
    LongitudeEngineMonitor.DRY_MOTOR_EXP_TIME = msfsSdk.UnitType.MINUTE.convertTo(3, msfsSdk.UnitType.MILLISECOND);

    /**
     * The Longitude external lights system.
     */
    class LongitudeExternalLightsSystem {
        /**
         * Creates an instance of the Longitude external lights system.
         * @param bus The event bus to use.
         * @param electrical The electrical system to use.
         * @param isPrimary Whether or not this is the primary sim-controlling instance.
         */
        constructor(bus, electrical, isPrimary) {
            this.bus = bus;
            this.electrical = electrical;
            this.isPrimary = isPrimary;
            this.auralRegistrationManager = this.isPrimary ? new msfsSdk.AuralAlertRegistrationManager(this.bus) : undefined;
            this.settings = LongitudeUserSettings.getManager(this.bus);
            this.previousTimestamp = -1;
            this.leftEngineRun = false;
            this.leftEngineStart = false;
            this.rightEngineRun = false;
            this.rightEngineStart = false;
            this.taIntruderCount = 0;
            this.raIntruderCount = 0;
            this.pulseLightsOn = msfsSdk.Subject.create(false);
            this.navLightsOn = msfsSdk.Subject.create(false);
            this.beaconLightsOn = msfsSdk.Subject.create(false);
            this.paxLightOn = msfsSdk.Subject.create(false);
            this.seatbeltsLightOn = msfsSdk.Subject.create(false);
            this.leftLandingLightOn = false;
            this.rightLandingLightOn = false;
            if (this.auralRegistrationManager) {
                this.auralRegistrationManager.register(LongitudeExternalLightsSystem.PAX_ALERT_DEF);
                this.auralRegistrationManager.register(LongitudeExternalLightsSystem.SEATBELT_ALERT_DEF);
            }
            msfsSdk.Wait.awaitSubscribable(msfsSdk.GameStateProvider.get(), s => s === GameState.ingame, true).then(() => {
                if (this.isPrimary) {
                    this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
                    this.bus.getSubscriber().on('tcas_ta_intruder_count').handle(c => this.taIntruderCount = c);
                    this.bus.getSubscriber().on('tcas_ra_intruder_count').handle(c => this.raIntruderCount = c);
                    this.bus.getSubscriber().on('turb_eng_runstop_1').handle(r => this.leftEngineRun = r);
                    this.bus.getSubscriber().on('turb_eng_runstop_2').handle(r => this.rightEngineRun = r);
                    this.bus.getSubscriber().on('eng_starter_on_1').handle(s => this.leftEngineStart = s);
                    this.bus.getSubscriber().on('eng_starter_on_2').handle(s => this.rightEngineStart = s);
                    msfsSdk.KeyEventManager.getManager(this.bus).then(this.initKeyEvents.bind(this));
                }
            });
            msfsSdk.GameStateProvider.get().sub(s => {
                //Since the pulse lights are actual landing lights 3, the sim will try to turn them
                //on with the landing lights on FLT init. So we just always turn them off here, since
                //they should never be on with any flight start.
                if (s === GameState.ingame) {
                    this.pulseLightsOn.set(false);
                    this.pulseLightsOn.notify();
                }
            });
        }
        /**
         * Updates the lights system.
         */
        update() {
            if (this.settings.getSetting('lightsPulseTaRaOn').get()) {
                if (this.taIntruderCount > 0 || this.raIntruderCount > 0) {
                    this.pulseLightsOn.set(true);
                }
            }
            if (this.settings.getSetting('lightsNavigationOn').get()) {
                if (this.electrical.lEmerBus.isActive.get() || this.electrical.rEmerBus.isActive.get()) {
                    this.navLightsOn.set(true);
                }
                else {
                    this.navLightsOn.set(false);
                }
            }
            else {
                this.navLightsOn.set(false);
            }
            if (this.settings.getSetting('lightsBeaconMode').get() === BeaconLightsMode.Normal) {
                if (this.leftEngineRun || this.leftEngineStart || this.rightEngineRun || this.rightEngineStart) {
                    this.beaconLightsOn.set(true);
                }
                else {
                    this.beaconLightsOn.set(false);
                }
            }
            else if (this.settings.getSetting('lightsBeaconMode').get() === BeaconLightsMode.On) {
                this.beaconLightsOn.set(true);
            }
            else {
                this.beaconLightsOn.set(false);
            }
            if (this.isPrimary) {
                this.paxLightOn.set(SimVar.GetSimVarValue('CABIN NO SMOKING ALERT SWITCH', msfsSdk.SimVarValueType.Bool) === 1);
                this.seatbeltsLightOn.set(SimVar.GetSimVarValue('CABIN SEATBELTS ALERT SWITCH', msfsSdk.SimVarValueType.Bool) === 1);
            }
        }
        /**
         * Initializes the key events for the light system.
         * @param keyEventManager The key event manager to use.
         */
        initKeyEvents(keyEventManager) {
            this.navLightsOn.sub(on => {
                keyEventManager.triggerKey('NAV_LIGHTS_SET', true, on ? 1 : 0);
            }, true);
            this.pulseLightsOn.sub(on => {
                keyEventManager.triggerKey('LANDING_LIGHTS_SET', true, on ? 1 : 0, 3);
            }, true);
            this.beaconLightsOn.sub(on => {
                keyEventManager.triggerKey('BEACON_LIGHTS_SET', true, on ? 1 : 0);
            });
            this.paxLightOn.sub(() => {
                this.bus.getPublisher().pub('aural_alert_trigger', 'longitude-pax-chime', true, false);
            });
            this.seatbeltsLightOn.sub(() => {
                this.bus.getPublisher().pub('aural_alert_trigger', 'longitude-seatbelt-chime', true, false);
            });
            keyEventManager.interceptKey('BEACON_LIGHTS_ON', false);
            keyEventManager.interceptKey('BEACON_LIGHTS_OFF', false);
            keyEventManager.interceptKey('BEACON_LIGHTS_SET', false);
            keyEventManager.interceptKey('TOGGLE_BEACON_LIGHTS', false);
            keyEventManager.interceptKey('LANDING_LIGHTS_ON', false);
            keyEventManager.interceptKey('LANDING_LIGHTS_OFF', false);
            keyEventManager.interceptKey('LANDING_LIGHTS_SET', false);
            keyEventManager.interceptKey('LANDING_LIGHTS_TOGGLE', false);
            keyEventManager.interceptKey('NAV_LIGHTS_ON', false);
            keyEventManager.interceptKey('NAV_LIGHTS_OFF', false);
            keyEventManager.interceptKey('NAV_LIGHTS_SET', false);
            keyEventManager.interceptKey('TOGGLE_NAV_LIGHTS', false);
            keyEventManager.interceptKey('RECOGNITION_LIGHTS_SET', false);
            keyEventManager.interceptKey('TOGGLE_RECOGNITION_LIGHTS', false);
            this.bus.getSubscriber().on('key_intercept').handle(data => this.onKeyIntercepted(keyEventManager, data));
            this.leftLandingLightOn = SimVar.GetSimVarValue('LIGHT LANDING ON:1', msfsSdk.SimVarValueType.Bool) === 1;
            this.rightLandingLightOn = SimVar.GetSimVarValue('LIGHT LANDING ON:2', msfsSdk.SimVarValueType.Bool) === 1;
        }
        /**
         * Handles when a key is intercepted.
         * @param keyEventManager The key event manager to use.
         * @param data The data for the key event.
         * @param data.key The key that was intercepted
         * @param data.value0 The value of the key
         * @param data.value1 The index
         */
        onKeyIntercepted(keyEventManager, { key, value0: value, value1: index }) {
            switch (key) {
                case 'BEACON_LIGHTS_ON':
                    this.settings.getSetting('lightsBeaconMode').set(BeaconLightsMode.On);
                    this.beaconLightsOn.set(true);
                    break;
                case 'BEACON_LIGHTS_OFF':
                    this.settings.getSetting('lightsBeaconMode').set(BeaconLightsMode.Off);
                    this.beaconLightsOn.set(false);
                    break;
                case 'BEACON_LIGHTS_SET':
                    this.settings.getSetting('lightsBeaconMode').set(value === 1 ? BeaconLightsMode.On : BeaconLightsMode.Off);
                    this.beaconLightsOn.set(value === 1);
                    break;
                case 'TOGGLE_BEACON_LIGHTS':
                    this.settings.getSetting('lightsBeaconMode').set(this.beaconLightsOn.get() ? BeaconLightsMode.Off : BeaconLightsMode.On);
                    this.beaconLightsOn.set(!this.beaconLightsOn.get());
                    break;
                case 'LANDING_LIGHTS_ON':
                case 'LANDING_LIGHTS_OFF':
                case 'LANDING_LIGHTS_SET':
                case 'LANDING_LIGHTS_TOGGLE':
                    this.handleLandingLightsEvent(keyEventManager, key, value, index);
                    break;
                case 'NAV_LIGHTS_ON':
                    this.settings.getSetting('lightsNavigationOn').set(true);
                    this.navLightsOn.set(true);
                    break;
                case 'NAV_LIGHTS_OFF':
                    this.settings.getSetting('lightsNavigationOn').set(false);
                    this.navLightsOn.set(false);
                    break;
                case 'NAV_LIGHTS_SET':
                    this.settings.getSetting('lightsNavigationOn').set(value === 1);
                    this.navLightsOn.set(value === 1);
                    break;
                case 'TOGGLE_NAV_LIGHTS':
                    this.settings.getSetting('lightsNavigationOn').set(!this.settings.getSetting('lightsNavigationOn').get());
                    this.navLightsOn.set(this.settings.getSetting('lightsNavigationOn').get());
                    break;
                case 'RECOGNITION_LIGHTS_SET':
                case 'TOGGLE_RECOGNITION_LIGHTS':
                    if (!this.leftLandingLightOn && !this.rightLandingLightOn) {
                        keyEventManager.triggerKey(key, true, value, index);
                    }
                    break;
            }
        }
        /**
         * Handles landing lights events.
         * @param keyEventManager The key event manager to use.
         * @param key The key to forward.
         * @param value The value to forward.
         * @param index The index to forward.
         */
        handleLandingLightsEvent(keyEventManager, key, value, index) {
            if (index !== 3) {
                switch (key) {
                    case 'LANDING_LIGHTS_ON':
                        keyEventManager.triggerKey('LANDING_LIGHTS_ON', true, value);
                        keyEventManager.triggerKey('RECOGNITION_LIGHTS_SET', true, 0, 0);
                        this.pulseLightsOn.set(false);
                        if (index === 0) {
                            this.rightLandingLightOn = true;
                            this.leftLandingLightOn = true;
                        }
                        else if (index === 1) {
                            this.leftLandingLightOn = true;
                        }
                        else {
                            this.rightLandingLightOn = true;
                        }
                        break;
                    case 'LANDING_LIGHTS_OFF':
                        keyEventManager.triggerKey('LANDING_LIGHTS_OFF', true, value);
                        if (index === 0) {
                            this.rightLandingLightOn = false;
                            this.leftLandingLightOn = false;
                        }
                        else if (index === 1) {
                            this.leftLandingLightOn = false;
                        }
                        else {
                            this.rightLandingLightOn = false;
                        }
                        break;
                    case 'LANDING_LIGHTS_SET': {
                        keyEventManager.triggerKey('LANDING_LIGHTS_SET', true, value, index);
                        const isSet = value === 1;
                        if (isSet) {
                            keyEventManager.triggerKey('RECOGNITION_LIGHTS_SET', true, 0, 0);
                            this.pulseLightsOn.set(false);
                        }
                        if (index === 0) {
                            this.rightLandingLightOn = isSet;
                            this.leftLandingLightOn = isSet;
                        }
                        else if (index === 1) {
                            this.leftLandingLightOn = isSet;
                        }
                        else {
                            this.rightLandingLightOn = isSet;
                        }
                        break;
                    }
                    case 'LANDING_LIGHTS_TOGGLE': {
                        keyEventManager.triggerKey('LANDING_LIGHTS_TOGGLE', true, value);
                        const isSet = this.rightLandingLightOn === false || this.leftLandingLightOn === false;
                        if (isSet) {
                            keyEventManager.triggerKey('RECOGNITION_LIGHTS_SET', true, 0, 0);
                            this.pulseLightsOn.set(false);
                        }
                        if (index === 0) {
                            this.rightLandingLightOn = isSet;
                            this.leftLandingLightOn = isSet;
                        }
                        else if (index === 1) {
                            this.leftLandingLightOn = isSet;
                        }
                        else {
                            this.rightLandingLightOn = isSet;
                        }
                        break;
                    }
                }
            }
            else {
                if (!this.leftLandingLightOn && !this.rightLandingLightOn) {
                    switch (key) {
                        case 'LANDING_LIGHTS_ON':
                            this.pulseLightsOn.set(true);
                            break;
                        case 'LANDING_LIGHTS_OFF':
                            this.pulseLightsOn.set(false);
                            break;
                        case 'LANDING_LIGHTS_SET':
                            this.pulseLightsOn.set(value === 1);
                            break;
                        case 'LANDING_LIGHTS_TOGGLE':
                            this.pulseLightsOn.set(!this.pulseLightsOn.get());
                            break;
                    }
                }
            }
        }
    }
    LongitudeExternalLightsSystem.PAX_ALERT_DEF = {
        uuid: 'longitude-pax-chime',
        queue: 'longitude-aural-passenger',
        priority: 0,
        sequence: 'tone_high_low_chime',
        continuous: false,
        repeat: false
    };
    LongitudeExternalLightsSystem.SEATBELT_ALERT_DEF = {
        uuid: 'longitude-seatbelt-chime',
        queue: 'longitude-aural-passenger',
        priority: 0,
        sequence: 'tone_high_chime',
        continuous: false,
        repeat: false
    };

    /**
     * Citation Longitude aural alert IDs.
     */
    var LongitudeAuralAlertIds;
    (function (LongitudeAuralAlertIds) {
        LongitudeAuralAlertIds["NoTakeoff"] = "longitude-no-takeoff";
        LongitudeAuralAlertIds["BrakesFail"] = "longitude-brakes-fail";
        LongitudeAuralAlertIds["GensOff"] = "longitude-gens-off";
    })(LongitudeAuralAlertIds || (LongitudeAuralAlertIds = {}));
    /**
     * A utility class for working with Citation Longitude aural alerts.
     */
    class LongitudeAuralAlertUtils {
    }
    /** A map from Citation Longitude aural alert IDs to their default priorities. */
    LongitudeAuralAlertUtils.PRIORITIES = {
        [LongitudeAuralAlertIds.NoTakeoff]: -51,
        [LongitudeAuralAlertIds.BrakesFail]: -52,
        [LongitudeAuralAlertIds.GensOff]: -69
    };

    /**
     * The state of the no takeoff checks.
     */
    class TakeoffCheckStates {
        constructor() {
            this.parkBrake = msfsSdk.Subject.create(false);
            this.pitchRollDisc = msfsSdk.Subject.create(false);
            this.aileronTrim = msfsSdk.Subject.create(false);
            this.stabilizerTrim = msfsSdk.Subject.create(false);
            this.rudderTrim = msfsSdk.Subject.create(false);
            this.flaps = msfsSdk.Subject.create(false);
            this.spoilers = msfsSdk.Subject.create(false);
            this.speedbrakeHandle = msfsSdk.Subject.create(false);
            this.controlLockOn = msfsSdk.Subject.create(false);
            this.cabinDoorOpen = msfsSdk.Subject.create(false);
        }
    }
    /**
     * Handle the no takeoff checks for the Longitude
     */
    class LongitudeNoTakeoffChecks {
        /**
         * Creates an instance of the LongitudeNoTakeoffChecks.
         * @param bus The event bus to use.
         * @param hydraulicSystem The hydraulic system to read from.
         * @param isPrimary Whether or not this is the primary instance.
         */
        constructor(bus, hydraulicSystem, isPrimary) {
            this.bus = bus;
            this.hydraulicSystem = hydraulicSystem;
            this.isPrimary = isPrimary;
            this.current = new TakeoffCheckStates();
            this.previous = new TakeoffCheckStates();
            this.onGround = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('on_ground'), true);
            this.throttlePctLeft = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('v_throttle_lever_pos_1'), 0);
            this.throttlePctRight = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('v_throttle_lever_pos_2'), 0);
            this.isTakeoff = false;
            this.noTakeoff = msfsSdk.Subject.create(false);
            this.noTakeoffWarning = msfsSdk.Subject.create(false);
            this.auralVoice = msfsWtg3000Common.AuralAlertUserSettings.getManager(this.bus).voice;
            this.hydraulicSystem.brakeSystem.brakeControlSystem.parkingBrakeOn.sub(v => this.current.parkBrake.set(!v), true);
            this.hydraulicSystem.spoilerSystem.controlSystem.spoilersInput.sub(v => this.current.speedbrakeHandle.set(v < 0.02), true);
            this.bus.getSubscriber().on('rudder_trim_pct').handle(v => this.current.rudderTrim.set(Math.abs(v) <= 33));
            this.bus.getSubscriber().on('aileron_trim_pct').handle(v => this.current.aileronTrim.set(Math.abs(v) <= 33));
            this.bus.getSubscriber().on('elevator_trim_angle').handle(v => this.current.stabilizerTrim.set(v >= 2.5 && v <= 6.5));
            this.bus.getSubscriber().on('flaps_handle_index').handle(v => this.current.flaps.set(v === 1 || v === 2));
            this.current.pitchRollDisc.set(true);
            this.current.spoilers.set(true);
            this.current.controlLockOn.set(true);
            this.current.cabinDoorOpen.set(true);
            this.previous.aileronTrim.set(true);
            this.previous.cabinDoorOpen.set(true);
            this.previous.controlLockOn.set(true);
            this.previous.flaps.set(true);
            this.previous.parkBrake.set(true);
            this.previous.pitchRollDisc.set(true);
            this.previous.rudderTrim.set(true);
            this.previous.speedbrakeHandle.set(true);
            this.previous.spoilers.set(true);
            this.previous.stabilizerTrim.set(true);
            this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
            if (this.isPrimary) {
                const cas = this.bus.getPublisher();
                cas.pub('cas_register_alert', { uuid: 'lng-no-takeoff', message: 'NO TAKEOFF', inhibitedBy: [InhibitStates.LOPI, InhibitStates.TOPI, InhibitStates.InAir] }, true, false);
                this.auralRegistrationManager = new msfsSdk.AuralAlertRegistrationManager(this.bus);
                this.auralRegistrationManager.register({
                    uuid: LongitudeAuralAlertIds.NoTakeoff,
                    queue: msfsWtg3000Common.G3000AuralAlertUtils.PRIMARY_QUEUE,
                    priority: LongitudeAuralAlertUtils.PRIORITIES[LongitudeAuralAlertIds.NoTakeoff],
                    sequence: 'aural_no_takeoff_f',
                    continuous: false,
                    repeat: true
                });
                msfsSdk.CasAuralAlertTransporter.create(this.bus, LongitudeAuralAlertIds.NoTakeoff, () => {
                    return {
                        uuid: LongitudeAuralAlertIds.NoTakeoff,
                        sequence: this.auralVoice.get() === msfsWtg3000Common.AuralAlertVoiceSetting.Male ? 'aural_no_takeoff_m' : 'aural_no_takeoff_f'
                    };
                }, 'lng-no-takeoff', msfsSdk.AnnunciationType.Warning, undefined, true);
                msfsSdk.CasAlertTransporter.create(this.bus, 'lng-no-takeoff', msfsSdk.AnnunciationType.SafeOp)
                    .bind(this.noTakeoff, v => v);
                msfsSdk.CasAlertTransporter.create(this.bus, 'lng-no-takeoff', msfsSdk.AnnunciationType.Warning)
                    .bind(this.noTakeoffWarning, v => v);
            }
        }
        /**
         * Updates the no takeoff checks system.
         */
        update() {
            const eitherThrottleTO = (this.throttlePctLeft.get() > .9 || this.throttlePctRight.get() > .9);
            const eitherThrottleBeyondIdle = (this.throttlePctLeft.get() > .1 || this.throttlePctRight.get() > .1);
            if (this.onGround.get() && eitherThrottleTO) {
                if (!this.isTakeoff) {
                    this.copyToPrevious();
                    this.isTakeoff = true;
                }
            }
            else {
                this.isTakeoff = false;
            }
            this.noTakeoff.set(!this.canTakeoff());
            if ((this.onGround.get() && eitherThrottleTO) || (this.onGround.get() && !this.current.parkBrake.get() && eitherThrottleBeyondIdle)) {
                this.noTakeoffWarning.set(this.noTakeoff.get());
            }
            else {
                this.noTakeoffWarning.set(false);
            }
        }
        /**
         * Checks if the takeoff configuration is valid.
         * @returns True if valid, false otherwise.
         */
        canTakeoff() {
            return this.current.aileronTrim.get()
                && this.current.cabinDoorOpen.get()
                && this.current.controlLockOn.get()
                && this.current.flaps.get()
                && this.current.parkBrake.get()
                && this.current.pitchRollDisc.get()
                && this.current.rudderTrim.get()
                && this.current.speedbrakeHandle.get()
                && this.current.spoilers.get()
                && this.current.stabilizerTrim.get();
        }
        /**
         * Copies the current values to the previous values.
         */
        copyToPrevious() {
            this.previous.aileronTrim.set(this.current.aileronTrim.get());
            this.previous.cabinDoorOpen.set(this.current.cabinDoorOpen.get());
            this.previous.controlLockOn.set(this.current.controlLockOn.get());
            this.previous.flaps.set(this.current.flaps.get());
            this.previous.parkBrake.set(this.current.parkBrake.get());
            this.previous.pitchRollDisc.set(this.current.pitchRollDisc.get());
            this.previous.rudderTrim.set(this.current.rudderTrim.get());
            this.previous.speedbrakeHandle.set(this.current.speedbrakeHandle.get());
            this.previous.spoilers.set(this.current.spoilers.get());
            this.previous.stabilizerTrim.set(this.current.stabilizerTrim.get());
        }
    }

    /**
     * The Longitude auto-test system.
     */
    class LongitudeAutoTestSystem {
        /**
         * Creates an instance of the LongitudeAutoTestSystem.
         * @param bus The event bus to use with this instance.
         * @param fuelSystem An instance of the fuel system.
         * @param hydraulicSystem And instance of the hydraulic system.
         * @param antiIce An instance of the anti-ice system.
         * @param electrical An instance of the electrical system.
         * @param isPrimary If this is the primary sim controlling instance.
         */
        constructor(bus, fuelSystem, hydraulicSystem, antiIce, electrical, isPrimary) {
            this.bus = bus;
            this.fuelSystem = fuelSystem;
            this.hydraulicSystem = hydraulicSystem;
            this.antiIce = antiIce;
            this.electrical = electrical;
            this.isPrimary = isPrimary;
            this.simTime = this.bus.getSubscriber().on('simTime');
            this.onGround = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('on_ground'), true);
            this.groundSpeed = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('ground_speed'), 0);
            this.leftEngineRunStop = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_1'), false);
            this.rightEngineRunStop = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('turb_eng_runstop_2'), false);
            this.leftN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_1'), 0);
            this.rightN2 = msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('n2_2'), 0);
            this.noTakeoffChecks = new LongitudeNoTakeoffChecks(this.bus, this.hydraulicSystem, this.isPrimary);
            this.bleedLeakTest = new TestSequence(this.simTime).withStep(new FixedTimeStep(2000));
            this.cvrTest = new TestSequence(this.simTime).withStep(new FixedTimeStep(4000));
            this.flapsTest = new TestSequence(this.simTime).withStep(new FixedTimeStep(10000));
            this.iceDetectorTest = new TestSequence(this.simTime).withStep(new FixedTimeStep(6000));
            this.pressurizationTest = new TestSequence(this.simTime).withStep(new FixedTimeStep(6500));
            this.engineHasShutdown = false;
            this.fuelLevelLowTest = new TestSequence(this.simTime)
                .withStep(new FixedTimeStep(4000, msfsSdk.ConsumerSubject.create(this.bus.getSubscriber().on('fuel_usable_total').atFrequency(1), 0)
                .map(v => msfsSdk.UnitType.GALLON_FUEL.convertTo(v, msfsSdk.UnitType.POUND) < 1000 ? TestResult.Failed : TestResult.Passed)));
            this.hydPressureATest = new TestSequence(this.simTime)
                .withStep(new DynamicFunctionStep(() => {
                return this.hydraulicSystem.outputs.leftSystemPressure.value.get() > 2950 ? TestResult.Completed : TestResult.Pending;
            }))
                .withStep(new FixedTimeStep(2000));
            this.hydPressureBTest = new TestSequence(this.simTime)
                .withStep(new DynamicFunctionStep(() => {
                return this.hydraulicSystem.outputs.rightSystemPressure.value.get() > 2950 ? TestResult.Completed : TestResult.Pending;
            }))
                .withStep(new FixedTimeStep(2000));
            this.leftFuelSystemTest = new TestSequence(this.simTime)
                .withStep(new DynamicFunctionStep(() => {
                return this.fuelSystem.getLine(FuelLines.LeftMain).get() ? TestResult.Completed : TestResult.Pending;
            }))
                .withStep(new FixedTimeStep(5000));
            this.rightFuelSystemTest = new TestSequence(this.simTime)
                .withStep(new DynamicFunctionStep(() => {
                return this.fuelSystem.getLine(FuelLines.LeftMain).get() ? TestResult.Completed : TestResult.Pending;
            }))
                .withStep(new FixedTimeStep(5000));
            this.spoilersTest = new TestSequence(this.simTime)
                .withStep(new FixedTimeStep(2000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                const leftPressure = this.hydraulicSystem.outputs.leftSystemPressure.value.get();
                const rightPressure = this.hydraulicSystem.outputs.rightSystemPressure.value.get();
                if (leftPressure >= 1200 && rightPressure >= 1200) {
                    this.hydraulicSystem.spoilerSystem.setSpoilersTesting(true);
                    return TestResult.Completed;
                }
                else {
                    return TestResult.Failed;
                }
            }))
                .withStep(new FixedTimeStep(2000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                this.hydraulicSystem.spoilerSystem.setSpoilersTesting(false);
                return TestResult.Completed;
            }))
                .withStep(new FixedTimeStep(2000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                const leftPressure = this.hydraulicSystem.outputs.leftSystemPressure.value.get();
                const rightPressure = this.hydraulicSystem.outputs.rightSystemPressure.value.get();
                if (leftPressure >= 1200 && rightPressure >= 1200) {
                    this.hydraulicSystem.spoilerSystem.setSpoilersTesting(true);
                    return TestResult.Completed;
                }
                else {
                    return TestResult.Failed;
                }
            }))
                .withStep(new FixedTimeStep(2000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                this.hydraulicSystem.spoilerSystem.setSpoilersTesting(false);
                return TestResult.Completed;
            }))
                .withStep(new FixedTimeStep(2000));
            this.tailDeiceTest = new TestSequence(this.simTime)
                .withStep(new FixedTimeStep(5000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                this.isPrimary && SimVar.SetSimVarValue(AiSimVars.StabAi, msfsSdk.SimVarValueType.Number, 1);
                return TestResult.Completed;
            }))
                .withStep(new FixedTimeStep(2000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                this.isPrimary && SimVar.SetSimVarValue(AiSimVars.StabAi, msfsSdk.SimVarValueType.Number, 0);
                return TestResult.Passed;
            }));
            this.wingAiTest = new TestSequence(this.simTime)
                .withStep(new FixedTimeStep(6000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                if (!this.antiIce.isWingAiOn) {
                    this.isPrimary && SimVar.SetSimVarValue('K:TOGGLE_STRUCTURAL_DEICE', msfsSdk.SimVarValueType.Number, 1);
                }
                return TestResult.Completed;
            }))
                .withStep(new FixedTimeStep(6000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                if (this.antiIce.leftAiActive.get() && this.antiIce.rightAiActive.get()) {
                    this.isPrimary && SimVar.SetSimVarValue('K:TOGGLE_STRUCTURAL_DEICE', msfsSdk.SimVarValueType.Number, 1);
                    return TestResult.Passed;
                }
                else {
                    return TestResult.Failed;
                }
            }));
            this.pitotHeatTest = new TestSequence(this.simTime)
                .withStep(new FixedTimeStep(8000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                if (!this.antiIce.isPitotHeatOn) {
                    this.isPrimary && SimVar.SetSimVarValue('K:PITOT_HEAT_ON', msfsSdk.SimVarValueType.Number, 1);
                    return TestResult.Completed;
                }
                else {
                    return TestResult.Passed;
                }
            }))
                .withStep(new FixedTimeStep(2000, TestResult.Completed))
                .withStep(new DynamicFunctionStep(() => {
                this.isPrimary && SimVar.SetSimVarValue('K:PITOT_HEAT_OFF', msfsSdk.SimVarValueType.Number, 1);
                return TestResult.Passed;
            }));
            this.testsSkipped = false;
            this.bus.getSubscriber().on('simTime').handle(this.update.bind(this));
        }
        /**
         * Updates the auto-test system.
         */
        update() {
            if (!this.testsSkipped) {
                const skipTests = SimVar.GetSimVarValue('L:WT_LNG_PREFLIGHT_TESTS_SKIP', msfsSdk.SimVarValueType.Number);
                if (skipTests) {
                    this.bleedLeakTest.set(TestResult.Passed);
                    this.cvrTest.set(TestResult.Passed);
                    this.flapsTest.set(TestResult.Passed);
                    this.fuelLevelLowTest.set(TestResult.Passed);
                    this.iceDetectorTest.set(TestResult.Passed);
                    this.pressurizationTest.set(TestResult.Passed);
                    this.leftFuelSystemTest.set(TestResult.Passed);
                    this.rightFuelSystemTest.set(TestResult.Passed);
                    this.hydPressureATest.set(TestResult.Passed);
                    this.hydPressureBTest.set(TestResult.Passed);
                    this.spoilersTest.set(TestResult.Passed);
                    this.tailDeiceTest.set(TestResult.Passed);
                    this.wingAiTest.set(TestResult.Passed);
                    this.pitotHeatTest.set(TestResult.Passed);
                    this.testsSkipped = true;
                }
            }
            this.updateEngineShutdown();
            this.updatePowerOnTests();
            this.updateAutoTests();
            this.updateAutoTaxiTests();
        }
        /**
         * Updates test states with engine shutdown.
         */
        updateEngineShutdown() {
            if (!this.engineHasShutdown) {
                if (this.isEngineStopped('left') || this.isEngineStopped('right')) {
                    this.engineHasShutdown = true;
                    this.bleedLeakTest.reset();
                    this.cvrTest.reset();
                    this.flapsTest.reset();
                    this.fuelLevelLowTest.reset();
                    this.iceDetectorTest.reset();
                    this.pressurizationTest.reset();
                    this.spoilersTest.reset();
                    this.tailDeiceTest.reset();
                    this.wingAiTest.reset();
                    this.pitotHeatTest.reset();
                }
            }
            else {
                if (!this.isEngineStopped('left') && !this.isEngineStopped('right')) {
                    this.engineHasShutdown = false;
                }
            }
        }
        /**
         * Updates the auto-tests.
         */
        updateAutoTests() {
            if (this.electrical.lEmerBus.isActive || this.electrical.rEmerBus.isActive) {
                this.leftFuelSystemTest.start();
                this.rightFuelSystemTest.start();
                this.hydPressureATest.start();
                this.hydPressureBTest.start();
            }
            else {
                this.leftFuelSystemTest.reset();
                this.rightFuelSystemTest.reset();
                this.hydPressureATest.reset();
                this.hydPressureBTest.reset();
            }
        }
        /**
         * Updates the power-on tests.
         */
        updatePowerOnTests() {
            if (this.electrical.lEmerBus.isActive || this.electrical.rEmerBus.isActive) {
                this.bleedLeakTest.start();
                this.cvrTest.start();
                this.flapsTest.start();
                this.fuelLevelLowTest.start();
                this.iceDetectorTest.start();
                this.pressurizationTest.start();
            }
            else {
                this.bleedLeakTest.reset();
                this.cvrTest.reset();
                this.flapsTest.reset();
                this.fuelLevelLowTest.reset();
                this.iceDetectorTest.reset();
                this.pressurizationTest.reset();
            }
        }
        /**
         * Updates the auto-taxi tests.
         */
        updateAutoTaxiTests() {
            if ((this.electrical.lEmerBus.isActive || this.electrical.rEmerBus.isActive)
                && !this.engineHasShutdown
                && this.onGround.get()
                && this.groundSpeed.get() > 5) {
                this.spoilersTest.start();
                this.tailDeiceTest.start();
                this.wingAiTest.start();
                this.pitotHeatTest.start();
            }
        }
        /**
         * Determines if the engine is stopped.
         * @param side The side to check.
         * @returns True if the engine is stopped, false otherwise.
         */
        isEngineStopped(side) {
            if (side === 'left') {
                return !this.leftEngineRunStop.get() || this.leftN2.get() < 58;
            }
            else {
                return !this.rightEngineRunStop.get() || this.rightN2.get() < 58;
            }
        }
    }

    /**
     * The PFD synoptics plugin for the Citation Longitude.
     */
    class LongitudePfdSynopticsPlugin extends msfsWtg3000Pfd.AbstractG3000PfdPlugin {
        /** @inheritdoc */
        onInit() {
            this.bleedAirSystem = new LongitudeBleedAirSystem(this.binder.bus, false);
            this.bleedAirSystem.init();
            this.ecsSystem = new LongitudeEcsSystem(this.bleedAirSystem, this.binder.bus, false);
            this.fuelSystem = new LongitudeFuelSystem(this.binder.bus, false);
            this.hydraulicsSystem = new LongitudeHydraulicSystem(this.binder.bus, false);
            this.electricalSystem = new LongitudeElectricalSystem(this.binder.bus, this.ecsSystem, false);
            this.engineMonitor = new LongitudeEngineMonitor(this.binder.bus, this.electricalSystem, false);
            this.antiIceSystem = new LongitudeAntiIceSystem(this.binder.bus, this.bleedAirSystem, this.electricalSystem, false);
            this.autoTestSystem = new LongitudeAutoTestSystem(this.binder.bus, this.fuelSystem, this.hydraulicsSystem, this.antiIceSystem, this.electricalSystem, false);
            this.exteriorLightsSystem = new LongitudeExternalLightsSystem(this.binder.bus, this.electricalSystem, false);
            this.binder.backplane.addPublisher('AntiIce', new msfsSdk.AntiIcePublisher(this.binder.bus), true);
        }
        /** @inheritdoc */
        registerDisplayPaneViews(viewFactory) {
            viewFactory.registerView(LongitudeDisplayPaneViewKeys.EcsSynoptics, (index) => msfsSdk.FSComponent.buildComponent(EcsSynopticsPane, { index: index, halfSizeOnly: true, bleedAir: this.bleedAirSystem, ecs: this.ecsSystem, bus: this.binder.bus }));
            viewFactory.registerView(LongitudeDisplayPaneViewKeys.FuelSynoptics, (index) => msfsSdk.FSComponent.buildComponent(FuelSynopticsPane, { index: index, halfSizeOnly: true, bus: this.binder.bus, fuelSystem: this.fuelSystem }));
            viewFactory.registerView(LongitudeDisplayPaneViewKeys.HydraulicsSynoptics, (index) => msfsSdk.FSComponent.buildComponent(HydraulicsSynopticsPane, { halfSizeOnly: true, index: index, bus: this.binder.bus, hydraulicSystem: this.hydraulicsSystem }));
            viewFactory.registerView(LongitudeDisplayPaneViewKeys.SummarySynoptics, (index) => msfsSdk.FSComponent.buildComponent(SummarySynopticsPane, { halfSizeOnly: true, index: index, bus: this.binder.bus, hydraulics: this.hydraulicsSystem, ecs: this.ecsSystem, electrical: this.electricalSystem, lights: this.exteriorLightsSystem }));
            viewFactory.registerView(LongitudeDisplayPaneViewKeys.ElectricalSynoptics, (index) => msfsSdk.FSComponent.buildComponent(ElectricalSynopticsPane, { halfSizeOnly: true, index: index, electrical: this.electricalSystem }));
            viewFactory.registerView(LongitudeDisplayPaneViewKeys.FlightControlsSynoptics, (index) => msfsSdk.FSComponent.buildComponent(FlightControlsSynopticsPane, { halfSizeOnly: true, index: index, bus: this.binder.bus, hydraulics: this.hydraulicsSystem }));
            viewFactory.registerView(LongitudeDisplayPaneViewKeys.AntiIceSynoptics, (index) => msfsSdk.FSComponent.buildComponent(AntiIceSynopticsPane, { halfSizeOnly: true, index: index, bleedAir: this.bleedAirSystem, antiIce: this.antiIceSystem }));
            viewFactory.registerView(LongitudeDisplayPaneViewKeys.PreFlightSynoptics, (index) => msfsSdk.FSComponent.buildComponent(PreFlightSynopticsPane, { halfSizeOnly: true, index: index, testSystem: this.autoTestSystem, electrical: this.electricalSystem, engineMonitor: this.engineMonitor, bus: this.binder.bus }));
        }
    }
    msfsSdk.registerPlugin(LongitudePfdSynopticsPlugin);

    /**
     * A plugin which loads the Longitude PFD CSS file.
     */
    class LongitudePfdCssPlugin extends msfsWtg3000Pfd.AbstractG3000PfdPlugin {
        /** @inheritdoc */
        onInstalled() {
            this.loadCss(`${LongitudeFilePaths.PLUGINS_PATH}/LongitudePfdPlugins.css`);
        }
    }
    msfsSdk.registerPlugin(LongitudePfdCssPlugin);

    exports.LongitudePfdCssPlugin = LongitudePfdCssPlugin;
    exports.LongitudePfdInstrumentsPlugin = LongitudePfdInstrumentsPlugin;
    exports.LongitudePfdSynopticsPlugin = LongitudePfdSynopticsPlugin;

    return exports;

})({}, msfssdk, wtg3000pfd, wtg3000common);

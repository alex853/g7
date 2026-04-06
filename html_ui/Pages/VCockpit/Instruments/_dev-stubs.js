// ===== BaseInstrument stub =====
class BaseInstrument extends HTMLElement {

    constructor() {
        super();
        console.info("BaseInstrument.constructor")
    }

    connectedCallback() {
        console.info("BaseInstrument.connectedCallback")
    }

    disconnectedCallback() {
        console.info("BaseInstrument.disconnectedCallback")
    }

    parseXMLConfig() {
        console.info("BaseInstrument.parseXMLConfig")
    }

    Update() {
        // noop
    }

    getAttribute(name) {
        if (name === "url") {
            return window.location.href;
        }
    }
}

const StubSimVar = {
    store: {},

    GetSimVarValue: function(name, unit) {
        if (name === "E:ABSOLUTE TIME") {
            return Date.now() / 1000;
        }

        const rawValue = localStorage.getItem(name);
        if (unit.toLowerCase() === "bool") {
            if (rawValue === undefined || rawValue === null) {
                return 0;
            } else if (rawValue === 0 || rawValue === '0') {
                return 0;
            } else if (rawValue === 1 || rawValue === '1') {
                return 1;
            } else {
                return 0;
            }
        } else if (unit.toLowerCase() === "number"
            || unit.toLowerCase() === "celsius"
            || unit.toLowerCase() === "gallons"
            || unit.toLowerCase() === "feet") {
            if (rawValue === undefined || rawValue === null) {
                return 0;
            } else {
                return Number(rawValue);
            }
        }
        return rawValue || 0;
    },

    SetSimVarValue: function(name, unit, value) {
        if (name === "K:CABIN_SEATBELTS_ALERT_SWITCH_TOGGLE") {
            name = "CABIN SEATBELTS ALERT SWITCH";
            value = this.negateBool(this.GetSimVarValue(name, "Bool"));
        } else if (name === "K:CABIN_NO_SMOKING_ALERT_SWITCH_TOGGLE") {
            name = "CABIN NO SMOKING ALERT SWITCH";
            value = this.negateBool(this.GetSimVarValue(name, "Bool"));
        } else if (name === "K:ELECT_FUEL_PUMP1_SET") {
            name = "GENERAL ENG FUEL PUMP ON:1";
            value = this.negateBool(this.GetSimVarValue(name, "Bool"));
        } else if (name === "K:ELECT_FUEL_PUMP2_SET") {
            name = "GENERAL ENG FUEL PUMP ON:2";
            value = this.negateBool(this.GetSimVarValue(name, "Bool"));
        } else if (name.indexOf("K:") === 0) {
            console.error("don't know what to do with " + name + " event");
            return;
        }

        //this.store[name] = value;
        localStorage.setItem(name, value);
    },

    negateBool: function (v) {
        if (v === 0) {
            return 1;
        } else if (v === 1) {
            return 0;
        } else {
            return 0;
        }
    }
}

const FSRemoteControlSimVar = {
    nameStore: [],
    valueStore: {},
    isPolling: false,
    pollIntervalId: null,
    pollRateMs: 200,

    GetSimVarValue: function(name, unit) {
        const simVarName = name + ":" + unit;
        if (!this.nameStore.includes(simVarName)) {
            this.nameStore.push(simVarName);
        }

        if (!this.isPolling) {
            this.startPolling();
        }

        return this.valueStore[simVarName] || 0;
    },

    SetSimVarValue: function(name, unit, value) {
        // todo ak3 not implemented
/*        if (name === "K:CABIN_SEATBELTS_ALERT_SWITCH_TOGGLE") {
            name = "CABIN SEATBELTS ALERT SWITCH";
            value = !this.GetSimVarValue(name);
        } else if (name === "K:CABIN_NO_SMOKING_ALERT_SWITCH_TOGGLE") {
            name = "CABIN NO SMOKING ALERT SWITCH";
            value = !this.GetSimVarValue(name);
        }

        this.store[name] = value;*/
    },

    startPolling: function() {
        if (this.isPolling) return;

        this.isPolling = true;

        this.pollIntervalId = setInterval(() => {
            this.fetchSimVars();
        }, this.pollRateMs);
    },

    fetchSimVars: function() {
        if (this.nameStore.length === 0) return;

        $.ajax({
            url: 'https://d1.simforge.net:7775/service/v2/ui/poll',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                session: "2",
                vars: this.nameStore.join(',')
            }),
            contentType: 'application/json',
            success: function (response) {
                FSRemoteControlSimVar.valueStore = response;
            },
            error: function (e) {
                console.error("error loading data");
            }
        });
    }
}

const SimVar = window.location.search.includes("fsremote")
    ? FSRemoteControlSimVar
    : StubSimVar;

let instrumentTagName;
let instrumentClass;
let instrumentTemplateHtml;
let instrumentInstance

function setInstrumentTemplateHtml(templateHtml) {
    instrumentTemplateHtml = templateHtml;
}

function registerInstrument(tagName, instrumentClazz) {
    instrumentTagName = tagName;
    instrumentClass = instrumentClazz;
}

function initWrapper() {
    customElements.define(instrumentTagName, instrumentClass);

    instrumentInstance = document.createElement(instrumentTagName);

    instrumentInstance.innerHTML = instrumentTemplateHtml;

    document.getElementById("dev-root")
        .appendChild(instrumentInstance);

    startUpdateLoop(instrumentInstance);
}

function startUpdateLoop(instance) {
    function loop() {
        if (instance.Update) {
            instance.Update();
        }
        requestAnimationFrame(loop);
    }
    loop();
}

EMapRotationMode = {
    NorthUp: "north-up",
    HDGUp: "hdg-up"
}

const StubMap = {
    rotationMode: EMapRotationMode.NorthUp,

    setCenteredOnPlane: function () {},
    update: function () {},
    zoomOut: function () {},
    zoomIn: function () {},
    getRotationMode: function () {
        return this.rotationMode;
    },
    setRotationMode: function (rotationMode) {
        this.rotationMode = rotationMode;
    },
}

const Coherent = {
    call: function (method, callback) {
        const fpFilename = "3.json";
        // const fpFilename = "eglf-lfpo-1.json";
        if (method === "GET_FLIGHTPLAN") {
            return fetch(fpFilename).then(res => res.json());
        }

        return Promise.resolve(null);
    }
}

class FlightPlanManager {
    constructor() {
        console.info("FlightPlanManager.constructor")
    }

    registerListener() {}
}

function diffAndSetText(element, text) {
    if (element.textContent !== text) {
        element.textContent = text;
    }
}

function diffAndSetHTML(element, html) {
    if (element.innerHTML !== html) {
        element.innerHTML = html;
    }
}

function GetStoredData(key) {}

function SetStoredData(key, value) {}

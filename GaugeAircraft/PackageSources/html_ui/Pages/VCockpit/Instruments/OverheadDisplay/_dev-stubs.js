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
}

const StubSimVar = {
    store: {},

    GetSimVarValue: function(name, unit) {
        return this.store[name] || 0;
    },

    SetSimVarValue: function(name, unit, value) {
        if (name === "K:CABIN_SEATBELTS_ALERT_SWITCH_TOGGLE") {
            name = "CABIN SEATBELTS ALERT SWITCH";
            value = !this.GetSimVarValue(name);
        } else if (name === "K:CABIN_NO_SMOKING_ALERT_SWITCH_TOGGLE") {
            name = "CABIN NO SMOKING ALERT SWITCH";
            value = !this.GetSimVarValue(name);
        }

        this.store[name] = value;
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
        // todo ak not implemented
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
/*

        fetch("https://d1.simforge.net:7775/service/v2/ui/poll?session=2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: this.nameStore
        })
            .then(res => res.json())
            .then(data => {
                Object.assign(this.valueStore, data);
            })
            .catch(err => {
                console.error("SimVar fetch error:", err);
            });*/
    }
}

const SimVar = FSRemoteControlSimVar;

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

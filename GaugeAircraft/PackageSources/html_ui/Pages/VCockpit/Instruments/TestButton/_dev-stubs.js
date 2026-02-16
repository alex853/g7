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

const SimVar = {
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

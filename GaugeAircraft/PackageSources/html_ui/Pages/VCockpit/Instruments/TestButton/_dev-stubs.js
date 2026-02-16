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

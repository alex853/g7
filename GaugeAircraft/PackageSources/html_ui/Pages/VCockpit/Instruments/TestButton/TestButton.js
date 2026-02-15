class TestButton extends BaseInstrument {
    constructor() {
        super();
    }

    get templateID() { return "TestButton"; }

    get isInteractive() { 
        return true; 
    }

    connectedCallback() {
        super.connectedCallback();

        console.log("connected callback");

//    this.addEventListener("click", () => {
//        console.log("Root clicked");
//    });

//    requestAnimationFrame(() => {
        this.initButtons();
//    });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    parseXMLConfig() {
        super.parseXMLConfig();
    }

    Update() {
        super.Update();
    }

    initButtons() {
        const buttons = this.querySelectorAll(".menu-button");
        buttons.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                this.onMenuPressed(index, btn);
            });
        });
    }

    onMenuPressed(index, button) {
        console.log("Pressed button index:", index);

        this.querySelectorAll(".menu-button")
            .forEach(b => b.classList.remove("active"));
        button.classList.add("active");
    }
}
registerInstrument("test-button-element", TestButton);
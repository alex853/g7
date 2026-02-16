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

        this.initButtons();
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
        this.openTab(index);
    }

    openTab(index) {
        const page = this.Pages[index];

        this.querySelectorAll('.menu-button')
            .forEach(b => b.classList.remove('active'));
        this.querySelectorAll('#' + page.id + '-btn')
            .forEach(b => b.classList.add('active'));

        this.querySelectorAll('.content-tab')
            .forEach(b => b.classList.add('hidden'));
        this.querySelectorAll('#' + page.id + '-tab')
            .forEach(b => b.classList.remove('hidden'));
    }

    Pages = [
        {
            id: "irs-apu-batt",
        },
        {
            id: "ecs",
        },
        {
            id: "external-lights",
        },
        {
            id: "fuel",
        },
        {
            id: "hyd-cpcs",
        },
        {
            id: "cockpit-lights",
        },
        {
            id: "anti-ice",
        },
        {
            id: "du-ctrl-test",
        }
    ];
}

registerInstrument("test-button-element", TestButton);

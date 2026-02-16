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
        this.openTab(2);
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
        this.querySelectorAll(".menu-button").forEach((btn, index) => {
            btn.addEventListener("click", () => {
                this.onMenuPressed(index, btn);
            });
        });

        this.querySelectorAll(".external-lights-tab-button").forEach((btn) => {
            btn.addEventListener("click", () => {
                this.onExternalLightsButtonPressed(btn);
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

    onExternalLightsButtonPressed(button) {
        const action = button.dataset.action;
        console.log("Pressed external lights button:", action);
        const page = this.Pages[2];
        const state = page.state;

        state[action] = !state[action];
        // todo ak call simvar

        this.updateExternalLightsButtons();
    }

    updateExternalLightsButtons() { // todo ak call it from updateFromSim
        const page = this.Pages[2];
        const state = page.state;

        this.querySelectorAll('.external-lights-tab-button')
            .forEach(b => {
                const action = b.dataset.action;
                if (!action) return;

                if (state[action])
                    b.classList.add('active');
                else
                    b.classList.remove('active');
            });
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
            state: {
                nav: false,
                beacon: false,
                strobe: false,
                taxi: false,
                landing: false,
                "seat-belt": false,
                "no-smoke": false
            }
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

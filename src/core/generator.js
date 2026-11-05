import { createConfig } from "../utils/config.js";

import { createChallenge } from "./challenge.js";

export class CaptchaGenerator {

    constructor(options = {}) {
        this.config = createConfig(options);
    }

    generate() {
        const challenge = createChallenge(this.config);

        return {
            challenge,
            config: this.config
        };
    }
}
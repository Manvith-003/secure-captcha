import { CaptchaStorage } from "./storage.js";
import { CaptchaGenerator } from "./generator.js";

export function createCaptcha(options = {}) {
    const storage = new CaptchaStorage();
    const generator = new CaptchaGenerator(options);

    return {
        storage,
        generator,
        config: generator.config
    };
}
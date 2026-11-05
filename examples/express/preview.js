import fs from "node:fs";

import { createConfig } from "../../src/utils/config.js";

import { generateNumericCode } from "../../src/utils/random.js";

import { renderCaptchaImage } from "../../src/image/renderer.js";

const config = createConfig({
    length: 6,
    width: 220,
    height: 70,
    fontSize: 36,
    noise: true,
    distortion: true
});

const code = generateNumericCode(config.length);

const image = renderCaptchaImage(code, config);

fs.writeFileSync("captcha-preview.png", image);

console.log("CAPTCHA image generated!");
console.log("Preview code (development only):", code);
console.log("Saved as captcha-preview.png");
import { describe, it, expect } from "vitest";

import { createConfig } from "../src/utils/config.js";

import { renderCaptchaImage } from "../src/image/renderer.js";

describe("CAPTCHA Image Renderer", () => {

    it("should generate a valid PNG image", () => {

        const config = createConfig({
            width: 200,
            height: 65
        });

        const image = renderCaptchaImage("123456", config);

        expect(Buffer.isBuffer(image)).toBe(true);

        // PNG signature
        expect(image.subarray(0, 8).toString("hex"))
            .toBe("89504e470d0a1a0a");
    });

    it("should generate non-empty image data", () => {

        const config = createConfig();

        const image = renderCaptchaImage("123456", config);

        expect(image.length).toBeGreaterThan(100);
    });

});
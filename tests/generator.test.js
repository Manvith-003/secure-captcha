import { describe, it, expect } from "vitest";

import {
    generateNumericCode,
    generateChallengeId
} from "../src/utils/random.js";

import { createConfig } from "../src/utils/config.js";

import { createChallenge } from "../src/core/challenge.js";

describe("CAPTCHA Generator", () => {

    it("should generate six digits", () => {
        const code = generateNumericCode(6);

        expect(code).toMatch(/^\d{6}$/);
    });

    it("should generate unique challenge IDs", () => {
        const first = generateChallengeId();
        const second = generateChallengeId();

        expect(first).not.toBe(second);
    });

    it("should reject invalid CAPTCHA length", () => {
        expect(() => generateNumericCode(3)).toThrow();
    });

    it("should create a challenge with expiry", () => {
        const config = createConfig({
            length: 6,
            expiresIn: 180
        });

        const challenge = createChallenge(config);

        expect(challenge.answer).toMatch(/^\d{6}$/);

        expect(challenge.expiresAt).toBeGreaterThan(
            challenge.createdAt
        );

        expect(challenge.attempts).toBe(0);
    });

});
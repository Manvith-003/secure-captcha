
import { describe, it, expect } from "vitest";
import { validateChallenge } from "../src/core/validator.js";

function createTestChallenge(overrides = {}) {
    return {
        answer: "123456",
        expiresAt: Date.now() + 60000,
        attempts: 0,
        maxAttempts: 5,
        used: false,
        ...overrides
    };
}

describe("CAPTCHA Validator", () => {

    it("should accept correct answer", () => {
        const challenge = createTestChallenge();

        const result = validateChallenge(challenge, "123456");

        expect(result.success).toBe(true);
        expect(challenge.used).toBe(true);
    });

    it("should reject incorrect answer", () => {
        const challenge = createTestChallenge();

        const result = validateChallenge(challenge, "654321");

        expect(result.success).toBe(false);
        expect(challenge.attempts).toBe(1);
    });

    it("should reject expired CAPTCHA", () => {
        const challenge = createTestChallenge({
            expiresAt: Date.now() - 1000
        });

        const result = validateChallenge(challenge, "123456");

        expect(result.success).toBe(false);
        expect(result.message).toBe("CAPTCHA expired");
    });

    it("should reject reused CAPTCHA", () => {
        const challenge = createTestChallenge({
            used: true
        });

        const result = validateChallenge(challenge, "123456");

        expect(result.success).toBe(false);
    });

    it("should reject after maximum attempts", () => {
        const challenge = createTestChallenge({
            attempts: 5
        });

        const result = validateChallenge(challenge, "123456");

        expect(result.success).toBe(false);
    });

});

import crypto from "node:crypto";

/**
 * Generate a cryptographically secure random integer.
 */
export function secureRandomInt(min, max) {
    if (
        !Number.isSafeInteger(min) ||
        !Number.isSafeInteger(max) ||
        min > max
    ) {
        throw new Error("Invalid random number range");
    }

    return crypto.randomInt(min, max + 1);
}

/**
 * Generate a numeric CAPTCHA code.
 */
export function generateNumericCode(length = 6) {
    if (!Number.isInteger(length) || length < 4 || length > 8) {
        throw new Error("CAPTCHA length must be between 4 and 8");
    }

    const digits = [];

    for (let i = 0; i < length; i++) {
        digits.push(secureRandomInt(0, 9));
    }

    return digits.join("");
}

/**
 * Generate a unique challenge ID.
 */
export function generateChallengeId() {
    return crypto.randomBytes(24).toString("hex");
}
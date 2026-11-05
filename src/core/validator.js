
import crypto from "node:crypto";

export function validateChallenge(challenge, answer) {

    if (!challenge) {
        return {
            success: false,
            message: "CAPTCHA not found"
        };
    }

    if (challenge.used) {
        return {
            success: false,
            message: "CAPTCHA already used"
        };
    }

    if (Date.now() >= challenge.expiresAt) {
        challenge.used = true;

        return {
            success: false,
            message: "CAPTCHA expired"
        };
    }

    if (challenge.attempts >= challenge.maxAttempts) {
        challenge.used = true;

        return {
            success: false,
            message: "Maximum attempts exceeded"
        };
    }

    challenge.attempts++;

    if (typeof answer !== "string") {
        return {
            success: false,
            message: "Incorrect CAPTCHA"
        };
    }

    const expected = Buffer.from(challenge.answer);
    const submitted = Buffer.from(answer);

    const valid =
        expected.length === submitted.length &&
        crypto.timingSafeEqual(expected, submitted);

    if (!valid) {
        return {
            success: false,
            message: "Incorrect CAPTCHA"
        };
    }

    challenge.used = true;

    return {
        success: true,
        message: "CAPTCHA verified successfully"
    };
}

import { validateChallenge } from "../core/validator.js";

/**
 * Creates Express middleware to verify CAPTCHA on protected routes.
 *
 * Supports reading captchaId and answer from:
 * - Request headers: x-captcha-id and x-captcha-answer
 * - Request body: req.body.captchaId and req.body.captchaAnswer (or req.body.answer)
 * - Custom extractor via options.getCaptchaData(req)
 *
 * @param {Object} captcha - Captcha instance from createCaptcha()
 * @param {Object} [options]
 * @param {Function} [options.getCaptchaData] - Custom extractor `(req) => ({ captchaId, answer })`
 * @returns {import("express").RequestHandler}
 */
export function createCaptchaMiddleware(captcha, options = {}) {
    const { storage } = captcha;

    return (req, res, next) => {
        let captchaId;
        let answer;

        if (typeof options.getCaptchaData === "function") {
            const extracted = options.getCaptchaData(req) || {};
            captchaId = extracted.captchaId;
            answer = extracted.answer;
        } else {
            captchaId = req.headers["x-captcha-id"] || req.body?.captchaId;
            answer =
                req.headers["x-captcha-answer"] ||
                req.body?.captchaAnswer ||
                req.body?.answer;
        }

        if (typeof captchaId !== "string" || typeof answer !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing CAPTCHA response"
            });
        }

        const challenge = storage.get(captchaId);
        const result = validateChallenge(challenge, answer);

        // Remove completed, expired, or exhausted challenges from storage
        if (
            challenge &&
            (
                result.success ||
                challenge.used ||
                Date.now() >= challenge.expiresAt ||
                challenge.attempts >= challenge.maxAttempts
            )
        ) {
            storage.delete(captchaId);
        }

        if (!result.success) {
            return res.status(400).json(result);
        }

        next();
    };
}


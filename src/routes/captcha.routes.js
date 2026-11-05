
import express from "express";
import { renderCaptchaImage } from "../image/renderer.js";
import { validateChallenge } from "../core/validator.js";

export function createCaptchaRouter(captcha) {
    const router = express.Router();

    const { storage, generator } = captcha;

    // Generate CAPTCHA
    router.get("/generate", (req, res) => {
        const { challenge } = generator.generate();

        storage.save(challenge);

        const image = renderCaptchaImage(
            challenge.answer,
            generator.config
        );

        res.set({
            "Content-Type": "image/png",
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache"
        });

        res.setHeader("X-Captcha-Id", challenge.id);

        return res.send(image);
    });

    // Verify CAPTCHA
    router.post("/verify", (req, res) => {
        const { captchaId, answer } = req.body ?? {};

        if (
            typeof captchaId !== "string" ||
            typeof answer !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }

        const challenge = storage.get(captchaId);

        const result = validateChallenge(
            challenge,
            answer
        );

        // Remove completed, expired or exhausted challenges
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

        return res
            .status(result.success ? 200 : 400)
            .json(result);
    });

    // API health
    router.get("/health", (req, res) => {
        return res.json({
            success: true,
            message: "CAPTCHA API is running"
        });
    });

    return router;
}

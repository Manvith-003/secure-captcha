import { describe, it, expect, vi } from "vitest";
import { createCaptcha } from "../src/core/captcha.js";
import { createCaptchaMiddleware } from "../src/middleware/captcha.middleware.js";

describe("CAPTCHA Middleware", () => {
    it("should allow request when valid CAPTCHA header is provided", () => {
        const captcha = createCaptcha();
        const { challenge } = captcha.generator.generate();
        captcha.storage.save(challenge);

        const middleware = createCaptchaMiddleware(captcha);

        const req = {
            headers: {
                "x-captcha-id": challenge.id,
                "x-captcha-answer": challenge.answer
            },
            body: {}
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(captcha.storage.get(challenge.id)).toBeNull();
    });

    it("should allow request when valid CAPTCHA body is provided", () => {
        const captcha = createCaptcha();
        const { challenge } = captcha.generator.generate();
        captcha.storage.save(challenge);

        const middleware = createCaptchaMiddleware(captcha);

        const req = {
            headers: {},
            body: {
                captchaId: challenge.id,
                captchaAnswer: challenge.answer
            }
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("should reject request when CAPTCHA is missing", () => {
        const captcha = createCaptcha();
        const middleware = createCaptchaMiddleware(captcha);

        const req = { headers: {}, body: {} };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        middleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: "Invalid or missing CAPTCHA response"
        }));
    });

    it("should reject request when CAPTCHA answer is incorrect", () => {
        const captcha = createCaptcha();
        const { challenge } = captcha.generator.generate();
        captcha.storage.save(challenge);

        const middleware = createCaptchaMiddleware(captcha);

        const req = {
            headers: {},
            body: {
                captchaId: challenge.id,
                captchaAnswer: "000000"
            }
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const next = vi.fn();

        middleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: "Incorrect CAPTCHA"
        }));
    });
});


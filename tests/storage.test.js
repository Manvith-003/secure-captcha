import { describe, it, expect } from "vitest";
import { CaptchaStorage } from "../src/core/storage.js";

describe("CaptchaStorage", () => {
    it("should save and retrieve challenge", () => {
        const storage = new CaptchaStorage();
        const challenge = { id: "test-1", answer: "123456", expiresAt: Date.now() + 10000 };

        storage.save(challenge);
        expect(storage.get("test-1")).toEqual(challenge);
        expect(storage.size).toBe(1);
    });

    it("should delete challenge", () => {
        const storage = new CaptchaStorage();
        const challenge = { id: "test-2", answer: "123456" };

        storage.save(challenge);
        expect(storage.delete("test-2")).toBe(true);
        expect(storage.get("test-2")).toBeNull();
    });

    it("should clean up expired challenges", () => {
        const storage = new CaptchaStorage();
        storage.save({ id: "active", expiresAt: Date.now() + 10000, attempts: 0, maxAttempts: 5 });
        storage.save({ id: "expired", expiresAt: Date.now() - 1000, attempts: 0, maxAttempts: 5 });
        storage.save({ id: "used", expiresAt: Date.now() + 10000, used: true });

        storage.cleanup();
        expect(storage.get("active")).not.toBeNull();
        expect(storage.get("expired")).toBeNull();
        expect(storage.get("used")).toBeNull();
    });
});


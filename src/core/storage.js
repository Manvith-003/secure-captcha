
export class CaptchaStorage {

    constructor() {
        this.challenges = new Map();
    }

    save(challenge) {
        this.challenges.set(challenge.id, challenge);

        return challenge;
    }

    get(id) {
        return this.challenges.get(id) || null;
    }

    delete(id) {
        return this.challenges.delete(id);
    }

    cleanup() {
        const now = Date.now();

        for (const [id, challenge] of this.challenges) {

            if (
                now >= challenge.expiresAt ||
                challenge.used ||
                challenge.attempts >= challenge.maxAttempts
            ) {
                this.delete(id);
            }
        }
    }

    clear() {
        this.challenges.clear();
    }

    get size() {
        return this.challenges.size;
    }
}

import {
    generateChallengeId,
    generateNumericCode
} from "../utils/random.js";

export function createChallenge(config) {
    const now = Date.now();

    return {
        id: generateChallengeId(),

        answer: generateNumericCode(config.length),

        createdAt: now,

        expiresAt: now + config.expiresIn * 1000,

        attempts: 0,

        maxAttempts: config.maxAttempts,

        used: false
    };
}
const DEFAULT_CONFIG = {
    length: 6,

    width: 200,
    height: 65,

    expiresIn: 180,

    maxAttempts: 5,

    backgroundColor: "#F5F7FA",
    textColor: "#172033",

    noise: true,
    distortion: true,

    fontSize: 34
};

export function createConfig(options = {}) {
    const config = {
        ...DEFAULT_CONFIG,
        ...options
    };

    if (!Number.isInteger(config.length) ||
        config.length < 4 ||
        config.length > 8) {
        throw new Error("Length must be between 4 and 8");
    }

    if (!Number.isInteger(config.width) ||
        config.width < 100 || config.width > 500) {
        throw new Error("Width must be between 100 and 500");
    }

    if (!Number.isInteger(config.height) ||
        config.height < 40 || config.height > 200) {
        throw new Error("Height must be between 40 and 200");
    }

    if (!Number.isInteger(config.expiresIn) ||
        config.expiresIn < 30 || config.expiresIn > 600) {
        throw new Error("Expiry must be between 30 and 600 seconds");
    }

    if (!Number.isInteger(config.maxAttempts) ||
        config.maxAttempts < 1 || config.maxAttempts > 10) {
        throw new Error("Max attempts must be between 1 and 10");
    }

    return Object.freeze(config);
}
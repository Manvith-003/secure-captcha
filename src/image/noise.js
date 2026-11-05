import { secureRandomInt } from "../utils/random.js";

export function addImageNoise(ctx, width, height, count = 250) {

    for (let i = 0; i < count; i++) {

        const x = secureRandomInt(0, width - 1);
        const y = secureRandomInt(0, height - 1);

        ctx.fillStyle = "rgba(80, 100, 130, 0.35)";

        ctx.fillRect(x, y, 1, 1);
    }
}
import { createCanvas } from "@napi-rs/canvas";

import { secureRandomInt } from "../utils/random.js";

export function renderCaptchaImage(code, config) {

    const { width, height } = config;

    const canvas = createCanvas(width, height);

    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Font settings
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw digits individually
    const digitWidth = width / code.length;

    for (let i = 0; i < code.length; i++) {

        const x = digitWidth * i + digitWidth / 2;
        const y = height / 2;

        const rotation = secureRandomInt(-25, 25);

        const fontSize = config.fontSize +
            secureRandomInt(-4, 5);

        ctx.save();

        ctx.translate(
            x,
            y + secureRandomInt(-5, 6)
        );

        ctx.rotate(rotation * Math.PI / 180);

        ctx.font = `bold ${fontSize}px Arial`;

        ctx.fillStyle = config.textColor;

        ctx.fillText(code[i], 0, 0);

        ctx.restore();
    }

    // Noise
    if (config.noise) {
        addNoise(ctx, width, height);
    }

    // Distortion lines
    if (config.distortion) {
        addDistortion(ctx, width, height);
    }

    return canvas.toBuffer("image/png");
}

function addNoise(ctx, width, height) {

    for (let i = 0; i < 250; i++) {

        const x = secureRandomInt(0, width - 1);
        const y = secureRandomInt(0, height - 1);

        ctx.fillStyle = "rgba(80, 100, 130, 0.35)";

        ctx.fillRect(x, y, 1, 1);
    }
}

function addDistortion(ctx, width, height) {

    for (let i = 0; i < 5; i++) {

        ctx.beginPath();

        ctx.strokeStyle = "rgba(90, 120, 160, 0.45)";
        ctx.lineWidth = 1;

        ctx.moveTo(
            secureRandomInt(0, width),
            secureRandomInt(0, height)
        );

        ctx.bezierCurveTo(
            secureRandomInt(0, width),
            secureRandomInt(0, height),
            secureRandomInt(0, width),
            secureRandomInt(0, height),
            secureRandomInt(0, width),
            secureRandomInt(0, height)
        );

        ctx.stroke();
    }
}
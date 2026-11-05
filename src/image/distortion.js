export function applyWaveDistortion(ctx, width, height) {

    ctx.save();

    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;

    for (let y = 10; y < height; y += 15) {

        ctx.beginPath();

        for (let x = 0; x <= width; x += 5) {

            const wave = Math.sin(x * 0.04) * 3;

            if (x === 0) {
                ctx.moveTo(x, y + wave);
            } else {
                ctx.lineTo(x, y + wave);
            }
        }

        ctx.stroke();
    }

    ctx.restore();
}
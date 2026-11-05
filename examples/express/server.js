
import express from "express";

import {
    createCaptcha,
    createCaptchaRouter
} from "../../src/index.js";

const app = express();

// JSON middleware
app.use(express.json({ limit: "10kb" }));

// CORS middleware (only needed for direct cross-origin requests)
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "http://localhost:5173"
    );

    res.setHeader(
        "Access-Control-Allow-Credentials",
        "true"
    );

    res.setHeader(
        "Access-Control-Expose-Headers",
        "X-Captcha-Id"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// Create CAPTCHA instance
const captcha = createCaptcha({
    length: 6,
    width: 220,
    height: 70,
    expiresIn: 180,
    maxAttempts: 5,
    noise: true,
    distortion: true
});

// CAPTCHA routes
app.use(
    "/api/captcha",
    createCaptchaRouter(captcha)
);

// Start server
app.listen(5000, () => {
    console.log(
        "CAPTCHA server running at http://localhost:5000"
    );
});

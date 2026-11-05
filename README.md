# SecureCaptcha

A reusable, lightweight numeric image CAPTCHA library for Node.js and Express applications with an optional browser widget.

![CAPTCHA Preview](./captcha-preview.png)

## Features

- **Numeric image CAPTCHA**: High contrast numbers rendered using `@napi-rs/canvas`.
- **Distortion & Noise**: Configurable wave distortion and background noise dots.
- **Timing Safe**: Constant-time comparison to prevent timing attacks.
- **Express Integration**: Ready-to-use Express router and verification middleware.
- **Rate & Expiry Controls**: Configurable challenge expiration and attempt limits.
- **Browser Widget**: Built-in client script and stylesheet for frontend integration.

## Installation

```bash
npm install @manvith-003/secure-captcha
```

## Quick Start

### 1. Server-Side (Express)

```javascript
import express from "express";
import {
  createCaptcha,
  createCaptchaRouter,
  createCaptchaMiddleware
} from "@manvith-003/secure-captcha";

const app = express();
app.use(express.json());

// Initialize CAPTCHA instance
const captcha = createCaptcha({
  length: 6,
  width: 220,
  height: 70,
  expiresIn: 180, // seconds
  maxAttempts: 5,
  noise: true,
  distortion: true
});

// Mount CAPTCHA API endpoints (/generate, /verify, /health)
app.use("/api/captcha", createCaptchaRouter(captcha));

// Protect sensitive endpoints with CAPTCHA middleware
const requireCaptcha = createCaptchaMiddleware(captcha);

app.post("/api/login", requireCaptcha, (req, res) => {
  res.json({ success: true, message: "Logged in successfully" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
```

### 2. Client-Side (Browser)

```html
<div id="captcha"></div>

<script type="module">
  import { SecureCaptcha } from "@manvith-003/secure-captcha/client";
  import "@manvith-003/secure-captcha/client/css";

  const captcha = new SecureCaptcha({
    container: "#captcha",
    apiUrl: "http://localhost:5000/api/captcha",
    length: 6,
    theme: "light"
  });

  captcha.render();
</script>
```

## License

MIT

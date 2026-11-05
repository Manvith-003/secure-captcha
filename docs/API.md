# API Reference

## Server API

### `createCaptcha(options)`
Creates a CAPTCHA manager instance with storage and generator.

#### Options:
- `length` *(number, default: 6)*: Number of digits (between 4 and 8).
- `width` *(number, default: 200)*: Canvas width in pixels (100 to 500).
- `height` *(number, default: 65)*: Canvas height in pixels (40 to 200).
- `fontSize` *(number, default: 34)*: Font size in pixels.
- `expiresIn` *(number, default: 180)*: Challenge validity in seconds (30 to 600).
- `maxAttempts` *(number, default: 5)*: Maximum failed attempts allowed (1 to 10).
- `noise` *(boolean, default: true)*: Whether to draw noise points.
- `distortion` *(boolean, default: true)*: Whether to apply sinusoidal wave distortion.

### `createCaptchaRouter(captcha)`
Returns an Express Router with:
- `GET /generate`: Generates challenge and sends PNG image buffer with `X-Captcha-Id` header.
- `POST /verify`: Accepts `{ captchaId, answer }` in JSON body and returns validation result.
- `GET /health`: Health check endpoint.

### `createCaptchaMiddleware(captcha, [options])`
Express middleware protecting endpoints. Checks:
- `x-captcha-id` & `x-captcha-answer` headers, OR
- `req.body.captchaId` & `req.body.captchaAnswer` / `req.body.answer`.

---

## Client API

### `new SecureCaptcha(options)`
- `container` *(string | HTMLElement)*: Target container selector (e.g. `"#captcha"`).
- `apiUrl` *(string)*: Base URL of the CAPTCHA server (e.g. `"http://localhost:5000/api/captcha"`).
- `length` *(number, default: 6)*: Number of digits expected.
- `theme` *(string, default: "light")*: Theme (`"light"` or `"dark"`).

#### Methods:
- `render()`: Renders widget UI into the container and loads first challenge.
- `refresh()`: Requests a new challenge.
- `verify()`: Manually triggers verification.
- `destroy()`: Cleans up blob URLs and removes DOM elements.


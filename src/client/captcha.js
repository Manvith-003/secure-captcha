
import { CaptchaAPI } from "./api.js";
import "./captcha.css";

export class SecureCaptcha {
    constructor(options = {}) {
        this.options = {
            container: "#captcha",
            apiUrl: "http://localhost:5000/api/captcha",
            length: 6,
            theme: "light",
            ...options
        };

        this.container = typeof this.options.container === "string"
            ? document.querySelector(this.options.container)
            : this.options.container;

        if (!this.container) {
            throw new Error("CAPTCHA container not found");
        }

        this.api = new CaptchaAPI(this.options.apiUrl);

        this.captchaId = null;
        this.imageUrl = null;
        this.loading = false;
        this.verified = false;
    }

    render() {
        this.container.innerHTML = `
            <div class="secure-captcha ${this.options.theme}">
                <div class="captcha-title">
                    <span>Security Verification</span>
                    <span class="captcha-subtitle">
                        Enter the numbers shown below
                    </span>
                </div>

                <div class="captcha-image-row">
                    <img
                        class="captcha-image"
                        alt="Numeric CAPTCHA challenge"
                    >

                    <button
                        type="button"
                        class="captcha-refresh"
                        aria-label="Refresh CAPTCHA"
                        title="Refresh CAPTCHA"
                    >
                        ↻
                    </button>
                </div>

                <input
                    class="captcha-input"
                    type="text"
                    inputmode="numeric"
                    autocomplete="off"
                    maxlength="${this.options.length}"
                    placeholder="Enter CAPTCHA"
                    aria-label="Enter CAPTCHA numbers"
                >

                <button
                    type="button"
                    class="captcha-verify"
                >
                    Verify
                </button>

                <p class="captcha-message" aria-live="polite"></p>
            </div>
        `;

        this.image = this.container.querySelector(".captcha-image");
        this.input = this.container.querySelector(".captcha-input");
        this.message = this.container.querySelector(".captcha-message");

        this.refreshButton = this.container.querySelector(
            ".captcha-refresh"
        );

        this.verifyButton = this.container.querySelector(
            ".captcha-verify"
        );

        this.refreshButton.addEventListener(
            "click",
            () => this.refresh()
        );

        this.verifyButton.addEventListener(
            "click",
            () => this.verify()
        );

        this.input.addEventListener("input", () => {
            this.input.value = this.input.value
                .replace(/\D/g, "")
                .slice(0, this.options.length);
        });

        this.refresh();

        return this;
    }

    async refresh() {
        if (this.loading) return;

        this.loading = true;
        this.verified = false;

        this.input.value = "";
        this.message.textContent = "Loading CAPTCHA...";
        this.message.className = "captcha-message";

        this.refreshButton.disabled = true;
        this.verifyButton.disabled = true;

        try {
            const result = await this.api.generate();

            this.captchaId = result.captchaId;

            if (this.imageUrl) {
                URL.revokeObjectURL(this.imageUrl);
            }

            this.imageUrl = result.imageUrl;
            this.image.src = result.imageUrl;

            this.message.textContent = "Enter the numbers above.";
        } catch (error) {
            this.message.textContent = error.message;
            this.message.classList.add("error");
        } finally {
            this.loading = false;
            this.refreshButton.disabled = false;
            this.verifyButton.disabled = false;
        }
    }

    async verify() {
        if (this.loading || this.verified) return false;

        const answer = this.input.value.trim();

        if (!new RegExp(`^\\d{${this.options.length}}$`).test(answer)) {
            this.message.textContent =
                `Please enter all ${this.options.length} digits.`;

            this.message.className = "captcha-message error";

            return false;
        }

        if (!this.captchaId) {
            this.message.textContent = "Please refresh CAPTCHA.";
            return false;
        }

        this.loading = true;
        this.verifyButton.disabled = true;

        try {
            const result = await this.api.verify(
                this.captchaId,
                answer
            );

            if (result.success) {
                this.verified = true;

                this.message.textContent = "CAPTCHA verified successfully!";
                this.message.className = "captcha-message success";

                this.input.disabled = true;

                this.refreshButton.disabled = true;

                return true;
            }

            this.message.textContent = result.message;
            this.message.className = "captcha-message error";

            if (
                result.message === "CAPTCHA expired" ||
                result.message === "Maximum attempts exceeded"
            ) {
                await this.refresh();
            }

            return false;

        } catch (error) {
            this.message.textContent = "Unable to verify CAPTCHA.";
            this.message.className = "captcha-message error";

            return false;
        } finally {
            this.loading = false;
            this.verifyButton.disabled = false;
        }
    }

    destroy() {
        if (this.imageUrl) {
            URL.revokeObjectURL(this.imageUrl);
        }

        this.container.innerHTML = "";
    }
}

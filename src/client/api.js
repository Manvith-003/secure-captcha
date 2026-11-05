
export class CaptchaAPI {
    constructor(apiUrl) {
        this.apiUrl = apiUrl.replace(/\/$/, "");
    }

    async generate() {
        const response = await fetch(
            `${this.apiUrl}/generate`,
            {
                method: "GET",
                credentials: "include",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to generate CAPTCHA");
        }

        const captchaId = response.headers.get("X-Captcha-Id");

        if (!captchaId) {
            throw new Error("CAPTCHA ID missing from server response");
        }

        const imageBlob = await response.blob();

        return {
            captchaId,
            imageUrl: URL.createObjectURL(imageBlob)
        };
    }

    async verify(captchaId, answer) {
        const response = await fetch(
            `${this.apiUrl}/verify`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    captchaId,
                    answer
                })
            }
        );

        const result = await response.json();

        return {
            ...result,
            status: response.status
        };
    }
}

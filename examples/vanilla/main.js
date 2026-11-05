
import { SecureCaptcha } from "../../src/client/captcha.js";

const captcha = new SecureCaptcha({
    container: "#captcha",
    apiUrl: "http://localhost:5000/api/captcha",
    length: 6,
    theme: "light"
});

captcha.render();

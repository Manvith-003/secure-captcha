
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        emptyOutDir: true,
        target: "node20",

        lib: {
            entry: "src/index.js",
            formats: ["es", "cjs"],

            fileName: (format) => {
                return format === "es"
                    ? "index.js"
                    : "index.cjs";
            }
        },

        rollupOptions: {
            external: [
                "express",
                "@napi-rs/canvas",
                "node:crypto"
            ]
        }
    }
});

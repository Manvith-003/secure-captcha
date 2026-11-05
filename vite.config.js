import { defineConfig } from "vite";

export default defineConfig({
    build: {
        emptyOutDir: true,
        target: "node20",

        lib: {
            entry: {
                index: "src/index.js",
                client: "src/client/index.js"
            },
            formats: ["es", "cjs"],

            fileName: (format, entryName) => {
                const ext = format === "es" ? ".js" : ".cjs";
                return `${entryName}${ext}`;
            }
        },

        rollupOptions: {
            external: [
                "express",
                "@napi-rs/canvas",
                "node:crypto"
            ],
            output: {
                exports: "named",
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                        return "client.css";
                    }
                    return "[name].[ext]";
                }
            }
        }
    }
});

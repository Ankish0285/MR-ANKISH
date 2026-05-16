import { exec } from "node:child_process";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** Open only http://localhost — Chrome on Windows, default browser elsewhere */
function openLocalChrome() {
  return {
    name: "open-local-chrome",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const addr = server.httpServer?.address();
        const port = typeof addr === "object" && addr ? addr.port : 5173;
        const url = `http://localhost:${port}/`;
        if (process.platform === "win32") {
          exec(`start chrome "${url}"`, { windowsHide: true });
        } else if (process.platform === "darwin") {
          exec(`open -a "Google Chrome" "${url}"`, () => {});
        } else {
          exec(`xdg-open "${url}"`, () => {});
        }
      });
    },
  };
}

const apiProxy = {
  "/api": {
    target: "http://127.0.0.1:5000",
    changeOrigin: true,
    configure(proxy) {
      proxy.on("error", (_err, _req, res) => {
        if (res && !res.headersSent && typeof res.writeHead === "function") {
          res.writeHead(503, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error:
                "Flask API is not running on port 5000. From FRONTEND run: npm run dev (starts API + site). Frontend-only: npm run dev:vite — then in another terminal: cd BACKEND && python app.py",
            })
          );
        }
      });
    },
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), openLocalChrome()],
  /* Bind to this machine only — not 0.0.0.0 / LAN */
  server: {
    host: "localhost",
    port: 5173,
    strictPort: false,
    open: false,
    proxy: apiProxy,
  },
  preview: {
    host: "localhost",
    port: 4173,
    strictPort: false,
    proxy: apiProxy,
  },
});

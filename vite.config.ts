import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // allows external access
    port: 8080,
    hmr: {
      overlay: false,
      protocol: "wss",
      host: " https://16d4-196-96-68-63.ngrok-free.app",
      port: 8080,
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app', // allow ngrok domains
    ],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

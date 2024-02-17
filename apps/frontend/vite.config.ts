import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["shared-code"],
  },
  build: {
    commonjsOptions: {
      include: [/shared-code/, /node_modules/],
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifestFilename: "manifest.json",
      manifest: {
        name: "Brush",
        short_name: "Brush",
        start_url: ".",
        display: "fullscreen",
        background_color: "#228c22",
        theme_color: "#228c22",
        orientation: "portrait",
        icons: [
          {
            src: "/resources/icons/android-icon-36x36.png",
            sizes: "36x36",
            type: "image/png",
          },
          {
            src: "/resources/icons/android-icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/resources/icons/android-icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/resources/icons/android-icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/resources/icons/android-icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/resources/icons/android-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: process.env.SW_DEV === "true",
        /* when using generateSW the PWA plugin will switch to classic */
        type: "module",
        navigateFallback: "index.html",
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});

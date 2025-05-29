import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    VitePWA({
      includeAssets: [
        "favicon.svg",
        "192x192.png",
        "512x512.png",
        "og-image.png",
        "checker.html",
        "top.html",
      ],
      manifest: {
        name: "Latte Lovers",
        short_name: "LatteLovers",
        description:
          "Find the perfect coffee for your milk drinks. Check compatibility of different coffee origins, processing methods, and roast levels for lattes.",
        background_color: "#ffffff",
        theme_color: "#2196F3",
        orientation: "portrait-primary",
        icons: [
          {
            src: "192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            handler: 'NetworkFirst',
            urlPattern: /.*/,
          }
        ]
      },
      injectRegister: null
    }),
  ],
});

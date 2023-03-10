import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["axios"],
    exclude: ["electron"],
  },
  build: {
    target: "modules",
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser", // 混淆器
  },
  // server: {
  //     cors: true,
  //     open: true,
  //     proxy: {
  //       '/api': {
  //           target: 'http://192.168.99.223:3000',   //代理接口
  //           changeOrigin: true,
  //           rewrite: (path) => path.replace(/^\/api/, '')
  //       }
  //     }
  // }
});

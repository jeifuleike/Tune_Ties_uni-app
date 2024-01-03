import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/uni_music/',
  plugins: [uni()],
    // other config options
    build: {
      rollupOptions: {
        external: ['plugin-vue:export-helper'],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/style/index.scss";`,//引入全局样式
        },

      },
    }
})


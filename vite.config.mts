import { defineConfig } from "vite";
import uniModule from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

const uni = (uniModule as any).default || uniModule;

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    uni(),
    AutoImport({
      imports: ["vue", "uni-app"],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      dirs: ["src/components"],
      dts: "src/components.d.ts",
    }),
  ],
});

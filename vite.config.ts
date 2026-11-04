import { defineConfig } from "vite";

export default defineConfig({
  base: "/projects/memory/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        settings: "settings.html",
        game: "game.html",
      },
    },
  },
});

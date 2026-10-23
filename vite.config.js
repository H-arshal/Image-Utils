import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { minify } from 'html-minifier-terser'

function minifyHtmlPlugin() {
  return {
    name: 'vite-plugin-minify-html',
    apply: 'build',
    async transformIndexHtml(html) {
      return await minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), minifyHtmlPlugin()],
})


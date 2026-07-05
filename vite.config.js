import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serves api/mcb-stats.js during `vite dev` / `vite preview` the same way
// Vercel does in production, so the live-stats section works locally.
// (Vercel ignores this and runs the function natively.)
function mcbStatsLocalApi() {
  const attach = (server) => {
    server.middlewares.use('/api/mcb-stats', async (req, res) => {
      const { default: handler } = await import(
        new URL('./api/mcb-stats.js', import.meta.url).href
      )
      res.status = (code) => {
        res.statusCode = code
        return res
      }
      res.json = (body) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(body))
        return res
      }
      await handler(req, res)
    })
  }
  return {
    name: 'mcb-stats-local-api',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

export default defineConfig({
  plugins: [react(), mcbStatsLocalApi()],
})

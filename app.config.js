const ssrHost =
  (process.env.USING_DOCKER ? '0.0.0.0' : process.env.SERVER_RENDER_HOST) ||
  '0.0.0.0'
const ssrPort = process.env.SERVER_RENDER_PORT || 9009

const isDev = process.env.NODE_ENV === 'development'
let staticUrl = `http://${ssrHost}:${ssrPort}`

module.exports = {
  ssrHost,
  ssrPort,
  isDev,
  staticUrl,
}

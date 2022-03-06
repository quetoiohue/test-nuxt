const isDev = process.env.NODE_ENV === 'development'
const APP_TITLE = process.env.APP_TITLE || 'test-nuxt'

module.exports = {
  isDev,
  APP_TITLE,
}

/* eslint-disable nuxt/no-cjs-in-config */
require('dotenv').config({
  path: require('find-config')('config.env'),
})
const appConfig = require('./app.config')
const { version: packageVersion } = require('./package.json')

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'test-nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  styleResources: {
    scss: [
      '~assets/styles/_variables.scss',
      '~assets/styles/_mixins.scss',
      '~assets/styles/_functions.scss',
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/styles/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/element-ui'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['element-ui'],

    babel: {
      cacheDirectory: true,
      compact: true,
      presets({ envName }) {
        const envTargets = {
          client: { browsers: ['last 2 versions'], ie: 11 },
          server: { node: 'current' },
        }

        return [
          [
            '@nuxt/babel-preset-app',
            {
              targets: envTargets[envName],
              corejs: { version: 3 },
              polyfills: [
                'es.array.iterator',
                'es.promise',
                'es.object.assign',
                'es.promise.finally',
                'es.weak-map',
              ],
              useBuiltIns: 'usage',
            },
          ],
        ]
      },
    },

    terser: {
      parallel: false,
      cache: true,
    },

    hotMiddleware: {
      client: {
        path: `${appConfig.staticUrl}/__webpack_hmr/client`,
      },
    },

    publicPath: appConfig.staticUrl,

    loaders: {
      cssModules: {
        modules: {
          localIdentName: appConfig.isDev
            ? '[local]_[hash:base64:5]'
            : '[hash:base64:8]',
        },
      },
    },

    extend(config, { isDev, isClient, loaders }) {
      if (isDev) {
        config.devtool = isClient ? 'source-map' : 'inline-source-map'
      }

      loaders.scss.additionalData = `
        @use "sass:math";
      `
    },

    optimization: {
      splitChunks: process.server
        ? false
        : {
            cacheGroups: {
              vendor: {
                test(module) {
                  const excludes = [
                    /element-ui/,
                    // /moment[\\/]locale/,
                  ]

                  return (
                    /node_modules/.test(module.context) &&
                    !excludes.some((e) => e.test(module.context))
                  )
                },
                name: 'commons/app',
                chunks: 'initial',
                reuseExistingChunk: true,
                enforce: true,
                priority: -10,
              },
              element: {
                name: 'vendors/element',
                test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                chunks: 'all',
                reuseExistingChunk: true,
                enforce: true,
                priority: 0,
              },
            },
          },
    },

    extractCSS: appConfig.isDev
      ? false
      : {
          ignoreOrder: true,
        },
  },
}

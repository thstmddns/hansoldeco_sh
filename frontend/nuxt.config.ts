// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/device', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  vite: {
    define: {
      'process.env': {
        // 'Bearer ec38318a5e4a4e780b775e7d518cabd26fadfcd80204e12da811b1f63a5f6c0df3bdc10f66f12672e279446c78202d50bff7fa2e59b01283c73746e075672ab98b70faac401d2d1647e96d680192064d9813862a8c8b93f92c6f99c6ac0f9b77f0a5f703e5c99b8a0706294ee3400e5235e2e8a30a7f1c343cef2dc05ecbb03b'
        MASTER_TOKEN: process.env.MASTER_TOKEN || 'Bearer 0ccd5834709ab37dbc31fd29e9df99de865d8264dcb549de176b940b22cbd31fad2a99154c1f802dd967285a9b237b150fbea192dcfb7a44a19e6089735144d793e1cd918500e5509f3e2b57991e171f11c874448b80495f9d9b2979c03ae28e3bd84ac2ac25eb4304421ae96b6dd075cdb20a2caff6a9de5ede8cbfe65f3f9a',
        SERVER_URL: process.env.SERVER_URL || 'https://sosohajaai.com',
        SERVERLESS_URL: process.env.SERVERLESS_URL || 'https://og7i092nu9.execute-api.ap-northeast-2.amazonaws.com/prod/upload',
        AI_SERVER_URL: process.env.AI_SERVER_URL || 'https://sosohajaai.com',
      },
    }
  },
  // runtimeConfig: {
  //   public: {
  //     secret: 'secret_value'
  //   }
  // },
  app: {
    head: {
      title: 'Sosohaja',
      titleTemplate: '%s | Sosohaja',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      script: [
        { src: 'https://unpkg.com/@zxing/library@latest' },
        { src: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest'}
      ]
    },
    viewTransition: true
  },
  // strapi: {
  //   url: process.env.STRAPI_URL || 'http://localhost:1337',
  //   prefix: '/api',
  //   admin: '/admin',
  //   version: 'v4',
  //   cookie: {},
  //   cookieName: 'strapi_jwt'
  // },
})

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  css: ['@/assets/styles/base.css'],
  modules: [
    '@nuxt/eslint',
    'nuxt-security',
    'nuxt-lodash',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  imports: {
    dirs: [
      'composables',
      'composables/*/*',
    ],
  },
  runtimeConfig: {
    public: {
      dummy: process.env.NUXT_PUBLIC_DUMMY_VAL,
    },
  },
  /*
  security: {
    headers: {
      xFrameOptions: 'DENY',
    },
  },
  */
})

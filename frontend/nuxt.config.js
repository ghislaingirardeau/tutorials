import colors from 'vuetify/es5/util/colors'
import i18n from './config/i18n'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'tutos',
    htmlAttrs: {
      lang: 'en, fr'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script: [
      { src: "https://js.stripe.com/v3/" },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/firebase'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: "AIzaSyCAdzvIYwTXrf139FyQScXbBKrR5t4fkcY",
          authDomain: "my-database-project-1f237.firebaseapp.com",
          projectId: "my-database-project-1f237",
          storageBucket: "my-database-project-1f237.appspot.com",
          messagingSenderId: "86336628395",
          databaseURL: "https://my-database-project-1f237-default-rtdb.europe-west1.firebasedatabase.app/",
          appId: "1:86336628395:web:eea9b92f1eea075dcbb9ee"
        },
        services: {
          auth: true,
          firestore: true,
          database: true
        },
        auth: {
          persistence: 'local', // keep auth on reload & close browser
        }
      }
    ]
  ],

/*   i18n: {
  seo: false,
  locales: [
    { code: 'en', iso: 'en-US', file: 'en.js' },
    { code: 'fr', iso: 'fr-FR', file: 'fr.js' },
  ],
  baseUrl: '',
  defaultLocale: 'en',
  vueI18n: i18n
  },
 */
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}

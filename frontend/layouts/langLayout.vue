<template>
  <v-app >
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in $t('navBar')"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt-child :browserLanguage="browserLanguage" keep-alive />
      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      langs: [
          "fr",
          "en",
          "kh",
          "thai",
          "indo"
      ],
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'StripeAPI',
          to: '/stripeAPI'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'StripeJS',
          to: '/stripeJS'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'fetch nuxt',
          to: '/fetch'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      browserLanguage: 'en'
    }
  },
  methods: {

  },
  created () {
    this.browserLanguage = navigator.language.slice(0, 2)
    this.$i18n.setLocale(this.browserLanguage)
  },
  mounted() {
  },
}
</script>

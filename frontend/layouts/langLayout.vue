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

      <v-spacer></v-spacer>

      <v-toolbar-title>{{$t('layout.webTitle')}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="routeCart"><v-icon>mdi-cart</v-icon></v-btn>

      <v-btn @click="switchLanguage('fr')">fr</v-btn>
      <v-btn @click="switchLanguage('en')">en</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt-child :browserLanguage="browserLanguage" :serverDatas="serverDatas" keep-alive />
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
      miniVariant: false,
      browserLanguage: 'en',
      serverDatas: undefined,
    }
  },
  methods: {
    routeCart() {
      this.$router.push(`/_${this.browserLanguage}/carts`)
    },
    async switchLanguage(lang) {
      this.browserLanguage = lang
      this.$i18n.locale = lang

      const body = {
        lang: lang
      }
      await this.$axios.$post('http://localhost:8000/api/i18n', JSON.stringify(body), {
          headers: {
          "content-type": "application/json",
          },
      })
      .then(response => {
          this.serverDatas = response
      })  
    }
  },
  created () {
    this.browserLanguage = navigator.language.slice(0, 2)
    this.$i18n.locale = this.browserLanguage
  },
  async mounted() {
    const body = {
      lang: this.browserLanguage
    }
    await this.$axios.$post('http://localhost:8000/api/i18n', JSON.stringify(body), {
        headers: {
        "content-type": "application/json",
        },
    })
    .then(response => {
        this.serverDatas = response
    })  
  },
}
</script>

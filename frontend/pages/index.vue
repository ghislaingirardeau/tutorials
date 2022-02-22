<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="6" class="text-center">
      <h1>
          {{$t('index.h1')}}
      </h1>
    </v-col>
    <v-col cols="6" md="3">
      <v-text-field
        :name="$t('index.search')"
        :label="$t('index.search')"
        append-icon="mdi-map-marker"
      ></v-text-field>
    </v-col>
    <v-col cols="6" md="3">
      <v-select
        v-model="category"
        :items="categoryItems"
        append-icon="mdi-map"
        menu-props="auto"
        :label="$t('index.category')"
        single-line
        @change="selectionByCategory"
      ></v-select>
    </v-col>  

    <v-row v-if="serverDatas" class="pa-3">
      <v-col cols="12" sm="4" v-for="item in serverDatas" :key="item.id">
          <v-card
            class="mx-auto"
            max-width="344"
            elevation="4"
          >
            <v-img
              height="200"
              src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
            ></v-img>
            <v-card-title primary-title>
              {{item.name}}
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                elevation="2"
              >{{item.price}} {{$t('index.currency')}}
              </v-btn>
            </v-card-title>
            <v-card-subtitle>
              {{item.category}}
            </v-card-subtitle>
            <v-card-text>
              <p class="text--primary">
                {{item.description}}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="teal accent-4"
                @click="showOrigin(item.id)"
              >
                {{$t('index.cardMore')}}
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="teal accent-4"
              >
                {{$t('index.cardCart')}}
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <v-card
                v-if="revealCard === ('origin' + item.id)"
                class="transition-fast-in-fast-out v-card--reveal"
                style="height: 100%;"
              >
                <v-card-text class="pb-0">
                  <p class="text-h4 text--primary">
                    {{$t('index.cardTitle')}}
                  </p>
                  <p>
                    {{item.community}}
                  </p>
                </v-card-text>
                <v-card-actions class="pt-0">
                  <v-btn
                    text
                    color="teal accent-4"
                    @click="revealCard = false"
                  >
                    {{$t('index.cardClose')}}
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="teal accent-4"
                  >
                    village link {{item.communityId}}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-expand-transition>
          </v-card>
        </v-col>
    </v-row>

    <!-- <v-col cols="12" >
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="image, article"
          elevation='6'
        ></v-skeleton-loader>    
    </v-col> -->
    <v-overlay v-else :value="overlay" :absolute="true" >
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>    
  </v-row>
</template>

<script>
export default {
  layout: "langLayout",
  data() {
    return {
      overlay: true,
      category: undefined,
      revealCard: false,
      categoryItems: [
        "accessory",
        "encense"
      ]
    }
  },
  props: {
    browserLanguage: {
      type: String,
    },
    serverDatas: {
      type: Array,
    },
  },
  watch: {
    serverDatas() {
    }
  },
  methods: {
    showOrigin(id) {
      this.revealCard = 'origin' + id
    },
    selectionByCategory() {
      console.log(this.category)
    }
  },
}
</script>

<style lang="scss">
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
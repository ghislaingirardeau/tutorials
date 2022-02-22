<template>
    <v-row class="pa-3">
      <v-col cols="12" sm="4" v-for="item in listProducts" :key="item.id">
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
              >{{price(item.price)}} {{$t('index.currency')}}
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
</template>

<script>
    export default {
        data() {
            return {
                revealCard: false,
            }
        },
        props: {
            listProducts: Array
        },
        computed: {
        },
        methods: {
            showOrigin(id) {
            this.revealCard = 'origin' + id
            },
            price(el) {
                let length = el.length - 2
                let centimes = el.slice(length)
                let amount = el.slice(0, length)
                return amount.concat(",", centimes)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
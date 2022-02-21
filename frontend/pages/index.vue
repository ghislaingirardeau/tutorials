<template>
  <v-row justify="center" align="center">
    <v-col cols="6">
      <h1>
          {{$t('index.h1')}} {{browserLanguage}}
      </h1>
    </v-col>
    <v-col cols="3">
      <v-text-field
        :name="$t('Search')"
        :label="$t('Search')"
        append-icon="mdi-map-marker"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-select
        v-model="category"
        :items="categoryItems"
        append-icon="mdi-map"
        menu-props="auto"
        :label="$t('category')"
        single-line
      ></v-select>
    </v-col>

    <v-col cols="12" v-if="serverDatas">
      <h2>
        content : {{serverDatas.message}}
      </h2>
    </v-col>
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
      categoryItems: [
        "bracelet",
        "encense"
      ]
    }
  },
  props: {
    browserLanguage: {
      type: String,
    },
    serverDatas: {
      type: Object,
    },
  },
  watch: {
    serverDatas() {
      console.log('change')
    }
  },
}
</script>

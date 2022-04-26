<template :key="$route.path">
  <div class="page-wrapper" >
    <div class="article-cards-wrapper">
      <template v-if="$fetchState.pending">
        <h1>Loading...</h1>
      </template>
      <template v-else>
        <!-- <article-card-block
          v-for="article in articles"
          :key="article.id"
          :article="article"
          class="article-card-block"
        /> -->
        <h2 :key="revealMixinData">{{revealMixinData}}</h2>
      </template>
    </div>
  </div>
</template>

<script>
import ArticleCardBlock from "@/components/ArticleCardBlock";

export default {
  middleware: 'route-guard',
  components: {
    ArticleCardBlock,
  },
  data() {
    return {
      currentPage: 1,
      articles: [],
    };
  },
  mounted() {
    console.log(this.$fetchState);
  },
  async fetch() {
    const articles = await fetch(
      `https://dev.to/api/articles?tag=nuxt&state=rising&page=${this.currentPage}`
    ).then((res) => res.json());

    this.articles = this.articles.concat(articles);
  },
};
</script>
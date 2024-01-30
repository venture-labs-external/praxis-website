<template>
  <div class="news mx-auto pt-10 pt-md-0" id="news">
    <div class="mt-4 mt-md-0">
      <img
        class="news__image"
        src="news-image/news-image.png"
        srcset="
          /news-image/news-image_w_330.webp   330w,
          /news-image/news-image_w_705.webp   705w,
          /news-image/news-image_w_975.webp   975w,
          /news-image/news-image_w_1156.webp 1156w,
          /news-image/news-image_w_1310.webp 1310w
        "
        loading="lazy"
        alt="Doctor's photo"
      />
    </div>
    <div class="news__content d-flex align-center">
      <div>
        <h4 class="news__title">{{ news.header }}</h4>
        <p class="body-1 ma-0">{{ news.description }}</p>
        <div class="body-1">{{ news.footer }}</div>
        <div class="body-1">{{ news.name }}</div>
        <div class="body-1">{{ news.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'News',
  data() {
    return {
      news: {
        header: this.$t('homepage.newsTitle'),
        description: this.$t('homepage.newsDescription'),
        footer: this.$t('homepage.kindRegards'),
        name: this.$t('homepage.doctors'),
        title: this.$t('homepage.specialistForGynecologyAndObstetrics'),
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.news {
  max-width: 73rem;
  display: flex;
  flex-direction: column-reverse;
  @media #{$md-and-up} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
  &__title {
    font-size: 1.125rem;
  }
  &__image {
    width: 100%;
    height: auto;
  }
  &__content {
    white-space: pre-line;
    &:first-line {
      line-height: 0;
    }
  }
}
</style>

<template>
  <div class="news">
    <div class="mt-4 mt-md-0">
      <img
        class="news__image"
        src="doctors-photo/doctor-photo.png"
        srcset="
          /doctors-photo/doctor-photo_w_330.webp   330w,
          /doctors-photo/doctor-photo_w_678.webp   678w,
          /doctors-photo/doctor-photo_w_921.webp   921w,
          /doctors-photo/doctor-photo_w_1133.webp 1133w,
          /doctors-photo/doctor-photo_w_1310.webp 1310w
        "
        alt="Doctor's photo"
      />
    </div>
    <div class="news__content d-flex align-center">
      <div>
        <h4 class="h4-text">{{ news.header }}</h4>
        <p class="body-1 ma-0">{{ news.description }}</p>
        <div class="body-1">{{ news.footer }}</div>
        <div class="text-h4">{{ news.name }}</div>
        <div class="body-1">{{ news.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'News',
  props: {
    news: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.news {
  display: flex;
  flex-direction: column-reverse;
  @media #{$md-and-up} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
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

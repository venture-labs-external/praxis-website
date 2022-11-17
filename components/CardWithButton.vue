<template>
  <div class="card white pt-6">
    <div class="card__title d-flex mx-6 pb-4">
      <img :src="cardInfo.icon" alt="right arrow" class="mr-4" />
      <h3 class="text-h3">{{ cardInfo.title }}:</h3>
    </div>
    <div class="card__content mx-6 my-4"><slot /></div>
    <div class="card__button white--text dark-green pa-5">
      <a
        :href="cardInfo.link"
        target="_blank"
        class="button text-decoration-none white--text"
      >
        <div class="button text-h5">
          <img src="/arrow-right.svg" alt="right arrow" class="mr-4" />
          {{ $t('homepage.bookAppointment') }}
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardWithButton',
  props: {
    cardInfo: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 6px;
  &__title {
    border-bottom: 1px solid var(--v-dark-gray-base);
  }
  &__button {
    border-radius: 0 0 6px 6px;
  }
}
.button {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="card white pt-6">
    <div class="card__title d-flex mx-6 pb-4">
      <img :src="cardInfo.icon" alt="right arrow" class="mr-4" />
      <h3 class="text-h3">{{ cardInfo.title }}:</h3>
    </div>
    <div class="card__content mx-6 my-4"><slot /></div>
    <div v-if="optionalCardInfo" class="mt-7">
      <div class="card__title d-flex mx-6 pb-4">
        <img :src="optionalCardInfo.icon" alt="right arrow" class="mr-4" />
        <h3 class="text-h3">{{ optionalCardInfo.title }}:</h3>
      </div>
      <div class="card__content mx-6 my-4"><slot name="optionalBox" /></div>
    </div>
    <div class="card__button white--text dark-green pa-5">
      <a
        class="button text-decoration-none white--text"
        href="https://www.doctolib.de/praxisgemeinschaft/duesseldorf/frauenaerztinnen-gerresheim?utm_campaign=website-button&amp;utm_source=frauenaerztinnen-gerresheim-website-button&amp;utm_medium=referral&amp;utm_content=option-8&amp;utm_term=frauenaerztinnen-gerresheim"
        rel="noopener noreferrer"
        target="_blank"
      >
        <div class="button text-h5">
          <img src="/arrow-right-white.svg" alt="right arrow" class="mr-4" />
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
    optionalCardInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: false,
    };
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
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>

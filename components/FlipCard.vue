<template>
  <v-card class="flip-card mx-auto" max-width="344">
    <div class="flip-card__content d-flex justify-center align-center">
      <div>
        <div class="flip-card__icon mint-blue mx-auto">
          <img :src="cardInfo.iconName" class="pa-5" />
        </div>
        <h5 class="text-h5 text-center mt-6 mx-10">{{ cardInfo.title }}</h5>
        <v-card-actions>
          <v-btn icon @click="show = true" class="mx-auto">
            <img src="/arrow-right.svg" />
          </v-btn>
        </v-card-actions>
      </div>
    </div>
    <!-- flip card reverse  -->
    <div v-show="show" class="flip-card__reverse">
      <v-card-actions class="d-flex flex-row-reverse">
        <v-btn icon @click="show = false" v-show="show">
          <img src="/cross.svg" />
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <h5 class="text-h5 mb-4">{{ cardInfo.title }}</h5>
        <p>
          {{ cardInfo.description }}
        </p>
      </v-card-text>
      <div class="flip-card__button pa-5">
        <a
          :href="cardInfo.link"
          target="_blank"
          class="button text-decoration-none"
        >
          <div class="button text-h5">
            <img src="/arrow-right.svg" alt="right arrow" class="mr-4" />
            {{ $t('homepage.bookAppointment') }}
          </div>
        </a>
      </div>
    </div>
  </v-card>
</template>
<script>
export default {
  name: 'FlipCard',
  props: {
    cardInfo: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    show: false,
  }),
};
</script>

<style lang="scss" scoped>
.flip-card {
  &__content {
    padding: 5.6rem 0;
  }
  &__icon {
    height: 4rem;
    width: 4rem;
  }
  &__button {
    border-top: 4px solid var(--v-mint-blue-base);
  }
}
</style>

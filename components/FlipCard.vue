<template>
  <div
    class="flip-card mx-auto mr-4 mb-md-0"
    :class="show ? 'flip-card--click' : ''"
  >
    <div class="flip-card--inner">
      <div class="flip-card--front" @click="show = !show">
        <div v-show="!show">
          <div class="flip-card__icon mint-blue mx-auto">
            <img :src="cardInfo.iconName" class="pa-5" alt="" />
          </div>
          <h5 class="text-h5 text-center mt-6 mx-10">{{ cardInfo.title }}</h5>
          <div>
            <v-btn icon class="mx-auto">
              <img src="/arrow-right.svg" alt="" />
            </v-btn>
          </div>
        </div>
      </div>
      <div class="flip-card--back">
        <div
          v-show="show"
          class="flip-card__wrapper d-flex flex-column justify-space-between"
          @click="show = !show"
        >
          <div @click="show = !show">
            <div class="d-flex flex-row-reverse" @click="show = !show">
              <v-btn icon>
                <img src="/cross.svg" />
              </v-btn>
            </div>
            <div class="text-left mx-6" @click="show = !show">
              <h5 class="text-h5 mb-4">{{ cardInfo.title }}</h5>
              <p class="subtitle-2">
                {{ cardInfo.description }}
              </p>
            </div>
          </div>
          <div class="flip-card__button d-flex pa-4">
            <a
              class="button text-decoration-none"
              href="https://www.doctolib.de/praxisgemeinschaft/duesseldorf/frauenaerztinnen-gerresheim?utm_campaign=website-button&amp;utm_source=frauenaerztinnen-gerresheim-website-button&amp;utm_medium=referral&amp;utm_content=option-8&amp;utm_term=frauenaerztinnen-gerresheim"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div class="text-h5">
                <img src="/arrow-right.svg" alt="right arrow" class="mr-4" />
                {{ $t('homepage.bookAppointment') }}
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FlipCard',
  props: {
    cardInfo: {
      dialog: false,
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    show: false,
    dialog: false,
  }),
};
</script>

<style lang="scss" scoped>
.flip-card {
  background-color: transparent;
  width: 18.75rem;
  height: 31.25rem;
  perspective: 1000px;
  @media #{$md-and-up} {
    width: 100%;
  }
  &__wrapper {
    width: 18.75rem;
    height: 31.25rem;
  }
  &--inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  &--front,
  &--back {
    background-color: var(--v-white-base);
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  &--front {
    padding: 9.844rem 0;
  }
  &--back {
    transform: rotateY(180deg);
  }
  &--click &--inner {
    transform: rotateY(180deg);
  }
  &__icon {
    height: 4rem;
    width: 4rem;
  }
  &__button {
    border-top: 4px solid var(--v-mint-blue-base);
    height: 3.5rem;
  }
}
</style>

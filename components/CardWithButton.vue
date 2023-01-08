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
    <v-dialog
      v-model="dialog"
      persistent
      max-width="320"
      @click:outside="dialog = false"
    >
      <template v-slot:activator="{ on, attrs }">
        <div
          class="card__button white--text dark-green pa-5"
          v-bind="attrs"
          v-on="on"
        >
          <a class="button text-decoration-none white--text">
            <div class="button text-h5">
              <img
                src="/arrow-right-white.svg"
                alt="right arrow"
                class="mr-4"
              />
              {{ $t('homepage.bookAppointment') }}
            </div>
          </a>
        </div>
      </template>
      <v-card>
        <v-card-title class="text-h5"
          >{{ $t('homepage.unfortunatelyAnOnlineAppointment') }}
        </v-card-title>
        <v-card-text>
          {{ $t('homepage.weAreWorking') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="dark-green darken-1" text @click="dialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  width: 100%;
  height: 100%;
}
</style>

<template>
  <v-card class="expanding-card mx-auto mb-6" max-width="940">
    <div class="pa-8" @click="show = !show">
      <div
        class="d-flex flex-column flex-md-row align-center justify-md-space-between"
      >
        <div class="d-flex flex-column flex-md-row align-center">
          <img
            :src="cardData.photo"
            class="expanding-card__image"
            loading="lazy"
          />
          <div class="text-left ml-md-6">
            <h3 class="text-h2 mt-6 mb-1">{{ cardData.name }}</h3>
            <span class="body-2 dark-green--text">
              {{ cardData.title }}
            </span>
          </div>
        </div>
        <v-card-actions class="pa-0">
          <v-btn icon class="mx-auto">
            <img :src="show ? '/arrow-up.svg' : '/arrow-down.svg'" />
          </v-btn>
        </v-card-actions>
      </div>
      <v-expand-transition>
        <div v-show="show">
          <v-card-text class="body-1 pa-0 pt-8">
            <p>{{ cardData.description }}</p>
            <!-- missing content -->
            <!-- <ol>
              <li
                v-for="(qualification, index) in cardData.qualifications"
                :key="index"
              >
                {{ qualification }}
              </li>
            </ol> -->
          </v-card-text>
        </div>
      </v-expand-transition>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'ExpandingCard',
  props: {
    cardData: {
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
.expanding-card {
  &__image {
    height: 7.375rem;
    width: 7.375rem;
  }
}
</style>

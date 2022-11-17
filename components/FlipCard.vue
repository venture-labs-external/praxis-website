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
    <!-- <v-card-actions>
      <v-btn icon @click="show = true" class="mx-auto">
        <img src="/arrow-right.svg" />
      </v-btn>
      <v-btn icon @click="show = false" class="mx-auto">
        <img src="/cross.svg" />
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          I'm a thing. But, like most politicians, he promised more than he
          could deliver. You won't have time for sleeping, soldier, not with all
          the bed making you'll be doing. Then we'll go with that data file!
          Hey, you add a one and two zeros to that or we walk! You're going t
          do his laundry? I've got to find a way to escape.
        </v-card-text>
      </div>
    </v-expand-transition> -->
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
}
</style>

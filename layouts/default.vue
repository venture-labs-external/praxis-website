<template>
  <v-app class="app d-flex justify-center">
    <Navigation />
    <v-container>
      <nuxt />
    </v-container>
    <Footer />
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  components: {
    Navigation: () => import('~/components/Navigation.vue'),
    Footer: () => import('~/components/Footer.vue'),
  },
};
</script>
<style scoped lang="scss">
.app {
  color: var(--v-dark-gray-base);
  background-color: var(--v-beige-base);
}
</style>

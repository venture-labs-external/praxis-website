<template>
  <v-app class="app d-flex justify-center">
    <Navigation />
    <v-container>
      <NuxtPage />
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
  color: rgb(var(--v-theme-dark-gray));
  background-color: rgb(var(--v-theme-beige));
}
</style>

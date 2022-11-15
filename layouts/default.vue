<template>
  <v-app class="d-flex justify-center">
    <v-container>
      <Navigation />
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  components: {
    Navigation: () => import('~/components/Navigation.vue'),
  },
};
</script>
<style scoped lang="scss"></style>

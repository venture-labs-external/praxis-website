<template>
  <v-app
    dark
    class="app"
  >
    <v-main>
      <v-container
        fluid
        class="px-8 py-6"
      >
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'DefaultLayout',

};
</script>
<style scoped lang="scss">
.app {
  color: var(--v-primary-dark-base);
  background-color: var(--v-primary-base);
}
</style>

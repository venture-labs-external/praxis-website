<template>
  <v-app theme="dark">
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/"> Home page </NuxtLink>
  </v-app>
</template>

<script>
// Kept for completeness only (see this spec's "Risks and open questions"):
// `layout: 'empty'` already pointed at a layout file that doesn't exist in the
// old build either, and this site has exactly one route, so this layout isn't
// user-facing on a normal visit - not part of the parity check.
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style scoped lang="scss">
h1 {
  font-size: $type-error-heading-size;
}
</style>

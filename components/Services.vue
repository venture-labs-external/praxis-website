<template>
  <div class="services mx-auto">
    <div class="about-us__title mb-6">
      <span class="subtitle-1 light-green--text">
        {{ $t('homepage.services') }}
      </span>
      <h2 class="text-h1">
        {{ $t('homepage.whatWeDo') }}
      </h2>
    </div>
    <div></div>
  </div>
</template>

<script>
// import ExpandingCard from '~/components/ExpandingCard';
// import doctors from '~/mixins/aboutUsData.js';
export default {
  name: 'Services',
  // components: {
  //   ExpandingCard,
  // },
  // mixins: [doctors],
};
</script>

<style lang="scss" scoped>
.services {
  padding-top: 5rem;
  max-width: 58.75rem;
}
</style>

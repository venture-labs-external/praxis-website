<template>
  <div class="services mx-auto">
    <div class="about-us__title mb-6">
      <span class="subtitle-1 dark-green--text">
        {{ $t('homepage.services') }}
      </span>
      <h2 class="text-h1">
        {{ $t('homepage.whatWeDo') }}
      </h2>
    </div>
    <div>
      <FlipCard
        v-for="(service, index) in services"
        :key="index"
        :cardInfo="service"
      />
    </div>
  </div>
</template>

<script>
import FlipCard from '~/components/FlipCard';
import services from '~/mixins/servicesData.js';
export default {
  name: 'Services',
  components: {
    FlipCard,
  },
  mixins: [services],
};
</script>

<style lang="scss" scoped>
.services {
  padding-top: 5rem;
  max-width: 58.75rem;
}
</style>

<template>
  <div class="about-us mx-auto">
    <div class="about-us__title mb-6">
      <span class="subtitle-1 dark-green--text">{{
        $t('homepage.aboutUs')
      }}</span>
      <h2 class="text-h1">
        {{ $t('homepage.ourDoctors') }}
      </h2>
    </div>
    <ExpandingCard
      v-for="doctor in doctors"
      :key="doctor.name"
      :cardData="doctor"
    />
  </div>
</template>

<script>
import ExpandingCard from '~/components/ExpandingCard';
import doctors from '~/mixins/aboutUsData.js';
export default {
  name: 'AboutUs',
  components: {
    ExpandingCard,
  },
  mixins: [doctors],
};
</script>

<style lang="scss" scoped>
.about-us {
  padding-top: 5rem;
  max-width: 58.75rem;
}
</style>

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
export default {
  name: 'AboutUs',
  components: {
    ExpandingCard,
  },
  computed: {
    // TODO: add missing content
    doctors() {
      return [
        {
          name: 'Dr. med. Heike Weydandtr',
          photo: 'dr-weydandtr.png',
          title: this.$t('homepage.specialistInGynecologyAndObstetrics'),
          description: this.$t('homepage.afterTheExtensiveTraining'),
          qualifications: ['qualifikation', 'qualifikation'],
        },
        {
          name: 'Dr. med. R. Korbmacher',
          photo: 'dr-korbmacher.png',
          title: this.$t('homepage.specialistInGynecologyAndObstetrics'),
          description: this.$t('homepage.afterTheExtensiveTraining'),
          qualifications: [
            'qualifikation',
            'qualifikation',
            'qualifikation',
            'qualifikation',
            'qualifikation',
            'qualifikation',
          ],
        },
        {
          name: 'Christine Engberg',
          photo: 'dr-engberg.png',
          title: this.$t('homepage.specialistInGynecologyAndObstetrics'),
          description: this.$t('homepage.afterTheExtensiveTraining'),
          qualifications: ['qualifikation', 'qualifikation'],
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.about-us {
  padding-top: 5rem;
  max-width: 58.75rem;
}
</style>

<template>
  <div id="about-us" class="about-us mx-auto">
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
import { NAMES } from '~/constants';
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
          name: NAMES.drHeikeWeydandt,
          photo: 'dr-weydandtr.png',
          title: this.$t('homepage.specialistInGynecologyAndObstetrics'),
          description: this.$t(
            'homepage.duringMyMoreThan20YearsOfCollaboration',
          ),
          qualifications: ['qualifikation', 'qualifikation'],
        },
        {
          name: NAMES.drRahelKorbmacher,
          photo: 'dr-korbmacher.png',
          title: this.$t('homepage.specialistInGynecologyAndObstetrics'),
          description: this.$t(
            'homepage.afterTheExtensiveTrainingInVariousClinics',
          ),
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
          name: NAMES.ChristineEngberg,
          photo: 'dr-engberg.png',
          title: this.$t('homepage.specialistInGynecologyAndObstetrics'),
          description: this.$t(
            'homepage.IAmLookingForwardToSupportingThePracticeTeam',
          ),
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

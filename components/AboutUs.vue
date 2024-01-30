<template>
  <div id="about-us" class="about-us mx-auto">
    <div class="about-us__title mb-6">
      <span class="subtitle-1 dark-green--text">
        {{ $t('homepage.aboutUs') }}
      </span>
      <h2 class="text-h1">
        {{ $t('homepage.ourDoctors') }}
      </h2>
    </div>
    <div class="about-us__cards">
      <div v-for="doctor in doctors" :key="doctor.name">
        <div class="about-us__card box-shadow">
          <div class="about-us__card-image">
            <img :src="doctor.photo" :alt="doctor.name" loading="lazy" />
          </div>
          <div class="about-us__card-title">
            <span class="text-body-2">{{ doctor.name }}</span>
            <p class="text-body-1">{{ doctor.title }}</p>
          </div>
          <div class="about-us__card-description">
            <p class="text-body-1">{{ doctor.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NAMES } from '~/constants';
export default {
  name: 'AboutUs',
  components: {},
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
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.about-us {
  padding-top: 5rem;
  max-width: 58.75rem;
  &__cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }
  &__card {
    display: grid;
    gap: 1.5rem;
    padding: 2rem;
    background-color: var(--v-white-base);
    border-radius: 6px;
    justify-items: center;
    height: 100% !important;
    &-title {
      & span {
        font-family: 'Roboto Serif' !important;
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
      }
      & p {
        color: var(--v-dark-green-base);
        font-family: Roboto;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 1.4;
        margin-bottom: 0 !important;
      }
    }
    &-image {
      width: 100%;
      height: 100%;
      & img {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
  }
}
</style>

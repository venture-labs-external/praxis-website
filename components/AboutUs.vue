<template>
  <div id="about-us" class="about-us mx-auto">
    <div class="about-us__title mb-6">
      <span class="subtitle-1 text-dark-green">
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
  padding-top: $space-xl;
  max-width: 58.75rem;
  &__cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $space-sm;
    width: 100%;
  }
  &__card {
    display: grid;
    grid-template-rows: max-content max-content 1fr;
    gap: $space-sm;
    padding: $space-md;
    background-color: rgb(var(--v-theme-white));
    border-radius: $radius-sm;
    justify-items: center;
    height: 100% !important;
    &-title {
      justify-self: start;
      & span {
        font-family: $type-card-title-family !important;
        font-size: $type-card-title-size !important;
        font-weight: $type-card-title-weight !important;
        line-height: $type-card-title-line-height;
      }
      & p {
        color: rgb(var(--v-theme-dark-green));
        font-family: $type-card-subtitle-family;
        font-size: $type-card-subtitle-size !important;
        font-style: normal;
        font-weight: $type-card-subtitle-weight !important;
        line-height: $type-card-subtitle-line-height;
        margin-bottom: 0 !important;
      }
    }
    &-image {
      width: 100%;
      height: 100%;
      & img {
        border-radius: $radius-sm;
        width: 100%;
        aspect-ratio: 3 / 2;
        object-fit: cover;
        object-position: center;
      }
    }
  }
}
</style>

<template>
  <div id="about-us" class="about-us mx-auto">
    <div class="about-us__title mb-6">
      <span class="text-subtitle-1 text-dark-green">
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
      // `span`/`p` here keep their real `text-body-2`/`text-body-1` classes
      // (Vuetify 2 already generated those as aliases of its unprefixed
      // `body-2`/`body-1` - confirmed in dev's own compiled CSS - so they
      // were never dead; removing them would lose the real letter-spacing/
      // family-fallback Vuetify supplies). `main.scss`'s own `.text-body-2`
      // `@media md-and-up` override now also matches this exact selector
      // (ties in specificity), so `&.text-body-2` is repeated here to win
      // deterministically rather than depend on CSS source order.
      & span.text-body-2 {
        font-family: $type-card-title-family !important;
        font-size: $type-card-title-size !important;
        font-weight: $type-card-title-weight !important;
        line-height: $type-card-title-line-height !important;
      }
      & p.text-body-1 {
        color: rgb(var(--v-theme-dark-green));
        font-size: $type-card-subtitle-size !important;
        font-style: normal;
        margin-bottom: 0 !important;
        // family/weight/line-height are intentionally left to Vuetify's
        // real `text-body-1` class - its values are exactly the ones the
        // pre-migration build rendered here too.
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
    // This paragraph has no override of its own - its look always came
    // entirely from Vuetify's real `text-body-1` class (1rem). `main.scss`'s
    // `.text-body-1` `@media md-and-up` size bump now also matches it with
    // the same specificity, so it is pinned back to the un-bumped size here
    // (`&.text-body-1` to win the tie, same as the card-title rule above).
    &-description p.text-body-1 {
      font-size: $type-card-subtitle-size !important;
    }
  }
}
</style>

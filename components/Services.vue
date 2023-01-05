<template>
  <div id="services" class="services mx-auto">
    <div class="about-us__title mb-6">
      <span class="subtitle-1 dark-green--text">
        {{ $t('homepage.services') }}
      </span>
      <h2 class="text-h1">
        {{ $t('homepage.whatWeDo') }}
      </h2>
    </div>
    <div class="services__cards slider">
      <FlipCard
        class="slider__slide"
        v-for="(service, index) in services"
        :key="index"
        :cardInfo="service"
      />
    </div>
  </div>
</template>

<script>
import FlipCard from '~/components/FlipCard';
export default {
  name: 'Services',
  components: {
    FlipCard,
  },
  computed: {
    // TODO: add missing content
    services() {
      return [
        {
          iconName: '/baby.svg',
          title: this.$t('homepage.familyPlanning'),
          description: this.$t('homepage.ifYouWishToHaveChildren'),
        },
        {
          iconName: '/hearts.svg',
          title: this.$t('homepage.pregnancy'),
          description: this.$t('homepage.ifYouAreAlreadyPregnant'),
        },
        {
          iconName: '/medical-cross.svg',
          title: this.$t('homepage.generalGynecology'),
          description: this.$t('homepage.wouldYouLikeToUseContraception'),
        },
        {
          iconName: '/drop.svg',
          title: this.$t('homepage.endometriosis'),
          description: this.$t(
            'homepage.endometriosisIsOneOfTheMostCommonGynaecologicalDiseases',
          ),
        },
        {
          iconName: '/check-verified.svg',
          title: this.$t('homepage.cancerPrevention'),
          description: this.$t(
            'homepage.weAreHappyToBeAtYourDisposalForRegularCheckUps',
          ),
        },
        {
          iconName: '/heart-hand.svg',
          title: this.$t('homepage.girlsConsultation'),
          description: this.$t('homepage.teenagersOftenHaveManyQuestions'),
        },
        {
          iconName: '/activity-heart.svg',
          title: this.$t('homepage.menopauseAndHormones'),
          description: this.$t('homepage.hotFlushesAndSleepDisorders'),
        },
        {
          iconName: '/microscope.svg',
          title: this.$t('homepage.gynecologicalOncology'),
          description: this.$t('homepage.ofCourseWeDoNotLeaveOurPatientsAlone'),
        },
        {
          iconName: '/stethoscope.svg',
          title: this.$t('homepage.emergencyConsultation'),
          description: this.$t('homepage.suddenlyIll'),
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.services {
  padding-top: 5rem;
  max-width: 58.75rem;
  &__cards {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    @media #{$md-and-up} {
      overflow: unset;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 1.5rem;
    }
  }
  .slider {
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    }
    &__slide {
      flex: 0 0 auto;
    }
  }
}
</style>

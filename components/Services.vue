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
    <div class="services__cards">
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
          description:
            'Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan neque odio vel a, lectus.Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu.',
        },
        {
          iconName: '/hearts.svg',
          title: this.$t('homepage.pregnancy'),
          description:
            'Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan neque odio vel a, lectus.Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu.',
        },
        {
          iconName: '/medical-cross.svg',
          title: this.$t('homepage.generalGynecology'),
          description:
            'Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan neque odio vel a, lectus.Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu.',
        },
        {
          iconName: '/drop.svg',
          title: this.$t('homepage.incontinence'),
          description:
            'Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan neque odio vel a, lectus.Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu.',
        },
        {
          iconName: '/check-verified.svg',
          title: this.$t('homepage.precaution'),
          description:
            'Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan neque odio vel a, lectus.Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu.',
        },
        {
          iconName: '/heart-hand.svg',
          title: this.$t('homepage.girlsConsultation'),
          description:
            'Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan neque odio vel a, lectus.Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu.',
        },
        {
          iconName: '/activity-heart.svg',
          title: this.$t('homepage.menopause'),
          description:
            'Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan neque odio vel a, lectus.Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu.',
        },
        {
          iconName: '/microscope.svg',
          title: this.$t('homepage.hormones'),
          description:
            'Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan neque odio vel a, lectus.Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu.',
        },
        {
          iconName: '/stethoscope.svg',
          title: this.$t('homepage.breastDisease'),
          description:
            'Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan neque odio vel a, lectus.Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu accumsan Ut est faucibus metus scelerisque. Malesuada rutrum eu.',
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
    @media #{$md-and-up} {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 1.5rem;
    }
  }
}
</style>

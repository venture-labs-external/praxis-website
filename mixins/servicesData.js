export default {
  computed: {
    // TODO: add missing content
    services() {
      return [
        {
          iconName: '/baby.svg',
          title: this.$t('homepage.familyPlanning'),
          description: 'lorem ipsum dolor sit amet, consectetur adipiscing',
        },
        {
          iconName: '/hearts.svg',
          title: this.$t('homepage.pregnancy'),
          description: 'lorem ipsum dolor sit amet, consectetur adipiscing',
        },
        {
          iconName: '/medical-cross.svg',
          title: this.$t('homepage.generalGynecology'),
          description: 'lorem ipsum dolor sit amet, consectetur adipiscing',
        },
        {
          iconName: '/drop.svg',
          title: this.$t('homepage.incontinence'),
          description: 'lorem ipsum dolor sit amet, consectetur adipiscing',
        },
        {
          iconName: '/check-verified.svg',
          title: this.$t('homepage.precaution'),
          description: 'lorem ipsum dolor sit amet, consectetur adipiscing',
        },
        {
          iconName: '/heart-hand.svg',
          title: this.$t('homepage.girlsConsultation'),
          description: 'lorem ipsum dolor sit amet, consectetur adipiscing',
        },
        {
          iconName: '/activity-heart.svg',
          title: this.$t('homepage.menopause'),
          description: 'lorem ipsum dolor sit amet, consectetur adipiscing',
        },
        {
          iconName: '/microscope.svg',
          title: this.$t('homepage.hormones'),
          description: 'lorem ipsum dolor sit amet, consectetur adipiscing',
        },
        {
          iconName: '/stethoscope.svg',
          title: this.$t('homepage.breastDisease'),
          description: 'lorem ipsum dolor sit amet, consectetur adipiscing',
        },
      ];
    },
  },
};

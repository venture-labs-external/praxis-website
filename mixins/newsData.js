export default {
  computed: {
    news() {
      return {
        header: this.$t('homepage.dearPatients'),
        description: this.$t('homepage.onJanuary'),
        footer: this.$t('homepage.kindRegards'),
        name: this.$t('homepage.drRahelKorbmacher'),
        title: this.$t('homepage.specialistForGynecologyAndObstetrics'),
      };
    },
  },
};

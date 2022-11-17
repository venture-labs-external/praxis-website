export default {
  computed: {
    cardInfo() {
      return {
        title: this.$t('homepage.location'),
        icon: '/map-pin.svg',
        address: 'Neunzigstraße 1, 40625 Düsseldorf',
        link: '/',
      };
    },
  },
};

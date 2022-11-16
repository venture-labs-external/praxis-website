export default {
  computed: {
    cardInfo() {
      return {
        title: this.$t('homepage.officeHours'),
        icon: '/clock.svg',
        workingTime: [
          {
            day: this.$t('homepage.mondayThursday'),
            hours: '08:00 - 13:00 \n 14:00 - 19:00',
          },
          { day: this.$t('homepage.friday'), hours: '08:00 - 13:00' },
        ],
        link: '/',
      };
    },
  },
};

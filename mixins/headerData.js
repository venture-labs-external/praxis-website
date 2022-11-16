export default {
  computed: {
    cardInfo() {
      return {
        title: 'Sprechzeiten:',
        icon: '/clock.svg',
        workingTime: [
          { day: 'Mo. -Do.:', hours: '08:00 - 13:00 \n 14:00 - 19:00' },
          { day: 'Fr.', hours: '08:00 - 13:00' },
        ],
        link: 'http://www.meteo.pl',
      };
    },
  },
};

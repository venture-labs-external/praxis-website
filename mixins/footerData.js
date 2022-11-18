export default {
  computed: {
    contactData() {
      return {
        address: 'Neunzigstraße 1, 40625 Düsseldorf',
        doctors:
          'Praxisgemeinschaft Gerresheim\nPraxis für Frauenheilkunde\n Dr. med. R. Korbmacher\n\nPraxis für Frauenheilkunde\nDr. med. H. Weydandt',
        workingTime: [
          {
            day: this.$t('homepage.mondayThursdayLong'),
            hours: '08:00 - 13:00 | 14:00 - 19:00',
          },
          { day: this.$t('homepage.fridayLong'), hours: '08:00 - 13:00' },
        ],
        phone: '0211-285009',
        mail: 'info@loremipsum.de',
      };
    },
  },
};

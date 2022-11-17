export default {
  computed: {
    // TODO: add missing content
    doctors() {
      return [
        {
          name: 'Dr. med. Heike Weydandtr',
          photo: 'dr-weydandtr.png',
          title: this.$t('homepage.specialistInGynecologyAndObstetrics'),
          description: this.$t('homepage.afterTheExtensiveTraining'),
          qualifications: ['qualifikation', 'qualifikation'],
        },
        {
          name: 'Dr. med. R. Korbmacher',
          photo: 'dr-korbmacher.png',
          title: this.$t('homepage.specialistInGynecologyAndObstetrics'),
          description: this.$t('homepage.afterTheExtensiveTraining'),
          qualifications: [
            'qualifikation',
            'qualifikation',
            'qualifikation',
            'qualifikation',
            'qualifikation',
            'qualifikation',
          ],
        },
        {
          name: 'Christine Engberg',
          photo: 'dr-engberg.png',
          title: this.$t('homepage.specialistInGynecologyAndObstetrics'),
          description: this.$t('homepage.afterTheExtensiveTraining'),
          qualifications: ['qualifikation', 'qualifikation'],
        },
      ];
    },
  },
};

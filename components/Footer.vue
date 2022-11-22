<template>
  <footer
    class="footer dark-green white--text d-flex flex-column flex-md-row justify-md-space-between align-md-end py-8 px-md-10"
  >
    <div
      class="d-flex flex-column align-center align-md-start text-center text-md-left"
    >
      <img src="/map-pin-white.svg" alt="map pin" class="white--text mb-4" />
      <div>{{ contactData.address }}</div>
      <div>{{ contactData.doctors }}</div>
    </div>
    <div
      class="footer__column d-flex flex-column align-center align-md-start justify-md-space-between text-center text-md-left"
    >
      <div>
        <img
          src="/clock-white.svg"
          alt="clock"
          class="white--text my-4 my-md-0 mb-md-4"
        />
        <div>
          <div v-for="(time, index) in contactData.workingTime" :key="index">
            <div>{{ time.day }} {{ time.hours }}</div>
          </div>
        </div>
      </div>
      <div>
        <img src="/phone-white.svg" alt="phone" class="my-4" />
        <div>{{ $t('homepage.telephone') }} {{ contactData.phone }}</div>
        <div>{{ $t('homepage.email') }} {{ contactData.mail }}</div>
      </div>
    </div>
    <div class="d-md-flex flex-md-column align-md-end align-self-sm-end">
      <div v-show="$vuetify.breakpoint.mdAndUp" class="footer__logo">
        <a
          href="/"
          class="d-flex flex-column justify-center align-center text-decoration-none"
        >
          <img src="/logo-white.svg" alt="Logo" />
          <span class="flex-wrap text-center white--text">
            Frauenärztinnen Gerresheim
          </span>
        </a>
      </div>
      <div class="d-flex justify-center align-end mt-6 mt-md-4">
        <a href="/" class="white--text font-weight-regular"
          >{{ $t('homepage.imprint') }}
        </a>
        <a class="white--text mx-1">|</a>
        <a href="/" class="white--text font-weight-regular">
          {{ $t('homepage.privacyPolicy') }}</a
        >
      </div>
    </div>
  </footer>
</template>

<script>
import { CONTACT_DATA } from '~/constants';
export default {
  name: 'Footer',
  computed: {
    contactData() {
      return {
        address: CONTACT_DATA.address,
        doctors:
          'Praxisgemeinschaft Gerresheim\nPraxis für Frauenheilkunde\n Dr. med. R. Korbmacher\n\nPraxis für Frauenheilkunde\nDr. med. H. Weydandt',
        workingTime: [
          {
            day: this.$t('homepage.mondayThursdayLong'),
            hours: '08:00 - 13:00 | 14:00 - 19:00',
          },
          { day: this.$t('homepage.fridayLong'), hours: '08:00 - 13:00' },
        ],
        phone: CONTACT_DATA.phone,
        mail: CONTACT_DATA.email,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  border-radius: 6px 6px 0 0;
  white-space: pre-line;
  &:first-line {
    line-height: 0;
  }
  &__logo {
    width: 10.5rem;
    font-family: 'Roboto Serif';
    font-size: 1.25rem;
    line-height: 1.2;
  }
  &__column {
    height: 100%;
  }
}
</style>

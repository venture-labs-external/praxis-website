<template>
  <footer
    class="footer dark-green white--text d-flex flex-column align-center py-8"
  >
    <div class="d-flex flex-column align-center">
      <img src="/map-pin.svg" alt="map pin" class="mb-4" />
      <div>{{ contactData.address }}</div>
      <div class="text-center">{{ contactData.doctors }}</div>
      <img src="/clock.svg" alt="clock" class="my-4" />
      <div>
        <div v-for="(time, index) in contactData.workingTime" :key="index">
          <div>{{ time.day }} {{ time.hours }}</div>
        </div>
      </div>
      <img src="/phone.svg" alt="phone" class="my-4" />
      <div>{{ $t('homepage.telephone') }} {{ contactData.phone }}</div>
      <div>{{ $t('homepage.email') }} {{ contactData.mail }}</div>
    </div>
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
    <div class="d-flex mt-6">
      <a href="/" class="white--text">{{ $t('homepage.imprint') }} </a>
      <a href="/" class="white--text"> {{ $t('homepage.privacy') }}</a>
    </div>
  </footer>
</template>

<script>
import contactData from '~/mixins/footerData.js';
export default {
  name: 'Footer',
  mixins: [contactData],
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
}
</style>

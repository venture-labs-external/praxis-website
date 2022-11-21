<template>
  <div>
    <nav
      v-if="!showMenu"
      class="nav d-flex align-center justify-space-between px-7 px-md-10 py-4 py-md-6"
    >
      <a
        href="/"
        class="nav__logo d-flex flex-column justify-center align-center text-decoration-none"
      >
        <img src="/logo.svg" alt="Logo" />
        <span class="flex-wrap text-center pt-4">
          Frauenärztinnen Gerresheim
        </span>
      </a>
      <div v-show="$vuetify.breakpoint.mdAndUp">
        <ul class="nav__list list d-flex justify-space-between">
          <li v-for="item in navList" :key="item.name">
            <nuxt-link
              :to="{ path: item.path, hash: item.hash }"
              class="list__item font-weight-bold mr-6 mr-lg-14"
            >
              {{ item.name }}
            </nuxt-link>
          </li>
        </ul>
      </div>
      <v-btn
        v-show="$vuetify.breakpoint.mdAndUp"
        color="dark-green"
        depressed
        class="nav__button white--text font-weight-bold"
      >
        <img src="/arrow-right-white.svg" alt="right arrow" class="mr-4" />
        Termin buchen
      </v-btn>
      <div v-show="$vuetify.breakpoint.smAndDown">
        <img src="/menu-list.svg" alt="menu" @click="showMenu = true" />
      </div>
    </nav>
    <v-overlay
      :opacity="opacity"
      :value="showMenu"
      :color="'dark-green'"
      class="d-flex"
    >
      <div
        class="nav__menu menu d-flex flex-column flex-shrink-1 justify-space-between"
      >
        <div>
          <div class="d-flex flex-row-reverse py-15 pr-10">
            <img src="/cross-white.svg" alt="close" @click="showMenu = false" />
          </div>
          <div class="d-flex flex-column align-center">
            <ul class="list--mobile pa-0">
              <li v-for="item in menuList" :key="item.name" class="mb-6">
                <nuxt-link
                  :to="{ path: item.path, hash: item.hash }"
                  class="text-decoration-none"
                >
                  <span
                    class="list__item--mobile text-h2 white--text"
                    @click="showMenu = false"
                  >
                    {{ item.name }}
                  </span>
                </nuxt-link>
              </li>
            </ul>
            <div class="button text-h2 my-8">
              <img
                src="/arrow-right-white.svg"
                alt="right arrow"
                class="mr-4"
              />
              {{ $t('homepage.bookAppointment') }}
            </div>
          </div>
          <div class="mt-16 d-flex justify-center">
            <a href="/" class="white--text mr-6"
              >{{ $t('homepage.imprint') }}
            </a>
            <a href="/" class="white--text"> {{ $t('homepage.privacy') }}</a>
          </div>
        </div>
        <div class="menu__logo mx-auto">
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
      </div>
    </v-overlay>
  </div>
</template>
<script>
export default {
  name: 'Navigation',
  data() {
    return {
      opacity: 1,
      showMenu: false,
      navList: [
        { name: this.$t('homepage.news'), path: '/', hash: '#news' },
        { name: this.$t('homepage.aboutUs'), path: '/', hash: '#about-us' },
        { name: this.$t('homepage.services'), path: '/', hash: '#services' },
        { name: this.$t('homepage.contact'), path: '/', hash: '#contact' },
      ],
      menuList: [
        { name: this.$t('homepage.home'), path: '/', hash: '#' },
        { name: this.$t('homepage.news'), path: '/', hash: '#news' },
        { name: this.$t('homepage.aboutUs'), path: '/', hash: '#about-us' },
        { name: this.$t('homepage.services'), path: '/', hash: '#services' },
        { name: this.$t('homepage.contact'), path: '/', hash: '#contact' },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.nav {
  border-bottom: 1px solid var(--v-dark-green-base);
  &__logo {
    width: 10.5rem;
    font-family: 'Roboto Serif';
    font-size: 1.25rem;
    line-height: 1.2;
  }
  &__button {
    text-transform: unset !important;
  }
  &__menu {
    width: 100vw;
    height: 100vh;
  }
}
.list {
  list-style: none;
  &__item {
    text-decoration: none;
    font-size: 1.125rem;
    line-height: 1.2;
    &--mobile:hover {
      color: var(--v-mint-blue-base) !important;
    }
  }
  &--mobile {
    list-style: none;
  }
}
.menu {
  &__logo {
    padding-bottom: 5rem;
    max-width: 8.75rem;
  }
}
</style>

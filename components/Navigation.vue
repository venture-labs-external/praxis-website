<template>
  <div>
    <nav
      class="nav d-flex align-center justify-space-between px-10 py-4 py-md-6"
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
          <li v-for="item in menuList" :key="item.name">
            <a
              :href="item.link"
              class="list__item font-weight-bold mr-6 mr-lg-14"
            >
              {{ item.name }}
            </a>
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
        <!-- TODO: add mobile menu when design will be ready -->
        <img src="/menu-list.svg" alt="menu" />
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  name: 'Navigation',
  data() {
    return {
      // TODO: change links in navigation
      menuList: [
        { name: 'Jüngste Nachrichten', link: '#' },
        { name: 'Über uns', link: '#' },
        { name: 'Services', link: '#' },
        { name: 'Kontakt', link: '#' },
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
}
.list {
  list-style: none;
  &__item {
    text-decoration: none;
    font-size: 1.125rem;
    line-height: 1.2;
  }
}
</style>

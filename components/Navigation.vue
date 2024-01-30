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
        <a
          class="button text-decoration-none white--text"
          href="https://www.doctolib.de/praxisgemeinschaft/duesseldorf/frauenaerztinnen-gerresheim?utm_campaign=website-button&amp;utm_source=frauenaerztinnen-gerresheim-website-button&amp;utm_medium=referral&amp;utm_content=option-8&amp;utm_term=frauenaerztinnen-gerresheim"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src="/arrow-right-white.svg" alt="right arrow" class="mr-4" />
          {{ $t('homepage.bookAppointment') }}
        </a>
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
              <a
                class="button text-decoration-none white--text"
                href="https://www.doctolib.de/praxisgemeinschaft/duesseldorf/frauenaerztinnen-gerresheim?utm_campaign=website-button&amp;utm_source=frauenaerztinnen-gerresheim-website-button&amp;utm_medium=referral&amp;utm_content=option-8&amp;utm_term=frauenaerztinnen-gerresheim"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src="/arrow-right-white.svg"
                  alt="right arrow"
                  class="mr-4"
                />
                {{ $t('homepage.bookAppointment') }}
              </a>
            </div>
          </div>
          <v-dialog v-model="dialog" width="700px">
            <template v-slot:activator="{ on, attrs }">
              <div class="d-flex justify-center align-center mt-6 mt-md-4">
                <a
                  class="white--text font-weight-regular text-decoration-underline"
                  v-bind="attrs"
                  v-on="on"
                  >{{ $t('homepage.imprint') }}
                </a>
                <!-- <a class="white--text mx-1">|</a>
        <a href="/" class="white--text font-weight-regular">
          {{ $t('homepage.privacyPolicy') }}</a
        > -->
              </div>
            </template>
            <v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <div class="d-flex flex-row-reverse">
                  <v-btn icon @click="dialog = false">
                    <img src="/cross.svg" />
                  </v-btn>
                </div>
              </v-card-actions>
              <v-card-title>
                <span class="text-h2">{{ $t('imprint.imprint') }}</span>
              </v-card-title>
              <v-card-text class="nav__imprint">
                <p
                  v-for="element in impressumData"
                  :key="element.label"
                  :class="{
                    'subtitle-1': element.type === 'title',
                    'body-2': element.type === 'content',
                  }"
                  v-html="$t(element.label)"
                />
                <p
                  class="subtitle-1"
                  v-html="$t('imprint.conceptDesignProgramming.title')"
                />
                <div class="d-flex justify-start" style="height: 100%">
                  <div class="d-flex justify-start flex-column">
                    <img src="/venture-labs.svg" width="100px" height="45px" />
                    <img src="/lab-icons.svg" width="100px" height="15px" />
                  </div>
                  <p
                    class="body-2 ml-10 mt-2"
                    v-html="$t('imprint.conceptDesignProgramming.content')"
                  />
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
      dialog: false,
      dialogImprint: false,
      opacity: 1,
      showMenu: false,
      navList: [
        { name: this.$t('homepage.services'), path: '/', hash: '#services' },
        { name: this.$t('homepage.aboutUs'), path: '/', hash: '#about-us' },
        { name: this.$t('homepage.contact'), path: '/', hash: '#contact' },
      ],
      menuList: [
        { name: this.$t('homepage.home'), path: '/', hash: '#' },
        { name: this.$t('homepage.news'), path: '/', hash: '#news' },
        { name: this.$t('homepage.services'), path: '/', hash: '#services' },
        { name: this.$t('homepage.aboutUs'), path: '/', hash: '#about-us' },
        { name: this.$t('homepage.contact'), path: '/', hash: '#contact' },
      ],
      impressumData: [
        { label: 'imprint.generalInfo.title', type: 'title' },
        { label: 'imprint.generalInfo.content', type: 'content' },
        { label: 'imprint.jobInfo.title', type: 'title' },
        { label: 'imprint.jobInfo.content', type: 'content' },
        { label: 'imprint.competenceInfo.title', type: 'title' },
        { label: 'imprint.competenceInfo.content', type: 'content' },
        { label: 'imprint.doctorsInfo.title', type: 'title' },
        { label: 'imprint.doctorsInfo.content', type: 'content' },
        { label: 'imprint.professionalRegulations.title', type: 'title' },
        { label: 'imprint.professionalRegulations.content', type: 'content' },
        { label: 'imprint.legalTitle.title', type: 'title' },
        { label: 'imprint.legalTitle.content', type: 'content' },
        { label: 'imprint.liabilityNotice.title', type: 'title' },
        { label: 'imprint.liabilityNotice.content', type: 'content' },
        { label: 'imprint.content.title', type: 'title' },
        { label: 'imprint.content.content', type: 'content' },
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
  &__imprint {
    white-space: pre-line;
    margin-top: 30px;
    &:first-line {
      line-height: 0;
    }
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

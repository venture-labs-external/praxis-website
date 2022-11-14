<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="drawer primary"
      width="324"
    >
      <div class="drawer-wrapper d-flex">
        <PrimarySidebar />
        <div class="drawer-container primary pt-3 d-flex flex-column justify-space-between">
          <div class="drawer-content">
            <div class="drawer-header d-flex align-center px-6 mb-5 font-weight-medium">
              <div class="d-flex align-center">
                <span>
                  <v-icon
                    v-if="$route.path.includes('settings')"
                    class="text-light-middle--text"
                    size="35"
                  > mdi-settings </v-icon>
                  <v-avatar
                    v-else
                    size="40"
                  > <v-img src="/logoHuawei.png" /></v-avatar>
                </span>
              </div>
              <span class="drawer-header-title text-light--text px-2">
                <span v-if="$route.path.includes('settings')">
                  {{ $t('settingsMenu.settings') }}
                </span>
                <span v-else>
                  Name
                </span>
              </span>
            </div>
            <div>
              <nuxt-link
                v-for="item in activeArea.sidebar"
                :key="item.icon"
                v-ripple
                height="52"
                :to="drawerContentLinks(item.linkTo)"
                active-class="router-active"
                class="drawer-link d-flex align-center text-light--text text-decoration-none font-weight-regular px-6 card-surface--text"
              >
                <v-icon
                  size="16"
                  color="card-surface"
                >
                  {{ item.icon }}
                </v-icon>
                <span class="drawer-link-text text-capitalize pl-3">
                  {{ item.title }}
                </span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
    <div class="app-bar-background primary">
      <v-app-bar
        app
        height="75"
        flat
        class="app-bar text-light px-8"
      >
        <v-app-bar-nav-icon
          v-if="$vuetify.breakpoint.mdAndDown"
          @click="drawer = !drawer"
        />
        <v-icon
          v-if="activeArea.appBarReturn"
          @click="returnButtonClick"
        >
          mdi-arrow-left
        </v-icon>
        <span class="app-bar-title text-middle--text font-weight-medium">
          <FlashMessage />
          {{ activeArea.appBarTitle }}
        </span>
      </v-app-bar>
    </div>
    <v-main>
      <v-container
        fluid
        class="px-8 py-6"
      >
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import sidebarMixin from '@/constants/mixins/sidebarMixin';

export default {
  name: 'DefaultLayout',
  components: {
    PrimarySidebar: () => import('@/components/PrimarySidebar.vue'),
    FlashMessage: () => import('@/components/FlashMessage.vue'),
  },
  mixins: [sidebarMixin],
  data() {
    return {
      drawerIconsTop: 5,
      activeCompanyName: '',
      drawer: !this.$vuetify.breakpoint.mdAndDown,
    };
  },
};
</script>
<style scoped lang="scss">
.drawer {
  &-wrapper {
    height: 100%;
  }
  &-container {
    width: 100%;
    border-left: 2px solid var(--v-primary-light-base) !important;
  }
  &-header {
    letter-spacing: 0.15px;
    &-title {
      width: 170px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.43;
    }
  }
  &-link {
    height: 52px;
  }
  &-link-text {
    line-height: 19px;
    letter-spacing: 0.15px;
  }
}

.app-bar {
  border-top-left-radius: 1rem !important;
  &-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 75px;
    z-index: 2;
  }
  ::v-deep {
    .v-toolbar__content {
      display: grid;
      grid-auto-columns: max-content;
      grid-auto-flow: column;
      gap: 1.75rem;
      padding-left: 1.25rem;
      box-shadow: 0 4px 1px -3px rgba(0, 0, 0, 0.15) !important;
    }
  }
  &-title {
    font-size: 1.625rem;
    letter-spacing: 0.25px;
    line-height: 1.17;
  }
}
</style>

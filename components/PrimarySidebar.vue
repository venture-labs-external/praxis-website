<template>
  <fragment>
    <div class="drawer d-flex flex-column justify-space-between pa-3">
      <div>
        <nuxt-link
          v-ripple
          to="/"
          exact
          class="drawer-link d-flex justify-center align-center text-decoration-none mb-5 rounded-circle"
        >
          <v-img
            alt="Logo"
            src="/logoHuawei.png"
            contain
            height="24"
            width="24"
          />
        </nuxt-link>
        <nuxt-link
          v-ripple
          to="/"
          class="drawer-link text-decoration-none d-flex justify-center align-center"
        >
          <v-icon
            size="24"
            color="text-light"
          >
            mdi-cake
          </v-icon>
        </nuxt-link>
      </div>
      <div class="drawer-link d-flex flex-column align-center justify-end">
        <v-btn
          icon
          color="text-light-middle"
        >
          <v-icon size="26.7">
            mdi-cake
          </v-icon>
        </v-btn>
        <v-menu
          top
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              @click="userMenuVisible = !userMenuVisible"
              v-on="on"
            >
              <v-avatar
                size="35"
                class="icon"
                color="primary"
              >
                <v-img
                  src="/example-avatar.png"
                />
              </v-avatar>
            </v-btn>
          </template>
          <div class="user-menu primary-dark rounded d-flex flex-column ml-7 mb-3">
            <v-btn
              depressed
              block
              tile
              text
              class="user-menu-item body-2 d-flex justify-start text-light--text font-weight-medium px-4 py-2"
              @click="() => this.$router.push('/settings/profile')"
            >
              <v-avatar
                size="24"
                class="icon"
                color="primary"
              >
                <v-img
                  v-if="profileInfos.picture"
                  :src="profileInfos.picture"
                />
                <span
                  v-else
                  class="text-light--text text-uppercase"
                >EL</span>
              </v-avatar>
              <span
                v-if="!!profileInfos.lastName"
                class="pl-3 text-capitalize"
              > Name Surname</span>
            </v-btn>
            <v-btn
              depressed
              block
              tile
              text
              class="user-menu-item body-2 d-flex justify-start text-light--text font-weight-medium px-5 py-1"
            >
              <v-icon>
                mdi-cake
              </v-icon>
              <span class="text-capitalize pl-3">
                Title
              </span>
            </v-btn>
            <v-btn
              depressed
              block
              tile
              text
              class="user-menu-item body-2 d-flex justify-start text-light--text font-weight-medium px-5 py-1"
            >
              <span class="text-light--text text-lowercase">
                {{ $t('settingsMenu.userMenu.unlog') }}
              </span>
            </v-btn>
          </div>
        </v-menu>
      </div>
    </div>
  </fragment>
</template>

<script>
import sidebarMixin from '@/constants/mixins/sidebarMixin';

export default {
  mixins: [sidebarMixin],
  data() {
    return {
      getUserCompanies: null,
      drawerIconsSlicePoint: 3,
      company: null,
      profileInfos: {
        firstName: '',
        lastName: '',
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.drawer {
  height: 100%;
  &-link {
    border-radius: 6px;
    height: 40px;
    width: 40px;
  }
}
.v-menu__content {
  box-shadow: none;
}
.user-menu {
  overflow: hidden;
  width: 12.5rem;
  &-item {
    height: 48px !important;
    line-height: 16px !important;
  }
}
</style>

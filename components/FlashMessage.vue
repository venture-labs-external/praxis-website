<template>
  <v-snackbar
    v-model="snackbar"
    class="info-box pt-0"
    :color="snackbarType"
    max-width="100vw"
    top
    tile
    timeout="6000"
    vertical
    @click.native="closeFlashMessage"
  >
    <span class="font-weight-medium">{{ snackbarText }}</span>
  </v-snackbar>
</template>
<script>
export default {
  data: () => ({
    snackbarText: '',
    snackbar: false,
    snackbarType: '',
  }),
  mounted() {
    this.$root.$on('show-flash-message', this.showFlashMessage);
  },
  methods: {
    showFlashMessage(event) {
      this.snackbarText = event.message;
      this.snackbarType = event.type;
      this.snackbar = true;
    },
    closeFlashMessage() {
      this.snackbar = false;
      this.snackbarText = '';
      this.snackbarType = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.info-box {
  width: 100%;
  display:block;
  ::v-deep {
    .v-snack__wrapper {
      margin: 0;
      max-width: 100%;
      height: 4rem;
    }
    .v-snack__content {
      display: flex;
      align-items: center;
      margin-right: unset;
    }
    .v-snack__action {
      display: none;
    }
  }
}
</style>

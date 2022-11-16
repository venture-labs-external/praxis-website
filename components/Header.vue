<template>
  <header class="header">
    <div>
      <span class="light-green--text">Willkommen</span>
      <h1>Frauenärztinnen Gerresheim</h1>
    </div>
    <!-- <div class="image__wrapper pa-3"> -->
    <img
      class="header__image image"
      src="doctors-office/doctors-office.png"
      srcset="
        /doctors-office/doctors-office_w_330.webp   330w,
        /doctors-office/doctors-office_w_687.webp   687w,
        /doctors-office/doctors-office_w_927.webp   927w,
        /doctors-office/doctors-office_w_1137.webp 1137w,
        /doctors-office/doctors-office_w_1310.webp 1310w
      "
      alt="Doctor's office"
    />
    <!-- <div class="image__border"></div> -->
    <!-- </div> -->
  </header>
</template>

<script>
export default {
  name: 'Header',
  // components: {
  //   Button,
  //   HeaderBox,
  // },
};
</script>

<style lang="scss" scoped>
.header {
  //mobile
  &__image {
    max-width: 100%;
    height: auto;
  }
}
// .image {
//   position: absolute;
//   width: 41rem;
//   height: 27.8rem;
//   z-index: 2;
//   &__border {
//     position: absolute;
//     border: 3px solid var(--v-dark-green-base);
//     width: 41rem;
//     height: 27.8rem;
//     border-radius: 6px;
//     margin-top: -2.8rem;
//     margin-left: 2.8rem;
//   }
//   &__wrapper {
//     position: relative;
//     width: 45rem;
//     height: 35rem;
//   }
// }
</style>

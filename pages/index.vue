<template>
  <main>
    <AkutSprechstundeNotice />
    <Header />
    <News />
    <Services />
    <AboutUs />
    <Team />
    <Contact />
  </main>
</template>

<script>
import AkutSprechstundeNotice from '~/components/AkutSprechstundeNotice.vue';
import Header from '~/components/Header.vue';

export default {
  components: {
    AkutSprechstundeNotice,
    Header,
    News: () => import('~/components/News'),
    AboutUs: () => import('~/components/AboutUs'),
    Services: () => import('~/components/Services'),
    Team: () => import('~/components/Team'),
    Contact: () => import('~/components/Contact'),
  },
};
</script>

<style lang="scss" scoped>
.info {
  display: grid;
  grid-template-columns: max-content 1fr;
  @media #{$xs-only} {
    grid-template-columns: 1fr;
    grid-template-rows: max-content 1fr;
    justify-items: center;
  }
  align-items: center;
  gap: $space-xs;
  padding: $space-xs;
  background-color: rgb(var(--v-theme-info));
  color: rgb(var(--v-theme-info-text));
  border-radius: $radius-sm;
  font-size: $type-info-size;
  font-weight: $type-info-weight;
  line-height: $type-info-line-height;
  letter-spacing: $type-info-letter-spacing;

  @media #{$md-and-up} {
    margin-top: $space-info-margin-top;
  }

  & p {
    margin-bottom: 0 !important;
  }
  & svg {
    margin: 0 $space-xs;
  }
}
</style>

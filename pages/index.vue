<template>
  <main>
    <Header />
    <News />
    <Services />
    <AboutUs />
    <Team />
    <Contact />
  </main>
</template>

<script>
import Header from '~/components/Header.vue';

export default {
  components: {
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
  gap: 1rem;
  padding: 1rem;
  background-color: var(--v-info-base);
  color: var(--v-info-text-base);
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0;

  @media #{$md-and-up} {
    margin-top: 4.5rem;
  }

  & p {
    margin-bottom: 0 !important;
  }
  & svg {
    margin: 0 1rem;
  }
}
</style>

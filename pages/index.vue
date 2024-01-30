<template>
  <div>
    <Header />
    <News />
    <Services />
    <AboutUs />
    <Team />
    <Contact />
  </div>
</template>

<script>
export default {
  components: {
    Header: () => import('~/components/Header'),
    News: () => import('~/components/News'),
    AboutUs: () => import('~/components/AboutUs'),
    Services: () => import('~/components/Services'),
    Team: () => import('~/components/Team'),
    Contact: () => import('~/components/Contact'),
  },
};
</script>

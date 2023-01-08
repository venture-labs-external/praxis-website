<template>
  <div>
    <Header />
    <News :news="news" />
    <Services />
    <AboutUs />
    <Contact />
  </div>
</template>

<script>
import news from '~/mixins/newsData.js';
export default {
  components: {
    Header: () => import('~/components/Header'),
    News: () => import('~/components/News'),
    AboutUs: () => import('~/components/AboutUs'),
    Services: () => import('~/components/Services'),
    Contact: () => import('~/components/Contact'),
  },
  mixins: [news],
};
</script>

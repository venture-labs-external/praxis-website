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
import AboutUs from '~/components/AboutUs';
import Contact from '~/components/Contact';
import Header from '~/components/Header';
import News from '~/components/News';
import Services from '~/components/Services';
import news from '~/mixins/newsData.js';
export default {
  components: {
    Header,
    News,
    AboutUs,
    Services,
    Contact,
  },
  mixins: [news],
};
</script>

<template>
  <div>
    <Header />
    <News :news="news" />
    <Contact />
  </div>
</template>

<script>
import Contact from '~/components/Contact';
import Header from '~/components/Header';
import News from '~/components/News';
import news from '~/mixins/newsData.js';
export default {
  components: {
    Header,
    News,
    Contact,
  },
  mixins: [news],
};
</script>

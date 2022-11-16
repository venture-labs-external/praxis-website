<template>
  <div>
    <Header />
    <News :news="news" />
  </div>
</template>

<script>
import Header from '~/components/Header';
import News from '~/components/News';
import news from '~/mixins/newsData.js';
export default {
  components: {
    Header,
    News,
  },
  mixins: [news],
};
</script>

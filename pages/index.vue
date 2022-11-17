<template>
  <div>
    <Header />
    <AboutUs />
    <Contact />
  </div>
</template>

<script>
import AboutUs from '~/components/AboutUs';
import Contact from '~/components/Contact';
import Header from '~/components/Header';
export default {
  components: {
    Header,
    AboutUs,
    Contact,
  },
};
</script>

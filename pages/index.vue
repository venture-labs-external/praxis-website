<template>
  <div>
    <Header />
    <AboutUs />
    <Services />
    <Contact />
  </div>
</template>

<script>
import AboutUs from '~/components/AboutUs';
import Contact from '~/components/Contact';
import Header from '~/components/Header';
import Services from '~/components/Services';
export default {
  components: {
    Header,
    AboutUs,
    Services,
    Contact,
  },
};
</script>

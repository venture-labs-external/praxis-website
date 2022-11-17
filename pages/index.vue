<template>
  <div>
    <Header />
    <Services />
    <Contact />
  </div>
</template>

<script>
import Contact from '~/components/Contact';
import Header from '~/components/Header';
import Services from '~/components/Services';
export default {
  components: {
    Header,
    Services,
    Contact,
  },
};
</script>

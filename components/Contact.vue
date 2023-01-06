<template>
  <div class="contact mx-auto py-10" id="contact">
    <div class="contact__title">
      <span class="subtitle-1 dark-green--text">{{
        $t('homepage.location')
      }}</span>
      <h2 class="text-h1">
        {{ $t('homepage.whereYouCanFindUs') }}
      </h2>
    </div>
    <div class="contact__map my-6 my-md-0">
      <iframe
        class="map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2498.0250631052186!2d6.8599432!3d51.23703329999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8ceacc8c92bbb%3A0x769d54921bee11da!2sNeunzigstra%C3%9Fe%201%2C%2040625%20D%C3%BCsseldorf%2C%20Germany!5e0!3m2!1sen!2spl!4v1668618451757!5m2!1sen!2spl"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    <div class="contact__card">
      <CardWithButton :cardInfo="cardInfo" class="mt-md-8">
        <slot>
          <div class="text-h4">
            {{ cardInfo.address }}
          </div>
        </slot>
      </CardWithButton>
    </div>
  </div>
</template>

<script>
import CardWithButton from '~/components/CardWithButton';
import { CONTACT_DATA } from '~/constants';
export default {
  name: 'Header',
  components: {
    CardWithButton,
  },
  computed: {
    cardInfo() {
      return {
        title: this.$t('homepage.location'),
        icon: '/map-pin.svg',
        address: CONTACT_DATA.address,
        link: '/',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.contact {
  max-width: 73rem;
  @media #{$md-and-up} {
    padding: 5rem 0;
  }
  &__map {
    border: 7px solid var(--v-white-base);
    border-radius: 6px;
  }
  @media #{$md-and-up} {
    display: grid;
    grid-template:
      'title map map map'
      'card map map map';
    column-gap: 3rem;
  }
  &__title {
    grid-area: title;
    @media #{$md-and-up} {
      padding-top: 5rem;
    }
  }
  &__card {
    grid-area: card;
    max-width: 29rem;
    @media #{$md-and-up} {
      padding-bottom: 5rem;
    }
  }
  &__map {
    grid-area: map;
  }
}
.map {
  width: 100%;
  height: 18.75rem;
  @media #{$md-and-up} {
    height: 100%;
  }
}
</style>

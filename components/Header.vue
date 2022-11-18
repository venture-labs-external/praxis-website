<template>
  <header class="header">
    <div class="header__title">
      <span class="subtitle-1 dark-green--text">{{
        $t('homepage.welcome')
      }}</span>
      <h1 class="text-h1">{{ $t('homepage.gynecologists') }}</h1>
    </div>
    <div class="image__wrapper py-6">
      <img
        class="header__image image"
        src="doctors-office/doctors-office.png"
        srcset="
          /doctors-office/doctors-office_w_330.webp   330w,
          /doctors-office/doctors-office_w_687.webp   687w,
          /doctors-office/doctors-office_w_927.webp   927w,
          /doctors-office/doctors-office_w_1137.webp 1137w,
          /doctors-office/doctors-office_w_1310.webp 1310w
        "
        alt="Doctor's office"
      />
      <div v-show="$vuetify.breakpoint.mdAndUp" class="image__border"></div>
    </div>
    <div class="header__card">
      <CardWithButton
        :cardInfo="cardInfo"
        :optionalCardInfo="optionalCardInfo"
        class="mt-md-8"
      >
        <template v-slot>
          <div class="table">
            <v-row
              v-for="(time, index) in cardInfo.workingTime"
              :key="index"
              class="table__row pr-12"
            >
              <v-col class="text-h4">{{ time.day }}</v-col>
              <v-col class="body-1 text-right">{{ time.hours }}</v-col>
            </v-row>
          </div>
        </template>
        <template v-slot:optionalBox>
          <div class="table">
            <v-row
              v-for="(contact, index) in optionalCardInfo.contact"
              :key="index"
              class="table__row pr-12"
            >
              <v-col class="text-h4">{{ contact.type }}</v-col>
              <v-col class="body-1 text-right">{{ contact.details }}</v-col>
            </v-row>
          </div>
        </template>
      </CardWithButton>
    </div>
  </header>
</template>

<script>
import CardWithButton from '~/components/CardWithButton';
export default {
  name: 'Header',
  components: {
    CardWithButton,
  },
  computed: {
    cardInfo() {
      return {
        title: this.$t('homepage.officeHours'),
        icon: '/clock.svg',
        workingTime: [
          {
            day: this.$t('homepage.mondayThursday'),
            hours: '08:00 - 13:00 \n 14:00 - 19:00',
          },
          { day: this.$t('homepage.friday'), hours: '08:00 - 13:00' },
        ],
        link: '/',
      };
    },
    optionalCardInfo() {
      return {
        title: this.$t('homepage.contact'),
        icon: '/phone.svg',
        contact: [
          {
            type: this.$t('homepage.telephone'),
            details: '0211-285009',
          },
          { type: this.$t('homepage.email'), details: 'info@loremipsum.de' },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  @media #{$md-and-up} {
    padding-top: 5rem;
    padding-bottom: 5rem;
    display: grid;
    grid-template:
      'title image'
      'card image';
    column-gap: 3rem;
  }
  &__title {
    grid-area: title;
  }
  &__card {
    grid-area: card;
  }
}
.image {
  width: 100%;
  height: auto;
  @media #{$md-and-up} {
    position: absolute;
    width: 41rem;
    height: 27.8rem;
    z-index: 2;
  }
  &__border {
    position: absolute;
    border: 3px solid var(--v-dark-green-base);
    width: 41rem;
    height: 27.8rem;
    border-radius: 6px;
    inset: -1.5rem 3rem;
  }
  &__wrapper {
    grid-area: image;
    @media #{$md-and-up} {
      position: relative;
      width: 45rem;
    }
  }
}
.table {
  white-space: pre-line;
  &:first-line {
    line-height: 0;
  }
  &__row {
    display: grid;
    grid-template-columns: 35% auto;
  }
}
</style>

<template>
  <header class="header mx-auto">
    <div class="header__title">
      <span class="subtitle-1 dark-green--text">{{
        $t('homepage.welcome')
      }}</span>
      <h1 class="text-h1">{{ $t('homepage.gynecologists') }}</h1>
    </div>
    <div class="header__image py-6 py-md-0">
      <div class="image__wrapper">
        <img
          class="image"
          src="header-image/header-image.png"
          srcset="
            /header-image/header-image_w_330.webp   330w,
            /header-image/header-image_w_714.webp   714w,
            /header-image/header-image_w_984.webp   984w,
            /header-image/header-image_w_1166.webp 1166w,
            /header-image/header-image_w_1310.webp 1310w
          "
          loading="lazy"
          alt="Doctor's office"
        />
      </div>
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
export default {
  name: 'Header',
  components: {
    CardWithButton: () => import('~/components/CardWithButton'),
  },
  computed: {
    cardInfo() {
      return {
        title: this.$t('homepage.officeHours'),
        icon: '/clock.svg',
        workingTime: [
          {
            day: this.$t('homepage.mondayThursday'),
            hours: '08:00 - 19:00',
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
          {
            type: this.$t('homepage.email'),
            details: 'termin@frauenaerztinnen-gerresheim.de',
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  max-width: 73rem;
  @media #{$md-and-up} {
    padding-top: 5rem;
    padding-bottom: 5rem;
    display: grid;
    grid-template:
      'title  image '
      'card image  ';
    grid-template-columns: 40% auto;
    column-gap: 3rem;
    align-items: end;
  }
  &__title {
    grid-area: title;
  }
  &__card {
    grid-area: card;
  }
  &__image {
    grid-area: image;
  }
}
.image {
  width: 100%;
  height: auto;
  @media #{$md-and-up} {
    position: relative;
    width: 100%;
    height: auto;
    z-index: 2;
  }
  &__wrapper {
    @media #{$md-and-up} {
      position: relative;
      width: 100%;
    }
    &::after {
      @media #{$md-and-up} {
        content: '';
        position: absolute;
        left: 5%;
        bottom: 8%;
        width: 100%;
        height: 100%;
        border: 3px solid var(--v-dark-green-base);
        border-radius: 6px;
      }
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

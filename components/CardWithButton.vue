<template>
  <article class="card bg-white pt-6">
    <div class="card__content mx-6 my-4">
      <section
        v-for="(card, index) in cardInfo"
        :key="index"
        class="info-section"
      >
        <header class="info-section__header d-flex align-center pb-4">
          <component :is="card.icon" class="mr-4" />
          <h2 class="text-h3">{{ card.title }}:</h2>
        </header>
        <div
          v-for="(time, index) in card.workingTime"
          :key="index"
          class="info-section__row pr-12"
        >
          <div class="text-h4">{{ time.day }}</div>
          <div class="text-body-1 text-right">{{ time.hours }}</div>
        </div>
        <dl
          v-for="(contact, index) in card.contact"
          :key="index"
          class="contact-list pr-12"
        >
          <dt class="text-h4">{{ contact.type }}</dt>
          <dd class="text-body-1 text-right">
            <a
              v-if="['phone', 'fax'].includes(contact.contactType)"
              :href="`tel:${contact.details}`"
            >
              {{ contact.details }}
            </a>
          </dd>
        </dl>
        <div v-if="card.info" class="text-h4 pt-4 pb-2">
          <a
            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              card.info,
            )}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none"
          >
            {{ card.info }}
          </a>
        </div>
      </section>
    </div>
    <footer class="card__button text-white bg-dark-green pa-5">
      <a
        class="button text-decoration-none text-white"
        href="https://www.doctolib.de/praxisgemeinschaft/duesseldorf/frauenaerztinnen-gerresheim"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span class="button text-h5">
          <img
            src="/arrow-right-white.svg"
            alt="Book appointment"
            class="mr-4"
          />
          {{ $t('homepage.bookAppointment') }}
        </span>
      </a>
    </footer>
  </article>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  name: 'CardWithButton',
  components: {
    // Vue 3 no longer auto-wraps a bare `() => import(...)` function as an
    // async component (Vue 2 did) - without `defineAsyncComponent`, the
    // dynamic `<component :is="card.icon">` below ends up rendering the
    // unresolved Promise as text instead of the icon.
    Clock: defineAsyncComponent(() => import('./icons/Clock.vue')),
    Phone: defineAsyncComponent(() => import('./icons/PhoneIcon.vue')),
    MapPin: defineAsyncComponent(() => import('./icons/MapPin.vue')),
  },
  props: {
    cardInfo: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: $radius-sm;
  // Vuetify 2's `white` background utility only ever set
  // `background-color`; Vuetify 3's `bg-white` utility additionally forces
  // `color: #000 !important` (it auto-computes an "on-white" text colour for
  // every bg-* utility). This card has no text-colour class of its own and
  // relied on inheriting `.app`'s dark-gray - restored explicitly here.
  color: rgb(var(--v-theme-dark-gray)) !important;
  &__title {
    border-bottom: 1px solid rgb(var(--v-theme-dark-gray));
  }
  &__button {
    border-radius: 0 0 $radius-sm $radius-sm;
  }
}

.info-section {
  &__header {
    border-bottom: 1px solid rgb(var(--v-theme-dark-gray));
  }
}

.contact-list,
.info-section__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-2xs 0;
  &:last-child {
    margin-bottom: $space-md;
  }
}

.button {
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>

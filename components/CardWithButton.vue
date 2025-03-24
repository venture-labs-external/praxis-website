<template>
  <article class="card white pt-6">
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
          <div class="body-1 text-right">{{ time.hours }}</div>
        </div>
        <dl
          v-for="(contact, index) in card.contact"
          :key="index"
          class="contact-list pr-12"
        >
          <dt class="text-h4">{{ contact.type }}</dt>
          <dd class="body-1 text-right">
            <a
              v-if="['phone', 'fax'].includes(contact.contactType)"
              :href="`tel:${contact.details}`"
            >
              {{ contact.details }}
            </a>
            <a
              v-if="contact.contactType === 'email'"
              :href="`mailto:${contact.details}`"
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
    <footer class="card__button white--text dark-green pa-5">
      <a
        class="button text-decoration-none white--text"
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
export default {
  name: 'CardWithButton',
  components: {
    Clock: () => import('./icons/Clock.vue'),
    Phone: () => import('./icons/PhoneIcon.vue'),
    MapPin: () => import('./icons/MapPin.vue'),
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
  border-radius: 6px;
  &__title {
    border-bottom: 1px solid var(--v-dark-gray-base);
  }
  &__button {
    border-radius: 0 0 6px 6px;
  }
}

.info-section {
  &__header {
    border-bottom: 1px solid var(--v-dark-gray-base);
  }
}

.contact-list,
.info-section__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  &:last-child {
    margin-bottom: 2rem;
  }
}

.button {
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>

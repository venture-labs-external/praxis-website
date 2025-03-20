<template>
  <footer
    class="footer dark-green white--text d-flex flex-column flex-md-row justify-md-space-between align-md-end py-8 px-md-10"
  >
    <div
      class="d-flex flex-column align-center align-md-start text-center text-md-left"
    >
      <img src="/map-pin-white.svg" alt="map pin" class="white--text mb-4" />
      <a
        :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          contactData.address,
        )}`"
        target="_blank"
        rel="noopener noreferrer"
        class="white--text"
        >{{ contactData.address }}</a
      >
      <div>{{ contactData.doctors }}</div>
    </div>
    <div
      class="footer__column d-flex flex-column align-center align-md-start text-center text-md-left"
      v-for="item in workingTime"
      :key="item.title"
    >
      <component :is="item.icon" class="white--text my-4 my-md-0 mb-md-4" />
      <div class="white--text">
        <span class="white--text">{{ item.title }}</span>
        <div
          v-for="(time, index) in item.workingTime"
          :key="index"
          class="footer__item"
        >
          <span class="no-wrap">{{ time.day }}:</span>
          <span class="no-wrap">{{ time.hours }}</span>
        </div>
        <div
          v-for="(contact, index) in item.contact"
          :key="index"
          class="footer__item"
        >
          <span class="white--text no-wrap">{{ contact.type }}:</span>
          <a
            v-if="['phone', 'fax'].includes(contact.contactType)"
            :href="`tel:${contact.details}`"
            class="white--text no-wrap"
            >{{ contact.details }}</a
          >
          <a
            v-if="contact.contactType === 'email'"
            :href="`mailto:${contact.details}`"
            class="white--text"
            >{{ contact.details }}</a
          >
        </div>
      </div>
    </div>
    <div class="d-md-flex flex-md-column align-center align-self-center">
      <div v-show="$vuetify.breakpoint.mdAndUp" class="footer__logo">
        <a
          href="/"
          class="d-flex flex-column justify-center align-center text-decoration-none"
        >
          <img src="/logo-white.svg" alt="Logo" />
          <span class="flex-wrap text-center white--text">
            Frauenärztinnen Gerresheim
          </span>
        </a>
      </div>
      <v-dialog v-model="dialog" width="700px">
        <template v-slot:activator="{ on, attrs }">
          <div class="mt-6 mt-md-4">
            <a
              class="white--text font-weight-regular text-decoration-underline"
              v-bind="attrs"
              v-on="on"
              >{{ $t('homepage.imprint') }}
            </a>
            <!-- <a class="white--text mx-1">|</a>
        <a href="/" class="white--text font-weight-regular">
          {{ $t('homepage.privacyPolicy') }}</a
        > -->
          </div>
        </template>
        <v-card>
          <v-card-actions>
            <v-spacer></v-spacer>
            <div class="d-flex flex-row-reverse">
              <v-btn icon @click="dialog = false">
                <img src="/cross.svg" />
              </v-btn>
            </div>
          </v-card-actions>
          <v-card-title>
            <span class="text-h2">{{ $t('imprint.imprint') }}</span>
          </v-card-title>
          <v-card-text class="footer__imprint">
            <p
              v-for="element in impressumData"
              :key="element.label"
              :class="{
                'subtitle-1': element.type === 'title',
                'body-2': element.type === 'content',
              }"
              v-html="$t(element.label)"
            />
            <p
              class="subtitle-1"
              v-html="$t('imprint.conceptDesignProgramming.title')"
            />
            <div class="d-flex justify-start" style="height: 100%">
              <div class="d-flex justify-start flex-column">
                <img src="/venture-labs.svg" width="100px" height="45px" />
                <img src="/lab-icons.svg" width="100px" height="15px" />
              </div>
              <p
                class="body-2 ml-10 mt-2"
                v-html="$t('imprint.conceptDesignProgramming.content')"
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </footer>
</template>

<script>
import { CONTACT_DATA, WORKING_TIME } from '~/constants';

import Clock from './icons/Clock.vue';
import Phone from './icons/PhoneIcon.vue';

export default {
  name: 'Footer',
  components: {
    Clock,
    Phone,
  },
  data() {
    return {
      dialog: false,
      impressumData: [
        { label: 'imprint.generalInfo.title', type: 'title' },
        { label: 'imprint.generalInfo.content', type: 'content' },
        { label: 'imprint.jobInfo.title', type: 'title' },
        { label: 'imprint.jobInfo.content', type: 'content' },
        { label: 'imprint.competenceInfo.title', type: 'title' },
        { label: 'imprint.competenceInfo.content', type: 'content' },
        { label: 'imprint.doctorsInfo.title', type: 'title' },
        { label: 'imprint.doctorsInfo.content', type: 'content' },
        { label: 'imprint.professionalRegulations.title', type: 'title' },
        { label: 'imprint.professionalRegulations.content', type: 'content' },
        { label: 'imprint.legalTitle.title', type: 'title' },
        { label: 'imprint.legalTitle.content', type: 'content' },
        { label: 'imprint.liabilityNotice.title', type: 'title' },
        { label: 'imprint.liabilityNotice.content', type: 'content' },
        { label: 'imprint.content.title', type: 'title' },
        { label: 'imprint.content.content', type: 'content' },
      ],
      workingTime: WORKING_TIME,
    };
  },
  computed: {
    contactData() {
      return {
        address: CONTACT_DATA.address,
        doctors:
          'Praxisgemeinschaft Gerresheim\nPraxis für Frauenheilkunde\n Dr. med. R. Korbmacher\n\nPraxis für Frauenheilkunde\nDr. med. H. Weydandt',
        workingTime: [
          {
            day: this.$t('homepage.mondayWednesday'),
            hours: '08:00 - 13:00  |  14:00 - 19:00',
          },
          {
            day: this.$t('homepage.thursday'),
            hours: '08:00 - 13:00  |  14:00 - 18:00',
          },
          { day: this.$t('homepage.friday'), hours: '08:00 - 13:00' },
        ],
        phone: CONTACT_DATA.phone,
        mail: CONTACT_DATA.email,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  font-weight: 700;
  border-radius: 6px 6px 0 0;
  white-space: pre-line;
  gap: 1.5rem;
  &:first-line {
    line-height: 0;
  }
  &__logo {
    width: 10.5rem;
    font-family: 'Roboto Serif', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
  }
  &__column {
    height: 100%;
  }
  &__item {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  &__imprint {
    white-space: pre-line;
    margin-top: 30px;
    &:first-line {
      line-height: 0;
    }
  }
  svg {
    fill: currentColor;
    width: 24px;
    height: 24px;
  }
}
</style>

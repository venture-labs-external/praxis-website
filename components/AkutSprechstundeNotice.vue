<template>
  <div class="akut-notice">
    <v-dialog
      v-model="dialogOpen"
      max-width="640"
      eager
      content-class="akut-notice__dialog"
      overlay-color="dark-green"
      overlay-opacity="0.6"
    >
      <v-card
        role="dialog"
        aria-modal="true"
        :aria-labelledby="headlineId"
        class="akut-notice__card pa-7 pa-sm-8"
      >
        <v-btn
          icon
          class="akut-notice__close"
          :aria-label="$t('homepage.akutNoticeCloseLabel')"
          @click="close"
        >
          <img src="/cross.svg" alt="" />
        </v-btn>
        <div class="akut-notice__overline primary--text">
          <span class="akut-notice__dash"></span>
          {{ $t('homepage.akutNoticeOverline') }}
        </div>
        <h2 :id="headlineId" class="akut-notice__headline">
          {{ $t('homepage.akutNoticeHeadline') }}
        </h2>
        <div class="akut-notice__validity primary--text">
          {{ $t('homepage.akutNoticeValidity') }}
        </div>
        <hr class="akut-notice__rule" />
        <p class="akut-notice__body">
          {{ $t('homepage.akutNoticeBody') }}
        </p>
        <p class="akut-notice__emphasis primary--text">
          {{ $t('homepage.akutNoticeEmphasisBefore') }}
          <span class="akut-notice__highlight">{{
            $t('homepage.akutNoticeEmphasisHighlight')
          }}</span>
          {{ $t('homepage.akutNoticeEmphasisAfter') }}
        </p>
        <div class="akut-notice__contact primary white--text">
          <p class="akut-notice__contact-intro">
            {{ $t('homepage.akutNoticeContactIntro') }}
          </p>
          <p class="akut-notice__hours">
            <img src="/clock-white.svg" alt="" width="20" height="20" />
            {{ $t('homepage.akutNoticeHours') }}
          </p>
          <a class="akut-notice__phone white--text" href="tel:+49211285009">
            <img src="/phone-white.svg" alt="" width="22" height="22" />
            {{ $t('homepage.akutNoticePhone') }}
          </a>
        </div>
        <p class="akut-notice__closing">
          {{ $t('homepage.akutNoticeClosingLine1') }}<br />
          <strong>{{ $t('homepage.akutNoticeClosingLine2') }}</strong>
        </p>
      </v-card>
    </v-dialog>

    <button
      v-if="pillVisible"
      type="button"
      class="akut-notice__pill info info-text--text"
      @click="reopen"
    >
      <span class="akut-notice__dot"></span>
      {{ $t('homepage.akutNoticeReopenLabel') }}
    </button>
  </div>
</template>

<script>
// Content version for the single localStorage close-entry (criterion 5): bump
// this whenever the notice's copy changes so a visitor who closed the old
// wording sees the corrected one again.
const CONTENT_VERSION = 'v1';
const STORAGE_KEY = 'akutSprechstundeNoticeClosedAt';

// The notice is shown from go-live through 31.03.2027 and hidden completely
// from 01.04.2027 (criterion 17; customer, 2026-10-07: "Hinweis ab sofort bis
// Ende März passt"). Month is 0-indexed, so month 3 is April.
const NOTICE_END_DATE = new Date(2027, 3, 1);

export default {
  name: 'AkutSprechstundeNotice',
  data() {
    return {
      // Starts closed so the generated static HTML (criterion 9) never shows
      // an open-then-close flash for a visitor who already dismissed it;
      // mounted() (client-only) decides the real state.
      dialogOpen: false,
      pillVisible: false,
      headlineId: 'akut-sprechstunde-notice-headline',
    };
  },
  mounted() {
    if (this.isExpired()) {
      this.dialogOpen = false;
      this.pillVisible = false;
      return;
    }

    if (this.hasBeenClosed()) {
      this.dialogOpen = false;
      this.pillVisible = true;
    } else {
      this.dialogOpen = true;
      this.pillVisible = false;
    }
  },
  methods: {
    isExpired() {
      return new Date() >= NOTICE_END_DATE;
    },
    hasBeenClosed() {
      let stored = null;
      try {
        stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      } catch (error) {
        stored = null;
      }
      return !!stored && stored.version === CONTENT_VERSION;
    },
    close() {
      this.dialogOpen = false;
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            version: CONTENT_VERSION,
            closedAt: new Date().toISOString(),
          }),
        );
      } catch (error) {
        // localStorage can be unavailable (private mode); closing still
        // works for this visit, it just is not remembered for the next one.
      }
      if (!this.isExpired()) {
        this.pillVisible = true;
      }
    },
    reopen() {
      this.dialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.akut-notice {
  // Vuetify centers v-dialog's content vertically by default; variant A
  // anchors the notice near the top of the viewport instead.
  ::v-deep .v-dialog__content {
    align-items: flex-start;
    padding-top: 4rem;
  }

  &__card {
    position: relative;
    border-radius: 10px !important;
  }

  &__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  &__overline {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  &__dash {
    width: 1.25rem;
    height: 2px;
    background-color: var(--v-dark-green-base);
    display: inline-block;
  }

  &__headline {
    font-family: 'Roboto Serif', serif;
    font-weight: 700;
    font-size: 2rem;
    line-height: 1.1;
    color: var(--v-primary-base);
    margin: 0.75rem 0 0;
  }

  &__validity {
    font-weight: 700;
    font-size: 1.05rem;
    margin-top: 0.6rem;
  }

  &__rule {
    border: none;
    border-top: 1px solid var(--v-mint-blue-base);
    margin: 1.25rem 0;
  }

  &__body {
    font-size: 1rem;
    line-height: 1.5;
    margin: 0 0 1.25rem;
  }

  &__emphasis {
    text-align: center;
    font-weight: 700;
    font-size: 1.2rem;
    line-height: 1.4;
    margin: 0 0 1.5rem;

    .akut-notice__highlight {
      color: var(--v-secondary-base);
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }
  }

  &__contact {
    border-radius: 6px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
  }

  &__contact-intro {
    margin: 0 0 0.75rem;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  &__hours {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 0.5rem !important;
  }

  &__phone {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 900;
    font-size: 1.75rem;
    text-decoration: none;
  }

  &__closing {
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
  }

  &__pill {
    position: fixed;
    top: 1.25rem;
    right: 1.5rem;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    border-radius: 999px;
    padding: 0.5rem 1rem 0.5rem 0.75rem;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
  }

  &__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: var(--v-info-text-base);
    display: inline-block;
  }
}
</style>

<template>
  <div class="akut-notice">
    <!-- Not a v-dialog/v-overlay: Vuetify 3 gates both components' slot
    content behind `useHydration()` (components/AkutSprechstundeNotice.vue
    finding, 2026-10-09 Tester round) - it never renders during `nuxt
    generate`'s SSR pass no matter the `eager` prop, so the headline/phone
    text required in `dist/index.html` (criterion 9) would never be there.
    This plain, always-rendered markup (hidden via `v-show`, which only ever
    toggles an inline `display:none` and never removes the element) keeps
    the dialog's own role/aria-modal/focus-trap/Escape/overlay-click
    behaviour (criterion 7) without that gate. `v-card`/`v-btn` are kept -
    only `VOverlay`/`VDialog` use `useHydration` (confirmed: `grep -rl
    useHydration node_modules/vuetify/lib/components/` lists only
    `VOverlay` and `VNoSsr`). -->
    <div
      class="akut-notice__overlay"
      v-show="dialogOpen"
      @click.self="close"
      @keydown="onOverlayKeydown"
    >
      <v-card
        ref="dialogCard"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="headlineId"
        class="akut-notice__card pa-7 pa-sm-8"
      >
        <v-btn
          ref="closeBtn"
          icon
          class="akut-notice__close"
          :aria-label="$t('homepage.akutNoticeCloseLabel')"
          @click="close"
        >
          <img src="/cross.svg" alt="" />
        </v-btn>
        <div class="akut-notice__overline text-primary">
          <span class="akut-notice__dash"></span>
          {{ $t('homepage.akutNoticeOverline') }}
        </div>
        <h2 :id="headlineId" class="text-h1 akut-notice__headline">
          {{ $t('homepage.akutNoticeHeadline') }}
        </h2>
        <div class="akut-notice__validity text-primary">
          {{ $t('homepage.akutNoticeValidity') }}
        </div>
        <hr class="akut-notice__rule" />
        <p class="akut-notice__body">
          {{ $t('homepage.akutNoticeBody') }}
        </p>
        <p class="akut-notice__emphasis text-primary">
          {{ $t('homepage.akutNoticeEmphasisBefore') }}
          <span class="akut-notice__highlight">{{
            $t('homepage.akutNoticeEmphasisHighlight')
          }}</span>
          {{ $t('homepage.akutNoticeEmphasisAfter') }}
        </p>
        <div class="akut-notice__contact bg-primary text-white">
          <p class="akut-notice__contact-intro">
            {{ $t('homepage.akutNoticeContactIntro') }}
          </p>
          <p class="akut-notice__hours">
            <img src="/clock-white.svg" alt="" width="20" height="20" />
            {{ $t('homepage.akutNoticeHours') }}
          </p>
          <a class="akut-notice__phone text-white" href="tel:+49211285009">
            <img src="/phone-white.svg" alt="" width="22" height="22" />
            {{ $t('homepage.akutNoticePhone') }}
          </a>
        </div>
        <p class="akut-notice__closing">
          {{ $t('homepage.akutNoticeClosingLine1') }}<br />
          <strong>{{ $t('homepage.akutNoticeClosingLine2') }}</strong>
        </p>
      </v-card>
    </div>

    <button
      v-if="pillVisible"
      type="button"
      class="akut-notice__pill bg-info text-info-text"
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
      // The element focused before the dialog opened (criterion 7: focus
      // returns there on close); only ever read/written client-side.
      previouslyFocusedEl: null,
    };
  },
  watch: {
    // Every path that flips dialogOpen - the X button's close(), Escape and
    // an overlay click (both handled by onOverlayKeydown/@click.self below,
    // criterion 4) - ends up here, the one place persistence and the focus
    // trap run, instead of duplicating either in three handlers (Reviewer
    // finding, Christian 2026-10-09). Vue only fires this when dialogOpen
    // actually changes value, so mounted()'s own false -> false assignments
    // (already-closed, or expired) never trigger it - only a real
    // open -> closed or closed -> open transition does.
    dialogOpen(isOpen) {
      if (isOpen) {
        this.trapFocus();
      } else {
        this.persistClose();
        this.releaseFocus();
      }
    },
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
      } catch {
        stored = null;
      }
      return !!stored && stored.version === CONTENT_VERSION;
    },
    // Writes the single localStorage close-entry and shows the re-open
    // pill; called by the dialogOpen watcher for every path that closes the
    // dialog (X button, Escape, overlay click), so none of them needs its
    // own copy of this logic (criterion 5).
    persistClose() {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            version: CONTENT_VERSION,
            closedAt: new Date().toISOString(),
          }),
        );
      } catch {
        // localStorage can be unavailable (private mode); closing still
        // works for this visit, it just is not remembered for the next one.
      }
      if (!this.isExpired()) {
        this.pillVisible = true;
      }
    },
    close() {
      this.dialogOpen = false;
    },
    reopen() {
      this.dialogOpen = true;
    },
    // Criterion 7: focus moves into the dialog on open, and the page behind
    // it is not reachable while it is open - combined with the overlay
    // covering the full viewport (so a click can't land on anything behind
    // it) and the Tab trap below (so the keyboard can't reach it either).
    // Guarded by `typeof document` (not `window`, already used for
    // localStorage above) so this is a no-op anywhere `document` does not
    // exist - this method only ever runs client-side in the browser.
    trapFocus() {
      if (typeof document === 'undefined') return;
      this.previouslyFocusedEl = document.activeElement;
      document.body.style.overflow = 'hidden';
      this.$nextTick(() => {
        const closeBtnEl = this.$refs.closeBtn && this.$refs.closeBtn.$el;
        if (closeBtnEl) closeBtnEl.focus();
      });
    },
    // Criterion 4: after closing, the page scrolls and focus returns to
    // where it was before opening.
    releaseFocus() {
      if (typeof document === 'undefined') return;
      document.body.style.overflow = '';
      if (
        this.previouslyFocusedEl &&
        typeof this.previouslyFocusedEl.focus === 'function'
      ) {
        this.previouslyFocusedEl.focus();
      }
      this.previouslyFocusedEl = null;
    },
    // Escape closes the dialog (criterion 4); Tab/Shift+Tab cycle only
    // between the dialog's own focusable elements (criterion 7) instead of
    // leaving it - replaces the `persistent`/focus-trap behaviour v-dialog
    // used to provide for free before it was removed (see the template
    // comment on why).
    onOverlayKeydown(event) {
      if (event.key === 'Escape') {
        this.close();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = this.getFocusableElements();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    getFocusableElements() {
      const cardEl = this.$refs.dialogCard && this.$refs.dialogCard.$el;
      if (!cardEl) return [];
      return Array.from(
        cardEl.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.akut-notice {
  // Variant A's overlay: full-viewport scrim, anchored near the top of the
  // viewport (not centered) - `rgba(var(--v-theme-dark-green), 0.6)` is the
  // existing `dark-green` token at variant A's own 0.6 opacity, not a new
  // hex value (criterion 13/20; Vuetify 3 exposes each theme colour as a
  // comma-separated R,G,B custom property for exactly this, confirmed in
  // `node_modules/vuetify/lib/composables/theme.js`'s `genCssVariables`).
  // Hidden by the template's `v-show` (inline `display:none`, overridden by
  // this class's `display:flex` once shown) rather than `v-if`, so it never
  // leaves the DOM - and `dist/index.html` always carries its text
  // (criterion 9).
  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 4rem 1.5rem;
    background-color: rgba(var(--v-theme-dark-green), 0.6);
  }

  &__card {
    position: relative;
    width: 100%;
    max-width: 640px;
    background-color: rgb(var(--v-theme-white));
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
    background-color: rgb(var(--v-theme-dark-green));
    display: inline-block;
  }

  &__headline {
    // Size/weight/line-height/font-family come from the site's existing
    // "text-h1" Vuetify typography class (assets/variables.scss $headings),
    // the same pattern Services.vue/AboutUs.vue/Contact.vue/Team.vue use for
    // their own headings - not redeclared here (Reviewer finding: a literal
    // 'Roboto Serif' font-family in this file was a brand-new reference to
    // an unlicensed font; reusing the pre-existing class avoids adding one).
    color: rgb(var(--v-theme-primary));
    margin: 0.75rem 0 0;
  }

  &__validity {
    font-weight: 700;
    font-size: 1.05rem;
    margin-top: 0.6rem;
  }

  &__rule {
    border: none;
    border-top: 1px solid rgb(var(--v-theme-mint-blue));
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
      color: rgb(var(--v-theme-secondary));
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
    background-color: rgb(var(--v-theme-info-text));
    display: inline-block;
  }
}
</style>

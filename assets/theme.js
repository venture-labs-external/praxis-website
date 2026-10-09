const themeLight = {
  primary: '#0C2750',
  secondary: '#039BE5',
  beige: '#FEF7EA',
  'dark-green': '#738F81',
  'mint-blue': '#D0E2DE',
  'dark-gray': '#424C63',
  white: '#FFFFFF',
  info: '#FFE1A8',
  'info-text': '#5E410D',
  'light-green': '#D0E2DE',
};

export default themeLight;

// Vuetify-behaviour tokens (20261009-praxis-gerresheim-last-differences-to-
// the-live-s): restore three Vuetify 2 defaults that Vuetify 3 changed,
// named here instead of being literals in options/vuetify.options.js -
// "nicht hardcodest... sondern... in so ein kleines Theme" (Christian
// Wenzel, 2026-10-09).

// Vuetify 2's `icon` boolean prop on `v-btn` always rendered flat and
// transparent (no background, no elevation); Vuetify 3's `icon` prop only
// changes the shape - the background/elevation comes from the separate
// `variant` prop, whose own default ('elevated') gave every `<v-btn icon>`
// in this app (the FlipCard arrow/close buttons, the Impressum dialog's
// close cross) a white circular background and a box-shadow that got
// stronger on hover. `'text'` has neither.
export const iconButtonVariant = 'text';

// Vuetify 3's `v-overlay`/`v-dialog` scrim defaults to `--v-overlay-opacity:
// 0.32` (black) - lighter than Vuetify 2's own historical dialog overlay,
// measured against the `main` branch's build by tools/visual-parity.
export const dialogScrimOpacity = 0.46;

// Vuetify 3's theme `variables['hover-opacity']` defaults to 0.04; Vuetify
// 2's own historical hover-state strength (the "Termin buchen" nav button's
// hover colour, among others) was roughly double that, measured against the
// `main` branch's build by tools/visual-parity.
export const hoverOpacity = 0.08;

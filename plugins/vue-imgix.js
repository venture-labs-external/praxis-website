import Vue from 'vue';
import VueImgix from 'vue-imgix';

const getDomain = () => {
  switch (window.location.href) {
  case 'http://localhost:3000/': {
    return 'dev-advisor.volunteerworld.com';
  }
  case 'https://dev-advisor.volunteerworld.com/': {
    return 'dev-advisor-volunteerworld.imgix.net';
  }
  default: {
    return 'advisor-volunteerworld.imgix.net';
  }
  }
};

Vue.use(VueImgix, {
  domain: getDomain(),
  defaultIxParams: {
    auto: 'format',
    format: 'webp',
  },
});

import Vue from 'vue';

import reveal from '~/utils/reveal';

Vue.directive('reveal', reveal.createRevealDirective());

import { extend, ValidationProvider } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

// install rules and localization
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
});

export default {
  components: {
    ValidationProvider,
  },
};

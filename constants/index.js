export const CONTACT_DATA = {
  address: 'Neunzigstraße 1, 40625 Düsseldorf',
  phone: '0211-285009',
};

export const NAMES = {
  drRahelKorbmacher: 'Dr. med. Rahel Korbmacher',
  drHeikeWeydandt: 'Dr. med. Heike Weydandt',
  ChristineEngberg: 'Christine Engberg',
};

export const WORKING_TIME = [
  {
    title: 'Öffnungszeiten Dr. med. R.Korbmacher',
    icon: 'clock',
    workingTime: [
      {
        day: 'Mo.,Mi. & Fr.',
        hours: '08 -13 Uhr',
      },
      {
        day: 'Di.',
        hours: '14 - 19 Uhr',
      },
      {
        day: 'Do.',
        hours: '14 - 18 Uhr',
      },
    ],
  },
  {
    title: 'Öffnungszeiten Dr. med. H.Weydandt',
    icon: 'clock',
    workingTime: [
      {
        day: 'Mo. & Mi.',
        hours: '14 - 19 Uhr',
      },
      {
        day: 'Do. & Di.',
        hours: '08 - 13 Uhr',
      },
    ],
  },
  {
    title: 'Kontakt',
    icon: 'phone',
    contact: [
      {
        contactType: 'phone',
        type: 'Telefon',
        details: '0211 - 28 500 9',
      },
      {
        contactType: 'fax',
        type: 'Fax',
        details: '0211 - 29 26 761',
      },
    ],
  },
];

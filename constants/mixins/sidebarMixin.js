export default {
  data() {
    return {
      userMenuVisible: false,
      userMenuItems: [
        {
          title: 'Settings',
          icon: 'mdi-account',
          onClick: () => this.$router.push('/settings'),
        },
        {
          title: 'Other settings',
          icon: 'mdi-domain',
          onClick: () => this.$router.push('/settings'),
        },
      ],
      sidebarIcons: [
        {
          icon: 'mdi-home',
          linkTo: '/home/',
        },
        {
          icon: 'mdi-magnify',
          linkTo: '/magnify',
        },
        {
          icon: 'mdi-plus-circle-outline',
          linkTo: '/plus',
        },
        {
          icon: 'mdi-account-multiple',
          linkTo: '/people',
        },
        {
          icon: 'mdi-help',
          linkTo: '/help',
        },
        {
          icon: 'mdi-bell',
          linkTo: '/bell',
        },
      ],
      sidebarItems: {
        settings: [
          {
            icon: 'mdi-account-tie',
            title: 'Sidebar item 1',
            linkTo: 'employees',
          },
          {
            icon: 'mdi-briefcase',
            title: 'Sidebar item 1',
            linkTo: 'freelancers',
          },
          {
            icon: 'mdi-account-group',
            title: 'Sidebar item 2',
            linkTo: 'teams',
          },
          {
            icon: 'mdi-calendar-account',
            title: 'Sidebar item 3',
            linkTo: 'guests',
          },
          {
            icon: 'mdi-account-multiple',
            title: 'Sidebar item 4',
            linkTo: 'contacts',
          },
        ],
        home: [
          {
            icon: 'mdi-close',
            title: 'example item 1',
            linkTo: 'employees',
          },
          {
            icon: 'mdi-church',
            title: 'example item 2',
            linkTo: 'freelancers',
          },
          {
            icon: 'mdi-adobe-acrobat',
            title: 'example item 3',
            linkTo: 'teams',
          },
          {
            icon: 'mdi-cigar',
            title: 'example item 4',
            linkTo: 'guests',
          },
          {
            icon: 'mdi-dog-side',
            title: 'example item 5',
            linkTo: 'contacts',
          },
        ],
      },
    };
  },
  methods: {
    drawerContentLinks(item) {
      // if (this.$route.params.company) {
      //   return `/${this.$route.params.company}/${item}`;
      // }
      // return `/company-name/${item}`;

      return item;
    },
  },
  computed: {
    activeArea() {
      switch (this.$route.path) {
      default: {
        return {
          appBarTitle: 'Change title in constans/mixins/sidabarMixin.js depending on a route',
          sidebar: this.sidebarItems.home,
        };
      }
      case '/':
      case '/home/': {
        return {
          appBarTitle: 'Home page title',
          sidebar: this.sidebarItems.home,
        };
      }
      case '/settings': {
        return {
          appBarTitle: 'Settings app bar title',
          sidebar: this.sidebarItems.settings,

        };
      }
      }
    },
  },

};

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost/',
      ],
      staticDistDir: './dist',
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'http://http://lighthouse.wenzel-consulting.io/',
      // token: process.env.LHCI_SERVER_TOKEN,
    },
  },
};

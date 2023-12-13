// next.config.js
module.exports = {
    // Customizing the webpack config
    webpack: (config) => {
      // Set file watcher polling interval to 300 milliseconds
      config.watchOptions.poll = 300;
      return config;
    },
    // Other configurations can be added based on your requirements
  };
  
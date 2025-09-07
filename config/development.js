// Configuración de desarrollo para SoFinance
module.exports = {
  // URLs de desarrollo
  urls: {
    web: 'http://localhost:3000',
    mobile: 'http://localhost:8081',
    api: 'http://localhost:3000'
  },

  // Configuración de puertos
  ports: {
    web: 3000,
    expo: 8081,
    metro: 8081
  },

  // Configuración de hot reload
  hotReload: {
    enabled: true,
    fastRefresh: true,
    webpackHMR: true
  },

  // Configuración de debugging
  debug: {
    enabled: true,
    logLevel: 'debug',
    showDevMenu: true
  },

  // Configuración de plataformas
  platforms: {
    web: true,
    ios: true,
    android: true
  },

  // Configuración de build
  build: {
    mode: 'development',
    sourceMap: true,
    minify: false
  }
};

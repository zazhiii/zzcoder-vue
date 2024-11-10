const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 7070,
    host: '0.0.0.0', // 允许从任何 IP 访问
    allowedHosts: 'all',
  }
})

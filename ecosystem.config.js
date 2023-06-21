module.exports = {
  apps: [{
    name: 'pay-paper-decrypter',
    script: './index.js',
    instances: 2,
    exec_mode: 'cluster',
    wait_ready: true,
    listen_timeout: 5000
  }]
};
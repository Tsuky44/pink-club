const path = require('path');

const projectRoot = process.env.PM2_CWD || path.resolve(__dirname);

module.exports = {
  apps: [{
    name: 'pink-club',
    script: './node_modules/.bin/next',
    args: 'start',
    cwd: projectRoot,
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 6789,
      HOST: '0.0.0.0'
    },
    error_file: './logs/pink-club-error.log',
    out_file: './logs/pink-club-out.log',
    log_file: './logs/pink-club-combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    merge_logs: true
  }]
};

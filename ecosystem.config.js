module.exports = {
  apps: [{
    name: 'pink-club',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -H 0.0.0.0 -p 3000',
    cwd: '/var/www/pink-club',
    env: {
      NODE_ENV: 'production'
    },
    // Options PM2 recommandées
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // Logs
    log_file: '/var/log/pm2/pink-club.log',
    out_file: '/var/log/pm2/pink-club-out.log',
    error_file: '/var/log/pm2/pink-club-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Redémarrage intelligent
    min_uptime: '10s',
    max_restarts: 5,
    // Kill timeout
    kill_timeout: 5000,
    // Listen timeout
    listen_timeout: 10000,
  }]
};

// PM2 menjaga server tetap hidup & otomatis menyala ulang bila crash.
//   cd backend && npm ci --omit=dev
//   pm2 start ../deploy/pm2/ecosystem.config.js --env production
//   pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: 'apajurusanku',
      cwd: './backend',
      script: 'src/server.js',
      instances: 1,                 // SQLite cocok untuk satu proses penulis
      autorestart: true,
      max_memory_restart: '300M',
      env_production: {
        NODE_ENV: 'production',
        SAJIKAN_FRONTEND: 'false',  // frontend disajikan Nginx
      },
    },
  ],
};

module.exports = {
  apps: [
    {
      name: "limco-lms",
      cwd: "/var/www/limco-lms",
      script: "npm",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "700M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};

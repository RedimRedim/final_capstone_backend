module.exports = {
  apps: [
    {
      name: "testapi", // Name of your app
      script: "./src/api/testapi.js", // Path to your main app file (entry point)

      // Common environment variables that are used in both development and production
      env: {
        NODE_ENV: "development", // Default environment is development
        PORT: 2000, // Port for development (can be anything)
        API_URL: "http://localhost:2000", // Development API URL
      },

      // Environment-specific variables for production
      env_production: {
        NODE_ENV: "production",
        PORT: 2000, // Commonly used port in production (or use Railway's dynamic port)
        API_URL: "https://finalcapstonebackend-production.up.railway.app", // Production API URL
      },
      // You can also add other PM2-specific settings, like instances, auto restart, etc.
      instances: 1, // Number of instances to run (you can scale horizontally if needed)
      autorestart: true, // PM2 will automatically restart the app if it crashes
      watch: false, // Set to true if you want to watch for changes in development mode (not recommended in production)
      max_memory_restart: "1G", // Restart app if it exceeds 1GB memory usage
    },
  ],
};

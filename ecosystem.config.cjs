module.exports = {
  apps: [
    {
      name: "ReviveDatabaseService",
      namespace: "revive-database-service",
      script: "./src/index.js",
      watch: ["./src", "./src/*.js"],
      output: "./logs/out.log",
      error: "./logs/error.log",
    },
  ],
};

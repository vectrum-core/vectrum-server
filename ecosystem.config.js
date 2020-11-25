module.exports = {
  apps: [{
    name: "VectrumServer",
    script: './bin/vectrum-server',
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }],
};

export const CONFIG = {
  development: {
    app: {
      name: "Platfox OTB Fulfillment API",
      port: process.env.PORT || 3000,
    },
    database: {
      mongo: {
        auth: "",
        database: "platfoxOTB",
        host: "mongodb://localhost:",
        port: 27017,
      },
    },
  },
  production: {
    app: {
      name: "Platfox OTB Fulfillment API",
      port: process.env.PORT || 3000,
    },
    database: {
      mongo: {
        auth: "?authSource=admin",
        database: "platfoxOTB",
        host: "mongodb://localhost:",
        port: 27017,
      },
    },
  },
};

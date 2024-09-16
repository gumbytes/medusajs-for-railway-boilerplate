const dotenv = require("dotenv");
const { resolve } = require("path");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) { }

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const cloudinaryConfigured = CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET;

const ADMIN_APP_PORT = process.env.PORT || 7001;

const fileServicePlugin = cloudinaryConfigured
  ? {
    resolve: `medusa-file-cloudinary`,
    options: {
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    },
  }
  : {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  };
  const STRIPE_API_KEY = "sk_test_51OClCgHA9zjqz4pzaTJP6Kkw11Gx8AflF0uddSWxzCgZeNE60S2IM1Tun7vfxuYkouC0oqiIE6jbJm2f1ADpIPKh00a37WG9wG";

  const plugins = [
    `medusa-fulfillment-manual`,
    `medusa-payment-manual`,
    {
      resolve: "medusa-payment-stripe",
      options: {
        api_key: STRIPE_API_KEY, // Corrected key name
      },
    },
    fileServicePlugin, // Ensure this is properly declared or imported
    {
      resolve: "@medusajs/admin",
      /** @type {import('@medusajs/admin').PluginOptions} */
      options: {
        autoRebuild: true,
        develop: {
          open: process.env.OPEN_BROWSER !== "false",
          port: process.env.ADMIN_APP_PORT || 7000, // Ensure ADMIN_APP_PORT is defined or set a default
        },
      },
    },
  ];
  

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};

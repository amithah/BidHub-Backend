/**
 * config/env.js
 * @description :: Environment variables configuration
 */

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DB_URL
  },
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
  S3_PRESIGNEDBUCKET:process.env.S3_PRESIGNEDBUCKET,
  S3_PRESIGNEDREGION:process.env.S3_PRESIGNEDREGION,


};

"use strict";

/**
 * logistics-app-user service
 */

// @ts-ignore
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::logistics-app-user.logistics-app-user"
);

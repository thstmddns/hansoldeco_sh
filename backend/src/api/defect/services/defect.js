'use strict';

/**
 * defect service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::defect.defect');

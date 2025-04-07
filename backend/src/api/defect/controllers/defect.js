"use strict";

/**
 * defect controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
// const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = createCoreController("api::defect.defect");
// , ({ strapi }) => ({
//   async create(ctx) {
//     let entity;
//     if (ctx.is("multipart")) {
//       const { data, files } = parseMultipartData(ctx);
//       const uploadedFiles = await strapi
//         .service("api::upload.upload")
//         .upload({ files, data: {} });

//       if (uploadedFiles && uploadedFiles.length > 0) {
//         data.image = uploadedFiles[0].url;
//       }
//     } else {
//       entity = await strapi
//         .service("api::defect.defect")
//         .create(ctx.request.body);
//     }
//     return sanitizeEntity(entity, {
//       model: strapi.getModel("api::defect.defect"),
//     });
//   },
// }));
//{"file_name":"스크린샷 2022-06-27 오후 10.02.47.png","image_url":"/uploads/2022_06_27_10_02_47_80163165a6.png"}

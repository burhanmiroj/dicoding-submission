// const express = require('express')
// const knex = require('../database/index')
// const { body } = require('express-validator')

// const router = express.Router()

// // GET FILE
// router.get("/file-manager/list-file", function (req, res, next) {
//     return new Promise(function (resolve, reject) {
//         knex.select()
//         .from("tb_files")
//         .then((response) => {
//             resolve(
//                 res.json({
//                     data: response,
//                 })
//             );
//         })
//         .catch((error) => reject(error));
//     });
// });

// // FILE UPLOAD
// router.post("/file-manager/upload-file",
//     [
//         body("fileUpload").notEmpty(),
//         body("description").notEmpty()
//     ],
    
//     async (req, res, next) => {

//     if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).json({
//             status: 400,
//             message: "No files were uploaded.",
//         });
//     }

//     const file = req.files.fileUpload

//     let fileName = new Date().getTime() + "-" + file.name

//     const path = __dirname + "/public/filemanager/" + fileName
    
//     // GET FILESIZE
//     let uploadedFileSize = file.size;
//     let fileSizing = new Array('Bytes', 'KB', 'MB', 'GB')
//     let i = 0;
//     while (uploadedFileSize > 900) {
//         uploadedFileSize /= 1024;
//         i++;
//     }

//     let actualSize = (Math.round(uploadedFileSize * 100) / 100)+ ' ' + fileSizing[i];

//     file.mv(path, (err) => {
//         if (err) {
//             // HANDLE ERROR
//             return res.status(500).send(err);
//         } else {
//             // SUCCESS
//             let Datapost = [
//                 {
//                     file: fileName,
//                     description: req.body.description,
//                     size: actualSize,
//                 },
//             ];

//             knex.transaction(function (trx) {
//                 knex("tb_files")
//                     .transacting(trx)
//                     .insert(Datapost)
//                     .then()
//                     .then(trx.commit)
//                     .catch(trx.rollback);
//                 })
//                 .then(function (resp) {
//                     return res.status(200).json({
//                         status: 200,
//                         response: {
//                             fileId: resp,
//                             message: 'File berhasil di upload!',
//                         },
//                     });
//                 })
//                 .catch(function (err) {
//                     return res.status(500).json({
//                         status: 500,
//                         response: err,
//                     });
//                 });
//             }
//         });
//     }
// )
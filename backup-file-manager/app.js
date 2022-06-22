const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser') 
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const knex = require('./database/index')
const { body } = require("express-validator");
const cors = require('cors')
const fs = require("fs");

// INIT
const app = express()
app.use(fileUpload({
    createParentPath: true
}))
app.use(cors())

// VIEW ENGINE
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

// STATIC FILE SERVED
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// PARSING EACH REQUEST
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// GET FILE
app.get("/file-manager/list-file", 
    function (req, res, next) {
        return new Promise(function (resolve, reject) {
        knex
        .select()
        .from("tb_files")
        .then((response) => {
            resolve(
                res.json({
                data: response,
                })
            );
        })
        .catch((error) => reject(error));
    });
});

// FILE UPLOAD
app.post("/file-manager/upload-file",
    [
        body("fileUpload").notEmpty(),
        body("description").notEmpty()
    ],
    async (req, res, next) => {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "No files were uploaded.",
            });
        }

        const file = req.files.fileUpload
        let fileName = new Date().getTime() + "-" + file.name
        // GET FILESIZE
        let uploadedFileSize = file.size;
        let fileSizing = new Array('Bytes', 'KB', 'MB', 'GB')
        let i = 0;
        while (uploadedFileSize > 900) {
            uploadedFileSize /= 1024;
            i++;
        }

        let actualSize = (Math.round(uploadedFileSize * 100) / 100)+ ' ' + fileSizing[i];

        /**
         * SET Default folder to /public/filemanager
        */
        let folderToUpload
        if (req.body.folder_name == '') {
            folderToUpload = './public/filemanager/' + fileName
        } else {
            folderToUpload = './public/filemanager/' + req.body.folder_name + '/' + fileName
        }

        file.mv(folderToUpload, (err) => {
            if (err) {
                // HANDLE ERROR
                return res.status(500).send(err);
            } else {
                if (req.body.folder_name == '') {
                    let DATAPOST_FILE = [
                        {
                            file: fileName,
                            description: req.body.description,
                            folder_name: req.body.folder_name,
                            size: actualSize,
                        },
                    ];
                    // INSERT FILE
                    knex.transaction(function (trx) {
                        knex("tb_files")
                            .transacting(trx)
                            .insert(DATAPOST_FILE)
                            .then()
                            .then(trx.commit)
                            .catch(trx.rollback);
                        })
                        .then(function (resp) {
                            return res.status(200).json({
                                status: 200,
                                response: {
                                    fileId: resp,
                                    message: 'File berhasil di upload!',
                                },
                            });
                        })
                        .catch(function (err) {
                            return res.status(500).json({
                                status: 500,
                                response: err,
                            });
                        }
                    );  
                } else {
                    fs.access(req.body.folder_name, (error) => {
                        // To check if the given directory 
                        // already exists or not
                        if (error) {
                            let DATAPOST_FILE = [
                                {
                                    file: fileName,
                                    description: req.body.description,
                                    folder_name: req.body.folder_name,
                                    size: actualSize,
                                },
                            ];
                            // INSERT FILE
                            knex.transaction(function (trx) {
                                knex("tb_files")
                                    .transacting(trx)
                                    .insert(DATAPOST_FILE)
                                    .then()
                                    .then(trx.commit)
                                    .catch(trx.rollback);
                                })
                                .then(function (resp) {
                                    return res.json({
                                        status: 200,
                                        response: {
                                            fileId: resp,
                                            message: 'File berhasil di upload!',
                                        },
                                    });
                                })
                                .catch(function (err) {
                                    return res.json({
                                        status: 500,
                                        response: err,
                                    });
                                }
                            );  
                            
                        } else {
                            // If current directory does not exist
                            // then create it
                            fs.mkdir(req.body.folder_name, (error) => {                                
                                if (error) {
                                    return res.status(500).json({
                                        status: 500,
                                        response: error,
                                    });
                                }
                            });
                        }
                    });
                } 

            }}
        );
    }
)

// CREATE DIRECTORY
app.post('/file-manager/create-directory', function(req, res) {
    let folderName = "./public/filemanager/" + req.body.folder_name;

    fs.access(folderName, (error) => {
        // To check if the given directory 
        // already exists or not
        if (error) {
            // If current directory does not exist
            // then create it
            fs.mkdir(folderName, (error) => {
                if (error) {
                    return res.status(500).json({
                        status: 500,
                        response: error,
                    });
                } else {
                    // DB Transaction
                    let DATAPOST = {
                        folder_name : req.body.folder_name
                    }
        
                    knex.transaction(function (trx) {
                        knex("tb_folders")
                            .transacting(trx)
                            .insert(DATAPOST)
                            .then()
                            .then(trx.commit)
                            .catch(trx.rollback);
                        })
                        .then(function (resp) {
                            return res.status(200).json({
                                status: 200,
                                response: {
                                    folderId: resp,
                                    message: 'Folder berhasil dibuat!',
                                },
                            });
                        })
                        .catch(function (err) {
                            return res.status(500).json({
                                status: 500,
                                response: err,
                            });
                    });
                }
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: 'Oops! Sepertinya kamu telah membuat folder dengan nama',
                isExist: req.body.folder_name
            });
        }
    });
})

// GET DIRECTORY
app.get('/file-manager/list-directory', function(req, res) {
    return new Promise(function(resolve, reject){
        knex.select()
        // .first()
        .from('tb_folders')
        .then((response) => {
          resolve(
            res.json({
              data: response
            })
          );
        })
        .catch(error => reject(error))
    });
})

// GET SINGLE DIRECTORY
app.get('/file-manager/list-directory/directory-id=:id', function(req, res) {
    return new Promise(function(resolve, reject){
        knex.select()
        .from('tb_folders')
        .where({
            id: req.params.id
        })
        .then((response) => {
            resolve(
                res.json({
                    data: response,
                    message: 'Success get single directory!'
                })
            );
        })
        .catch(error => reject(error))
    });
})

// DELETE DIRECTORY
app.post('/file-manager/delete-directory/directory-name=:folder_name', function(req, res) {
    const dir = './public/filemanager/' + req.params.folder_name;
    
    fs.rm(dir, { recursive: true }, (err) => {
        if (err) {
            return res.json({
                status: 500,
                response: err,
                message: 'Folder tidak ditemukan!'
            });
        } else {
            // API Handler
            // SUCCESS DELETED
            return res.json({
                status: 200,
                message: 'Folder berhasil dihapus!',
            });
        }
    });

    return new Promise(function(resolve, reject){
        knex.select()
        .from('tb_folders')
        .where({
            folder_name: req.params.folder_name
        })
        .del()
        .then((response) => {
            return response
        })
        .catch(error => reject(error))
    });
})

// LISTEN THE APP
const port = process.env.PORT || 9000
app.listen(port, function() {
    console.log('Server is running on http://127.0.0.1:' + port);
})
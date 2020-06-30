var bodyParser = require('body-parser');
var encrypt = require('../utils/encryptUtils');
var responseUtils = require('../utils/responseUtils.js');
const fileUpload = require('express-fileupload');
var multer = require('multer')
var uploadImage = multer({ dest: 'uploads-image/' })
var uploadFile = multer({ dest: 'uploads-file/' })
const API_SERVICES = '/api/file/';
const fs = require('fs');
// parse application/json
module.exports = {
    apis: (app) => {

        return [
            () => {
                /* 
                    title: upload image
                    code:
                        0: success  `
                        1: error
                */
                // app.use(fileUpload());

                app.post(API_SERVICES + 'upload-image', uploadImage.array('files', 12), function (req, res) {
                    if (Object.keys(req.files).length == 0) {
                        res.send(responseUtils.build(1, []));
                    }
                    res.send(responseUtils.build(0, req.files.map(item => {
                        return item.filename + "?name=" + item.originalname + "&type=" + item.mimetype
                    })));
                });
            },
            () => {
                /* 
                    title: view iamge
                    code:
                        0: success
                        1: error
                */
                // let jsonParser = jsonParser.json();
                app.get('/view-image/:id', function (req, res) {
                    let { id } = req.params;
                    let type = req.query.type;
                    let name = req.query.name;
                    let filePath = "uploads-image" + "/" + id;
                    fs.exists(filePath, function (exists) {
                        if (exists) {
                            // Content-type is very interesting part that guarantee that
                            // Web browser will handle response in an appropriate manner.
                            res.writeHead(200, {
                                "Content-Type": type,
                                // "Content-Disposition": "attachment; filename=" + name
                            });
                            fs.createReadStream(filePath).pipe(res);
                        } else {
                            response.writeHead(400, { "Content-Type": "text/plain" });
                            response.end("ERROR File does not exist");
                        }
                    });
                });
                app.get('/view-file/:id.:ext', function (req, res) {
                    let { path, id, ext } = req.params;
                    let type = req.query.type;
                    let filePath = "uploads-file" + "/" + id;
                    fs.exists(filePath, function (exists) {
                        if (exists) {
                            // Content-type is very interesting part that guarantee that
                            // Web browser will handle response in an appropriate manner.
                            res.writeHead(200, {
                                "Content-Type": type,
                                // "Content-Disposition": "attachment; filename=" + id + "." + ext
                            });
                            fs.createReadStream(filePath).pipe(res);
                        } else {
                            res.writeHead(400, { "Content-Type": "text/plain" });
                            res.end("ERROR File does not exist");
                        }
                    });


                });
            },
            () => {
                /* 
                    title: upload file
                    code:
                        0: success
                        1: error
                */
                app.post(API_SERVICES + 'upload-file', uploadFile.array('files', 12), function (req, res) {
                    if (Object.keys(req.files).length == 0) {
                        res.send(responseUtils.build(1, []));
                    }
                    res.send(responseUtils.build(0, req.files.map(item => {
                        return item.filename + "?type=" + item.mimetype + "&name=" + item.originalname
                    })));
                });
            },
            () => {
                /* 
                    title: view file
                    code:
                        0: success
                        1: error
                */
                // let jsonParser = bodyParser.json();
                app.get('/view-file/:id', function (req, res) {
                    let { id } = req.params;
                    let name = req.query.name;
                    let type = req.query.type;
                    let filePath = "uploads-file" + "/" + id;
                    fs.exists(filePath, function (exists) {
                        if (exists) {
                            // Content-type is very interesting part that guarantee that
                            // Web browser will handle response in an appropriate manner.
                            let response = {
                                "Content-Type": type,
                            };
                            let exts = (name || "").split(".");
                            let ext = null;
                            if (exts.length > 1) {
                                ext = exts[exts.length - 1];
                                ext = ext.toLowerCase();
                            }
                            switch (ext) {
                                case "pdf":
                                case "png":
                                case "jpg":
                                case "gif":
                                case "bmp":
                                case "txt":
                                    break;
                                default:
                                    response["Content-Disposition"] = "attachment; filename=" + name
                            }

                            res.writeHead(200, response);
                            fs.createReadStream(filePath).pipe(res);
                        } else {
                            response.writeHead(400, { "Content-Type": "text/plain" });
                            response.end("ERROR File does not exist");
                        }
                    });


                });
            },
        ]
    }
}
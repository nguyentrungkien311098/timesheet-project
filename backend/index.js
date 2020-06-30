var userController = require('./src/apis/user-controller');
var productController = require('./src/apis/product-controller');
var projectController = require('./src/apis/project-controller');
var jobController = require('./src/apis/job-controller');
var timeSheetController = require('./src/apis/timesheet-controller');
var fileController = require('./src/apis/file-controller');
var express = require('express');
const cors = require('cors');
const app = express();
const { authenticate } = require('./src/middleware/authenticate');
var bodyParser = require('body-parser');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


userController.apis(app).forEach(item => {
    item.call(this);
});
productController.apis(app).forEach(item => {
    item.call(this);
})
projectController.apis(app).forEach(item => {
    item.call(this);
})
jobController.apis(app).forEach(item => {
    item.call(this);
})
timeSheetController.apis(app).forEach(item => {
    item.call(this);
})

fileController.apis(app).forEach(item => {
    item.call(this)
})
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("listening at http://%s:%s", host, port)
})
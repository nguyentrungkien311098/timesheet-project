var userController = require('./apis/user-controller');
var productController = require('./apis/product-controller');
var projectController = require('./apis/project-controller');
var jobController = require('./apis/job-controller');
var timeSheetController = require('./apis/timesheet-controller');
var fileController = require('./apis/file-controller');
const cors = require('cors');
const { authenticate } = require('./middleware/authenticate');
var bodyParser = require('body-parser');

module.exports = {
    init(app) {
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
    }
}
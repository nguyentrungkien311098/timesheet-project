var responseUtils = require('../utils/responseUtils');

// First we call the model using the above code.
// We pass in the token from the request header and see if we can get the
// User or not, if not then we return a 401 and if it works we pass next()
var authenticate = (req, res, next) => {
    try {
        var authorization = req.headers.authorization;
        const user = authUtils.getUser(req.headers);
        if (user && user.user && user.user.id) {
            req.user = user.user;
            req.token = authorization;
            next();
        }
        else {
            res.send(responseUtils.build(401, null, "Vui lòng đăng nhập"));
        }
    } catch (error) {
        console.log(error)


        res.send(responseUtils.build(401, error, "Vui lòng đăng nhập"));
    }
}

module.exports = { authenticate }
const encryptUtils = require('./encryptUtils');
module.exports = {
    getUser(header) {
        try {
            var user = encryptUtils.decrypt(header.authorization);
            return user;
        } catch (error) {
            console.log(error)


            return null;
        }
    }
}
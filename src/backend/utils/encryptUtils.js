var CryptoJS = require("crypto-js");
var KEY = "IMA.EDU.VN_ENCRYPT_KEY";
module.exports = {
    encrypt: (obj) => {
        let data = {
            data: obj
        }
        return CryptoJS.AES.encrypt(JSON.stringify(data), KEY).toString();
    },
    decrypt: (obj) => {
        try {
            let data = JSON.parse(CryptoJS.AES.decrypt(obj, KEY).toString(CryptoJS.enc.Utf8));
            return data.data;
        } catch (error) {
            console.log(error)


            return null;
        }
    }
}
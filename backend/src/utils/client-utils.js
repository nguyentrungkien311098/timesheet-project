const axios = require('axios');

const server_url = "http://123.24.206.9:8000"; //dev
// const server_url = "http://123.24.206.9:8000"; //test
// const server_url = "https://api.produce.isofhcare.com"; //release
// const server_url = "http://34.95.91.81"; //stable

const httpClient = axios.create();
httpClient.defaults.timeout = 50000;

String.prototype.getServiceUrl =
    String.prototype.absolute ||
    function (defaultValue) {
        let _this = this ? this.toString() : "";
        if (_this == "")
            if (defaultValue != undefined)
                return defaultValue;
            else
                return _this;
        if (_this.indexOf("http") == 0 || _this.indexOf("blob") == 0) {
            return _this;
        }
        return server_url + _this;
    };

module.exports = {
    auth: "",
    serverApi: server_url,
    uploadFile(url, file) {
        const formData = new FormData();
        formData.append('file', file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': this.auth,
                // 'MobileMode':'vendorPortal'
            }
        }
        return axios.post(url.getServiceUrl(), formData, config)
    },
    requestApi(methodType, url, body) {
        return new Promise((resolve, reject) => {
            console.log("Request url " + url + " with token: " + this.auth);
            if (!body)
                body = {};
            let dataBody = JSON.stringify(body);
            this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (url),
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.auth,
                    'MobileMode': 'user',
                    'deviceType': "mobile"
                }, dataBody).then(s => {
                    if (s.data)
                        resolve(s.data);
                    reject(s);
                }).catch(e => {
                    reject(e);
                });
        });
    },
    requestApi2(methodType, url, body) {
        return new Promise((resolve, reject) => {
            console.log("Request url " + url + " with token: " + this.auth);
            if (!body)
                body = {};
            let dataBody = JSON.stringify(body);
            this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (url),
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.auth,
                    // 'MobileMode': 'user',
                    // 'deviceType': "mobile"
                }, dataBody).then(s => {
                    if (s.data)
                        resolve(s.data);
                    reject(s);
                }).catch(e => {
                    reject(e);
                });
        });
    },
    requestFetch(methodType, url, headers, body) {
        let data = {
            methodType,
            url: url.getServiceUrl(),
            headers,
            body
        };
        console.log(JSON.stringify(data));
        return new Promise((resolve, reject) => {
            let promise = null;
            methodType = (methodType || "").toLowerCase();
            switch (methodType) {
                case "post":
                    promise = httpClient.post(url.getServiceUrl().toString(), body, {
                        headers
                    });
                    break;
                case "get":
                    promise = httpClient.get(url.getServiceUrl().toString(), {
                        headers
                    });
                    break;
                case "put":
                    promise = httpClient.put(url.getServiceUrl().toString(), body, {
                        headers
                    });
                    break;
                case "delete":
                    promise = httpClient.delete(url.getServiceUrl().toString(), {
                        headers
                    });
                    break;
            }

            promise
                .then(json => {
                    console.log(json);
                    if (json.status != 200) {
                        reject(json);
                    } else resolve(json);
                })
                .catch(e => {
                    console.log(e);
                    reject(e);
                });
        });
    }

}

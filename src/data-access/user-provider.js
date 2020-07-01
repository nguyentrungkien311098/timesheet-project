import client from "../utils/client-utils";
import stringUtils from "mainam-react-native-string-utils";
import constants from "../resources/strings";
import datacacheProvider from "./datacache-provider";
import clientUtils from "../utils/client-utils";

export default {
  login(username, password) {
    let object = {
      username,
      password: password.toMd5()
    };
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi("post", constants.api.user.login, object)
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  getDetailUser() {
    return new Promise((resolve, reject) => {
      clientUtils
        .requestApi("get", constants.api.user.detail, {})
        .then(x => {
          resolve(x);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  search(page, size, name, active,birthday, phone, email, role){
    let url = constants.api.user.search + "?";
    url += "page=" + (page || 1) + "&";
    url += "size=" + (size || 10) + "&";
    if (name) url += "name=" + name + "&";
    if (active !== undefined && active != -1)
      url += "active=" + (active ? 1 : 0) + "&";
    if (role) url += "role" + role + "&";
    if (birthday) url += "birthday=" + birthday + "&";
    if (phone) url += "phone=" + phone + "&";
    if (email) url += "email=" + email + "&";
    return client.requestApi("get", url, {});
  }
};

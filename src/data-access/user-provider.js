import client from "../utils/client-utils";
import stringUtils from "mainam-react-native-string-utils";
import constants from "../resources/strings";
import datacacheProvider from "./datacache-provider";
import clientUtils from "../utils/client-utils";

export default {

  getById(id) {
    let url = constants.api.user.detail + "/" + id;
    return client.requestApi("get", url, {});
  },

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
  delete(id) {
    return client.requestApi(
      "delete",
      constants.api.user.delete + "/" + id,
      {}
    );
  },
  reset(id){
    debugger
    return client.requestApi(
      "put",
      constants.api.user.reset + "/" + id,
      {}
    );
  },
  search(page, size, name, active,birthday, phone, email){
    let url = constants.api.user.search + "?";
    url += "page=" + (page || 1) + "&";
    url += "size=" + (size || 10) + "&";
    if (name) url += "name=" + name + "&";
    if (active !== undefined && active != -1)
      url += "active=" + (active ? 1 : 0) + "&";
    if (birthday) url += "birthday=" + birthday + "&";
    if (phone) url += "phone=" + phone + "&";
    if (email) url += "email=" + email + "&";
    return client.requestApi("get", url, {});
  },
  createOrEdit(id, name, active, phone, email, birthday, role, password) {
    if (!id) {
      let url = constants.api.user.create;
      return client.requestApi("post", url, {
        name,
        active: active ? 1 : 0,
        phone,
        email,
        birthday,
        role,
        password: password.toMd5(),
      });
    } else {
      let url = constants.api.user.update + "/" + id;
      return client.requestApi("put", url, {
        name,
        active: active ? 1 : 0,
        phone,
        birthday,
        role,
      });
    }
  },
};

import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.product.get_by_id + "/" + id;
    return client.requestApi("get", url, {});
  },

  search(page, size, name, active, selected) {
    let url = constants.api.product.search + "?";
    url += "page=" + (page || 1) + "&";
    url += "size=" + (size || 10) + "&";
    if (name) url += "name=" + name + "&";
    if (active !== undefined && active != -1)
      url += "active=" + (active ? 1 : 0) + "&";
    if (selected !== undefined) url += "selected=" + (selected ? 1 : 0) + "&";
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.product.delete + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, name, active) {
    if (!id) {
      let url = constants.api.product.create;
      return client.requestApi("post", url, {
        name,
        active: active ? 1 : 0
      });
    } else {
      let url = constants.api.product.update + "/" + id;
      return client.requestApi("put", url, {
        name,
        active: active ? 1 : 0
      });
    }
  },
  setMyProduct(products) {
    let url = constants.api.product.set_my_product;
    return client.requestApi("put", url, {
      products
    });
  }
};

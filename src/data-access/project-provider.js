import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.project.get_by_id + "/" + id;
    return client.requestApi("get", url, {});
  },

  search(page, size, name, active, selected) {
    let url = constants.api.project.search + "?";
    url += "page=" + (page || 1) + "&";
    url += "size=" + (size || 10) + "&";
    if (name) url += "name=" + name + "&";
    if (active !== undefined) url += "active=" + (active ? 1 : 0) + "&";
    if (selected !== undefined) url += "selected=" + (selected ? 1 : 0) + "&";

    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.project.delete + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, name, active) {
    if (!id) {
      let url = constants.api.project.create;
      return client.requestApi("post", url, {
        name,
        active: active ? 1 : 0
      });
    } else {
      let url = constants.api.project.update + "/" + id;
      return client.requestApi("put", url, {
        name,
        active: active ? 1 : 0
      });
    }
  },
  setMyProject(projects) {
    let url = constants.api.project.set_my_project;
    return client.requestApi("put", url, {
      projects
    });
  }
};

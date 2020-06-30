import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
  getById(id) {
    let url = constants.api.job.get_by_id + "/" + id;
    return client.requestApi("get", url, {});
  },
  search(page, size, name, active, selected, sort) {
    let url = constants.api.job.search + "?";
    url += "page=" + (page || 1) + "&";
    url += "size=" + (size || 10) + "&";
    if (name) url += "name=" + name + "&";
    // if (sort) url += "sort=" + sort + "&";
    if (active !== undefined && active !== -1)
      url += "active=" + (active ? 1 : 0) + "&";
    if (selected !== undefined) url += "selected=" + (selected ? 1 : 0) + "&";
    return client.requestApi("get", url, {});
  },
  delete(id) {
    let url = constants.api.job.delete + "/" + id;
    return client.requestApi("delete", url, {});
  },
  createOrEdit(id, name, active) {
    if (!id) {
      let url = constants.api.job.create;
      return client.requestApi("post", url, {
        name,
        active: active ? 1 : 0
      });
    } else {
      let url = constants.api.job.update + "/" + id;
      return client.requestApi("put", url, {
        name,
        active: active ? 1 : 0
      });
    }
  },
  setMyJob(jobs) {
    let url = constants.api.job.set_my_job;
    return client.requestApi("put", url, {
      jobs
    });
  }
};

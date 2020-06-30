import client from "../utils/client-utils";
import constants from "../resources/strings";
import dateUtils from "mainam-react-native-date-utils";
import datacacheProvider from "@data-access/datacache-provider";
export default {
  getById(id) {
    let url = constants.api.timesheet.get_by_id + "/" + id;
    return client.requestApi("get", url, {});
  },

  createOrEdit(
    id,
    date,
    startTime,
    endTime,
    projectId,
    productId,
    jobId,
    description,
    tickets,
    attachments,
    spec
  ) {
    if (!id) {
      let url = constants.api.timesheet.create;
      return client.requestApi("post", url, {
        date,
        startTime,
        endTime,
        projectId,
        productId,
        jobId,
        description,
        tickets,
        attachments: JSON.stringify(attachments || []),
        spec
      });
    } else {
      let url = constants.api.timesheet.update + "/" + id;
      return client.requestApi("put", url, {
        date,
        startTime,
        endTime,
        projectId,
        productId,
        jobId,
        description,
        tickets,
        attachments: JSON.stringify(attachments || []),
        spec
      });
    }
  },
  search(page, size, userId, date, month) {
    let url = constants.api.timesheet.search + "?";
    url += "page=" + (page || 1) + "&";
    url += "size=" + (size || 10) + "&";
    if (userId) url += "userId=" + userId + "&";
    if (date) url += "date=" + date.format("yyyy-MM-dd") + "&";
    if (month) url += "month=" + month.format("yyyy-MM-dd") + "&";
    return client.requestApi("get", url, {});
  },
  delete(id) {
    return client.requestApi(
      "delete",
      constants.api.timesheet.delete + "/" + id,
      {}
    );
  },
  detail(id) {
    return client.requestApi(
      "get",
      constants.api.timesheet.detail + "/" + id,
      {}
    );
  },
  sumaryByYear(userId, year, requestApi) {
    return new Promise((resolve, reject) => {
      if (!requestApi) {
        let sumary = datacacheProvider.read(
          userId,
          constants.key.SUMARY_BY_YEAR,
          []
        );
        if (sumary && sumary.length) {
          this.sumaryByYear(userId, year, true);

          resolve(sumary);
        } else {
          this.sumaryByYear(userId, year, true)
            .then(s => {
              resolve(s);
            })
            .catch(e => {
              resolve([]);
            });
        }
      } else {
        client
          .requestApi(
            "get",
            constants.api.timesheet.sumary_year + "?year=" + year,
            {}
          )
          .then(s => {
            if (s.code == 0) {
              datacacheProvider.save(
                userId,
                constants.key.SUMARY_BY_YEAR,
                s.data
              );

              resolve(s.data);
            } else {
              resolve([]);
            }
          })
          .catch(e => {
            resolve([]);
          });
      }
    });
  },
  sumaryByMonth(userId, month, requestApi) {
    return new Promise((resolve, reject) => {
      if (!requestApi) {
        let sumary = datacacheProvider.read(
          userId,
          constants.key.SUMARY_BY_MONTH,
          []
        );
        if (sumary && sumary.length) {
          this.sumaryByMonth(userId, month, true);

          resolve(sumary);
        } else {
          this.sumaryByMonth(userId, month, true)
            .then(s => {
              resolve(s);
            })
            .catch(e => {
              resolve([]);
            });
        }
      } else {
        client
          .requestApi(
            "get",
            constants.api.timesheet.sumary_month +
              "?month=" +
              month.format("yyyy/MM/dd HH:mm:ss"),
            {}
          )
          .then(s => {
            if (s.code == 0) {
              datacacheProvider.save(
                userId,
                constants.key.SUMARY_BY_MONTH,
                s.data
              );

              resolve(s.data);
            } else {
              resolve([]);
            }
          })
          .catch(e => {
            resolve([]);
          });
      }
    });
  },
  sumaryByDay(userId, day, requestApi) {
    return new Promise((resolve, reject) => {
      if (!requestApi) {
        let sumary = datacacheProvider.read(
          userId,
          constants.key.SUMARY_BY_DAY,
          []
        );
        if (sumary && sumary.length) {
          this.sumaryByDay(userId, day, true);
          resolve(sumary);
        } else {
          this.sumaryByDay(userId, day, true)
            .then(s => {
              resolve(s);
            })
            .catch(e => {
              resolve([]);
            });
        }
      } else {
        client
          .requestApi(
            "get",
            constants.api.timesheet.sumary_day +
              "?day=" +
              day.format("yyyy/MM/dd HH:mm:ss"),
            {}
          )
          .then(s => {
            if (s.code == 0) {
              datacacheProvider.save(
                userId,
                constants.key.SUMARY_BY_DAY,
                s.data
              );

              resolve(s.data);
            } else {
              resolve([]);
            }
          })
          .catch(e => {
            resolve([]);
          });
      }
    });
  }
};

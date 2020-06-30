const TB_TABLE = "tb_timesheet";
const dateUtils = require("mainam-react-native-date-utils");
const db = require("../database");

module.exports = {
  search(page, size, userId, date, month) {
    return new Promise((resolve, reject) => {
      try {
        if (!page) page = 1;
        if (!size) size = 10;
        size = parseInt(size);
        let sql = `select * from view_timesheet where 1=1 `;
        if (userId && userId.trim()) {
          sql += ` and userId = '${userId}'`;
        }
        if (date) {
          date = date.toDateObject();
          sql += `and fromDate BETWEEN '${date.format(
            "yyyy-MM-dd 00:00:00"
          )}' and  '${date.format("yyyy-MM-dd 23:59:59")}' `;
        } else {
          if (month) {
            month = month.toDateObject();
            let fromMonth = month.getFirstDateOfMonth();
            let toMonth = month.getLastDateOfMonth();
            sql += `and fromDate BETWEEN '${fromMonth.format(
              "yyyy-MM-dd 00:00:00"
            )}' and  '${toMonth.format("yyyy-MM-dd 23:59:59")}' `;
          }
        }

        sql += `order by fromDate, toDate`;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        console.log(error);

        reject(error);
      }
    });
  },
  checkDuplicateTime(userId, id, startTime, endTime) {
    return new Promise((resolve, reject) => {
      try {
        let sql = `select * from ${TB_TABLE} where id != '${id}' and 
                userId = N'${userId}' and 
                (
                    (fromDate <= N'${startTime}' and toDate > N'${startTime}') or
                    (fromDate < N'${endTime}' and toDate >= N'${endTime}') or
                    (fromDate <= N'${startTime}' and toDate >= N'${endTime}') or
                (fromDate >= N'${startTime}' and toDate <= N'${endTime}'))`;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) resolve(true);
            else resolve(false);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getById(id) {
    return new Promise((resolve, reject) => {
      try {
        let sql = `select * from view_timesheet where id = '${id}'`;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) resolve(result[0]);
            else resolve(null);
          }
        });
      } catch (error) {
        console.log(error);

        reject(error);
      }
    });
  },
  delete(id) {
    return new Promise((resolve, reject) => {
      try {
        let sql = `delete from ${TB_TABLE} where id = '${id}'`;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } catch (error) {
        console.log(error);

        reject(error);
      }
    });
  },
  /*reject 
        0: not found
        1: không có quyền       
        2: start time phải lớn hơn endtime
        3: trung thoi gian
    */

  createOrEdit(
    user,
    id,
    date,
    startTime,
    endTime,
    projectId,
    productId,
    jobId,
    description,
    tickets,
    data,
    attachments,
    spec
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        if (startTime.toDateObject() >= endTime.toDateObject()) {
          reject(2);
          return;
        }
        let fromDate =
          date.toDateObject().format("yyyy-MM-dd") +
          " " +
          startTime.toDateObject().format("HH:mm:ss");
        let toDate =
          date.toDateObject().format("yyyy-MM-dd") +
          " " +
          endTime.toDateObject().format("HH:mm:ss");
        let duplicate = await this.checkDuplicateTime(
          user.user.id,
          id,
          fromDate,
          toDate
        );
        if (duplicate == null) {
          reject({});
          return;
        } else {
          if (duplicate) {
            reject(3);
            return;
          }
        }
        let createdDate = new Date().format("yyyy-MM-dd HH:mm:ss");
        if (id) {
          let timeSheet = await this.getById(id);
          if (timeSheet) {
            if (user.user.id != timeSheet.userId) {
              reject(1);
              return;
            }
            let sql = `update  ${TB_TABLE} set 
                        fromDate=?, 
                        toDate=?, 
                        projectId=?, 
                        productId=?, 
                        jobId=?, 
                        description=?, 
                        attachments=?, 
                        spec=?, 
                        tickets=?, 
                        updatedDate=?,
                        data=? 
                        where id = ?`;
            db.queryWithParam(
              sql,
              [
                fromDate,
                toDate,
                projectId,
                productId,
                jobId,
                description,
                attachments || "",
                spec || "",
                (tickets || []).length ? tickets.join(",") : "",
                createdDate,
                data,
                id,
              ],
              function (err, result) {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          } else {
            reject(0);
          }
        } else {
          var sql = `insert into ${TB_TABLE} (userId, projectId, productId, jobId, fromDate, toDate, createdDate, updatedDate, percentToCore, description, data, tickets, attachments, spec) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
          db.queryWithParam(
            sql,
            [
              parseInt(user.user.id),
              parseInt(projectId),
              parseInt(productId),
              parseInt(jobId),
              fromDate,
              toDate,
              createdDate,
              createdDate,
              0,
              description,
              null,
              (tickets || []).length ? tickets.join(",") : "",
              attachments,
              spec,
            ],
            function (err, result) {
              if (err) reject(err);
              else resolve(result);
            }
          );
        }
      } catch (error) {
        console.log(error);

        reject(error);
      }
    });
  },
  sumaryByYear(userId, year) {
    return new Promise(async (resolve, reject) => {
      try {
        let start = Number(year) + "/1/1 0:0:0";
        let end = Number(year) + 1 + "/1/1 0:0:0";
        let sql = `select * from view_timesheet where userId = N'${userId}' and 
            (fromDate >= N'${start}' and toDate < N'${end}')
            `;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) {
              let obj = {};
              result.forEach((item) => {
                if (!obj[item.projectId + "-" + item.productId]) {
                  obj[item.projectId + "-" + item.productId] = {
                    projectId: item.projectId,
                    productId: item.productId,
                    projectName: item.projectName,
                    productName: item.productName,
                    time: 0,
                  };
                }
                obj[item.projectId + "-" + item.productId].time +=
                  item.toDate - item.fromDate;
              });
              let arr = [];
              for (let x in obj) {
                arr.push(obj[x]);
              }
              resolve(arr);
            } else resolve([]);
          }
        });
      } catch (error) {}
    });
  },
  sumaryByMonth(userId, month) {
    return new Promise(async (resolve, reject) => {
      try {
        let year = month.getFullYear();
        month = month.getMonth() + 1;
        let start = Number(year) + "/" + month + "/1 0:0:0";
        let end =
          Number(year) +
          (month == 12 ? 1 : 0) +
          "/" +
          (month == 12 ? 1 : month + 1) +
          "/1 0:0:0";
        let sql = `select * from view_timesheet where userId = N'${userId}' and 
            (fromDate >= N'${start}' and toDate < N'${end}')
            `;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) {
              let obj = {};
              result.forEach((item) => {
                if (!obj[item.projectId + "-" + item.productId]) {
                  obj[item.projectId + "-" + item.productId] = {
                    projectId: item.projectId,
                    projectName: item.projectName,
                    productName: item.productName,
                    productId: item.productId,
                    time: 0,
                  };
                }
                obj[item.projectId + "-" + item.productId].time +=
                  item.toDate - item.fromDate;
              });
              let arr = [];
              for (let x in obj) {
                arr.push(obj[x]);
              }
              resolve(arr);
            } else resolve([]);
          }
        });
      } catch (error) {}
    });
  },
  sumaryByDay(userId, day) {
    return new Promise(async (resolve, reject) => {
      try {
        let start = day.format("yyyy/MM/dd") + " 0:0:0";
        day.setDate(day.getDate() + 1);
        let end = day.format("yyyy/MM/dd") + " 0:0:0";
        let sql = `select * from view_timesheet where userId = N'${userId}' and 
            (fromDate >= N'${start}' and toDate < N'${end}')
            `;
        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) {
              let obj = {};
              result.forEach((item) => {
                if (!obj[item.projectId + "-" + item.productId]) {
                  obj[item.projectId + "-" + item.productId] = {
                    projectId: item.projectId,
                    projectName: item.projectName,
                    productName: item.productName,
                    productId: item.productId,
                    time: 0,
                  };
                }
                obj[item.projectId + "-" + item.productId].time +=
                  item.toDate - item.fromDate;
              });
              let arr = [];
              for (let x in obj) {
                arr.push(obj[x]);
              }
              resolve(arr);
            } else resolve([]);
          }
        });
      } catch (error) {}
    });
  },
  sumaryByProduct(productId, projectId, month, year) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = "";
        if (!month && !year) {
          sql = `select * from ${TB_TABLE} where productId = N'${productId}' and `;
          if (projectId) {
            sql += `projectId = N'${projectId}'`;
          }
        } else {
          let start = null;
          let end = null;
          if (month) {
            let _year = month.getFullYear();
            let _month = month.getMonth() + 1;
            start = Number(_year) + "/" + _month + "/1 0:0:0";
            end =
              Number(_year) +
              (_month == 12 ? 1 : 0) +
              "/" +
              (_month == 12 ? 1 : _month + 1) +
              "/1 0:0:0";
          } else {
            start = Number(year) + "/1/1 0:0:0";
            end = Number(year) + 1 + "/1/1 0:0:0";
          }
          sql = `select * from ${TB_TABLE} where productId = N'${productId}' and `;
          if (projectId) {
            sql += `projectId = N'${projectId}' and `;
          }
          sql += `(fromDate >= N'${start}' and toDate < N'${end}')`;
        }

        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) {
              let obj = {};
              result.forEach((item) => {
                if (!obj[item.projectId + "-" + item.productId]) {
                  obj[item.projectId + "-" + item.productId] = {
                    projectId: item.projectId,
                    productId: item.productId,
                    users: [],
                  };
                }
                let user = obj[
                  item.projectId + "-" + item.productId
                ].users.find((item2) => item2.id == item.userId);
                if (!user) {
                  obj[item.projectId + "-" + item.productId].users.push({
                    id: item.userId,
                    time: 0,
                  });
                }
                user.time += item.toDate - item.fromDate;
              });
              let arr = [];
              for (let x in obj) {
                arr.push(obj[x]);
              }
              resolve(arr);
            } else resolve([]);
          }
        });
      } catch (error) {}
    });
  },
  sumaryByJob(userId, jobId, month, year) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = "";
        if (!month && !year) {
          sql = `select * from ${TB_TABLE} where userId = N'${userId}' and  jobId = N'${jobId}'`;
        } else {
          let start = null;
          let end = null;
          if (month) {
            let _year = month.getFullYear();
            let _month = month.getMonth() + 1;
            start = Number(_year) + "/" + _month + "/1 0:0:0";
            end =
              Number(_year) +
              (_month == 12 ? 1 : 0) +
              "/" +
              (_month == 12 ? 1 : _month + 1) +
              "/1 0:0:0";
          } else {
            start = Number(year) + "/1/1 0:0:0";
            end = Number(year) + 1 + "/1/1 0:0:0";
          }
          sql = `select * from ${TB_TABLE} where userId = N'${userId}' and  jobId = N'${jobId}' and `;
          sql += `(fromDate >= N'${start}' and toDate < N'${end}')`;
        }

        db.query(sql, function (err, result) {
          if (err) {
            reject(err);
          } else {
            if (result.length) {
              let obj = {};
              result.forEach((item) => {
                if (!obj[item.jobId]) {
                  obj[item.jobId] = {
                    jobId: item.jobId,
                    time: 0,
                  };
                }
                obj[item.jobId].time += item.toDate - item.fromDate;
              });
              let arr = [];
              for (let x in obj) {
                arr.push(obj[x]);
              }
              resolve(arr);
            } else resolve([]);
          }
        });
      } catch (error) {
        resolve([]);
      }
    });
  },
};

var bodyParser = require("body-parser");
var encrypt = require("../utils/encryptUtils");
var responseUtils = require("../utils/responseUtils.js");
//
const TB_TABLE = "tb_timesheet";
const API_SERVICES = "/api/timesheet/";
const authUtils = require("../utils/auth-utils");
const dateUtils = require("mainam-react-native-date-utils");
const timeSheetProvider = require("../data-access/timesheet-provider");

// parse application/json
module.exports = {
  apis: app => {
    return [
      () => {
        /* 
                    title: tạo mới time sheet
                    code:
                        0: success
                        1: khong ton tai
                        2: khong co quyen
                        3: không thành công
                        4: vui lòng đăng nhập
                        5: thoi gian bat dau phai nho hon thoi gian ket thuc
                */
        let jsonParser = bodyParser.json();
        app.post(API_SERVICES + "create", jsonParser, function(req, res) {
          try {
            let {
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
            } = req.body;
            const user = authUtils.getUser(req.headers);
            if (user && user.user && user.user.id) {
              timeSheetProvider
                .createOrEdit(
                  user,
                  null,
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
                )
                .then(s => {
                  if (s.affectedRows) {
                    res.send(
                      responseUtils.build(0, {
                        id: s.insertId
                      })
                    );
                  } else {
                    res.send(responseUtils.build(3, "Thêm không thành công"));
                  }
                })
                .catch(e => {
                  if (e == 0) {
                    res.send(responseUtils.build(1, e, "Không tồn tại"));
                  } else if (e == 1) {
                    res.send(responseUtils.build(2, e, "Không có quyền"));
                  } else {
                    if (e == 2) {
                      res.send(
                        responseUtils.build(
                          5,
                          e,
                          "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc"
                        )
                      );
                    } else {
                      if (e == 3) {
                        res.send(
                          responseUtils.build(
                            5,
                            e,
                            "Đã có công việc trong thời gian bạn chọn"
                          )
                        );
                      } else {
                        res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
                      }
                    }
                  }
                });
            } else {
              res.send(responseUtils.build(4, {}, "Vui lòng đăng nhập"));
            }
          } catch (error) {
            console.log(error);

            res.send(responseUtils.build(500, error, "Xảy ra lỗi"));
          }
        });
      },
      () => {
        /* 
                    title: update timesheet
                    code:
                        0: success
                        1: khong ton tai
                        2: khong co quyen
                        3: không thành công
                        4: vui lòng đăng nhập
                        5: thoi gian bat dau phai nho hon thoi gian ket thuc
                */
        let jsonParser = bodyParser.json();
        app.put(API_SERVICES + "update/:id", jsonParser, function(req, res) {
          try {
            let { id } = req.params;
            if (!id) {
              res.send(responseUtils.build(1, err, "Không tồn tại"));
              return;
            }
            let {
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
            } = req.body;
            const user = authUtils.getUser(req.headers);
            if (user && user.user && user.user.id) {
              timeSheetProvider
                .createOrEdit(
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
                )
                .then(s => {
                  if (s.affectedRows) {
                    res.send(responseUtils.build(0, s[0]));
                  } else {
                    res.send(responseUtils.build(3, "sửa không thành công"));
                  }
                })
                .catch(e => {
                  if (e == 0) {
                    res.send(responseUtils.build(1, e, "Không tồn tại"));
                  } else if (e == 1) {
                    res.send(responseUtils.build(2, e, "Không có quyền"));
                  } else {
                    if (e == 2) {
                      res.send(
                        responseUtils.build(
                          5,
                          e,
                          "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc"
                        )
                      );
                    } else {
                      if (e == 3) {
                        res.send(
                          responseUtils.build(
                            5,
                            e,
                            "Đã có công việc trong thời gian bạn chọn"
                          )
                        );
                      } else {
                        res.send(responseUtils.build(500, ê, "Xảy ra lỗi"));
                      }
                    }
                  }
                });
            } else {
              res.send(responseUtils.build(4, {}, "Vui lòng đăng nhập"));
            }
          } catch (error) {
            console.log(error);

            res.send(responseUtils.build(500, error, "Xảy ra lỗi"));
          }
        });
      },
      () => {
        /* 
                    title: tìm kiếm
                    code:
                        0: success
                        1: login
                        2: access denied,
                        500: exception
                */
        let jsonParser = bodyParser.json();
        app.get(API_SERVICES + "search", jsonParser, function(req, res) {
          try {
            const user = authUtils.getUser(req.headers);
            if (user && user.user && user.user.id) {
              let { page, size, date, userId, month } = req.query;
              if (user.user.id != userId) {
                res.send(responseUtils.build(1, err, "Bạn không có quyền"));
                return;
              }

              timeSheetProvider
                .search(page, size, userId, date, month)
                .then(s => {
                  let total = s.length;
                  if (month) {
                    s = s.map(item => {
                      item.fromDate = item.fromDate.format(
                        "yyyy/MM/dd HH:mm:ss"
                      );
                      item.toDate = item.toDate.format("yyyy/MM/dd HH:mm:ss");
                      item.createdDate = item.createdDate.format(
                        "yyyy/MM/dd HH:mm:ss"
                      );
                      item.updatedDate = item.updatedDate.format(
                        "yyyy/MM/dd HH:mm:ss"
                      );
                      return item;
                    });
                    res.send(responseUtils.build(0, { data: s, total: total }));
                  } else {
                    let start = (page - 1) * size;
                    let arr = s.filter((item, index) => {
                      item.fromDate = item.fromDate.format(
                        "yyyy/MM/dd HH:mm:ss"
                      );
                      item.toDate = item.toDate.format("yyyy/MM/dd HH:mm:ss");
                      item.createdDate = item.createdDate.format(
                        "yyyy/MM/dd HH:mm:ss"
                      );
                      item.updatedDate = item.updatedDate.format(
                        "yyyy/MM/dd HH:mm:ss"
                      );
                      return index >= start && index < start + size;
                    });
                    res.send(
                      responseUtils.build(0, { data: arr, total: total })
                    );
                  }
                })
                .catch(e => {
                  res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
                });
            } else {
              res.send(responseUtils.build(2, {}, "Vui lòng đăng nhập"));
            }
          } catch (error) {
            console.log(error);

            res.send(responseUtils.build(500, error, "Xảy ra lỗi"));
          }
        });
      },
      () => {
        /* 
                    title: xóa timesheet
                    code:
                        0: success
                        1: error
                        2: không có dữ liệu
                */

        let jsonParser = bodyParser.json();
        app.delete(API_SERVICES + "delete/:id", jsonParser, function(req, res) {
          let { id } = req.params;
          timeSheetProvider
            .delete(id)
            .then(s => {
              if (s.affectedRows !== 0) {
                res.send(responseUtils.build(0, s));
                return;
              }
              res.send(responseUtils.build(1, null, "Không có dữ liệu"));
            })
            .catch(e => {
              res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
            });
        });
      },
      () => {
        /* 
                    title: tìm theo id
                    code:
                        0: success
                        1: error
                        2: không có dữ liệu
                */
        let jsonParser = bodyParser.json();
        app.get(API_SERVICES + "detail/:id", jsonParser, function(req, res) {
          let { id } = req.params;
          timeSheetProvider
            .getById(id)
            .then(s => {
              if (s) {
                s.fromDate = s.fromDate.format("yyyy/MM/dd HH:mm:ss");
                s.toDate = s.toDate.format("yyyy/MM/dd HH:mm:ss");
                s.createdDate = s.createdDate.format("yyyy/MM/dd HH:mm:ss");
                s.updatedDate = s.updatedDate.format("yyyy/MM/dd HH:mm:ss");
                res.send(responseUtils.build(0, s));
              } else {
                res.send(responseUtils.build(1, null, "Không có dữ liệu"));
              }
            })
            .catch(e => {
              res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
            });
        });
      },
      
      () => {
        /* 
                    title: tổng hợp theo năm
                    code:
                        0: success
                        1: vui lòng đơn giản
                */
        let jsonParser = bodyParser.json();
        app.get(API_SERVICES + "sumary/year", jsonParser, function(req, res) {
          let { year } = req.query;
          const user = authUtils.getUser(req.headers);
          if (user && user.user && user.user.id) {
            timeSheetProvider
              .sumaryByYear(user.user.id, year)
              .then(s => {
                res.send(responseUtils.build(0, s));
              })
              .catch(e => {
                res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
              });
          } else {
            res.send(responseUtils.build(1, {}, "Vui lòng đăng nhập"));
          }
        });
      },
      () => {
        /* 
                    title: tổng hợp theo month
                    code:
                        0: success
                        1: vui lòng đơn giản
                */
        let jsonParser = bodyParser.json();
        app.get(API_SERVICES + "sumary/month", jsonParser, function(req, res) {
          try {
            let { month } = req.query;
            const user = authUtils.getUser(req.headers);
            if (user && user.user && user.user.id) {
              timeSheetProvider
                .sumaryByMonth(user.user.id, month.toDateObject())
                .then(s => {
                  res.send(responseUtils.build(0, s));
                })
                .catch(e => {
                  res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
                });
            } else {
              res.send(responseUtils.build(1, {}, "Vui lòng đăng nhập"));
            }
          } catch (error) {
            res.send(responseUtils.build(500, error, "Xảy ra lỗi"));
          }
        });
      },
      () => {
        /* 
                    title: tổng hợp theo day
                    code:
                        0: success
                        1: vui lòng đơn giản
                */
        let jsonParser = bodyParser.json();
        app.get(API_SERVICES + "sumary/day", jsonParser, function(req, res) {
          try {
            let { day } = req.query;
            const user = authUtils.getUser(req.headers);
            if (user && user.user && user.user.id) {
              timeSheetProvider
                .sumaryByDay(user.user.id, day.toDateObject())
                .then(s => {
                  res.send(responseUtils.build(0, s));
                })
                .catch(e => {
                  res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
                });
            } else {
              res.send(responseUtils.build(1, {}, "Vui lòng đăng nhập"));
            }
          } catch (error) {
            res.send(responseUtils.build(500, error, "Xảy ra lỗi"));
          }
        });
      },
      () => {
        /* 
                          title: get by id
                          code:
                              0: success
                              1: error
                      */
        let jsonParser = bodyParser.json();
        app.get(API_SERVICES + ":id", jsonParser, function(req, res) {
          let { id } = req.params;
          timeSheetProvider
            .getById(id)
            .then(s => {
              s.fromDate = s.fromDate.format("yyyy/MM/dd HH:mm:ss");
              s.toDate = s.toDate.format("yyyy/MM/dd HH:mm:ss");
              s.createdDate = s.createdDate.format("yyyy/MM/dd HH:mm:ss");
              s.updatedDate = s.updatedDate.format("yyyy/MM/dd HH:mm:ss");
              if (s) res.send(responseUtils.build(0, { data: s }));
              else
                res.send(
                  responseUtils.build(1, null, "Không tìm thấy kết quả phù hợp")
                );
            })
            .catch(e => {
              res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
            });
        });
      }
    ];
  }
};

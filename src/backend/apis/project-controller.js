var bodyParser = require("body-parser");
var encrypt = require("../utils/encryptUtils");
var responseUtils = require("../utils/responseUtils.js");
const TB_TABLE = "tb_project";
const API_SERVICES = "/api/project/";
const authUtils = require("../utils/auth-utils");
const projectProvider = require("../data-access/project-provider");

// parse application/json
module.exports = {
  apis: app => {
    return [
      () => {
        /* 
                    title: tìm kiếm
                    code:
                        0: success
                        1: error,
                        2: vui long dang nhap
                */
        let jsonParser = bodyParser.json();
        app.get(API_SERVICES + "search", jsonParser, function(req, res) {
          let { page, size, name, active, selected } = req.query;
          const user = authUtils.getUser(req.headers);
          let userId = null;
          if (selected) {
            if (!user || !user.user || !user.user.id) {
              res.send(responseUtils.build(2, null, "Vui lòng đăng nhập"));
              return;
            } else {
              userId = user.user.id;
            }
          }
          projectProvider
            .search(page, size, name, active, selected, userId)
            .then(s => {
              let start = (page - 1) * size;
              let total = s.length;
              let arr = s.filter((item, index) => {
                return index >= start && index < start + size;
              });
              res.send(responseUtils.build(0, { data: arr, total: total }));
            })
            .catch(e => {
              res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
            });
        });
      },
      () => {
        /* 
                    title: tạo mới category
                    code:
                        0: success
                        1: khong ton tai id
                        2: da ton tai san pham
                        3: loi
                */
        let jsonParser = bodyParser.json();
        app.post(API_SERVICES + "create", jsonParser, function(req, res) {
          try {
            let { name, active } = req.body;
            projectProvider
              .createOrEdit(null, name, active)
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
                  res.send(
                    responseUtils.build(2, e, "Đã tồn tại tên sản phẩm")
                  );
                } else {
                  res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
                }
              });
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
                        1: khong ton tai id
                        2: không thành công
                */
        let jsonParser = bodyParser.json();
        app.put(API_SERVICES + "update/:id", jsonParser, function(req, res) {
          try {
            let { id } = req.params;
            if (!id) {
              res.send(responseUtils.build(1, err, "Không tồn tại"));
              return;
            }
            let { name, active } = req.body;
            projectProvider
              .createOrEdit(id, name, active)
              .then(s => {
                if (s.affectedRows) {
                  res.send(responseUtils.build(0, s[0]));
                } else {
                  res.send(responseUtils.build(2, "sửa không thành công"));
                }
              })
              .catch(e => {
                if (e == 0) {
                  res.send(responseUtils.build(1, e, "Không tồn tại"));
                } else if (e == 1) {
                  res.send(responseUtils.build(2, e, "Không có quyền"));
                } else {
                  res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
                }
              });
          } catch (error) {
            console.log(error);

            res.send(responseUtils.build(500, error, "Xảy ra lỗi"));
          }
        });
      },
      () => {
        /* 
                    title: xóa product
                    code:
                        0: success
                        1: error
                        2: không có dữ liệu
                */
        let jsonParser = bodyParser.json();
        app.delete(API_SERVICES + "delete/:id", jsonParser, function(req, res) {
          let { id } = req.params;
          projectProvider
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
                    title: set my project
                    code:
                        0: success
                        1: them khong thanh cong,
                        2: vui long dang nhap
                */
        let jsonParser = bodyParser.json();
        app.put(API_SERVICES + "set-my-project", jsonParser, function(
          req,
          res
        ) {
          const user = authUtils.getUser(req.headers);
          if (user && user.user && user.user.id) {
            let { projects } = req.body;
            projectProvider
              .setMyProject(user.user.id, projects || [])
              .then(s => {
                if (s.affectedRows !== 0) {
                  res.send(responseUtils.build(0, s));
                  return;
                }
                res.send(responseUtils.build(1, null, "Cập nhật thành công"));
              })
              .catch(e => {
                res.send(responseUtils.build(500, e, "Xảy ra lỗi"));
              });
          } else {
            res.send(responseUtils.build(2, {}, "Vui lòng đăng nhập"));
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
          projectProvider
            .getById(id)
            .then(s => {
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

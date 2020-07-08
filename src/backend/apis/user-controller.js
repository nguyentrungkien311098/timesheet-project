const clientUtils = require("./../utils/client-utils");
var bodyParser = require("body-parser");
var encrypt = require("../utils/encryptUtils");
var responseUtils = require("../utils/responseUtils.js");
const userProvider = require("../data-access/user-provider");
const roleProvider = require("../data-access/role-provider");
const dateUtils = require("mainam-react-native-date-utils");
const TB_TABLE = "tb_user";
const API_SERVICES = "/api/user/";
const md5 = require("md5");
const authUtils = require("../utils/auth-utils");
// parse application/json

module.exports = {
  apis: (app) => {
    return [
      () => {
        /*
                    code:
                        0: success
                        1: sai username-password
                        2: inactive
                        3: error
                */
        let jsonParser = bodyParser.json();
        app.post("/api/user/login", jsonParser, async function (req, res) {
          const { username, password } = req.body;
          try {
            let user = await userProvider.getByEmail(username);
            if (user && user.password === password) {
              if(user.active==1){
              let date = new Date();
              date.setDate(date.getDate() + 30);
              user.loginToken = encrypt.encrypt({
                user: {
                  id: user.id,
                  email: user.email,
                  phone: user.phone,
                  image: user.image,
                  role: user.image,
                },
                validTo: date,
              });
              delete user.password;
              userProvider.setLastLogin(user.id);
              res.send(responseUtils.build(0, user));
            } else {
              res.send(
                responseUtils.build(2, null, "Tài khoản đã bị vô hiệu hoá")
              );
            }
            } else {
              res.send(
                responseUtils.build(1, null, "Thông tin tài khoản không đúng")
              );
            }
          } catch (error) {
            res.send(
              responseUtils.build(
                500,
                error,
                "Xảy ra lỗi, vui lòng thử lại sau"
              )
            );
          }
        });
      },
      () => {
        /*
                    code:
                        0: success
                        1: vui long dang nhap
                        2: thong tin khong trung khop
                        500: error
                */
        let jsonParser = bodyParser.json();
        app.post("/api/user/change-password", jsonParser, async function (
          req,
          res
        ) {
          const { oldPassword, newPassword } = req.body;
          try {
            const user = authUtils.getUser(req.headers);
            if (!user || !user.user || !user.user.id) {
              res.send(responseUtils.build(1, null, "Vui lòng đăng nhập"));
              return;
            }
            userProvider
              .changePassword(user.user.id, oldPassword, newPassword)
              .then((s) => {
                if (s && s.affectedRows > 0)
                  res.send(
                    responseUtils.build(0, null, "Đổi mật khẩu thành công")
                  );
                else {
                  res.send(
                    responseUtils.build(
                      2,
                      null,
                      "Thông tin tài khoản không trùng khớp"
                    )
                  );
                }
              })
              .catch((e) => {
                responseUtils.build(500, e, "Đổi mật khẩu không thành công");
              });
          } catch (e) {
            responseUtils.build(500, e, "Đổi mật khẩu không thành công");
          }
        });
      },
      () => {
        /*
                    code:
                        0: success
                        #: không thành công
                */
        let jsonParser = bodyParser.json();
        app.post("/api/user/set-acitve/:id", jsonParser, async function (
          req,
          res
        ) {
          const { id } = req.params;
          const { active } = req.body;
          try {
            const user = authUtils.getUser(req.headers);
            if (!user || !user.user || !user.user.id) {
              res.send(responseUtils.build(1, null, "Vui lòng đăng nhập"));
              return;
            }
            if (id === user.user.id) {
              res.send(
                responseUtils.build(
                  2,
                  null,
                  "Bạn không thể set active chính bản thân mình"
                )
              );
              return;
            }
            if(roleProvider.checkAllowActiveUser(user.user))
            {
              res.send(
                responseUtils.build(
                  3,
                  null,
                  "Bạn không có quyền thực hiện"
                )
              );
              return;
            }
            userProvider
              .setActive(user.user.id, active)
              .then((s) => {
                if (s && s.affectedRows > 0)
                  res.send(
                    responseUtils.build(
                      0,
                      null,
                      active ? "Active thành công" : "Inactive thành công"
                    )
                  );
                else {
                  res.send(
                    responseUtils.build(
                      4,
                      null,
                      active
                        ? "Active không thành công"
                        : "Inactive không thành công"
                    )
                  );
                }
              })
              .catch((e) => {
                responseUtils.build(500, e, "Xảy ra lỗi, vui lòng thử lại sau");
              });
          } catch (e) {
            responseUtils.build(500, e, "Xảy ra lỗi, vui lòng thử lại sau");
          }
        });
      },
      () => {
        /*
                        code:
                            0: success
                            1: error
                            2: vui lòng đăng nhập
                    */
        let jsonParser = bodyParser.json();
        app.get(API_SERVICES + "detail/:id", jsonParser, function (req, res) {
          let { id } = req.params;
          const user = authUtils.getUser(req.headers);
          if (user && user.user && user.user.id) {
            userProvider
              .getById(id)
              .then((s) => {
                if (s) {
                  res.send(responseUtils.build(0, s));
                } else {
                  res.send(responseUtils.build(1, null));
                }
              })
              .catch((e) => {
                res.send(responseUtils.build(1, null, e.message));
              });
          } else {
            res.send(responseUtils.build(3, {}, "Vui lòng đăng nhập"));
          }
        });
      },
      () => {
                  // title: tìm kiếm
                  // code:
                  // 0: success
                  // 1: login
                  // 2: access denied,
                  // 500: exception
        let jsonParser = bodyParser.json();
        app.get(API_SERVICES + "search", jsonParser, function(req,res){
          try {
            const user = authUtils.getUser(req.headers);
            if (user && user.user && user.user.id) {
              let{page, size, id, name, active, phone, email, role} = req.query;
              // if (user.user.id != id) {
              //   res.send(responseUtils.build(1,{}, "Bạn không có quyền"));
              //   return;
              // }
              userProvider
                .search(page, size, id, name, active, phone, email, role)
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
            }
              else {
                res.send(responseUtils.build(2, {}, "Vui lòng đăng nhập"));
              }
            } catch (error) {
              console.log(error);
              res.send(responseUtils.build(500, error, "Xảy ra lỗi"));
            }
        })
      },
      () => {
        /*
                    title: xóa user
                    code:
                        0: success
                        1: error
                        2: không có dữ liệu
                */

        let jsonParser = bodyParser.json();
        app.delete(API_SERVICES + "delete/:id", jsonParser, function(req, res) {
          let { id } = req.params;
          userProvider
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
                    title: tạo mới category
                    code:
                        0: success
                        1: khong ton tai id
                        2: da ton tai email
                        3: loi
                */
        let jsonParser = bodyParser.json();
        app.post(API_SERVICES + "create", jsonParser, function(req, res) {
          try {
            let { name, active, birthday,phone,email,role,password } = req.body;
            userProvider
              .createOrEdit(null, name, active, birthday,phone,email,role,password)
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
                    responseUtils.build(2, e, "Đã tồn tại email này")
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
                    title: update user
                    code:
                        0: success
                        1: khong ton tai id
                        2: không thành công
                */
        let jsonParser = bodyParser.json();
        app.put(API_SERVICES + "update/:id", jsonParser, function(req, res) {
          try {
            let {id} = req.params;
            if (!id) {
              res.send(responseUtils.build(1, err, "Không tồn tại"));
              return;
            }
            let {name, active, birthday,phone,email,role,password} = req.body;
            userProvider
              .createOrEdit(id, name, active, birthday,phone,email,role,password)
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
                    title: reset user
                    code:
                        0: success
                        1: error
                        2: không có dữ liệu
                */

        let jsonParser = bodyParser.json();
        app.put(API_SERVICES + "reset/:id", jsonParser, function(req, res) {
          let { id } = req.params;
          userProvider
            .resetpassword(id)
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
    ];
  },
};

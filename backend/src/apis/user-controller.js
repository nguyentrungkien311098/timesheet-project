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
        app.get("/api/user/detail", jsonParser, function (req, res) {
          const user = authUtils.getUser(req.headers);
          if (user && user.user && user.user.id) {
            userProvider
              .getById(user.user.id)
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
    ];
  },
};

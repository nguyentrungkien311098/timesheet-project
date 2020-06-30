import userProvider from "@data-access/user-provider";
import { ToastContainer, toast } from "react-toastify";
import constants from "@strings";
import snackbar from "../../../utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import clientUtils from "@utils/client-utils";

function getDetailUser() {
  return (dispath, getState) => {
    userProvider
      .getDetailUser()
      .then(s => {
        if (s && s.code == 0)
          dispath(
            updateData({
              detail: s.data
            })
          );
        else
          dispath(
            updateData({
              detail: null
            })
          );
      })
      .catch(e => {
        dispath(
          updateData({
            detail: null
          })
        );
      });
  };
}

function onLogin(username, password) {
  return (dispath, getState) => {
    if (!username || !password) {
      toast.error("Vui lòng nhập tài khoản và mật khẩu", {
        position: toast.POSITION.TOP_RIGHT
      });
      return;
    }
    return new Promise((resolve, reject) => {
      userProvider
        .login(username, password)
        .then(res => {
          switch (res.code) {
            case 0:
              snackbar.show(constants.text.user.success_login, "success");
              dispath(
                updateData({
                  auth: res.data,
                  detail: null
                })
              );
              clientUtils.auth = res.data.loginToken || "";
              resolve(res.data);
              break;
            default:
              snackbar.show(
                res.message || constants.text.user.login_error,
                "danger"
              );
              break;
          }
          reject("Đăng nhập không thành công");
        })
        .catch(e => {
          reject(e);
          console.log(e);
        });
    });
  };
}

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "AUTH-UPDATE-DATA",
      data: data
    });
  };
}
export default {
  onLogin,
  onLogout() {
    return dispatch => {
      return new Promise((resolve, reject) => {
        dispatch(
          updateData({
            auth: null,
            detail: null
          })
        );
        clientUtils.auth = null;
        resolve();
      });
    };
  },
  updateData,
  getDetailUser
};

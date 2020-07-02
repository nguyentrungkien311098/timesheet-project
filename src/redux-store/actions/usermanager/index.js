import userProvider from "@data-access/user-provider";
import snackbar from "../../../utils/snackbar-utils";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "USER-UPDATE-DATA",
      data: data
    });
  };
}

function onSizeChange(size) {
  return (dispatch, getState) => {
    dispatch(
      updateData({
        size: size
      })
    );
    dispatch(gotoPage(1));
  };
}

function onSearch(data, action) {
  return (dispatch, getState) => {
    let searchNameUser = action === "name" ? data : getState().usermanager.searchNameUser;
    let searchActive = action === "active" ? data : getState().usermanager.searchActive;
    let searchPhone = action === "phone" ? data : getState().usermanager.searchPhone;
    let searchEmail = action === "email" ? data : getState().usermanager.searchEmail;
    if (searchNameUser === undefined && searchActive === undefined && searchPhone === undefined
      && searchEmail === undefined) {
    } else {
      dispatch(
        updateData({
          searchNameUser: searchNameUser,
          searchActive: searchActive,
          searchPhone: searchPhone,
          searchEmail: searchEmail,
        })
      );
    }
    dispatch(gotoPage(1));
  };
}
function loadListAccount() {
  return (dispatch, getState) => {
    userProvider
      .search(1, 1000, "", true)
      .then(s => {
        switch (s.code) {
          case 0:
            dispatch(
              updateData({
                usermanager: s.data.data
              })
            );
            break;
        }
      })
      .catch(e => {});
  };
}
function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().usermanager.size || 10;
    let name = getState().usermanager.searchNameUser;
    let active = getState().usermanager.searchActive;
    let phone = getState().usermanager.searchPhone;
    let email = getState().usermanager.searchEmail;
    let birthday = getState().usermanager.birthday;
    userProvider
      .search(page, size, name, active,birthday, phone, email, undefined)
      .then(s => {
        dispatch(
          updateData({
            total: s.data.total || size,
            data: s.data.data || []
          })
        );
      });
  };
}

function loadDetail(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      userProvider
        .getById(id)
        .then(s => {
          if (s && s.code == 0 && s.data) {
            dispatch(
              updateData({
                id: s.data.id,
                name: s.data.name,
                active: s.data.active,
                phone: s.data.phone,
                email: s.data.email,
                birthday: s.data.birthday,
                role: s.data.role,
                lastLogin: s.data.lastLogin,
              })
            );
            resolve(s.data);
            return;
          }
          snackbar.show("Không tìm thấy kết quả phù hợp", "danger");
          reject(s);
        })
        .catch(e => {
          snackbar.show(
            e && e.message ? e.message : "Xảy ra lỗi, vui lòng thử lại sau",
            "danger"
          );
          reject(e);
        });
    });
  };
}

function onDeleteItem(item) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      confirm({
        title: "Xác nhận",
        content: `Bạn có muốn xóa user này?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          userProvider
            .delete(item.id)
            .then(s => {
              if (s.code == 0) {
                let data = (getState().usermanager.data || []).filter(
                  item2 => item2.id != item.id
                );
                dispatch(
                  updateData({
                    data: data
                  })
                );
                snackbar.show("Xóa thành công", "success");
                resolve();
              } else {
                snackbar.show("Xóa không thành công", "danger");
                reject();
              }
            })
            .catch(e => {
              snackbar.show("Xóa không thành công", "danger");
              reject();
            });
        },
        onCancel() {
          reject();
        }
      });
    });
  };
}

export default {
  gotoPage,
  updateData,
  onSizeChange,
  onSearch,
  loadListAccount,
  loadDetail,
  onDeleteItem,
}

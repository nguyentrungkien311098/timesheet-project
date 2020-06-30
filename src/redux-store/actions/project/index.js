import projectProvider from "@data-access/project-provider";
import { ToastContainer, toast } from "react-toastify";
import constants from "@strings";
import snackbar from "@utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import moment from "moment";
import { Modal } from "antd";
const { confirm } = Modal;

function updateData(data) {
  return dispatch => {
    dispatch({
      type: "PROJECT-UPDATE-DATA",
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

function onSearch(name, status) {
  return (dispatch, getState) => {
    if (name === undefined && status === undefined) {
    } else {
      dispatch(
        updateData({
          searchName: name,
          searchActive: status
        })
      );
    }
    dispatch(gotoPage(1));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().project.size || 10;
    let name = getState().project.searchName;
    let sort = getState().project.sort || {};
    let active = getState().project.searchActive;
    projectProvider
      .search(page, size, name, active, undefined, sort)
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

function loadProjectDetail(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      projectProvider
        .getById(id)
        .then(s => {
          if (s && s.code == 0 && s.data && s.data.data) {
            dispatch(
              updateData({
                id: s.data.data.id,
                active: s.data.data.active,
                name: s.data.data.name
              })
            );
            resolve(s.data.data);
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

function onSort(key, value) {
  return (dispatch, getState) => {
    dispatch(
      updateData({
        sort: {
          key,
          value
        }
      })
    );
    dispatch(gotoPage(1));
  };
}

function loadListProject() {
  return (dispatch, getState) => {
    projectProvider.search(1, 1000, "", true).then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              projects: s.data.data
            })
          );
          break;
      }
    });
  };
}

function loadMyProject() {
  return (dispatch, getState) => {
    projectProvider.search(1, 1000, "", true, true).then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              myProjects: s.data.data
            })
          );
          break;
      }
    });
  };
}

function createOrEdit() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().project.id;
      let name = getState().project.name;
      let active = getState().project.active;
      projectProvider
        .createOrEdit(id, name, active)
        .then(s => {
          if (s.code == 0) {
            dispatch(
              updateData({
                id: "",
                name: "",
                active: false
              })
            );
            if (!id) {
              snackbar.show("Thêm thành công", "success");
            } else {
              snackbar.show("Cập nhật thành công", "success");
            }
            dispatch(loadListProject());
            resolve(s.data);
          } else {
            if (!id) {
              snackbar.show(s.message || "Thêm không thành công", "danger");
            } else {
              snackbar.show(s.message || "Sửa không thành công", "danger");
            }
            reject();
          }
        })
        .catch(e => {
          snackbar.show("Thêm không thành công", "danger");
          reject();
        });
    });
  };
}

function onDeleteItem(item) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      confirm({
        title: "Xác nhận",
        content: `Bạn có muốn xóa sản phẩm ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          projectProvider
            .delete(item.id)
            .then(s => {
              if (s.code == 0) {
                snackbar.show("Xóa thành công", "success");
                let data = getState().project.data || [];
                let index = data.findIndex(x => x.id == item.id);
                if (index != -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                dispatch(loadListProject());
                dispatch(loadMyProject());
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
  loadListProject,
  loadMyProject,
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onSort,
  onDeleteItem,
  loadProjectDetail,
  setMyProject(projects) {
    return (dispatch, getState) => {
      projectProvider
        .setMyProject(projects)
        .then(s => {
          let _myProject = (getState().project.projects || []).filter(item =>
            projects.find(item2 => item2 == item.id)
          );
          dispatch(
            updateData({
              myProjects: _myProjects
            })
          );
        })
        .catch(e => {
          snackbar.show("Cập nhật không thành công", "danger");
        });
    };
  }
};

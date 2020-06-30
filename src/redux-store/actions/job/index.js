import jobProvider from "@data-access/job-provider";
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
      type: "JOB-UPDATE-DATA",
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
    let size = getState().job.size || 10;
    let name = getState().job.searchName;
    let sort = getState().job.sort || {};
    let active = getState().job.searchActive;
    jobProvider.search(page, size, name, active, undefined, sort).then(s => {
      dispatch(
        updateData({
          total: s.data.total || size,
          data: s.data.data || []
        })
      );
    });
  };
}

function loadJobDetail(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      jobProvider
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

function loadListJob() {
  return (dispatch, getState) => {
    jobProvider.search(1, 1000, "", true).then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              jobs: s.data.data
            })
          );
          break;
      }
    });
  };
}

function loadMyJob() {
  return (dispatch, getState) => {
    jobProvider.search(1, 1000, "", true, true).then(s => {
      switch (s.code) {
        case 0:
          dispatch(
            updateData({
              myJobs: s.data.data
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
      let id = getState().job.id;
      let name = getState().job.name;
      let active = getState().job.active;
      jobProvider
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
            dispatch(loadListJob());
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
        content: `Bạn có muốn xóa công việc ${item.name}?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          jobProvider
            .delete(item.id)
            .then(s => {
              if (s.code == 0) {
                snackbar.show("Xóa thành công", "success");
                let data = getState().job.data || [];
                let index = data.findIndex(x => x.id == item.id);
                if (index != -1);
                data.splice(index, 1);
                dispatch(
                  updateData({
                    data: [...data]
                  })
                );
                dispatch(loadListJob());
                dispatch(loadMyJob());
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
  loadListJob,
  loadMyJob,
  createOrEdit,
  updateData,
  gotoPage,
  onSearch,
  onSizeChange,
  onSort,
  onDeleteItem,
  loadJobDetail,
  setMyJob(jobs) {
    return (dispatch, getState) => {
      jobProvider
        .setMyJob(jobs)
        .then(s => {
          let _myJob = (getState().job.jobs || []).filter(item =>
            jobs.find(item2 => item2 == item.id)
          );
          dispatch(
            updateData({
              myJobs: _myJob
            })
          );
        })
        .catch(e => {
          snackbar.show("Cập nhật không thành công", "danger");
        });
    };
  }
};

import projectProvider from "@data-access/project-provider";
import productProvider from "@data-access/product-provider";
import jobProvider from "@data-access/job-provider";
import timesheetProvider from "@data-access/timesheet-provider";
import fileProvider from "@data-access/file-provider";
import { ToastContainer, toast } from "react-toastify";
import constants from "@strings";
import snackbar from "@utils/snackbar-utils";
import stringUtils from "mainam-react-native-string-utils";
import moment from "moment";
import actionProduct from "@actions/product";
import actionProject from "@actions/project";
import actionJob from "@actions/job";
import { Modal } from "antd";
const { confirm } = Modal;
function updateData(data) {
  return dispatch => {
    dispatch({
      type: "TIME-SHEET-UPDATE-DATA",
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

function loadDataCalendar(month) {
  return (dispatch, getState) => {
    let userId = getState().auth.auth.id;
    updateData({ dataCalendar: [] });
    timesheetProvider.search(1, 10000, userId, null, month._d).then(s => {
      dispatch(
        updateData({
          dataCalendar: s.data.data || []
        })
      );
    });
  };
}

function onSearch(date) {
  return (dispatch, getState) => {
    // if (name === undefined && status === undefined) {
    // } else {
    //   dispatch(
    //     updateData({
    //       monthFilter: date
    //     })
    //   );
    // }
    dispatch(gotoPage(1));
  };
}

function gotoPage(page) {
  return (dispatch, getState) => {
    dispatch(updateData({ page: page }));
    let size = getState().timesheet.size || 10;
    let month = getState().timesheet.dateFilter || moment(new Date());
    let userId = getState().auth.auth.id;
    timesheetProvider.search(page, size, userId, month._d, null).then(s => {
      dispatch(
        updateData({
          total: s.data.total || size,
          data: s.data.data || []
        })
      );
    });
  };
}

function loadData() {
  return (dispatch, getState) => {
    dispatch(actionProduct.loadListProduct());
    dispatch(actionProduct.loadMyProduct());
    dispatch(actionJob.loadListJob());
    dispatch(actionJob.loadMyJob());
    dispatch(actionProject.loadListProject());
    dispatch(actionProject.loadMyProject());
  };
}

function loadItem(item) {
  return (dispatch, getState) => {
    dispatch(
      updateData({
        id: item.id,
        date: moment(new Date(item.fromDate)),
        startTime: moment(new Date(item.fromDate)),
        endTime: moment(new Date(item.toDate)),
        projectId: item.projectId,
        productId: item.productId,
        jobId: item.jobId,
        description: item.description,
        attachments: JSON.parse(item.attachments || "[]"),
        spec: item.spec,
        tickets: (item.tickets || "").split(",").filter(item => item)
      })
    );
  };
}

function resetForm() {
  return (dispatch, getState) => {
    dispatch(
      updateData({
        id: null,
        date: null,
        startTime: null,
        endTime: null,
        description: "",
        attachments: [],
        spec: "",
        tickets: []
      })
    );
  };
}

function loadTimeSheetDetail(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      timesheetProvider
        .getById(id)
        .then(s => {
          if (s && s.code == 0 && s.data && s.data.data) {
            dispatch(loadItem(s.data.data));
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

function onChangeDate(date) {
  return (dispatch, getState) => {
    let _predate = new Date();
    _predate.setDate(_predate.getDate() - 10);
    dispatch(
      updateData({
        dateFilter: date,
        date: date && _predate <= date._d ? date : null
      })
    );
    dispatch(gotoPage(1));
  };
}

function removeAttachment(file) {
  return (dispatch, getState) => {
    try {
      let attachments = getState().timesheet.attachments || [];
      dispatch(
        updateData({
          attachments: attachments.filter(item => item.uid != file.uid)
        })
      );
    } catch (error) {}
  };
}

function uploadFile(file) {
  return (dispatch, getState) => {
    dispatch(
      updateData({
        attachments: [
          ...(getState().timesheet.attachments || []),
          {
            uid: file.uid,
            name: file.name,
            uploading: true
          }
        ]
      })
    );
    return new Promise((resolve, reject) => {
      fileProvider
        .upload(file)
        .then(s => {
          let state = getState();
          let attachments = state.timesheet.attachments || [];
          let file = attachments.find(item => item.uid == s.file.uid);
          if (file) {
            file.uploading = false;
          }

          if (s && s.code == 0) {
            file.url = s.data[0];
            file.status = "done";
            dispatch(
              updateData({
                attachments: [...attachments]
              })
            );
            resolve(s);
          } else {
            file.error = true;
            dispatch(
              updateData({
                attachments: [...attachments]
              })
            );
            reject(s);
          }
        })
        .catch(e => {
          let state = getState();
          let attachments = state.timesheet.attachments || [];
          let file2 = attachments.find(item => item.uid == file.uid);
          if (file2) {
            file2.uploading = false;
            file2.error = true;
          }
          dispatch(
            updateData({
              attachments: [...attachments]
            })
          );
          reject(e);
        });
    });
  };
}

function createOrEdit(
  date,
  startTime,
  endTime,
  projectId,
  productId,
  jobId,
  description = "",
  tickets = [],
  attachments = [],
  spec = ""
) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let id = getState().timesheet.id;
      timesheetProvider
        .createOrEdit(
          id,
          date._d.format("yyyy/MM/dd"),
          startTime._d.format("yyyy/MM/dd HH:mm") + ":00",
          endTime._d.format("yyyy/MM/dd HH:mm") + ":00",
          projectId,
          productId,
          jobId,
          description,
          tickets,
          attachments,
          spec
        )
        .then(s => {
          switch (s.code) {
            case 0:
              if (!id) {
                snackbar.show("Thêm thành công", "success");
              } else {
                snackbar.show("Cập nhật thành công", "success");
              }
              resolve(s.data);
              break;
            default:
              if (!id) {
                snackbar.show(s.message || "Thêm không thành công", "danger");
              } else {
                snackbar.show(s.message || "Sửa không thành công", "danger");
              }
              reject();
          }
        })
        .catch(e => {
          if (!id) {
            snackbar.show("Thêm không thành công", "danger");
          } else {
            snackbar.show("Sửa không thành công", "danger");
          }
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
        content: `Bạn có muốn xóa công việc này?`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          timesheetProvider
            .delete(item.id)
            .then(s => {
              if (s.code == 0) {
                let data = (getState().timesheet.data || []).filter(
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
  updateData,
  gotoPage,
  onSizeChange,
  onSearch,
  loadData,
  loadTimeSheetDetail,
  onChangeDate,
  removeAttachment,
  uploadFile,
  createOrEdit,
  onDeleteItem,
  loadItem,
  resetForm,
  loadDataCalendar
};

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
    userProvider
      .search(page, size)
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

export default {
  gotoPage,
  updateData,
  onSizeChange,
  onSearch,
  loadListAccount
}

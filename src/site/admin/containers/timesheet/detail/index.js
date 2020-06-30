import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import timeSheetProvider from "@data-access/timesheet-provider";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  Upload,
  Icon
} from "antd";
import dateUtils from "mainam-react-native-date-utils";
import moment from "moment";
import { AdminPage, Panel } from "@admin/components/admin";

function index(props) {
  const [state, _setState] = useState({
    data: {}
  });
  const setState = _state => {
    _setState(state => ({
      ...state,
      ...(_state || {})
    }));
  };
  useEffect(() => {
    timeSheetProvider
      .getById(props.match.params.id)
      .then(s => {
        if (s && s.code == 0 && s.data && s.data.data) {
          setState({ data: s.data.data });
        }
      })
      .then(e => {});
  }, []);
  if (!state.data) return null;
  let attachments = JSON.parse(state.data.attachments || "[]");
  let tickets = (state.data.tickets || "").split(",").filter(item => item);
  const onClose = () => {
    props.history.push("/time-sheet");
  };
  return (
    <AdminPage
      className="mgr-timesheet-detail"
      icon="subheader-icon fal fa-window"
    >
      <Panel
        title={"Chi tiết công việc"}
        allowCollapse={false}
        allowClose={false}
      >
        <div>
          <label>Người báo cáo:</label>{" "}
          <strong style={{ fontWeight: 600 }}>{state.data.fullName}</strong>
        </div>
        <div>
          <label>Email:</label>{" "}
          <strong style={{ fontWeight: 600 }}>{state.data.email}</strong>
        </div>
        <div>
          <label>Sản phẩm:</label>{" "}
          <strong style={{ fontWeight: 600 }}>{state.data.productName}</strong>
        </div>
        <div>
          <label>Dự án:</label>{" "}
          <strong style={{ fontWeight: 600 }}>{state.data.projectName}</strong>
        </div>
        <div>
          <label>Công việc:</label>{" "}
          <strong style={{ fontWeight: 600 }}>{state.data.jobName}</strong>
        </div>
        {state.data.fromDate && (
          <div>
            <label>Bắt đầu lúc:</label>{" "}
            <strong style={{ fontWeight: 600 }}>
              {(state.data.fromDate || "")
                .toDateObject()
                .format("HH:mm:ss tt ngày dd/MM/yyyy")}
            </strong>
          </div>
        )}
        {state.data.toDate && (
          <div>
            <label>Kết thúc lúc:</label>{" "}
            <strong style={{ fontWeight: 600 }}>
              {(state.data.toDate || "")
                .toDateObject()
                .format("HH:mm:ss tt ngày dd/MM/yyyy")}
            </strong>
          </div>
        )}
        <div>
          <label>Chi tiết:</label>
        </div>
        <div>
          {(state.data.description || "").split("\n").map((item, index) => {
            return <p key={index}>{item}</p>;
          })}
        </div>
        {tickets && tickets.length ? (
          <div>
            <label>Tickets: </label>
            <ul>
              {tickets.map((item, index) => {
                return (
                  <li key={index}>
                    <a href={item.getTicketUrl()}>{item}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {state.data.spec ? (
          <div>
            <label>Nghiệp vụ: </label>
            <a href={`${state.data.spec}`}>{state.data.spec}</a>
          </div>
        ) : null}
        {attachments && attachments.length ? (
          <div>
            <label>Đính kèm:</label>
            <Upload
              fileList={(attachments || []).map(item => {
                let item2 = { ...item };
                if (item2.url) {
                  let exts = item2.url.split(".");
                  let ext = exts[exts.length - 1].toLowerCase();
                  switch (ext) {
                    case "doc":
                    case "docx":
                    case "xlsx":
                    case "xls":
                    case "ppt":
                    case "pptx":
                      item2.url =
                        "https://docs.google.com/viewer?url=" +
                        item2.url.absoluteFileUrl() +
                        "&embedded=true";
                      break;
                    default:
                      item2.url = item2.url.absoluteFileUrl();
                  }
                }
                return item2;
              })}
              disabled
              onDownload={file => {
                let x = (attachments || []).find(item => item.uid == file.uid);
                if (x && x.url) {
                  console.log(x.url.absoluteFileUrl());
                  window.open(x.url.absoluteFileUrl());
                }
              }}
              onRemove={file => {
                props.removeAttachment(file);
              }}
              customRequest={({ onSuccess, onError, file }) => {
                props
                  .uploadFile(file)
                  .then(s => {
                    onSuccess(null, {
                      uid: "-1",
                      name: "xxx.png",
                      status: "done",
                      url:
                        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                      thumbUrl:
                        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    });
                  })
                  .catch(e => {
                    onError(e);
                  });
              }}
              {...props}
              accept=".png,.gif,.jpg,.pdf,.doc,.xls,.ppt,.pptx,.xlsx,.docx,.zip,.rar,.7z"
            ></Upload>
          </div>
        ) : null}
        <div
            style={{
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "16px 16px 0px",
              background: "#fff",
              textAlign: "right"
            }}
          >
            <Button onClick={onClose} type="primary" style={{ marginRight: 8 }}>Quay lại</Button>
          </div>
      </Panel>
    </AdminPage>
  );
}

export default connect(state => {
  return {
    auth: state.auth.auth
  };
}, {})(index);

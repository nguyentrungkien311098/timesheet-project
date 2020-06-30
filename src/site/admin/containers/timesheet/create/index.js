import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Icon,
  TimePicker,
  Modal,
  Upload
} from "antd";
import { connect } from "react-redux";
import actionTimeSheet from "@actions/timesheet";
import moment from "moment";
import dateUtils from "mainam-react-native-date-utils";
import { AdminPage, Panel } from "@admin/components/admin";
import snackbar from "@utils/snackbar-utils";
const queryString = require("query-string");

const { Option } = Select;

function index(props) {
  const id = props.match.params.id;

  const [, updateState] = React.useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    props.loadData();

    if (id)
      props
        .loadTimeSheetDetail(id)
        .then(s => {})
        .catch(e => {
          props.history.replace("/time-sheet");
        });
    else {
      let date = moment(new Date());
      const parsed = queryString.parse(window.location.search);
      if (parsed && parsed.date) {
        if (parsed.date.toDateObject().isValidDate())
          date = moment(parsed.date.toDateObject());
      }
      props.updateData({
        id: null,
        date
      });
    }
  }, []);

  useEffect(() => {
    props.form.resetFields();
    forceUpdate();
  }, [
    props.date,
    props.startTime,
    props.endTime,
    props.productId,
    props.projectId,
    props.jobId,
    props.description,
    props.tickets,
    props.attachments,
    props.spec
  ]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        if (
          props.attachments.length &&
          props.attachments.filter(item => item.error || item.uploading).length
        ) {
          snackbar.show(
            "Một số file đang được upload hoặc bị lỗi, vui lòng kiểm tra lại",
            "danger"
          );
          return;
        }
        // Modal.confirm({
        //     title: 'Xác nhận?',
        //     content: props.id ? 'Bạn có muốn lưu những thay đổi' : 'Bạn có muốn tạo công việc',
        //     onOk() {
        //         return new Promise((resolve, reject) => {
        //             setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        //         }).catch(() => console.log('Oops errors!'));
        //     },
        //     onCancel() { },
        // });
        props
          .createOrEdit(
            props.date,
            props.startTime,
            props.endTime,
            props.projectId,
            props.productId,
            props.jobId,
            props.description,
            props.tickets,
            props.attachments,
            props.spec
          )
          .then(s => {
            props.updateData({
              description: "",
              attachments: [],
              tickets: [],
              date: null,
              startTime: null,
              endTime: null
            });
            props.history.replace(
              "/time-sheet?date=" + props.date._d.format("yyyy/MM/dd")
            );
          });
      }
    });
  };
  const { getFieldDecorator } = props.form;

  const checkDate = (rule, value, callback) => {
    if (!value || !props.date) {
      callback([new Error("Vui lòng chọn ngày làm việc")]);
    } else {
      if (value) {
        if (value._d > new Date()) {
          callback([new Error("Ngày không được lớn hơn ngày hiện tại")]);
        } else {
          let minDate = new Date();
          minDate.setDate(minDate.getDate() - 60);
          if (value._d < minDate) {
            callback([new Error("Bạn chỉ được nhập trong phạm vi 60 ngày")]);
          } else {
            callback();
          }
        }
      } else callback();
    }
  };

  const checkStartTime = (rule, value, callback) => {
    const form = props.form;
    const date = form.getFieldValue("date");
    if (!value) {
      callback();
    } else {
      if (date && value) {
        let _date = (
          date._d.format("yyyy/MM/dd") +
          " " +
          value._d.format("HH:mm:ss")
        ).toDateObject();
        if (_date > new Date()) {
          callback([new Error("Chọn nhỏ hơn thời gian hiện tại")]);
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
  };
  const checkEndTime = (rule, value, callback) => {
    const form = props.form;
    const date = form.getFieldValue("date");
    const startTime = form.getFieldValue("startTime");
    if (!value) {
      callback();
    } else {
      if (date && value) {
        let _date = (
          date._d.format("yyyy/MM/dd") +
          " " +
          value._d.format("HH:mm:ss")
        ).toDateObject();
        if (_date > new Date()) {
          callback([new Error("Chọn nhỏ hơn thời gian hiện tại")]);
        } else {
          if (startTime > value) {
            callback([new Error("Chọn thời gian lớn hơn thời gian bắt đầu")]);
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    }
  };

  const cancel = () => {
    props.history.push("/time-sheet");
  };
  return (
    <AdminPage>
      <Panel
        id={"calendar-timesheet"}
        title={props.id ? "Chỉnh sửa công việc" : "Nhập mô tả công việc"}
        bottom={
          <div className="panel-content py-2 rounded-bottom border-faded border-left-0 border-right-0 border-bottom-0 text-muted">
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: "100%",
                borderTop: "1px solid #e9e9e9",
                padding: "10px 16px",
                background: "#fff",
                textAlign: "right"
              }}
            >
              <Button onClick={cancel} style={{ marginRight: 8 }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                {props.id ? "Cập nhật" : "Gửi"}
              </Button>
            </div>
          </div>
        }
        sortable={false}
        allowClose={false}
        allowCollapse={false}
      >
        <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Ngày làm việc">
                {getFieldDecorator("date", {
                  rules: [{ validator: checkDate }],
                  initialValue: props.date
                })(
                  <DatePicker
                    onChange={e => {
                      props.updateData({
                        date: e
                      });
                    }}
                    style={{ width: "100%" }}
                    disabled={props.id ? true : false}
                    disabledDate={d => {
                      let minDate = new Date();
                      minDate.setDate(minDate.getDate() - 7);
                      return d._d > new Date() || d._d <= minDate;
                    }}
                    getPopupContainer={trigger => trigger.parentNode}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thời gian bắt đầu">
                {getFieldDecorator("startTime", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng chọn thời gian bắt đầu"
                    },
                    { validator: checkStartTime }
                  ],
                  initialValue: props.startTime
                })(
                  <TimePicker
                    onChange={e => {
                      props.updateData({
                        startTime: e
                      });
                    }}
                    format={"HH:mm"}
                    style={{ width: "100%" }}
                    getPopupContainer={trigger => trigger.parentNode}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thời gian kết thúc">
                {getFieldDecorator("endTime", {
                  rules: [
                    {
                      required: true,
                      message: "Vui lòng chọn thời gian kết thúc"
                    },
                    { validator: checkEndTime }
                  ],
                  initialValue: props.endTime
                })(
                  <TimePicker
                    format={"HH:mm"}
                    onChange={e => {
                      props.updateData({
                        endTime: e
                      });
                    }}
                    style={{ width: "100%" }}
                    getPopupContainer={trigger => trigger.parentNode}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Chọn sản phẩm">
                {getFieldDecorator("product", {
                  rules: [
                    { required: true, message: "Vui lòng chọn sản phẩm" }
                  ],
                  initialValue: props.productId
                })(
                  <Select
                    showSearch
                    onChange={e => {
                      props.updateData({
                        productId: e
                      });
                    }}
                    placeholder="Chọn sản phẩm"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {props.products.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Chọn dự án">
                {getFieldDecorator("project", {
                  rules: [{ required: true, message: "Vui lòng chọn dự án" }],
                  initialValue: props.projectId
                })(
                  <Select
                    showSearch
                    onChange={e => {
                      props.updateData({
                        projectId: e
                      });
                    }}
                    placeholder="Chọn dự án"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {props.projects.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Chọn công việc">
                {getFieldDecorator("job", {
                  rules: [
                    { required: true, message: "Vui lòng chọn công việc" }
                  ],
                  initialValue: props.jobId
                })(
                  <Select
                    showSearch
                    onChange={e => {
                      props.updateData({
                        jobId: e
                      });
                    }}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="Chọn công việc"
                  >
                    {props.jobs.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Mô tả công việc">
                {getFieldDecorator("description", {
                  rules: [
                    {
                      required: true,
                      message: "Nhập mô tả công việc"
                    }
                  ],
                  initialValue: props.description
                })(
                  <Input.TextArea
                    rows={4}
                    onChange={e => {
                      props.updateData({
                        description: e.target.value
                      });
                    }}
                    placeholder="Mô tả công việc"
                  />
                )}
              </Form.Item>
              <Form.Item label="Ticket">
                {getFieldDecorator("tickets", {
                  initialValue: props.tickets
                })(
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Nhập mã ticket enter để hoàn thành"
                    onChange={e => {
                      props.updateData({
                        tickets: e
                      });
                    }}
                  >
                    {/* {children} */}
                  </Select>
                )}

                {/* <TagsInput className="color-tags" inputProps={{ placeholder: 'Nhập ticket enter để kết thúc' }} value={state.tickets} onChange={onTagChange} /> */}
              </Form.Item>
              <Form.Item label="Nghiệp vụ">
                {getFieldDecorator("spec", {
                  initialValue: props.spec
                })(
                  <Input
                    onChange={e => {
                      props.updateData({
                        spec: e.target.value
                      });
                    }}
                    placeholder="Link nghiệp vụ"
                  />
                )}
              </Form.Item>

              <Form.Item label="File đính kèm">
                {getFieldDecorator(
                  "attachments",
                  {}
                )(
                  <Upload
                    fileList={(props.attachments || [])
                      .map(item => {
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
                    multiple
                    // onDownload={file => {
                    //     let x = props.attachments.find(item => item.uid == file.uid);
                    //     if (x && x.url) {
                    //         console.log(x.url.absoluteFileUrl());
                    //         window.open(x.url.absoluteFileUrl());
                    //     }
                    // }}
                    onRemove={file => {
                      props.removeAttachment(file);
                    }}
                    customRequest={({ onSuccess, onError, file }) => {
                      props
                        .uploadFile(file)
                        .then(s => {
                          onSuccess(null, {});
                        })
                        .catch(e => {
                          onError(e);
                        });
                    }}
                    {...props}
                    accept=".png,.gif,.jpg,.pdf,.doc,.xls,.ppt,.pptx,.xlsx,.docx,.zip,.rar,.7z"
                  >
                    <Button>
                      <Icon type="upload" /> Attachment
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    </AdminPage>
  );
}

export default connect(
  state => {
    let projects = state.project.myProjects || [];
    if (!projects.length) projects = state.project.projects || [];
    let products = state.product.myProducts || [];
    if (!products.length) products = state.product.products || [];

    let jobs = state.job.myJobs || [];
    if (!jobs.length) jobs = state.job.jobs || [];
    return {
      id: state.timesheet.id,
      projects,
      products,
      jobs,
      jobId: state.timesheet.jobId,
      projectId: state.timesheet.projectId,
      productId: state.timesheet.productId,
      description: state.timesheet.description,
      attachments: state.timesheet.attachments || [],
      spec: state.timesheet.spec,
      tickets: state.timesheet.tickets,
      date: (state.timesheet.date || "").length
        ? moment(state.timesheet.date)
        : state.timesheet.date,
      startTime: (state.timesheet.startTime || "").length
        ? moment(state.timesheet.startTime)
        : state.timesheet.startTime,
      endTime: (state.timesheet.endTime || "").length
        ? moment(state.timesheet.endTime)
        : state.timesheet.endTime
    };
  },
  {
    loadData: actionTimeSheet.loadData,
    loadData: actionTimeSheet.loadData,
    updateData: actionTimeSheet.updateData,
    createOrEdit: actionTimeSheet.createOrEdit,
    uploadFile: actionTimeSheet.uploadFile,
    removeAttachment: actionTimeSheet.removeAttachment,
    loadTimeSheetDetail: actionTimeSheet.loadTimeSheetDetail
  }
)(Form.create()(index));

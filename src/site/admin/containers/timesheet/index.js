import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Select, Tooltip, DatePicker } from "antd";
import { connect } from "react-redux";
import actionTimesheet from "@actions/timesheet";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
const { Option } = Select;
import Table from "@components/common/Table";
import Card from "@components/common/Card";
import SelectSize from "@components/common/SelectSize";
import Pagination from "@components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
const queryString = require("query-string");
import moment from "moment";

function index(props) {
  const onSizeChange = size => {
    props.onSizeChange(size);
  };

  const onPageChange = page => {
    props.gotoPage(page);
  };

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    let date = new Date();
    if (parsed && parsed.date) {
      date = parsed.date.toDateObject();
    }
    props.onChangeDate(moment(date));
  }, []);

  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: `[${item.projectName}][${item.productName}] ${item.jobName}`,
      col3: item.fromDate.toDateObject().format("HH:mm:ss"),
      col4: item.toDate.toDateObject().format("HH:mm:ss"),
      col5: item
    };
  });

  const create = () => {
    props.resetForm();
    if (props.dateFilter)
      props.history.push(
        "/time-sheet/commit?date=" + props.dateFilter._d.format("yyyy/MM/dd")
      );
    else {
      props.history.push("/time-sheet/commit");
    }
  };

  const editItem = item => () => {
    props.loadItem(item);
    props.history.push("/time-sheet/edit/" + item.id);
  };

  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };

  const onChangeDate = date => {
    props.onChangeDate(date);
    if (date)
      props.history.replace(`/time-sheet?date=${date._d.format("yyyy/MM/dd")}`);
  };

  const viewDetail = item => () => {
    props.history.replace(`/time-sheet/${item.id}`);
  };

  const copyItem = item => () => {
    props.updateData({
      id: null,
      date: moment(new Date(item.fromDate)),
      startTime: null,
      endTime: null,
      projectId: item.projectId,
      productId: item.productId,
      jobId: item.jobId,
      description: item.description
    });
    props.history.push("/time-sheet/commit");
  };
  return (
    <AdminPage
      className="mgr-timesheet"
      icon="subheader-icon fal fa-window"
      header="Công việc hàng ngày"
      subheader="Mô tả công việc hàng ngày của bạn, ghi cụ thể nội dung công việc"
    >
      <Panel
        id={"mgr-timesheet"}
        allowClose={false}
        allowCollapse={false}
        title={
          <DatePicker
            onChange={onChangeDate}
            value={props.dateFilter}
            disabledDate={date => {
              return date._d > new Date();
            }}
          />
        }
        toolbar={
          <div className="toolbar">
            <Button className="button" onClick={create}>
              Thêm mới
            </Button>
          </div>
        }
      >
        {/* <div className="body-header">
          <div className="toolbar">
            <Button className="button" onClick={create}>
              Thêm mới
            </Button>
          </div>
        </div> */}
        <Table
          scroll={{ x: 800, y: 500 }}
          style={{ marginLeft: -10, marginRight: -10 }}
          className="custom"
          columns={[
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">STT</div>
                  <div
                    className="addition-box"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#000"
                    }}
                  >
                    LỌC THEO
                  </div>
                </div>
              ),
              width: 100,
              dataIndex: "col1",
              key: "col1"
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Công việc</div>
                  <div className="addition-box">
                    <div className="search-box">
                      <img src={require("@images/icon/ic-search.png")} />
                      <input
                        value={props.searchName}
                        onChange={e => props.onSearch(e.target.value)}
                        placeholder="Tìm theo tên công việc"
                      />
                    </div>
                  </div>
                </div>
              ),
              width: 500,
              dataIndex: "col2",
              key: "col2"
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Bắt đầu</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 120,
              dataIndex: "col3",
              key: "col3"
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Kết thúc</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 120,
              dataIndex: "col4",
              key: "col4"
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box"></div>
                  <div className="addition-box"></div>
                </div>
              ),
              key: "operation",
              fixed: "right",
              width: 150,
              render: item => {
                return (
                  <div className="col-action">
                    <Tooltip placement="topLeft" title={"Xem chi tiết"}>
                      <div>
                        <a
                          onClick={viewDetail(item)}
                          class="btn btn-info btn-icon waves-effect waves-themed"
                        >
                          <i class="fal fa-eye"></i>
                        </a>
                      </div>
                    </Tooltip>

                    <Tooltip placement="topLeft" title={"Copy"}>
                      <div>
                        <a
                          onClick={copyItem(item)}
                          class="btn btn-info btn-icon waves-effect waves-themed"
                        >
                          <i class="fal fa-copy"></i>
                        </a>
                      </div>
                    </Tooltip>
                    <Tooltip placement="topLeft" title={"Sửa"}>
                      <div>
                        <a
                          onClick={editItem(item)}
                          class="btn btn-info btn-icon waves-effect waves-themed"
                        >
                          <i class="fal fa-edit"></i>
                        </a>
                      </div>
                    </Tooltip>
                    <Tooltip placement="topLeft" title={"Xóa"}>
                      <div>
                        <a
                          onClick={onDeleteItem(item)}
                          class="btn btn-info btn-icon waves-effect waves-themed"
                        >
                          <i class="fal fa-trash-alt"></i>
                        </a>
                      </div>
                    </Tooltip>
                  </div>
                );
              },
              dataIndex: "col5",
              key: "col5"
            }
          ]}
          dataSource={data}
        ></Table>
        <div className="footer">
          <SelectSize value={props.size} selectItem={onSizeChange} />
          <Pagination
            onPageChange={onPageChange}
            page={props.page}
            size={props.size}
            total={props.total}
            style={{ flex: 1, justifyContent: "flex-end" }}
          />
        </div>
      </Panel>
    </AdminPage>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      data: state.timesheet.data || [],
      size: state.timesheet.size || 10,
      page: state.timesheet.page || 1,
      total: state.timesheet.total || 0,
      dateFilter: (state.timesheet.dateFilter || "").length
        ? moment(state.timesheet.dateFilter)
        : state.timesheet.dateFilter,
      searchName: state.timesheet.searchName
    };
  },
  {
    updateData: actionTimesheet.updateData,
    onSizeChange: actionTimesheet.onSizeChange,
    gotoPage: actionTimesheet.gotoPage,
    onSearch: actionTimesheet.onSearch,
    onDeleteItem: actionTimesheet.onDeleteItem,
    onChangeDate: actionTimesheet.onChangeDate,
    loadItem: actionTimesheet.loadItem,
    resetForm: actionTimesheet.resetForm
  }
)(index);

import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Select, Tooltip } from "antd";
import { connect } from "react-redux";
import actionProduct from "@actions/product";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
const { Option } = Select;
import Table from "@components/common/Table";
import Card from "@components/common/Card";
import SelectSize from "@components/common/SelectSize";
import Pagination from "@components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
function index(props) {
  const onSizeChange = size => {
    props.onSizeChange(size);
  };

  const onPageChange = page => {
    props.gotoPage(page);
  };

  useEffect(() => {
    props.onSearch("", -1);
  }, []);

  let data = (props.data || []).map((item, index) => {
    return {
      key: index,
      col1: (props.page - 1) * props.size + index + 1,
      col2: item.name,
      col3: item.active,
      col4: item.updatedDate.toDateObject().format("dd/MM/yyyy HH:mm:ss"),
      col5: item
    };
  });

  const create = () => {
    props.updateData({
      id: null,
      active: true,
      name: ""
    });
    props.history.push("/admin/product/create");
  };

  const editItem = item => () => {
    props.updateData({
      id: item.id,
      active: item.active,
      name: item.name
    });
    props.history.push("/admin/product/edit/" + item.id);
  };

  const onDeleteItem = item => () => {
    props.onDeleteItem(item);
  };
  return (
    <AdminPage
      className="mgr-product"
      icon="subheader-icon fal fa-window"
      header="Quản lý danh mục sản phẩm"
      subheader="Danh sách các sản phẩm của công ty"
    >
      <Panel
        id={"mgr-product"}
        allowClose={false}
        allowCollapse={false}
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
                  <div className="title-box">Sản phẩm</div>
                  <div className="addition-box">
                    <div className="search-box">
                      <img src={require("@images/icon/ic-search.png")} />
                      <input
                        value={props.searchName}
                        onChange={e =>
                          props.onSearch(e.target.value, props.searchActive)
                        }
                        placeholder="Tìm theo tên sản phẩm"
                      />
                    </div>
                  </div>
                </div>
              ),
              width: 300,
              dataIndex: "col2",
              key: "col2"
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Trạng thái</div>
                  <div className="addition-box">
                    <Select
                      value={props.searchActive}
                      onChange={e => {
                        props.onSearch(props.searchName, e);
                      }}
                    >
                      <Option value={-1}>TẤT CẢ</Option>
                      <Option value={1}>ACTIVE</Option>
                      <Option value={0}>INACTIVE</Option>
                    </Select>
                  </div>
                </div>
              ),
              width: 200,
              dataIndex: "col3",
              key: "col3",
              render: item => {
                if (item == 1)
                  return (
                    <label href="#" class="badge badge-success">
                      Active
                    </label>
                  );
                return (
                  <label href="#" class="badge badge-danger">
                    InActive
                  </label>
                );
              }
            },
            {
              title: (
                <div className="custome-header">
                  <div className="title-box">Ngày sửa</div>
                  <div className="addition-box"></div>
                </div>
              ),
              width: 200,
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
              width: 100,
              render: item => {
                return (
                  <div className="col-action">
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
      data: state.product.data || [],
      size: state.product.size || 10,
      page: state.product.page || 1,
      total: state.product.total || 0,
      searchName: state.product.searchName,
      searchActive: state.product.searchActive
    };
  },
  {
    updateData: actionProduct.updateData,
    onSizeChange: actionProduct.onSizeChange,
    gotoPage: actionProduct.gotoPage,
    onSearch: actionProduct.onSearch,
    onDeleteItem: actionProduct.onDeleteItem
  }
)(index);

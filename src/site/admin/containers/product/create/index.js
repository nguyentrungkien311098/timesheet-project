import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Col, Row, Input, Select, Switch } from "antd";
import { connect } from "react-redux";
import actionProduct from "@actions/product";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
import { AdminPage, Panel } from "@admin/components/admin";
function index(props) {
  const id = props.match.params.id;

  useEffect(() => {
    if (id)
      props
        .loadProductDetail(id)
        .then(s => {})
        .catch(e => {
          props.history.replace("/admin/product");
        });
    else {
      props.updateData({
        id: null,
        name: "",
        active: true
      });
    }
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

  const onClose = () => () => {
    props.history.push("/admin/product");
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/admin/product");
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;

  return (
    <AdminPage className="mgr-product">
      <Panel
        title={id ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}
        id={"mgr-product"}
        allowClose={false}
        allowCollapse={false}
      >
        <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <Form.Item label="Tên sản phẩm">
                {getFieldDecorator("description", {
                  rules: [
                    {
                      required: true,
                      message: "Nhập tên sản phẩm"
                    }
                  ],
                  initialValue: props.name
                })(
                  <Input
                    onChange={e => {
                      props.updateData({ name: e.target.value });
                    }}
                    placeholder="Nhập tên sản phẩm"
                  />
                )}
              </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Form.Item label="Kích hoạt">
                <Switch
                  checked={props.active ? true : false}
                  onChange={e => {
                    props.updateData({
                      active: e
                    });
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              borderTop: "1px solid #e9e9e9",
              padding: "16px 16px 0px",
              background: "#fff",
              textAlign: "right"
            }}
          >
            <Button onClick={onClose(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              {id ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Panel>
    </AdminPage>
  );
}

export default connect(
  state => {
    return {
      auth: state.auth.auth,
      name: state.product.name,
      id: state.product.id,
      active: state.product.active
    };
  },
  {
    updateData: actionProduct.updateData,
    loadProductDetail: actionProduct.loadProductDetail,
    createOrEdit: actionProduct.createOrEdit
  }
)(Form.create()(index));

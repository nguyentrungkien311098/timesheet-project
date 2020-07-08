import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Col, Row, Input, Select, DatePicker,Switch } from "antd";
import { connect } from "react-redux";
import actionUsermanager from "@actions/usermanager";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
import { AdminPage, Panel } from "@admin/components/admin";
import moment from 'moment';
import '../style.scss';
// import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import DataContants from "../../../../../contants/data-contants";
function index(props) {
  const id = props.match.params.id;

  useEffect(() => {
    if (id)
      props
        .loadDetail(id)
        .then(s => {})
        .catch(e => {
          props.history.replace("/admin/user");
        });
    else {
      props.updateData({
        id: null,
        name: "",
        active: true,
        phone: "",
        email: "",
        birthday: "",
        role: "",
        password: "",
      });
    }
  }, []);

  const onClose =() => {
    props.history.push("/admin/user");
  };
  const handleSubmit = e => {
    // e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.createOrEdit().then(s => {
          props.history.push("/admin/user");
        });
      }
    });
  };
  const { getFieldDecorator } = props.form;

  return(
    <AdminPage className="mgr-create-usermanager">
      <Panel
        title={id ? "Chỉnh sửa user" : "Thêm mới user"}
        id={"mgr-usermanager"}
        allowClose={false}
        allowCollapse={false}
      >
        <Form layout="vertical" hideRequiredMark>
          <div className="row">
            <div className="col-6">
            <Form.Item label="Tên người dùng">
                {getFieldDecorator("description", {
                  rules: [
                    {
                      required: true,
                      message: "Nhập tên người dùng"
                    }
                  ],
                  initialValue: props.name
                })(
                  <Input
                    style={{ width: '80%' }}
                    onChange={e => {
                      props.updateData({ name: e.target.value });
                    }}
                    placeholder="Nhập tên người dùng"
                  />
                )}
              </Form.Item>
              <Form.Item label="Số điện thoại">
                <Input
                  style={{ width: '80%' }}
                  value={props.phone}
                  placeholder="Nhập số điện thoại"
                  onChange={e =>{
                    props.updateData({phone : e.target.value});
                  }}
                />
              </Form.Item>
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
              <Form.Item style={props.id ? {display:"none"} : {}} label="Password:">
                <Input.Password
                  placeholder="Nhập password"
                  onChange={e =>{
                    props.updateData({password : e.target.value});
                  }}
                  style={{width:'80%'}}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </div>
            <div className="col-6">
            <Form.Item label="Email/Tên đăng nhập">
                <Input
                  disabled={props.id? true : false}
                  value={props.email}
                  style={{ width: '80%' }}
                  placeholder="Nhập email"
                  onChange={e =>{
                    props.updateData({email : e.target.value});
                  }}
                />
              </Form.Item>
              <Form.Item label="Ngày sinh">
                <DatePicker
                  onChange={(event) => {
                    props.updateData({
                      birthday: event
                    });
                  }}
                  value={props.birthday}
                  style={{ width: '80%' }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
              <Form.Item label="Phân quyền * ">
                <Select
                  value={props.role}
                  style={{width:"40%"}}
                  showSearch
                  onChange={e => {
                    props.updateData({
                      role: e
                    });
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase().unsignText()
                      .indexOf(input.toLowerCase().unsignText()) >= 0
                    }
                  >
                  <Option value="">Chọn quyền</Option>
                    {DataContants.typeRole.map((item, index) => {
                      return (
                        <Option key={index} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                </Select>
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
            }} >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" onClick={() => handleSubmit()}>
              {id ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
        </div>
        </Form>
      </Panel>
    </AdminPage>
  )
}
export default connect(
  state => {
    return {
      auth: state.auth.auth,
      name: state.usermanager.name,
      id: state.usermanager.id,
      active: state.usermanager.active,
      birthday: state.usermanager.birthday ? moment(state.usermanager.birthday) : null,
      phone: state.usermanager.phone,
      email: state.usermanager.email,
      role: state.usermanager.role,
      password: state.usermanager.password,
    };
  },
  {
    updateData: actionUsermanager.updateData,
    loadDetail: actionUsermanager.loadDetail,
    createOrEdit: actionUsermanager.createOrEdit
  }
)(Form.create()(index));

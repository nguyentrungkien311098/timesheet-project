import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import actionUserManager from "@actions/usermanager";
import { Form, Button, Col, Row, Input} from "antd";
import { AdminPage, Panel } from "@admin/components/admin";

function index(props){
  const onClose = () => {
    props.history.push("/admin")
  }
  const handleSubmit = () => {}
  let a="";
  return(
    <AdminPage>
      <Panel>
        <Form layout="vertical" hideRequiredMark>
          <div className="row">
            <div className="col-md-4">
              <Form.Item label="Mật khẩu cũ: ">
                <Input.Password
                  // value={}
                  onChange={e =>{
                    props.updateData({
                      a: e.target.value
                    })
                  }}
                  placeholder="Nhập mật khẩu cũ"
                />
                {/* {props.password != a ? <div>Mật khẩu bạn nhập không đúng, vui lòng nhập lại</div> : null} */}
              </Form.Item>
              <Form.Item label="Mật khẩu mới: ">
                <Input.Password
                  placeholder="Nhập mật khẩu mới"
                />

              </Form.Item>
              <Form.Item label="Xác nhận mật khẩu: ">
                <Input.Password
                  placeholder="Xác nhận mật khẩu mới"
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
            }} >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" onClick={() => handleSubmit()}>
              Đổi mật khẩu
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
      password: state.usermanager.password,
    };
  },
  {
    updateData: actionUserManager.updateData,
  }
)(Form.create()(index));

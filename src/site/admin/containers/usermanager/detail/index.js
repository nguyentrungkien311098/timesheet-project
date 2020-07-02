import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import actionUserManager from "@actions/usermanager";
import { Button } from "antd";
import moment from 'moment';
import { InputDetail } from "@admin/components/admin/input";
import dateUtils from "mainam-react-native-date-utils";
import { AdminPage, Panel } from "@admin/components/admin";
import DataContants from "../../../../../contants/data-contants";

function index(props){
  const id = props.match.params.id;
  const getRole = (item) => {
    var role = DataContants.typeRole.filter((data) => {
        return parseInt(data.id) === Number(item)
    })
    if (role.length > 0)
        return role[0];
    return {};
  }

  useEffect(() => {
    if (id) {
      props.loadDetail(id).then(s => {
      }).catch(e => {
        props.history.replace("/admin/user");
      });
    }
    else {
      props.updateData({
        id: null,
        name: "",
        active: "",
        email:"",
        phone:"",
        birthday:null,
        role: "",
      });
    }
  }, []);
  const onClose = () => {
    props.history.push("/admin/user");
    props.updateData({
      id: null,
      name: "",
      active: "",
      email:"",
      phone:"",
      birthday:null,
      role: "",
    });
  }
  const trangthai = (item) =>{
    if (item == 1){
      return (
        <label href="#" class="badge badge-success">
          Active
        </label>
      );
    }
      return (
        <label href="#" class="badge badge-danger">
          InActive
        </label>
      );
    }
  return(
    <>
      <AdminPage className="user-manager">
        <Panel
          title="Chi tiết tài khoản"
          id={"user-manager"}
          allowClose={false}
          allowCollapse={false}
        >
          <div className="detail-body row">
            <div className="col-md-6">
              <InputDetail
                width={4}
                title="Tên nhân viên: "
                value={props.name}
              />
              <InputDetail
                width={4}
                title="Email: "
                value={props.email}
              />
              <InputDetail
                width={4}
                title="Số điện thoại: "
                value={props.phone}
              />
              <InputDetail
                width={4}
                title="Trạng thái: "
                value={trangthai(props.active)}
              />
              <InputDetail
                width={4}
                title="Ngày sinh: "
                value={props.birthday}
              />
              <InputDetail
                width={4}
                title="Phân quyền: "
                value={getRole(props.role) ? getRole(props.role).name : null}
              />
              <InputDetail
                width={4}
                title="Lần đăng nhập cuối: "
                value={props.lastLogin}
              />
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
            <Button onClick={onClose} type="primary" style={{ marginRight: 8 }}>Quay lại</Button>
          </div>
        </Panel>
      </AdminPage>
    </>
  )
}
export default connect(
  state=>{
    return {
      auth: state.auth.auth,
      id: state.usermanager.id,
      name: state.usermanager.name,
      phone: state.usermanager.phone,
      active: state.usermanager.active,
      email: state.usermanager.email,
      birthday: state.usermanager.birthday && moment(state.usermanager.birthday).format("DD/MM/YYYY") || null,
      role: state.usermanager.role,
      lastLogin: state.usermanager.lastLogin && moment(state.usermanager.lastLogin).format("DD/MM/YYYY") || null,
    }
  },
  {
    loadDetail: actionUserManager.loadDetail,
    updateData: actionUserManager.updateData,
  }
)(index)

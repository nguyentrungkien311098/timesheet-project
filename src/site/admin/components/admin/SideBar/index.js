import react, { useState, useEffect, useRef } from "react";
import "./style.scss";
import { connect } from "react-redux";
import Head from "next/head";
import ItemMenu from "../ItemMenu";
import $ from "jquery";
function index(props) {
  const menus = useRef(null);
  const [state, _setState] = useState({
    menus: [
      {
        href: "/admin/dashboard",
        i18n: "nav.dashboard",
        name: "Dashboard",
        icon: "fal fa-game-board-alt",
        filter: "dashboard tổng quan"
      },
      {
        href: "#",
        i18n: "nav.timesheet",
        name: "Time sheet",
        icon: "fal fa-person-carry",
        filter: "timesheet time sheet",
        menus: [
          {
            href: "/time-sheet/calendar",
            name: "Trong tháng",
            filter: "trong thang month",
            i18n: "time-sheet-in-month"
          },
          {
            href: "/time-sheet/commit",
            name: "Nhập công việc",
            filter: "nhap cong viec",
            i18n: "nav.commit-time-sheet"
          },
          {
            href: "/time-sheet",
            name: "Danh sách công việc",
            filter: "danh sach cong viec",
            i18n: "nav.list-time-sheet"
          },
          {
            href: "/time-sheet/config",
            name: "Cấu hình",
            filter: "config time sheet cau hinh time sheet",
            i18n: "nav.config-timesheet"
          }
        ]
      },
      {
        href: "#",
        icon: "fal fa-folder-tree",
        i18n: "nav.mgr-category",
        name: "Quản lý danh mục",
        filter: "Quản lý danh mục category ",
        role: 2,
        menus: [
          {
            href: "/admin/user",
            name: "Danh mục tài khoản",
            filter: "Quản lý danh mục tài khoản user management",
            i18n: "nav.user-management"
          },
          {
            href: "/admin/job",
            name: "Danh mục công việc",
            filter: "Quản lý danh mục công việc job management",
            i18n: "nav.job-management"
          },
          {
            href: "/admin/project",
            name: "Danh mục dự án",
            filter: "Quản lý danh mục dự án project management",
            i18n: "nav.project-management"
          },
          {
            href: "/admin/product",
            name: "Danh mục sản phẩm",
            filter: "Quản lý danh mục sản phẩm product management",
            i18n: "nav.product-management"
          }
        ]
      }
    ],
    show: false
  });
  const setState = _state => {
    _setState(state => ({
      ...state,
      ...(_state || {})
    }));
  };
  useEffect(() => {
    try {
      window.initApp.listFilter(
        $("#js-nav-menu"),
        $("#nav_filter_input"),
        $("#js-primary-nav")
      );
    } catch (error) {}
  });
  useEffect(() => {
    if (menus.current) {
      setState({ menus: menus.current });
    }
  }, []);
  const toggle = item => {
    item.open = !item.open;
    menus.current = [...state.menus];
    setState({ menus: menus.current });
  };
  return (
    <aside className="page-sidebar">
      <div className="page-logo">
        <a
          href="/admin"
          className={`page-logo-link
          press-scale-down
          d-flex align-items-center position-relative`}
          // data-toggle="modal"
          // data-target="#modal-shortcut"
        >
          <img
            src="/img/logo.png"
            alt="iSofH Portal"
            aria-roledescription="logo"
          />
          <span className="page-logo-text mr-1">Portal</span>
          {/* <span className="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2"></span>
          <i className="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i> */}
        </a>
      </div>
      <nav
        id="js-primary-nav"
        className="primary-nav js-list-filter"
        role="navigation"
      >
        <div className="nav-filter">
          <div className="position-relative">
            <input
              type="text"
              id="nav_filter_input"
              placeholder="Tìm kiếm tính năng"
              className="form-control"
              tabIndex="0"
            />
            <a
              href="#"
              onClick={() => {
                return false;
              }}
              className="btn-primary btn-search-close js-waves-off"
              data-action="toggle"
              data-class="list-filter-active"
              data-target=".page-sidebar"
            >
              <i className="fal fa-chevron-up"></i>
            </a>
          </div>
        </div>
        <div className="info-card">
          <img
            src="/img/demo/avatars/avatar-admin.png"
            className="profile-image rounded-circle"
            alt={props.auth.name}
          />
          <div className="info-card-text">
            <a href="#" className="d-flex align-items-center text-white">
              <span className="text-truncate text-truncate-sm d-inline-block">
                {props.auth.name}
              </span>
            </a>
            <span className="d-inline-block text-truncate text-truncate-sm">
              {props.auth.email}
            </span>
          </div>
          <img
            src="/img/card-backgrounds/cover-2-lg.png"
            className="cover"
            alt="cover"
          />
          <a
            href="#"
            onClick={() => {
              return false;
            }}
            className="pull-trigger-btn"
            data-action="toggle"
            data-class="list-filter-active"
            data-target=".page-sidebar"
            data-focus="nav_filter_input"
          >
            <i className="fal fa-angle-down"></i>
          </a>
        </div>
        <ul id="js-nav-menu" className="nav-menu">
          {state.menus.map((item, index) => {
            if (props.auth.role >= item.role || !item.role)
              return <ItemMenu key={index} item={item} toggle={toggle} />;
          })}
        </ul>
        <div className="filter-message js-filter-message bg-success-600"></div>
      </nav>
      <div className="nav-footer shadow-top">
        <a
          href="#"
          onClick={() => {
            return false;
          }}
          data-action="toggle"
          data-class="nav-function-minify"
          className="hidden-md-down"
        >
          <i className="ni ni-chevron-right"></i>
          <i className="ni ni-chevron-right"></i>
        </a>
        <ul className="list-table m-auto nav-footer-buttons">
          <li>
            <a
              href="https://join.skype.com/invite/Err1Tk50sOcD"
              data-toggle="tooltip"
              data-placement="top"
              title="Chat with me"
              data-original-title="Chat logs"
            >
              <i className="fal fa-comments"></i>
            </a>
          </li>
          <li>
            <a
              href="mailto:nguyentrungkien311098@gmail.com"
              data-toggle="tooltip"
              data-placement="top"
              title="Góp ý"
              data-original-title="Gửi góp ý"
            >
              <i className="fal fa-life-ring"></i>
            </a>
          </li>
          <li>
            <a
              href="tel:0327427755"
              data-toggle="tooltip"
              data-placement="top"
              title="Support"
              data-original-title="Make a call"
            >
              <i className="fal fa-phone"></i>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth.auth
  };
}

export default connect(mapStateToProps)(index);

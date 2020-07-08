import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from "react-router-dom";
// import { useRouter } from 'next/router'
function index(props) {
  // const router = useRouter();
  const getBreadcrumbs = () => {
    let url = (window.location.pathname || "").toLowerCase();
    let obj = [];
    switch (url) {
      case "/admin":
      case "/admin/dashboard":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            url: "/dashboard",
            name: "Dashboard"
          }
        ];
        break;
      case "/time-sheet":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            url: "/time-sheet",
            name: "Time Sheet"
          }
        ];
        break;
      case "/time-sheet/calendar":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            url: "/time-sheet",
            name: "Time Sheet"
          },
          {
            url: "/time-sheet/calendar",
            name: "Calendar"
          }
        ];
        break;
      case "/time-sheet/config":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            url: "/time-sheet",
            name: "Time Sheet"
          },
          {
            url: "/time-sheet/config",
            name: "Cấu hình"
          }
        ];
        break;
      case "/time-sheet/commit":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            url: "/time-sheet",
            name: "Time Sheet"
          },
          {
            url: "/time-sheet/commit",
            name: "Mô tả công việc"
          }
        ];
        break;
      case "/admin/job":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Quản lý danh mục"
          },
          {
            name: "Danh mục công việc"
          }
        ];
        break;
      case "/admin/job/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Quản lý danh mục"
          },
          {
            url: "/admin/job",
            name: "Danh mục công việc"
          },
          {
            name: "Tạo mới"
          }
        ];
        break;
      case "/admin/product":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Quản lý danh mục"
          },
          {
            name: "Danh mục sản phẩm"
          }
        ];
        break;
      case "/admin/product/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Quản lý danh mục"
          },
          {
            url: "/admin/product",
            name: "Danh mục sản phẩm"
          },
          {
            name: "Tạo mới"
          }
        ];
        break;
      case "/admin/project":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Quản lý danh mục"
          },
          {
            name: "Danh mục dự án"
          }
        ];
        break;
      case "/admin/project/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Quản lý danh mục"
          },
          {
            url: "/admin/project",
            name: "Danh mục dự án"
          },
          {
            name: "Tạo mới"
          }
        ];
        break;
      case "/admin/user/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Quản lý danh mục"
          },
          {
            url: "/admin/user",
            name: "Danh mục tài khoản"
          },
          {
            name: "Tạo mới tài khoản"
          }
        ];
        break;
      case "/admin/user":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Quản lý danh mục"
          },
          {
            name: "Danh mục tài khoản"
          }
        ];
        break;
      default:
        if (url.indexOf("/admin/job/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/admin",
              name: "Home"
            },
            {
              name: "Quản lý danh mục"
            },
            {
              url: "/admin/job",
              name: "Danh mục công việc"
            },
            {
              name: "Chỉnh sửa công việc"
            }
          ];
        } else {
          if (url.indexOf("/admin/product/edit") == 0) {
            obj = [
              {
                icon: "fal fa-home mr-1",
                url: "/admin",
                name: "Home"
              },
              {
                name: "Quản lý danh mục"
              },
              {
                url: "/admin/product",
                name: "Danh mục sản phẩm"
              },
              {
                name: "Chỉnh sửa sản phẩm"
              }
            ];
          } else {
            if (url.indexOf("/admin/project/edit") == 0) {
              obj = [
                {
                  icon: "fal fa-home mr-1",
                  url: "/admin",
                  name: "Home"
                },
                {
                  name: "Quản lý danh mục"
                },
                {
                  url: "/admin/project",
                  name: "Danh mục dự án"
                },
                {
                  name: "Chỉnh sửa dự án"
                }
              ];
            } else {
              if (url.indexOf("/time-sheet/edit") == 0) {
                obj = [
                  {
                    icon: "fal fa-home mr-1",
                    url: "/admin",
                    name: "Home"
                  },
                  {
                    url: "/time-sheet",
                    name: "Time Sheet"
                  },
                  {
                    name: "Chỉnh sửa công việc"
                  }
                ];
              } else {
                  if (url.indexOf("/time-sheet") == 0) {
                  obj = [
                  {
                    icon: "fal fa-home mr-1",
                    url: "/admin",
                    name: "Home"
                  },
                  {
                    url: "/time-sheet",
                    name: "Time Sheet"
                  },
                  {
                    name: "Chi tiết công việc"
                  }
                ];
              } else {
                if (url.indexOf("/admin/user/detail") == 0) {
                  obj = [
                    {
                      icon: "fal fa-home mr-1",
                      url: "/admin",
                      name: "Home"
                    },
                    {
                      name: "Quản lý danh mục"
                    },
                    {
                      url: "/admin/user",
                      name: "Danh mục tài khoản"
                    },
                    {
                      name: "Chi tiết tài khoản"
                    }
                  ];
                } else{
                  if (url.indexOf("/admin/user/edit") == 0) {
                    obj = [
                      {
                        icon: "fal fa-home mr-1",
                        url: "/admin",
                        name: "Home"
                      },
                      {
                        name: "Quản lý danh mục"
                      },
                      {
                        url: "/admin/user",
                        name: "Danh mục tài khoản"
                      },
                      {
                        name: "Chỉnh sửa tài khoản"
                      }
                    ];
                  }
                }
              }
            }
            }
          }
        }
        break;
    }
    return obj;
  };

  console.log(window.location.pathname);
  const breadCrumb = getBreadcrumbs();
  return (
    <ol className="breadcrumb bg-info-400">
      {breadCrumb.map((item, index) => {
        if (index < breadCrumb.length - 1)
          return (
            <li className="breadcrumb-item" key={index}>
              <Link to={item.url || "#"} className="text-white">
                {item.icon && <i className="fal fa-home mr-1"></i>}
                {item.name}
              </Link>
            </li>
          );
        return (
          <li className="breadcrumb-item active text-white" key={index}>
            {item.name}
          </li>
        );
      })}
    </ol>
  );
}
export default index;

module.exports = {
  key: {
    SUMARY_BY_MONTH: "SUMARY_BY_MONTH",
    SUMARY_BY_DAY: "SUMARY_BY_DAY",
    SUMARY_BY_YEAR: "SUMARY_BY_YEAR"
  },
  text: {
    internal_server_error: "Xảy ra lỗi, vui lòng thử lại sau",
    user: {
      success_login: "Đăng nhập thành công",
      login_error: "Đăng nhập không thành công"
    }
  },
  api: {
    user: {
      login: "/api/user/login",
      detail: "/api/user/detail"
    },
    product: {
      search: "/api/product/search",
      delete: "/api/product/delete",
      update: "/api/product/update",
      create: "/api/product/create",
      get_by_id: "/api/product",
      set_my_product: "/api/product/set-my-product"
    },
    project: {
      search: "/api/project/search",
      delete: "/api/project/delete",
      update: "/api/project/update",
      create: "/api/project/create",
      get_by_id: "/api/project",
      set_my_project: "/api/project/set-my-project"
    },
    job: {
      search: "/api/job/search",
      delete: "/api/job/delete",
      update: "/api/job/update",
      create: "/api/job/create",
      get_by_id: "/api/job",
      set_my_job: "/api/job/set-my-job"
    },
    timesheet: {
      create: "/api/timesheet/create",
      update: "/api/timesheet/update",
      search: "/api/timesheet/search",
      delete: "/api/timesheet/delete",
      get_by_id: "/api/timesheet",
      detail: "/api/timesheet/detail",
      sumary_year: "/api/timesheet/sumary/year",
      sumary_month: "/api/timesheet/sumary/month",
      sumary_day: "/api/timesheet/sumary/day"
    },
    file: {
      upload: "/api/file/upload-file"
    }
  }
};

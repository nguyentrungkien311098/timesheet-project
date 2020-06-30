import React from "react";
import SumaryByMonth from "@admin/components/SumaryByMonth";
import SumaryByYear from "@admin/components/SumaryByYear";
import SumaryByDay from "@admin/components/SumaryByDay";
import { AdminPage, Panel } from "@admin/components/admin";
function index(props) {
  return (
    <AdminPage
      icon="subheader-icon fal fa-window"
      header="Dashboard"
      subheader="Hiển thị thống kê công việc của bạn và bộ phận"
    >
      <div className="row">
        <div className="col-lg-12  ui-sortable">
          <SumaryByDay />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-6  ui-sortable sortable-grid">
          <SumaryByMonth />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6  ui-sortable sortable-grid">
          <SumaryByYear />
        </div>
      </div>
    </AdminPage>
  );
}
export default index;

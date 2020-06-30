import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import timesheetProvider from "@data-access/timesheet-provider";
import { Panel } from "@admin/components/admin";
import { Tooltip } from "antd";
import useInterval from "@hook/useInterval";
const colors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#883997",
  "#8bf6ff",
  "#4ebaaa",
  "#6effe8",
  "#63a4ff",
  "#ff5983",
  "#fa5788",
  "#39796b",
  "#ffad42",
  "#7b5e57",
  "#ffff56",
  "#484848",
  "#6ab7ff",
];
function index(props) {
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const [state, _setState] = useState({
    data: [],
  });
  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  const loadData = () => {
    timesheetProvider.sumaryByDay(props.auth.id, new Date()).then((s) => {
      let totalHourYear = 0;
      s.forEach((item) => {
        totalHourYear += item.time;
      });
      let totalHourYear2 = totalHourYear / 1000;
      let hour = totalHourYear2 / 60 / 60;
      let minute = parseInt((totalHourYear2 % 3600) / 60);
      const getHour = (time) => {
        let hour = parseInt(time / 1000 / 60 / 60);
        let minute = parseInt(((time / 1000) % 3600) / 60);
        return hour + " giờ " + minute + " phút";
      };
      setState({
        totalProjectYear: s.length,
        totalHourYear: parseInt(hour) + " giờ, " + minute + " phút",
        totalHourYear2: totalHourYear2,
        data: s.map((item) => {
          item.percent = parseInt((item.time * 10000) / totalHourYear) / 100;
          item.hour = getHour(item.time);
          return item;
        }),
      });
    });
  };
  useEffect(() => {
    loadData();
  }, []);
  useInterval(() => {
    loadData();
  }, 10000);

  return (
    <Panel
      allowClose={false}
      id={"effortday"}
      title={`Effort trong ngày ${new Date().format("dd/MM/yyyy")}`}
    >
      <div className="panel-tag">
        {state.totalHourYear || "0 giờ"}/{state.totalProjectYear || 0} dự án
      </div>
      {state.data.map((item, index) => {
        return (
          <Tooltip title={item.hour} key={index}>
            <div>
              {item.projectName}-{item.productName} ({item.percent}%)
              <div class="progress progress-sm mb-3">
                <div
                  class="progress-bar bg-success-500"
                  role="progressbar"
                  style={{ width: item.percent + "%" }}
                  aria-valuenow="34"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </Tooltip>
        );
      })}
    </Panel>
  );
}

export default connect((state) => {
  return {
    auth: state.auth.auth,
  };
})(index);

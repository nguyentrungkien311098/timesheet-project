import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import actionTimeSheet from "@actions/timesheet";
import actionProject from "@actions/project";
import actionProduct from "@actions/product";
import snackbarUtils from "@utils/snackbar-utils";
import timesheetProvider from "@data-access/timesheet-provider";
import Chart from "chart.js";
import { Panel } from "@admin/components/admin";
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
  "#6ab7ff"
];
function index(props) {
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);
  const [state, _setState] = useState({
    data: {}
  });
  const setState = _state => {
    _setState(state => ({
      ...state,
      ...(_state || {})
    }));
  };

  const loadData = () => {
    timesheetProvider
      .sumaryByYear(props.auth.id, new Date().getFullYear())
      .then(s => {
        let totalHourYear = 0;
        s.forEach(item => {
          totalHourYear += item.time;
        });
        let totalHourYear2 = totalHourYear / 1000;
        let hour = totalHourYear2 / 60 / 60;
        let minute = parseInt((totalHourYear2 % 3600) / 60);
        setState({
          totalProjectYear: s.length,
          totalHourYear: parseInt(hour) + " giờ, " + minute + " phút"
        });
        if (chartRef.current) {
          const myChartRef = chartRef.current.getContext("2d");
          if (!chartRef2.current) {
            chartRef2.current = new Chart(myChartRef, {
              type: "doughnut",
              data: {
                labels: s.map(item => {
                  let projectName = item.projectName + "-" + item.productName;
                  return projectName;
                }),
                datasets: [
                  {
                    data: s.map(item => {
                      return parseInt((item.time * 100) / totalHourYear);
                    }),
                    backgroundColor: s.map((item, index) => {
                      return colors[index];
                    }),
                    hoverBackgroundColor: s.map((item, index) => {
                      return colors[index];
                    })
                  }
                ]
              },
              options: {
                tooltips: {
                  displayColors: false,
                  titleFontSize: 16,
                  bodyFontSize: 14,
                  xPadding: 10,
                  yPadding: 10,
                  callbacks: {
                    label: (tooltipItem, data) => {
                      let index = tooltipItem.index;
                      return `${data.labels[index]}: ${data.datasets[0].data[index]}%`;
                    }
                  }
                }
              }
            });
          }
        }
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
      id={"effortyear"}
      title={`Effort trong năm ${new Date().getFullYear()}`}
    >
      <div className="panel-tag">
        {state.totalHourYear || "0 giờ"}/{state.totalProjectYear || 0} dự án
      </div>
      <h3 className="title">
        <small></small>
      </h3>
      <canvas ref={chartRef} />
    </Panel>
  );
}

export default connect(state => {
  return {
    auth: state.auth.auth
  };
})(index);

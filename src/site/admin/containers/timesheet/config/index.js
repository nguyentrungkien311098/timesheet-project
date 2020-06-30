import React from 'react';
import MyProject from '@admin/components/MyProject'
import MyProduct from '@admin/components/MyProduct'
import MyJob from '@admin/components/MyJob';
import {AdminPage,Panel} from "@admin/components/admin";

function index(props) {
    return <AdminPage icon="subheader-icon fal fa-window"
        header="Cấu hình các thông tin timesheet"
        subheader="Phần cấu hình giúp bạn lọc nhanh những dự án, sản phẩm, công việc bạn đang tham gia."
    >
        <div className="panel-content">
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                    <a className="nav-link" data-toggle="tab" href="#tab_borders_icons-2" role="tab" aria-selected="false"><i className="fal fa-user mr-1"></i> Dự án</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" data-toggle="tab" href="#tab_borders_icons-1" role="tab" aria-selected="true"><i className="fal fa-home mr-1"></i> Sản phẩm</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-toggle="tab" href="#tab_borders_icons-3" role="tab" aria-selected="false"><i className="fal fa-clock mr-1"></i> Công việc</a>
                </li>
            </ul>
            <div className="tab-content border border-top-0 p-3">
                <div className="tab-pane fade active show" id="tab_borders_icons-1" role="tabpanel">
                    <MyProduct />
                </div>
                <div className="tab-pane fade" id="tab_borders_icons-2" role="tabpanel">
                    <MyProject />
                </div>
                <div className="tab-pane fade" id="tab_borders_icons-3" role="tabpanel">
                    <MyJob />
                </div>
            </div>
        </div>
    </AdminPage>
}
export default index;
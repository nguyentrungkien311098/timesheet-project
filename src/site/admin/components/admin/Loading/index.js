import React, { useEffect } from "react";
import "./style.scss";
export default function() {
  return (
    <div className="admin-loading">
      <div class="lds-dual-ring"></div>
      <div>Đang tải</div>
    </div>
  );
}

import React from "react";
import "./style.scss";
function index(props) {
  return (
    <div className={`admin-page ${props.className}`}>
      {props.subheader && props.header && (
        <div className="subheader">
          <h1 className="subheader-title">
            <i className={props.icon}></i> {props.header}
            {props.subheader && <small>{props.subheader}</small>}
          </h1>
        </div>
      )}
      {props.children}
    </div>
  );
}
export default index;

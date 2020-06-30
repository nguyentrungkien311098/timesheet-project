import React from "react";
import "./style.scss";
export default function index(props) {
  let title = props.title;
  const click = () => {
    if (props.onClick) {
      if (props.showSort) {
        let value = "";
        if (props.dataSort == 2) {
          value = 0;
        } else {
          if (props.dataSort == 1) {
            value = 2;
          } else {
            value = 1;
          }
        }
        props.onClick(props.sort_key, value);
      }
    }
  };
  return (
    <div
      //   {...props}
      className={`title-box ${props.className} ${
        props.showSort ? "mn-sortable" : ""
      }`}
      onClick={click}
    >
      {title}
      {props.showSort && (
        <div className="icon">
          {props.dataSort != 1 && (
            <img src={require("./images/ic-up.png")} className="sort-asc" />
          )}
          {props.dataSort != 2 && (
            <img src={require("./images/ic-down.png")} className="sort-desc" />
          )}
        </div>
      )}
    </div>
  );
}

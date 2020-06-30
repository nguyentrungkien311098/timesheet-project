import React, { useEffect } from "react";
import stringUtils from "mainam-react-native-string-utils";
import Head from "next/head";
import $ from "jquery";
import "./style.scss";

function index(props) {
  useEffect(() => {
    try {
      $("body").smartPanel();
      $("[data-original-title]").tooltip();
    } catch (e) {}
  }, []);
  let x = {};
  if (!props.sortable && props.sortable !== undefined) {
    x["data-panel-sortable"] = true;
  }
  if (props.allowClose === false) {
    x["data-panel-close"] = false;
  }
  if (props.allowFullScreen === false) {
    x["data-panel-fullscreen"] = false;
  }
  if (props.allowCollapse === false) {
    x["data-panel-collapsed"] = false;
  }
  if (props.allowSetting === false) {
    x["data-panel-setting"] = false;
  }

  return (
    <div id={props.id || stringUtils.guid()} className="panel" {...x}>
      <div className="panel-hdr color-success-600">
        <h2
          className="ui-sortable-handle"
          onDragOver={(e) => {
            console.log(e);
          }}
        >
          {props.title}
        </h2>
        {props.toolbar && <div className="panel-toolbar">{props.toolbar}</div>}
      </div>
      <div className="panel-container collapse fullscreen show">
        <div className="panel-content">{props.children}</div>
      </div>
      {props.bottom}
      <Head>
        <script src="/js/panel.js"></script>
      </Head>
    </div>
  );
}
export default index;

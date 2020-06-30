import react, { useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import Collapse from "@kunukn/react-collapse";
function index(props) {
  const [state, _setState] = useState({
    show: false
  });
  const setState = _state => {
    _setState(state => ({
      ...state,
      ...(_state || {})
    }));
  };

  const onClick = item => e => {
    if (props.toggle) {
      props.toggle(item);
    }
    if (!item.href || item.href == "#") {
      e.preventDefault();
      e.stopPropagation();
    } else {
    }
  };
  return (
    <li>
      {props.item.href && (!props.item.menus || !props.item.menus.length) ? (
        <Link
          onClick={onClick(props.item)}
          to={props.item.href}
          title={props.item.name}
          data-filter-tags={props.item.filter}
          className=" waves-effect waves-themed"
        >
          <i className={props.item.icon}></i>
          <span className="nav-link-text" data-i18n={props.item.i18n}>
            {props.item.name}
          </span>
        </Link>
      ) : (
        <a
          onClick={onClick(props.item)}
          href="#"
          title={props.item.name}
          data-filter-tags={props.item.filter}
          className=" waves-effect waves-themed"
        >
          <i className={props.item.icon}></i>
          <span className="nav-link-text" data-i18n={props.item.i18n}>
            {props.item.name}
          </span>
          <b class="collapse-sign">
            {props.item.open ? (
              <em class="fal fa-angle-down"></em>
            ) : (
              <em class="fal fa-angle-up"></em>
            )}
          </b>
        </a>
      )}
      {props.item.menus && props.item.menus.length ? (
        <Collapse
          elementType="ul"
          isOpen={props.item.open}
          collapseHeight="0px"
          transition={`height 290ms cubic-bezier(.4, 0, .2, 1)`}
        >
          {props.item.menus.map((item, index) => {
            return (
              <li key={index}>
                <Link
                  onClick={onClick(item)}
                  to={item.href}
                  title={item.name}
                  data-filter-tags={item.filter}
                  className=" waves-effect waves-themed"
                >
                  <span className="nav-link-text" data-i18n={item.i18n}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </Collapse>
      ) : null}
    </li>
  );
}

export default index;

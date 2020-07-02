import React, { useState, useEffect } from 'react';
import './index.scss';

function InputDetail({ title, value, width, table, style }) {
  return (
    <div className="search-type search-type-disabled">
      <div className="row">
        <div className={"col-md-" + width}>
          <span className="title-search-input">{title}</span>
        </div>
        <div className={"col-md-" + (12 - width)} style={style}>
          {table ? value : <div className="title-input-disabled">{value}</div>}
        </div>
      </div>
    </div>
  )
}

export { InputDetail };

import React from 'react'
import { Table } from 'antd';
import './style.scss';

export default function index(props) {
    let className = 'custom-table ';
    if (props.className)
        className += props.className
    return (
        <Table
            pagination={false}
            {...props}
            className={className}
        />
    )
}

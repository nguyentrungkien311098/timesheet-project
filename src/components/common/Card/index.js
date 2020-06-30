import React from 'react'
import './style.scss';

export default function index(props) {
    let className = 'mn-card ';
    if (props.className)
        className += props.className
    return (
        <div {...props} className={className}>

        </div>
    )
}

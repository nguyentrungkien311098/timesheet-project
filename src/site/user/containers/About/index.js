import React from 'react'
import './style.scss';
import { connect } from 'react-redux';
import actionAuth from '@actions/auth';
function index(props) {
    const onLogin = () => {
        props.onLogin("admin", "123456");
    }
    return (
        <div className='about-page'>
            about
            {props.username}
            {props.password}
            <button onClick={onLogin}>login</button>
        </div>
    )
}
export default connect(state => {
    return {
        username: state.auth.username,
        password: state.auth.password
    }
}, {
    onLogin: actionAuth.onLogin,
    onLogut: actionAuth.onLogout
})(index);

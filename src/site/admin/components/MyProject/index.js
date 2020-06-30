import React, { useState, useEffect } from 'react'
import { Transfer } from 'antd';
import { connect } from 'react-redux';
import authAction from '@actions/auth';
import stringUtils from 'mainam-react-native-string-utils';
import projectAction from '@actions/project';

function index(props) {
    const [state, _setState] = useState({
        isShowCreate: false,
        data: []
    });
    const setState = (_state) => {
        _setState(state => ({
            ...state, ...(_state || {})
        }))
    }
    useEffect(() => {
        props.loadListProject();
        props.loadMyProject();
        // getMock();
    }, []);

    useEffect(() => {
        let projects = (props.projects).map(item => ({
            key: item.id,
            title: item.name,
            description: item.name
        }));

        setState({
            projects: projects,
            targetKeys: props.myProjects.map(item => item.id)
        })
    }, [props.projects, props.myProjects]);

    const filterOption = (inputValue, option) => (option.description || "").toLowerCase().unsignText().indexOf((inputValue || "").toLowerCase().unsignText()) > -1;

    const handleChange = targetKeys => {
        setState({ targetKeys });
        props.setMyProject(targetKeys);
    };

    const handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    return (
        <Transfer
            listStyle={{
                width: 'calc((100% - 40px)/2)',
                height: 300,
            }}
            titles={['Chưa chọn', 'Đã chọn']}
            dataSource={state.projects}
            showSearch
            filterOption={filterOption}
            targetKeys={state.targetKeys}
            onChange={handleChange}
            onSearch={handleSearch}
            render={item => item.title}
        />
    )
}

export default connect(state => {
    return {
        myProjects: state.project.myProjects || [],
        projects: state.project.projects || []
    }
}, {
        updateData: projectAction.updateData,
        loadListProject: projectAction.loadListProject,
        loadMyProject: projectAction.loadMyProject,
        setMyProject: projectAction.setMyProject
    })(index)

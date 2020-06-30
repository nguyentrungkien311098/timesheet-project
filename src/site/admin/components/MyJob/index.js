import React, { useState, useEffect } from 'react'
import { Transfer } from 'antd';
import { connect } from 'react-redux';
import authAction from '@actions/auth';
import stringUtils from 'mainam-react-native-string-utils';
import jobAction from '@actions/job';

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
        props.loadListJob();
        props.loadMyJob();
        // getMock();
    }, []);

    useEffect(() => {
        let jobs = (props.jobs).map(item => ({
            key: item.id,
            title: item.name,
            description: item.name
        }));

        setState({
            jobs: jobs,
            targetKeys: props.myJobs.map(item => item.id)
        })
    }, [props.jobs, props.myJobs]);

    const filterOption = (inputValue, option) => (option.description || "").toLowerCase().unsignText().indexOf((inputValue || "").toLowerCase().unsignText()) > -1;

    const handleChange = targetKeys => {
        setState({ targetKeys });
        props.setMyJob(targetKeys);
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
            dataSource={state.jobs}
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
        myJobs: state.job.myJobs || [],
        jobs: state.job.jobs || []
    }
}, {
        updateData: jobAction.updateData,
        loadListJob: jobAction.loadListJob,
        loadMyJob: jobAction.loadMyJob,
        setMyJob: jobAction.setMyJob
    })(index)

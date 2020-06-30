import React, { useState, useEffect } from 'react'
import { Transfer } from 'antd';
import { connect } from 'react-redux';
import authAction from '@actions/auth';
import stringUtils from 'mainam-react-native-string-utils';
import productAction from '@actions/product';

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
        props.loadListProduct();
        props.loadMyProduct();
        // getMock();
    }, []);

    useEffect(() => {
        let products = (props.products).map(item => ({
            key: item.id,
            title: item.name,
            description: item.name
        }));

        setState({
            products: products,
            targetKeys: props.myProducts.map(item => item.id)
        })
    }, [props.products, props.myProducts]);

    const filterOption = (inputValue, option) => (option.description || "").toLowerCase().unsignText().indexOf((inputValue || "").toLowerCase().unsignText()) > -1;

    const handleChange = targetKeys => {
        setState({ targetKeys });
        props.setMyProduct(targetKeys);
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
            dataSource={state.products}
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
        myProducts: state.product.myProducts || [],
        products: state.product.products || []
    }
}, {
        updateData: productAction.updateData,
        loadListProduct: productAction.loadListProduct,
        loadMyProduct: productAction.loadMyProduct,
        setMyProduct: productAction.setMyProduct
    })(index)

import React from "react";
import App, { Container } from 'next/app';
import Head from 'next/head'
import { connect } from 'react-redux'
import Main from "./Main";
import stateUtils from 'mainam-react-utils';
import AppWithReactRouter from '../next/AppWithReactRouter';
stateUtils.init(React);

class MyApp extends App {
	static async getInitialProps({ Component, ctx, req }) {
		if (ctx.isServer) {
			// for first page load request, we may wanna do something ?
		}
		const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
		return { pageProps };
	}

	render() {
		const { Component, pageProps, store, head } = this.props;
		const _body = <Container>
			<Component {...pageProps} />
		</Container>
		return <Main body={_body} store={store} />
	}

}

export default AppWithReactRouter(MyApp);
import React, { Component } from "react";
import { persistStore, persistReducer } from "redux-persist";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import createEncryptor from "redux-persist-transform-encrypt";
import { Provider, connect } from "react-redux";
import withRedux from "next-redux-wrapper";
import reducers from "@redux-store/reducers";
import storage from "redux-persist/lib/storage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { FacebookProvider, CustomChat } from "react-facebook";
import clientUtils from "@utils/client-utils";
// import "bootstrap/scss/bootstrap.scss";
import "@styles/bootstrap-override.scss";
import "@styles/app.scss";
import WebHeader from "@components/WebHeader";
import Head from "next/head";
import { withRouter } from "next/router";
import stringUtils from "mainam-react-native-string-utils";

const encryptor = createEncryptor({
  secretKey: "private-encrypt-key",
  onError: function(error) {
    // Handle the error.
  }
});

const makeStore = (initialState, options) => {
  let store;
  if (!options.isServer) {
    const persistConfig = {
      key: "root-product",
      storage,
      transforms: [encryptor]
    };
    store = createStore(
      persistReducer(persistConfig, reducers),
      initialState,
      compose(applyMiddleware(thunk))
    );
    store.__PERSISTOR = persistStore(store);
  } else {
    store = createStore(
      reducers,
      initialState,
      compose(applyMiddleware(thunk))
    );
  }
  return store;
};

class Main extends Component {
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Head>
          <meta charSet="utf-8" />
          <title>Portal</title>
          <meta name="description" content="AltEditor (beta)" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, minimal-ui"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="msapplication-tap-highlight" content="no" />

          <link
            href="https://fonts.googleapis.com/css?family=Muli&display=swap"
            rel="stylesheet"
          ></link>
          <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>

          <link
            rel="stylesheet"
            media="screen, print"
            href="/css/vendors.bundle.css"
          />
          <link
            rel="stylesheet"
            media="screen, print"
            href="/css/app.bundle.css"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/img/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/img/favicon/favicon-32x32.png"
          />
          <link
            rel="mask-icon"
            href="/img/favicon/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link
            rel="stylesheet"
            media="screen, print"
            href="/css/datagrid/datatables/datatables.bundle.css"
          />
          <link
            rel="stylesheet"
            media="screen, print"
            href="/css/theme-demo.css"
          />
          <script src="/js/vendors.bundle.js"></script>
          <script src="/js/app.bundle.js"></script>
        </Head>

        <WebHeader />
        <PersistGate persistor={this.props.store.__PERSISTOR} loading={null}>
          <ToastContainer autoClose={3000} />
          <Provider store={this.props.store}>
            <div className="app">
              <div className="main-content">{this.props.body}</div>
            </div>
          </Provider>
        </PersistGate>
        {/* <FacebookProvider appId="313919028686873" chatSupport>
            <CustomChat pageId="425898327604484" minimized={false} />
          </FacebookProvider> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth.auth
  };
}

export default withRouter(withRedux(makeStore)(connect(mapStateToProps)(Main)));

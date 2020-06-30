import React from 'react'
import Loadable from 'react-loadable';
import { Route, Link, Switch } from "react-router-dom";
import { Redirect } from 'react-router';
// import Header from '@user/components/Header';
// import Footer from '@user/components/Footer';
import RouterWithPaths from '@components/RouterWithPaths';
function Loading() {
    return <div></div>;
}
export default function index(props) {
    const routers = [
        {
            path: ["/gioi-thieu"],
            component: Loadable({
                loader: () => import('@user/containers/About'),
                loading: Loading,
            })
        },
        {
            path: ["/tin-tuc", "/tin-tuc/:alias", "/tin-tuc/:function1/:function1"],
            component: Loadable({
                loader: () => import('@user/containers/News'),
                loading: Loading,
            })
        }
    ]
    return (
        <div>
            {/* <Header /> */}
            <Switch>
                {
                    routers.map((route, key) => {
                        if (route.component)
                            return <RouterWithPaths exact key={key}
                                path={route.path}
                                render={props => {
                                    return <route.component {...props} />
                                }} />
                        return null;
                    })
                }
            </Switch>
            {/* <Footer /> */}
        </div>
    )
}

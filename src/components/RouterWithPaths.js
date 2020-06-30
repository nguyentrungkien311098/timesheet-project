import React from 'react';
import { Switch, Route } from 'react-router-dom';
export default ({ path, ...rest }) => (
    <Switch>
        {typeof path === 'string' ? <Route path={path} {...rest} /> :
            path.map((item, index) => (
                <Route path={item} {...rest} key={index} />
            ))}
    </Switch>
)


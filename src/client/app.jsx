import './style/main.scss';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory, hashHistory, IndexRoute} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './component/pages/App';
import Home from './component/pages/Home';
import ContestantList from './component/pages/ContestantList';
import ContestantVote from './component/pages/ContestantVote';
import ContestantRegister from './component/pages/ContestantRegister';
import ContestantEdit from './component/pages/ContestantEdit';

injectTapEventPlugin();

let root = document.getElementById('app');
if (!root) {
    root = document.body;
}

render(
    <MuiThemeProvider>
        <Router history={browserHistory}>
            <Route
                path='/'
                component={App}
            >
                <IndexRoute component={Home}/>
                <Route
                    path='/list'
                    component={ContestantList}
                />
                <Route
                    path='/list/:token'
                    component={ContestantVote}
                />
                <Route
                    path='/register'
                    component={ContestantRegister}
                />
                <Route
                    path='/edit'
                    component={ContestantEdit}
                />

            </Route>
        </Router>
    </MuiThemeProvider>
    , document.getElementById('app'));

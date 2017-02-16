import './style/main.scss';

import React from 'react';
import {render} from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ProductList from './component/pages/ProductList';
import App from './component/pages/App';
import Home from './component/pages/Home'
import ContestantList from './component/pages/ContestantList';
import ContestantForm from './component/pages/ContestantForm';


let root = document.getElementById('app');
if (!root) {
    root = document.body;
}

render((
    <MuiThemeProvider>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="/contestantlist" component={ContestantList}/>
                <Route path="/contestantform" component={ContestantForm}/>
            </Route>
        </Router>
    </MuiThemeProvider>
), document.getElementById('app'));
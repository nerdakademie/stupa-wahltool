import './style/main.scss';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory} from 'react-router'
//import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ProductList from './component/ProductList';
import Home from './component/Home';
import ContestantList from './component/ContestantList';
import ContestantForm from './component/ContestantForm';

//injectTapEventPlugin(); /* TODO Wofür ist das da? Und wird das wirklich benötigt? */

let root = document.getElementById('app');
if (!root) {
    root = document.body;
}

render((
    <MuiThemeProvider>
    <Router history={hashHistory}>
        <Route path="/" component={Home}/>
        {/* add the routes here */}
        <Route path="/contestantlist" component={ContestantList}/>
        <Route path="/contestantform" component={ContestantForm}/>
    </Router>
    </MuiThemeProvider>
), document.getElementById('app'))
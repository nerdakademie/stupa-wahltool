import './style/main.scss';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './component/pages/App';
import Home from './component/pages/Home';
import ContestantList from './component/pages/ContestantList';
import ContestantForm from './component/pages/ContestantForm';
import StudentList from './component/pages/StudentList';

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
        <IndexRoute component={Home} />
        <Route
          path='/list'
          component={ContestantList}
        />
        <Route
          path='/register'
          component={ContestantForm}
        />
        <Route
          path='/student'
          component={StudentList}
        />

      </Route>
    </Router>
  </MuiThemeProvider>
, document.getElementById('app'));

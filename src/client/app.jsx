import './style/main.scss';

import injectTapEventPlugin from 'react-tap-event-plugin';

import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ProductList from './component/ProductList';
import ContestantList from './component/ContestantList';

injectTapEventPlugin();

let root = document.getElementById('app');
if (!root) {
  root = document.body;
}

render(<MuiThemeProvider><ContestantList /></MuiThemeProvider>, root);

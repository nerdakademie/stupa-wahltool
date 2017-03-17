import React from 'react';
import {IndexLink} from 'react-router';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import NavLink from '../NavLink';
import Footer from '../Footer';
import Home from './Home';

function App(props) {
  const styles = {
    appBar: {
      position: 'fixed',
      top: '0',
      left: '0',
      backgroundColor: '#891400'
    },
    buttons: {
      marginTop: '8px'
    }
  };

  return (
    <div>
      <AppBar
        className='topbar'
        title='AINF-Wahl 2017'
        style={styles.appBar}
        showMenuIconButton={false}
        iconElementRight={<div style={styles.buttons}>
          <IndexLink to='/' activeClassName='active'><FlatButton label='Home / Infos' /></IndexLink>
          <NavLink to='/list'><FlatButton label='Bewerber' /></NavLink>
          <NavLink to='/register'><FlatButton label='Aufstellen' /></NavLink>
          <NavLink to='/edit'><FlatButton label='Bearbeiten' /></NavLink>
          <NavLink to='/result'><FlatButton label='Wahlergebnis' /></NavLink>
        </div>}
      />
      <div className='appContent'>
        {props.children || <Home />}
      </div>
      <Footer>{'(c) 2017 '}<a className='nerdakademie' href='https://nerdakademie.xyz'>{'Nerdakademie'}</a> | <a className='nerdakademie' href='https://github.com/nerdakademie/stupa-wahltool'>{'v1.3.0'}</a></Footer>
    </div>
  );
}

export default App;

import React from 'react';
import {IndexLink} from 'react-router';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import NavLink from '../NavLink';
import Footer from '../Footer';
import Home from './Home';

export default React.createClass({

  render() {
    const styles = {
      appBar: {
        position: 'fixed',
        top: '0',
        left: '0',
        backgroundColor: '#011F53'
      },
      buttons: {
        marginTop: '8px'
      }
    };

    const buttonStyle = {
      backgroundColor: 'transparent',
      color: 'white'
    };

            return (
            <div>
                <AppBar
                    className='topbar'
                    title='Stupa-Wahl 2017'
                    style={styles.appBar}
                    showMenuIconButton={false}
                    iconElementRight={<div style={styles.buttons}>
                        <IndexLink to='/' activeClassName='active'><FlatButton label='Home / Infos' /></IndexLink>
                        <NavLink to='/list'><FlatButton label='Bewerber' /></NavLink>
                        <NavLink to='/register'><FlatButton label='Aufstellen' /></NavLink>
                    <NavLink to='/edit'><FlatButton label='Bearbeiten' /></NavLink>
                    </div>}
                />
                {this.props.children || <Home />}
                <Footer>(c) 2017 <a className='nerdakademie' href='https://nerdakademie.xyz'>Nerdakademie</a> | <a className='nerdakademie' href='https://github.com/nerdakademie/stupa-wahltool'>v1.1.0</a></Footer>
            </div>
        );
    }
});
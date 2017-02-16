import React, {Component} from 'react';
import {IndexLink} from 'react-router'
import AppBar from 'material-ui/AppBar';
import NavLink from '../NavLink'
import Footer from '../Footer'
import Home from './Home'
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';


export default React.createClass({

    render(){
        const styles = {
            appBar: {
                position: 'absolute',
                top: '0',
                left: '0'
            },
            buttons: {
                'margin-top': '8px',
            }
        };

        var buttonStyle = {
            backgroundColor: 'transparent',
            color: 'white'
        };

            return (
            <div>
                <AppBar
                    className="topbar"
                    title="Stupa-Wahl 2017"
                    style={styles.appBar}
                    showMenuIconButton={false}
                    iconElementRight={<div style={styles.buttons}>
                        <IndexLink to="/" activeClassName="active"><FlatButton label="Home / Infos" /></IndexLink>
                        <NavLink to="/contestantlist"><FlatButton label="Liste" /></NavLink>
                        <NavLink to="/contestantform"><FlatButton label="Formular" /></NavLink>
                    </div>}
                />
                {this.props.children || <Home/>}
                <Footer>(c) 2017 Nerdakademie</Footer>
            </div>
        )
    }
})
import React from 'react'
import { IndexLink } from 'react-router'
import NavLink from '../NavLink'
import Home from './Home'

export default React.createClass({
    render() {
        return (
            <div>
                <ul role="nav">
                    <li><IndexLink to="/" activeClassName="active">Home / Infos</IndexLink></li>
                    <li><NavLink to="/contestantlist">Liste</NavLink></li>
                    <li><NavLink to="/contestantform">Formular</NavLink></li>
                </ul>
                {this.props.children || <Home/>}
            </div>
        )
    }
})
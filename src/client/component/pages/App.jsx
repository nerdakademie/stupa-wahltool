import React from 'react'
import NavLink from '../NavLink'
import Home from './Home'

export default React.createClass({
    render() {
        return (
            <div>
                <ul role="nav">
                    <li><NavLink to="/contestantlist">Liste</NavLink></li>
                    <li><NavLink to="/contestantform">Formular</NavLink></li>
                </ul>
                {this.props.children || <Home/>}
            </div>
        )
    }
})
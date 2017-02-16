import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
    render() {
        return (
            <div>
                <ul role="nav">
                    <li><Link to="/contestantlist">Liste</Link></li>
                    <li><Link to="/contestantform">Formular</Link></li>
                </ul>
            </div>
        )
    }
})
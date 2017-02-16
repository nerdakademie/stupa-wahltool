import React from 'react'

export default React.createClass({
    render() {
        return (
            <div>
                <div className='footer'>
                    {this.props.children}
                </div>
            </div>
        );
    }
});
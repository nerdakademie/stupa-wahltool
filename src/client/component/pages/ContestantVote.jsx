import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import AutoResponsive from 'autoresponsive-react';
import nl2br from 'react-nl2br';
import Avatar from 'material-ui/Avatar';
import request from 'superagent';
import {Scrollbars} from 'react-custom-scrollbars';

class ContestantVote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contestants: [],
            itemMargin: 10,
            horizontalDirection: 'left',
            gridWidth: 100,
            verticalDirection: 'top',
            containerHeight: null,
            activeCheckboxes: new Set()
        };
    };

    getAutoResponsiveProps() {
        return {
            horizontalDirection: this.state.horizontalDirection,
            verticalDirection: this.state.verticalDirection,
            itemMargin: this.state.itemMargin,
            containerWidth: this.state.containerWidth,
            itemClassName: 'item',
            containerHeight: this.state.containerHeight,
            transitionDuration: '.5',
            transitionTimingFunction: 'easeIn'
        };
    };

    loadContestants() {
        $.getJSON('/api/contestants/', (contestants) => {
            this.setState({
                contestants
            });
        });
    };

    componentDidMount() {
        this.loadContestants();
        window.addEventListener('resize', () => {
            if (ReactDOM.findDOMNode(this.AutoResponsiveContainer) !== null) {
                this.setState({
                    containerWidth: ReactDOM.findDOMNode(this.AutoResponsiveContainer).clientWidth
                });
            }
        }, false);
    };

    handleCheck(id) {
        if (this.state.activeCheckboxes.has(id)) {
            this.state.activeCheckboxes.delete(id);
        } else {
            this.state.activeCheckboxes.add(id);
        }
    };

    handleFormSubmit(formSubmitEvent) {
        formSubmitEvent.preventDefault();
        const $token = $('#token');
        this.resetErrors();
        let errors = 0;
        if (errors === 0) {
            const form = new FormData();
            form.append('token', $token.val());
            form.append('contestantIDs', Array.from(this.state.activeCheckboxes));

            request.post('/api/votes/')
                .send(form)
                .end((error, resp) => {
                    if (error) {
                        console.error(error);
                    }
                    if (resp.statusCode === 200) {
                        if (resp.body.success === false) {
                            miniToastr.error(resp.body.error.text, 'Error');
                        } else {
                            this.setState({
                                activeRender: this.successRender.bind(this),
                                responseBody: resp.body
                            });
                        }
                    }
                    return resp;
                });
        }
    };



    resetErrors() {
        this.setState({
            name_error: null,
            course_error: null,
            year_error: null,
            description_error: null
        });
    }

    render() {
        const fullwidth = {
            width: '100%'
        };
        const shadow = 1;
        const width = 350;
        const height = 650;
        const style = {
            width,
            height
        };
        return (
            <div className='contestantList'>
                <form method='post' style={fullwidth}>
                    <AutoResponsive
                        ref={(c) => {
                            this.AutoResponsiveContainer = c;
                        }}
                        {...this.getAutoResponsiveProps()}
                    >
                        {this.state.contestants.map(contestant => <Card
                            key={contestant._id} style={style} containerStyle={{
                            width,
                            height
                        }} zDepth={shadow}
                        >
                            <CardHeader
                                title={`${contestant.firstName} ${contestant.lastName}`}
                                subtitle={contestant.centuria}
                                avatar={<Avatar
                                    src={`img/${contestant.image}`}
                                    style={{borderRadius: 0}}
                                    size={125}
                                />}
                            />
                            <Scrollbars
                                autoHeight
                                autoHeightMin={0}
                                autoHeightMax={443}
                            >
                                <CardText >{nl2br(contestant.description)}</CardText>
                            </Scrollbars>

                            <CardActions>
                                <Checkbox label="Wählen" onCheck={() => this.handleCheck(contestant._id)}
                                />
                            </CardActions>
                        </Card>)}
                    </AutoResponsive>
                    <input type="text" hidden="hidden" id="token" value={this.props.params.token}/>
                    <FlatButton
                        label='Wahl abschließen' onClick={this.handleFormSubmit.bind(this)} backgroundColor='#4a89dc'
                        hoverColor='#357bd8' labelStyle={{color: '#fff'}} style={fullwidth}
                    />
                </form>
                <h2>{this.props.params.token}</h2>
            </div>
        );
    }
}

export default ContestantVote;
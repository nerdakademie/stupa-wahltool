import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import AutoResponsive from 'autoresponsive-react';
import nl2br from 'react-nl2br';
import Avatar from 'material-ui/Avatar';
import miniToastr from 'mini-toastr';
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
      activeCheckboxes: new Set(),
      activeRender: this.formRender.bind(this),

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
      $.ajax({
        method: "POST",
        url: '/api/votes/',
        data: {token: $token.val(), contestantIDs: Array.from(this.state.activeCheckboxes)}
      })
        .done(function (data) {
          if (data['error']) {
            console.error(data['error']);
          }
          if (data['resp'].statusCode === 200) {
            if (data['resp'].body.success === false) {
              miniToastr.error(data['resp'].body.error.text, 'Error');
            } else {
              this.setState({
                activeRender: this.successRender.bind(this),
                responseBody: data['resp'].body
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

  formRender() {
    const fullwidth = {
      width: '90%'
    };
    const shadow = 1;
    const width = 350;
    const height = 650;
    const style = {
      width,
      height
    };
    return (
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
        <h2>{this.props.params.token}</h2>
      </form>
    );
  }

  successRender() {
    return (
      <form id='form'>
        <p>Vielen Dank, dass du abgestimmt hast. <br />
          Dasch für ein Demokratie wischtich, nä versteheeeste?<br />
        </p>
      </form>
    );
  };

  render() {
    return (

      <div className='contestantList'>
        {this.state.activeRender()}
      </div>
    );
  }
}

export default ContestantVote;
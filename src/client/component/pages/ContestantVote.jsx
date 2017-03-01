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
      votedContestants: [],
      itemMargin: 10,
      horizontalDirection: 'left',
      gridWidth: 100,
      verticalDirection: 'top',
      containerHeight: null,
      activeCheckboxes: new Set(),
      activeRender: this.formRender.bind(this)
    };
    miniToastr.init();
  }

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
  }

  loadContestants() {
    $.getJSON('/api/contestants/', (contestants) => {
      this.setState({
        contestants
      });
    });
  }

  loadExistingVote() {
    $.getJSON(`/api/votes/${this.props.params.token}`, (votedContestants) => {
      this.setState({
        votedContestants
      });
    });
  }

  componentDidMount() {
    this.loadContestants();
    this.loadExistingVote();
    window.addEventListener('resize', () => {
      if (ReactDOM.findDOMNode(this.AutoResponsiveContainer) !== null) {
        this.setState({
          containerWidth: ReactDOM.findDOMNode(this.AutoResponsiveContainer).clientWidth
        });
      }
    }, false);
  }

  handleCheck(id) {
    if (this.state.activeCheckboxes.has(id)) {
      this.state.activeCheckboxes.delete(id);
    } else {
      this.state.activeCheckboxes.add(id);
    }
  }

  addExistingVotes() {
    for (const votedID of this.state.votedContestants) {
      this.state.activeCheckboxes.add(votedID);
    }
  }

  handleFormSubmit(formSubmitEvent) {
    this.addExistingVotes();
    formSubmitEvent.preventDefault();
    const $token = $('#token');
    $.ajax({
      method: 'POST',
      url: '/api/votes/',
      data: JSON.stringify({token: $token.val(),
        contestantIDs: Array.from(this.state.activeCheckboxes)}),
      contentType: 'application/json',
      dataType: 'json'
    }).done((data, status, xhr) => {
      if (xhr.status === 200) {
        if (data.success === false) {
          miniToastr.error(data.error.text, 'Error');
        } else {
          this.setState({
            activeRender: ContestantVote.successRender,
            responseBody: data
          });
        }
      } else if (data.success === false) {
        miniToastr.error(data.error.text, 'Error');
      } else {
        miniToastr.error('Fehler beim Empfang der Bestätigung', 'Error');
      }
    }).fail((xhr) => {
      if (xhr.responseJSON.success === false) {
        miniToastr.error(xhr.responseJSON.error.text, 'Error');
      }
    });
  }

  alreadyVoted(contestantID) {
    return this.state.votedContestants.includes(contestantID);
  }

  static createCard(contestant) {
    const shadow = 1;
    const width = 350;
    const height = 640;
    const style = {
      width,
      height
    };
    return (
      <Card
        key={contestant._id} style={style} containerStyle={{
          width,
          height
        }} zDepth={shadow}
      >
        <CardHeader
          title={`${contestant.firstName} ${contestant.lastName}`}
          subtitle={contestant.centuria}
          avatar={<Avatar
            src={`../img/${contestant.image}`}
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
          <Checkbox
            label='Wählen'
            onCheck={() => { this.handleCheck(contestant._id); }}
            defaultChecked={this.alreadyVoted(contestant._id)}
            disabled={this.alreadyVoted(contestant._id)}
          />
        </CardActions>
      </Card>);
  }

  formRender() {
    const fullWidth = {
      width: '90%'
    };
    return (
      <form method='post' style={fullWidth}>
        <AutoResponsive
          ref={(c) => {
            this.AutoResponsiveContainer = c;
          }}
          {...this.getAutoResponsiveProps()}
        >
          {this.state.contestants.map(ContestantVote.createCard, this)}
        </AutoResponsive>
        <input type='text' hidden='hidden' id='token' value={this.props.params.token} />
        <FlatButton
          label='Wahl abschließen' onClick={this.handleFormSubmit.bind(this)} backgroundColor='#4a89dc'
          hoverColor='#357bd8' labelStyle={{color: '#fff'}} style={{width: '100%'}}
        />
      </form>
    );
  }

  static successRender() {
    return (
      <form id='form'>
        <p>Vielen Dank, dass du abgestimmt hast. <br />
          Die Ergebnisse der Wahl werden zum Ende der Stupa-Wahl veröffentlicht<br />
        </p>
      </form>
    );
  }

  render() {
    return (

      <div className='contestantList'>
        {this.state.activeRender()}
      </div>
    );
  }
}

export default ContestantVote;

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
      activeCheckboxes: new Set(),
      activeRender: this.formRender.bind(this)
    };
    miniToastr.init();
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
      if (votedContestants.success !== false) {
        this.setState({
          votedContestants
        });
      }
    });
  }

  componentDidMount() {
    this.loadContestants();
    this.loadExistingVote();
  }

  handleCheck(checkedState, id) {
    if (checkedState === false && this.state.activeCheckboxes.has(id)) {
      this.state.activeCheckboxes.delete(id);
    } else if (checkedState) {
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
    })
        .fail((xhr) => {
          if (xhr.responseJSON.success === false) {
            miniToastr.error(xhr.responseJSON.error.text, 'Error');
          }
        });
  }

  alreadyVoted(contestantID) {
    return this.state.votedContestants.includes(contestantID);
  }

  static createCard(contestant) {
    return (
      <Card
        key={contestant._id}
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
        <CardActions>
          <Checkbox
            label='Wählen'
            onCheck={(event, isChecked) => { this.handleCheck(isChecked, contestant._id); }}
            defaultChecked={this.alreadyVoted(contestant._id)}
            disabled={this.alreadyVoted(contestant._id)}
          />
        </CardActions>
        <Scrollbars
          autoHeight
          autoHeightMin={0}
          autoHeightMax={443}
        >
          <CardText >{nl2br(contestant.description)}</CardText>
        </Scrollbars>
      </Card>);
  }

  formRender() {
    return (
      <form className='voteForm' method='post'>
        <div className='contestantList'>
        {this.state.contestants.map(ContestantVote.createCard, this)}
        </div>
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
        <p>{'Vielen Dank, dass du abgestimmt hast. '}<br />
          {'Die Ergebnisse der Wahl werden zum Ende der Stupa-Wahl veröffentlicht'}<br />
        </p>
      </form>
    );
  }

  render() {
    return (
      <div>
        {this.state.activeRender()}
      </div>
    );
  }
}

ContestantVote.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default ContestantVote;

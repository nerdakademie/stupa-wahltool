import React, {Component} from 'react';
import $ from 'jquery';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import nl2br from 'react-nl2br';
import Avatar from 'material-ui/Avatar';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import {Scrollbars} from 'react-custom-scrollbars';
import miniToastr from 'mini-toastr';

class ContestantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contestants: [],
      votedContestants: [],
      activeCheckboxes: new Set(),
      voteMode: this.props.params.token !== undefined,
      token: this.props.params.token
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
    $.getJSON(`/api/votes/${this.state.token}`, (votedContestants) => {
      if (votedContestants.success !== false) {
        this.setState({
          votedContestants
        });
      }
    });
  }

  componentDidMount() {
    this.loadContestants();
    if (this.state.voteMode) {
      this.loadExistingVote();
    }
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

  alreadyVoted(contestantID) {
    return this.state.votedContestants.includes(contestantID);
  }

  handleFormSubmit(formSubmitEvent) {
    this.addExistingVotes();
    formSubmitEvent.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/votes/',
      data: JSON.stringify({token: this.state.token,
        contestantIDs: Array.from(this.state.activeCheckboxes)}),
      contentType: 'application/json',
      dataType: 'json'
    }).done((data, status, xhr) => {
      if (xhr.status === 200) {
        if (data.success === false) {
          miniToastr.error(data.error.text, 'Error');
        } else {
          miniToastr.info('Wahl erfolgreich', 'Info');
          this.setState({votedContestants: Array.from(this.state.activeCheckboxes)});
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

  static createCard(contestant) {
    return (
      <Card
        key={contestant._id}
        className='card'
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
        {this.state.voteMode === true &&
        <CardActions>
          <Checkbox
            label='Wählen'
            onCheck={(event, isChecked) => { this.handleCheck(isChecked, contestant._id); }}
            defaultChecked={this.alreadyVoted(contestant._id)}
            disabled={this.alreadyVoted(contestant._id)}
          />
        </CardActions>
        }
        <Scrollbars
          autoHeight
          autoHeightMin={0}
          autoHeightMax={443}
        >
          <CardText >{nl2br(contestant.description)}</CardText>
        </Scrollbars>
      </Card>

    );
  }

  render() {
    return (
      <div>
        <div className='contestantList'>
          {this.state.contestants.map(ContestantList.createCard, this)}
        </div>
        {this.state.voteMode &&
          <FlatButton
            label='Wahl abschließen' onClick={this.handleFormSubmit.bind(this)} backgroundColor='#4a89dc'
            hoverColor='#357bd8' labelStyle={{color: '#fff'}} style={{width: '100%'}}
          />
          }
      </div>
    );
  }
}

export default ContestantList;

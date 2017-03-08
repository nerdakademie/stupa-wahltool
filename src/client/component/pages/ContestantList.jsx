import React, {Component} from 'react';
import $ from 'jquery';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import nl2br from 'react-nl2br';
import Avatar from 'material-ui/Avatar';
import {Scrollbars} from 'react-custom-scrollbars';

class ContestantList extends Component {
  constructor() {
    super();
    this.state = {
      contestants: []
    };
  }

  loadContestants() {
    $.getJSON('/api/contestants/', (contestants) => {
      this.setState({
        contestants
      });
    });
  }

  componentDidMount() {
    this.loadContestants();
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
      <div className='contestantList'>
        {this.state.contestants.map(ContestantList.createCard)}
      </div>
    );
  }
}

export default ContestantList;

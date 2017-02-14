import React, {Component} from 'react';
import $ from 'jquery';
import {Card, CardHeader, CardText} from 'material-ui/Card';

class ContestantList extends Component {
  constructor() {
    super();
    this.state = {contestants: []};
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
      <Card key={contestant._id}>
        <CardHeader
          title={contestant.name}
          subtitle={`${contestant.year}`}
        />
      <CardText>{contestant.description}</CardText>
      </Card>
    );
  }

  render() {
    return (
      <div>
        {this.state.contestants.map(ContestantList.createCard)}
      </div>
    );
  }
}

export default ContestantList;

import React, {Component} from 'react';
import $ from 'jquery';
import {Card, CardHeader, CardText} from 'material-ui/Card';

class ContestantList extends Component {
  constructor() {
    super();
    this.state = {contestants: []};
  }

  loadProducts() {
    $.getJSON('/api/contestant/', (contestants) => {
      this.setState({
        contestants
      });
    });
  }

  componentDidMount() {
    this.loadProducts();
  }

  static createCard(contestant) {
    return (
      <Card key={contestant.name}>
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

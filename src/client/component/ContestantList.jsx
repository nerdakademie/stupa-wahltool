import React, {Component} from 'react';
import $ from 'jquery';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

class ContestantList extends Component {
  constructor() {
    super();
    this.state = {contestants: [], shadow: 1};
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


  onMouseOver = () => this.setState({shadow: 3})
  onMouseOut = () => this.setState({shadow: 1})

  static createCard(contestant) {
    const style = {
      margin: 12,
    };
    return (
      <Card key={contestant._id} containerStyle={{width: 300}} zDepth={this.state.shadow}
        onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        <CardHeader
          title={contestant.name}
          subtitle={`${contestant.year}`}
        />
      <CardText>{contestant.description}</CardText>
      <CardActions>
        <RaisedButton
          label="Abstimmen"
          style={style}
          backgroundColor="#a4c639" />
      </CardActions>
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

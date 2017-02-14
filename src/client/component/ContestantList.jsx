import React, {Component} from 'react';
import $ from 'jquery';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

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


  static createCard(contestant, shadow) {
    var shadow = 1;
    const style = {
      margin: 12,
    };
    onMouseOver() {
      shadow = 3;
    }
    onMouseOut() {
      shadow = 1;
    }
    return (
      <Card key={contestant._id} containerStyle={{width: 300}} zDepth={shadow}
        onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
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
        {this.state.contestants.map(ContestantList.createCard, this.state.shadow)}
      </div>
    );
  }
}

export default ContestantList;

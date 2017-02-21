import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import AutoResponsive from 'autoresponsive-react';
import nl2br from 'react-nl2br';

class ContestantList extends Component {
  constructor() {
    super();
    this.state = {
      contestants: [],
      itemMargin: 10,
      horizontalDirection: 'left',
      gridWidth: 100,
      verticalDirection: 'top',
      containerHeight: null
    };
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

  componentDidMount() {
    this.loadContestants();
    window.addEventListener('resize', () => {
      this.setState({
        containerWidth: ReactDOM.findDOMNode(this.AutoResponsiveContainer).clientWidth
      });
    }, false);
  }

  static createCard(contestant) {
    const shadow = 1;
    const width = 350;
    const height = 450;
    const checkbox = {
      marginBottom: 16

    };
    return (
        <Card
          key={contestant._id}  style={{width,
          height}} containerStyle={{width, height}} zDepth={shadow}
        >
          <CardHeader
            title={`${contestant.firstName} ${contestant.lastName}`}
            subtitle={contestant.centuria}
            avatar={`img/${contestant.image}`}
          />
          <CardText >{nl2br(contestant.description)}</CardText>
        </Card>
    );
  }

  render() {
    return (
      <div className='contestantList'>
        <AutoResponsive
          ref={(c) => { this.AutoResponsiveContainer = c; }}
          {...this.getAutoResponsiveProps()}
        >
          {this.state.contestants.map(ContestantList.createCard)}
        </AutoResponsive>
      </div>
    );
  }
}

export default ContestantList;

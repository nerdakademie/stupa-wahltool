import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import AutoResponsive from 'autoresponsive-react';

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
    let width = 300;
    let height = 450;
    const checkbox = {
      marginBottom: 16

    };
    return (
        <Card
          key={contestant._id} style={{width,
            height}} containerStyle={{width: 300, height: 450}} zDepth={shadow}
        >
          <CardHeader
            title={contestant.name}
            subtitle={`${contestant.year}`}
          />
          <CardText actAsExpander={true} style={{'minHeight': 100,
            'maxHeight': 300,
            'height': '100%',
          'overflow': 'hidden'}}>{contestant.description.split('\n').map((item, key) => {
            return (
              <span key={key}>
                {item}
                <br />
              </span>
            );
          })}</CardText>
          <CardActions expandable={true}>
            <Checkbox
              label='Wählen'
              style={checkbox}
            />
          </CardActions>
        </Card>
    );
  }

  render() {
    return (
      <div>
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

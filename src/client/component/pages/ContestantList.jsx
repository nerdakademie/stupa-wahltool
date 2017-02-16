import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import AutoResponsive from 'autoresponsive-react';

class ContestantList extends Component {
  constructor() {
    super();
    this.state = {
      contestants: [],
      itemMargin: 10,
      horizontalDirection: 'left',
      verticalDirection: 'top',
      containerHeight: null
    };
  }

  getAutoResponsiveProps() {
    return {
      horizontalDirection: this.state.horizontalDirection,
      verticalDirection: this.state.verticalDirection,
      itemMargin: this.state.itemMargin,
      containerWidth: this.state.containerWidth || this.props.containerWidth,
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
        containerWidth: ReactDOM.findDOMNode(this.refs.container).clientWidth
      });
    }, false);
  }

  static createCard(contestant) {
    const shadow = 1;
    const style = {
      margin: 12
    };

    return (
      <Card
        key={contestant._id} style={{width: 300,
          height: 550}} containerStyle={{width: 300}} zDepth={shadow}
      >
        <CardHeader
          title={contestant.name}
          subtitle={`${contestant.year}`}
        />
        <CardText>{contestant.description}</CardText>
        <CardActions>
          <RaisedButton
            label='Abstimmen'
            style={style}
            backgroundColor='#a4c639'
          />
        </CardActions>
      </Card>
    );
  }

  render() {
    return (
      <div>
        <AutoResponsive ref='container' {...this.getAutoResponsiveProps()}>
          {this.state.contestants.map(ContestantList.createCard)}
        </AutoResponsive>
      </div>
    );
  }
}

export default ContestantList;

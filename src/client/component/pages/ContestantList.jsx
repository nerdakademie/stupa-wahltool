import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import AutoResponsive from 'autoresponsive-react';
import nl2br from 'react-nl2br';
import Avatar from 'material-ui/Avatar';
import {Scrollbars} from 'react-custom-scrollbars';

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
      if (ReactDOM.findDOMNode(this.AutoResponsiveContainer) !== null) {
        this.setState({
          containerWidth: ReactDOM.findDOMNode(this.AutoResponsiveContainer).clientWidth
        });
      }
    }, false);
  }

  static createCard(contestant) {
    const shadow = 1;
    const width = 350;
    const height = 600;
    const style = {
      width,
      height
    };
    return (

      <Card
        key={contestant._id} style={style} containerStyle={{width,
          height}} zDepth={shadow}
      >
        <CardHeader
          title={`${contestant.firstName} ${contestant.lastName}`}
          subtitle={contestant.centuria}
          avatar={<Avatar
            src={`img/${contestant.image}`}
            style={{'border-radius': 0}}
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

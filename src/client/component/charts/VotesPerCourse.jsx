import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';
import $ from 'jquery';

class VotesPerCourse extends Component {
  constructor() {
    super();
    this.state = {
      labels: [],
      datasets: [{
        label: 'Stupa-Wahl 2018 Wahlbeteiligung',
        backgroundColor: [
          '#3366CC',
          '#DC3912',
          '#FF9900',
          '#109618',
          '#990099',
          '#3B3EAC',
          '#0099C6',
          '#DD4477',
          '#66AA00',
          '#B82E2E',
          '#316395',
          '#994499',
          '#22AA99',
          '#AAAA11',
          '#6633CC',
          '#E67300',
          '#8B0707',
          '#329262',
          '#5574A6',
          '#3B3EAC'
        ],
        hoverBackgroundColor: [
          '#3366CC',
          '#DC3912',
          '#FF9900',
          '#109618',
          '#990099',
          '#3B3EAC',
          '#0099C6',
          '#DD4477',
          '#66AA00',
          '#B82E2E',
          '#316395',
          '#994499',
          '#22AA99',
          '#AAAA11',
          '#6633CC',
          '#E67300',
          '#8B0707',
          '#329262',
          '#5574A6',
          '#3B3EAC'
        ],
        data: []
      }],
      errorText: ''
    };
  }

  componentWillMount() {
    this.loadsVotesPerCourse();
  }

  loadsVotesPerCourse() {
    $.getJSON('/api/votes/results/votesPerCourse', (votesPerCourse) => {
      if (votesPerCourse.success !== false) {
        const labels = [];
        const data = [];
        for (const courseVotes of votesPerCourse) {
          labels.push(courseVotes.course);
          data.push(courseVotes.votes);
        }
        const dataState = this.state;
        dataState.labels = labels;
        dataState.datasets[0].data = data;
        this.setState({data: dataState});
      } else {
        this.setState({errorText: votesPerCourse.error.text});
      }
    });
  }

  render() {
    return (
      <div
        style={{
          float: 'left',
          width: '50%',
          height: '80%'
        }}
      >
        <h3>{'Abgegebene Stimmen pro Studiengang'}</h3>
        {this.state.errorText.length === 0 ?
          <Pie
            data={this.state}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          /> : <p>{this.state.errorText}</p>}

      </div>
    );
  }
}

export default VotesPerCourse;

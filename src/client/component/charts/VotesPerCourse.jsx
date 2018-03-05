import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';
import $ from 'jquery';

class VotesPerCourse extends Component {
  constructor() {
    super();
    this.state = {
      labels: [],
      datasets: [{
        label: 'Stupa-Wahl 2017 Wahlbeteiligung',
        backgroundColor: [
          '#FF6384',
          '#4BC0C0',
          '#FFCE56',
          '#36A2EB'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#4BC0C0',
          '#FFCE56',
          '#36A2EB'
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
        const {datasets} = this.state;
        datasets.labels = labels;
        datasets[0].data = data;
        this.setState({datasets});
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

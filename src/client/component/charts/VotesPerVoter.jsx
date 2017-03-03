import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';
import $ from 'jquery';

class VotesPerVoter extends Component {
  constructor() {
    super();
    this.state = {
      labels: [
        '1',
        '2',
        '3',
        '4'
      ],
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
      }]
    };
  }

  componentWillMount() {
    this.loadsVotesPerVoter();
  }

  loadsVotesPerVoter() {
    $.getJSON('/api/votes/results/votesPerVoter', (votesPerVoter) => {
      if (VotesPerVoter.success !== false) {
        const data = [];
        data.push(votesPerVoter.one);
        data.push(votesPerVoter.two);
        data.push(votesPerVoter.three);
        data.push(votesPerVoter.four);
        const {datasets} = this.state;
        datasets[0].data = data;
        this.setState({datasets});
      }
    });
  }

  render() {
    return (
      <div
        style={{
          float: 'left',
          width: '50%',
          height: '37%'
        }}>
        <h3>Votes per Wähler</h3>
        <Pie
          data={this.state}
          width={50}
          height={40}
          options={{
            maintainAspectRatio: false

          }}
        />
      </div>
    );
  }
}

export default VotesPerVoter;

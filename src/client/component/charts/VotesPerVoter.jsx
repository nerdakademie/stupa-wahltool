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
        label: 'Vorstandswahl AINF 2017 Wahlbeteiligung',
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
    this.loadsVotesPerVoter();
  }

  loadsVotesPerVoter() {
    $.getJSON('/api/votes/results/votesPerVoter', (votesPerVoter) => {
      if (votesPerVoter.success !== false) {
        const data = [];
        data.push(votesPerVoter.one);
        data.push(votesPerVoter.two);
        data.push(votesPerVoter.three);
        data.push(votesPerVoter.four);
        const {datasets} = this.state;
        datasets[0].data = data;
        this.setState({datasets});
      } else {
        this.setState({errorText: votesPerVoter.error.text});
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
        <h3>{'Abgegebene Stimmen pro Wähler'}</h3>
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

export default VotesPerVoter;

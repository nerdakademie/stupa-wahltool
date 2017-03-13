import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';
import $ from 'jquery';

class Participation extends Component {
  constructor() {
    super();
    this.state = {
      labels: [
        'Nicht teilgenommen',
        'Teilgenommen'
      ],
      datasets: [{
        label: 'Vorstandswahl AINF 2017 Wahlbeteiligung',
        backgroundColor: [
          '#FF6384',
          '#4BC0C0'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#4BC0C0'
        ],
        data: []
      }],
      errorText: ''
    };
  }

  loadParticipation() {
    $.getJSON('/api/votes/results/participation', (participation) => {
      if (participation.success !== false) {
        const data = [];
        data.push(participation.inactiveVoters);
        data.push(participation.activeVoters);
        const {datasets} = this.state;
        datasets[0].data = data;
        this.setState({datasets});
      } else {
        this.setState({errorText: participation.error.text});
      }
    });
  }

  componentWillMount() {
    this.loadParticipation();
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
        <h3>{'Wahlbeteiligung'}</h3>
        {this.state.errorText.length === 0 ?
          <Pie
            data={this.state}
            width={50}
            height={40}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          /> : <p>{this.state.errorText}</p>}

      </div>
    );
  }
}

export default Participation;

import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import $ from 'jquery';
import miniToastr from 'mini-toastr';

class ResultChart extends Component {
  constructor() {
    super();
    this.state = {
      labels: [],
      datasets: [{
        label: 'Stupa-Wahl 2017',
        backgroundColor: 'rgba(1,31,83,0.2)',
        borderColor: 'rgba(1,31,83,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(1,31,83,0.4)',
        hoverBorderColor: 'rgba(1,31,83,1)',
        data: []
      }]
    };
    miniToastr.init();
  }

  loadResult() {
    $.getJSON('/api/votes/results', (result) => {
      if (result.success !== false) {
        const labels = [];
        const data = [];
        for (const contestant of result) {
          labels.push(`${contestant.firstName} ${contestant.lastName}`);
          data.push(contestant.votes);
        }
        const dataState = this.state;
        dataState.labels = labels;
        dataState.datasets[0].data = data;
        this.setState({data: dataState});
      } else {
        miniToastr.error(result.error.text, 'Error', 99999999);
      }
    });
  }

  componentWillMount() {
    this.loadResult();
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '37%',
          marginBottom: '1%'
        }}
      >
        <h3>Wahlergebnis</h3>
        <Bar
          data={this.state}
          options={{
            legend: {
              display: false
            },
            maintainAspectRatio: false
          }}
        />
      </div>
    );
  }
}

export default ResultChart;


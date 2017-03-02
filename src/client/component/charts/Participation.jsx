import React from 'react';
import {Pie} from 'react-chartjs-2';

const getState = () => {
  return {
    labels: [
      'Nicht teilgenommen',
      'Teilgenommen'
    ],
    datasets: [{
      label: 'Stupa-Wahl 2017 Wahlbeteiligung',
      backgroundColor: [
        '#FF6384',
        '#4BC0C0'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#4BC0C0'
      ],
      data: [45, 55]
    }]
  };
};

export default React.createClass({
  componentWillMount() {
    this.setState(getState());
  },

  render() {
    return (
      <div
        style={{
          float: 'left',
          width: '50%',
          height: '37%'
        }}>
        <h3>Wahlbeteiligung</h3>
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
});

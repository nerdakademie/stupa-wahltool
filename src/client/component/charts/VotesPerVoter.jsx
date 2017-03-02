import React from 'react';
import {Pie} from 'react-chartjs-2';

const getState = () => {
  return {
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
      data: [15, 20, 25, 40]
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
});

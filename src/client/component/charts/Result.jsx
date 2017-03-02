import React from 'react';
import {Bar} from 'react-chartjs-2';

const getState = () => {
  return {
    labels: [
      'Mr. 1 abcdefgh',
      'Mrs. 2',
      'Mr. 3',
      'Mrs. 4',
      'Mr. 5',
      'Mrs. 6',
      'Mr. 7',
      'Mrs. 8',
      'Mr. 9',
      'Mrs. 10',
      'Mr. 11',
      'Mrs. 12',
      'Mr. 13',
      'Mrs. 14',
      'Mr. 15',
      'Mrs. 16',
      'Mr. 17',
      'Mrs. 18',
      'Mr. 19',
      'Mrs. 20',
      'Mr. 21'
    ],
    datasets: [{
      label: 'Stupa-Wahl 2017',
      backgroundColor: 'rgba(1,31,83,0.2)',
      borderColor: 'rgba(1,31,83,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(1,31,83,0.4)',
      hoverBorderColor: 'rgba(1,31,83,1)',
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210]
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
          width: '100%',
          height: '37%',
          'margin-bottom': '1%'
        }}>
        <h3>Wahlergebnis</h3>
        <Bar
          data={this.state}
          options={{
            legend: {
              display: false,
            },
            maintainAspectRatio: false
          }}
        />
      </div>
    );
  }
});

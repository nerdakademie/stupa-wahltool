import React from 'react';
import ResultChart from '../charts/ResultChart';
import Participation from '../charts/Participation';
import VotesPerCourse from '../charts/VotesPerCourse';

function Result() {
  return (
    <div>
      <ResultChart />
      <div style={{height: '50%'}}>
        <Participation />
        <VotesPerCourse />
      </div>
    </div>
  );
}

export default Result;

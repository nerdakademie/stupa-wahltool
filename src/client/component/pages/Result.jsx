import React from 'react';
import ResultChart from '../charts/ResultChart';
import Participation from '../charts/Participation';
import VotesPerVoter from '../charts/VotesPerVoter';

function Result() {
  return (
    <div>
      <ResultChart />
      <div style={{height: '50%'}}>
        <Participation />
        <VotesPerVoter />
      </div>
    </div>
  );
}

export default Result;

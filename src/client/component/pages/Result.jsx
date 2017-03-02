import React from 'react';
import Result from '../charts/Result';
import Participation from '../charts/Participation';
import VotesPerVoter from '../charts/VotesPerVoter';

export default React.createClass({

  render() {
    /* TODO: Fix for mobile phones */
    return (
      <div>
        <Result/>
        <div>
          <Participation/>
          <VotesPerVoter/>
        </div>
      </div>
    );
  }
});

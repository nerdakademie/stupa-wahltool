import React, {Component} from 'react';
import Toggle from 'material-ui/Toggle';
import ContestantEdit from './ContestantEdit';
import ContestantRegister from './ContestantRegister';

class ContestantActions extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.setState({
      toggleState: false
    });
  }

  onToggle(event, isInputChecked) {
    this.setState({
      toggleState: isInputChecked
    });
  }

  render() {
    const {toggleState} = this.state;
    return (
      <div>
        <center>
        <Toggle
          label='Erstellen/Bearbeiten'
          onToggle={this.onToggle.bind(this)}
        />
        </center>
        {toggleState ? <ContestantRegister /> : <ContestantEdit />}
      </div>
    );
  }
}

export default ContestantActions;

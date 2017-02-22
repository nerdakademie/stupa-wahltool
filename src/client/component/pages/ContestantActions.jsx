import React, {Component} from 'react';
import Toggle from 'material-ui/Toggle';
import ContestantEdit from './ContestantEdit';
import ContestantRegister from './ContestantRegister';

class ContestantActions extends Component {
  constructor() {
    super();
    this.state = {
      activeComponent: <ContestantRegister />
    };
  }

  shouldComponentUpdate(){
    return true;
  }

  onToggle(event, isInputChecked) {
    if (isInputChecked) {
      this.setState({activeComponent: <ContestantEdit />});
    } else {
      this.setState({activeComponent: <ContestantRegister />});
    }
  }

  render() {
    return (
      <div>
        <Toggle
          label='Erstellen/Bearbeiten'
          onToggle={this.onToggle()}
        />
        {this.state.activeComponent}
      </div>
    );
  }
}

export default ContestantActions;

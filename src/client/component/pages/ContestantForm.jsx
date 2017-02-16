import '../../style/form.scss';

import React, {Component} from 'react';
import $ from 'jquery';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropzoneComponent from 'react-dropzone-component';
import AutoComplete from 'material-ui/AutoComplete';

class ContestantForm extends Component {
  constructor() {
    super();
    this.state = {
      years: [],
      courses: [],
      file: false,
      name_error: null,
      course_error: null,
      year_error: null,
      description_error: null,
      activeRender: this.formRender.bind(this)
    };

    const maxImageWidth = 1024,
      maxImageHeight = 1024;

    this.djsConfig = {
      addRemoveLinks: true,
      maxFiles: 1,
      acceptedFiles: 'image/jpeg,image/png',
      autoProcessQueue: false,
      init() {
        this.on('thumbnail', (file) => {
                    // do the dimension checks you want to do
          if (file.width > maxImageWidth || file.height > maxImageHeight) {
            file.rejectDimensions();
          } else {
            file.acceptDimensions();
          }
        });
      },
      accept(file, done) {
        file.acceptDimensions = done;
        file.rejectDimensions = function () {
          done('Bild ist zu groß.');
        };
      }
    };

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png'],
      showFiletypeIcon: true,
      postUrl: 'no-url'
    };
  }

  loadCourses() {
    $.getJSON('api/students/courses', (courses) => {
      this.setState({
        courses
      });
    });
  }

  loadYears() {
    $.getJSON('api/students/years', (years) => {
      this.setState({
        years
      });
    });
  }

  handleFileAdded(file) {
    this.setState({file});
  }

  componentDidMount() {
    this.loadCourses();
    this.loadYears();
  }

  createContestant(e) {
    e.preventDefault();
  }

  formRender() {
    const fullwidth = {
      width: '100%'
    };

    const config = this.componentConfig;
    const djsConfig = this.djsConfig;
    const eventHandlers = {
      addedfile: this.handleFileAdded.bind(this)
    };


    return (
      <form id='form' method='post'>
        <div className='group'>
          <TextField
            id='name' name='name' floatingLabelText='Vor und Nachname' hintText='Max Mustermann'
            style={fullwidth}
            errorText={this.state.name_error}
          />
        </div>
        <div className='group'>
          <AutoComplete
            id='course' name='course'
            hintText='Wirtschaftsinformatik'
            floatingLabelText='Studiengang'
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.courses}
            maxSearchResults={4}
            fullWidth
            errorText={this.state.course_error}
          />
        </div>
        <div className='group'>
          <AutoComplete
            id='year' name='year'
            hintText='2015'
            floatingLabelText='Jahrgang'
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.years}
            maxSearchResults={3}
            fullWidth
            errorText={this.state.year_error}
          />
        </div>
        <div className='group'>
          <TextField
            id='description'
            hintText='Schreibe hier deinen tollen Text'
            floatingLabelText='Dein Bewerbungstext'
            name='description'
            style={fullwidth}
            multiLine
            rows={3}
            errorText={this.state.description_error}
          />
        </div>
        <div className='group'>
          <p>Lade ein Bild hoch</p>
          <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} />
        </div>
        <FlatButton
          label='Registrieren' onClick={this.createContestant.bind(this)} backgroundColor='#4a89dc'
          hoverColor='#357bd8' labelStyle={{color: '#fff'}} style={fullwidth}
        />
      </form>
    );
  }

  successRender() {
    return (
      <form id='form' method='post'>
        <p>Wir haben deinen Aufstellungswunsch erhalten. <br />
                    Bitte bestägige deine Aufstellung mit dem Aktivierungslink in deiner Email<br />
        </p>
      </form>
    );
  }

  render() {
    return (
      <div>
        {this.state.activeRender()}
      </div>
    );
  }
}

export default ContestantForm;

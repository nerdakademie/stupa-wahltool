import '../../style/form.scss';

import React, {Component} from 'react';
import $ from 'jquery';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropzoneComponent from 'react-dropzone-component';
import AutoComplete from 'material-ui/AutoComplete';
import request from 'superagent';
import miniToastr from 'mini-toastr';

class ContestantRegister extends Component {
  constructor() {
    super();
    this.state = {
      years: [],
      courses: [],
      file: false,
      firstName_error: null,
      lastName_error: null,
      course_error: null,
      year_error: null,
      description_error: null,
      activeRender: this.formRender.bind(this),
      responseError: '',
      characters: 0
    };
    miniToastr.init();

    const maxImageWidth = 1024;
    const maxImageHeight = 1024;

    this.djsConfig = {
      addRemoveLinks: true,
      maxFiles: 1,
      acceptedFiles: 'image/jpeg,image/png',
      dictDefaultMessage: 'Ziehe die Datei hier hinein, um sie hochzuladen.',
      dictFileTooBig: 'Datei ist zu groß.',
      dictRemoveFile: 'Datei entfernen.',
      dictMaxFilesExceeded: 'Es darf nur eine Datei hochgeladen werden.',
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
        file.rejectDimensions = () => {
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
    const $firstName = $('#firstName');
    const $lastName = $('#lastName');
    const $course = $('#course');
    const $year = $('#year');
    const $description = $('#description');
    this.resetErrors();
    let errors = 0;
    // TODO: check for image
    if ($firstName.val().length < 1) {
      this.setState({firstName_error: 'Bitte gebe Vornamen an.'});
      errors++;
    }
    if ($lastName.val().length < 1) {
      this.setState({lastName_error: 'Bitte gebe Nachnamen an.'});
      errors++;
    }
    if ($course.val().length < 1) {
      this.setState({course_error: 'Bitte gebe einen Studiengang an.'});
      errors++;
    }
    if ($year.val().length < 1) {
      this.setState({year_error: 'Bitte gebe einen Jahrgang an.'});
      errors++;
    }
    if ($description.val().length < 1) {
      this.setState({description_error: 'Bitte gebe eine Beschreibung an.'});
      errors++;
    }
    if ($description.val().length > 1500) {
      this.setState({description_error: 'Zu viele Zeichen.'});
      errors++;
    }
    // TODO: make picture upload optional again
    if (!this.state.file) {
      miniToastr.error('Bitte wähle ein Bild aus.', 'Error');
      errors++;
    }
    if (errors === 0) {
      const form = new FormData();
      form.append('contestantPhoto', this.state.file);
      form.append('firstName', $firstName.val());
      form.append('lastName', $lastName.val());
      form.append('course', $course.val());
      form.append('year', $year.val());
      form.append('description', $description.val());

      request.post('/api/contestants/')
        .send(form)
        .end((error, resp) => {
          if (resp.body.success === false) {
              miniToastr.error(resp.body.error.text, 'Error');
            } else if (resp.body.success === true){
              this.setState({
                activeRender: this.successRender.bind(this),
                responseBody: resp.body
              });
            } else {
            miniToastr.error(error, 'Error');
          }
          return resp;
        });
    }
  }

  resetErrors() {
    this.setState({
      name_error: null,
      course_error: null,
      year_error: null,
      description_error: null
    });
  }

  onChangeDescription(event, newValue) {
    if (newValue !== undefined) {
      this.setState({
        characters: newValue.length
      });
    }
  }

  formRender() {
    const fullwidth = {
      width: '100%'
    };

    const eventHandlers = {
      addedfile: this.handleFileAdded.bind(this)
    };

    return (
      <form
        id='form'
        method='post'
      >
        <div className='group'>
          <TextField
            id='firstName'
            name='firstName'
            floatingLabelText='Vorname'
            hintText='Max'
            style={fullwidth}
            errorText={this.state.firstName_error}
          />
        </div>
        <div className='group'>
          <TextField
            id='lastName'
            name='lastName'
            floatingLabelText='Nachname'
            hintText='Mustermann'
            style={fullwidth}
            errorText={this.state.lastName_error}
          />
        </div>
        <div className='group'>
          <AutoComplete
            id='course'
            name='course'
            hintText='Wirtschaftsinformatik'
            floatingLabelText='Studiengang'
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.courses}
            disableFocusRipple={false}
            maxSearchResults={4}
            fullWidth
            errorText={this.state.course_error}
          />
        </div>
        <div className='group'>
          <AutoComplete
            id='year'
            name='year'
            hintText='2015'
            floatingLabelText='Jahrgang'
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.years}
            disableFocusRipple={false}
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
            onChange={this.onChangeDescription.bind(this)}
            errorText={this.state.description_error}
          />
          <center>{this.state.characters}/1500</center>
        </div>
        <div className='group'>
          <DropzoneComponent
            config={this.componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={this.djsConfig}
          />
        </div>
        <center>Max Auflösung: 1024x1024. In der Liste als 125x125.</center>
        <FlatButton
          label='Registrieren'
          onClick={this.createContestant.bind(this)}
          backgroundColor='#4a89dc'
          hoverColor='#357bd8'
          labelStyle={{color: '#fff'}}
          style={fullwidth}
        />
      </form>
    );
  }

  successRender() {
    return (
      <form id='form'>
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

export default ContestantRegister;

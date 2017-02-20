import '../../style/form.scss';

import React, {Component} from 'react';
import $ from 'jquery';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropzoneComponent from 'react-dropzone-component';
import AutoComplete from 'material-ui/AutoComplete';
import request from 'superagent';
import Snackbar from 'material-ui/Snackbar';

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
      activeRender: this.formRender.bind(this),
      snackbarOpen: false,
      responseError: null
    };

    const maxImageWidth = 1024;
    const maxImageHeight = 1024;

    this.djsConfig = {
      addRemoveLinks: true,
      maxFiles: 1,
      acceptedFiles: 'image/jpeg,image/png',
      dictDefaultMessage: 'Ziehe die Datei hier hinein, um sie hochzuladen',
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
    const $name = $('#name');
    const $course = $('#course');
    const $year = $('#year');
    const $description = $('#description');
    this.resetErrors();
    let errors = 0;
      // TODO: check for image
    if ($name.val().length < 1) {
      this.setState({name_error: 'Bitte gebe einen Namen (Vor- und Nachname) an'});
      errors++;
    }
    if ($course.val().length < 1) {
      this.setState({course_error: 'Bitte gebe einen Studiengang an'});
      errors++;
    }
    if ($year.val().length < 1) {
      this.setState({year_error: 'Bitte gebe einen Jahrgang an'});
      errors++;
    }
    if ($description.val().length < 1) {
      this.setState({description_error: 'Bitte gebe eine Beschreibung an'});
      errors++;
    }
    if (errors === 0) {
      const form = new FormData();
      form.append('contestantPhoto', this.state.file);
      form.append('name', $name.val());
      form.append('course', $course.val());
      form.append('year', $year.val());
      form.append('description', $description.val());

      request.post('/api/contestants/')
          .send(form)
          .end((error, resp) => {
            if (error) {
              console.error(error);
            }
            if (resp.statusCode === 200) {
              this.setState({
                activeRender: this.successRender.bind(this),
                responseBody: resp.body
              });
            } else if (resp.statusCode === 400) {
              this.setState({
                snackbarOpen: true,
                responseError: resp.body.error.text
              });
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

  formRender() {
    const fullwidth = {
      width: '100%'
    };

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
            disableFocusRipple={false}
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
            errorText={this.state.description_error}
          />
        </div>
        <div className='group'>
          <DropzoneComponent config={this.componentConfig} eventHandlers={eventHandlers} djsConfig={this.djsConfig} />
        </div>
        <FlatButton
          label='Registrieren' onClick={this.createContestant.bind(this)} backgroundColor='#4a89dc'
          hoverColor='#357bd8' labelStyle={{color: '#fff'}} style={fullwidth}
        />
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.responseError}
          autoHideDuration={4000}
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

export default ContestantForm;

import '../../style/form.scss';

import React, {Component} from 'react';
import $ from 'jquery';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropzoneComponent from 'react-dropzone-component';
import request from 'superagent';
import miniToastr from 'mini-toastr';

class ContestantEdit extends Component {
  constructor() {
    super();
    this.state = {
      file: false,
      description_error: null,
      firstName_error: null,
      lastName_error: null,
      activeRender: this.formRender.bind(this),
      responseError: '',
      characters: 0,
      descriptionText: '',
      firstName: '',
      lastName: '',
      token: ''
    };
    miniToastr.init();

    const maxImageWidth = 1024;
    const maxImageHeight = 1024;

    this.djsConfig = {
      addRemoveLinks: true,
      maxFiles: 1,
      acceptedFiles: 'image/jpeg,image/png',
      dictDefaultMessage: 'Ziehe die Datei hier hinein, um sie hochzuladen',
      dictFileTooBig: 'Datei ist zu groß',
      dictRemoveFile: 'Datei entfernen',
      dictMaxFilesExceeded: 'Es darf nur eine Datei hochgeladen werden',
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

  handleFileAdded(file) {
    this.setState({file});
  }

  changeContestant() {
    const $description = $('#description');
    this.resetErrors();
    let errors = 0;
    // TODO: check for image
    if (this.state.firstName.length < 1) {
      this.setState({firstName_error: 'Bitte gebe Vornamen an'});
      errors++;
    }
    if (this.state.lastName.length < 1) {
      this.setState({lastName_error: 'Bitte gebe Nachnamen an'});
      errors++;
    }
    if (this.state.token.length !== 36) {
      this.setState({token_error: 'Bitte gebe einen validen Token'});
      errors++;
    }
    if ($description.val().length < 1) {
      this.setState({description_error: 'Bitte gebe eine Beschreibung an'});
      errors++;
    }
    if ($description.val().length > 1500) {
      this.setState({description_error: 'Zu viele Zeichen'});
      errors++;
    }
    // TODO: make picture upload optional again
    if (errors === 0) {
      const form = new FormData();
      if (this.state.file !== false) {
        form.append('contestantPhoto', this.state.file);
      }
      form.append('firstName', this.state.firstName);
      form.append('lastName', this.state.lastName);
      form.append('token', this.state.token);
      form.append('description', $description.val());

      request.put('/api/contestants/')
          .send(form)
          .end((error, resp) => {
            if (error) {
              console.error(error);
            }
            if (resp.statusCode === 200) {
              if (resp.body.success === false) {
                miniToastr.error(resp.body.error.text, 'Error');
              } else {
                this.setState({
                  activeRender: ContestantEdit.successRender
                });
              }
            }
            return resp;
          });
    }
  }

  getContestant() {
    const $firstName = $('#firstName');
    const $lastName = $('#lastName');
    const $token = $('#token');
    this.resetErrors();
    let errors = 0;
    // TODO: check for image
    if ($firstName.val().length < 1) {
      this.setState({firstName_error: 'Bitte gebe Vornamen an'});
      errors++;
    }
    if ($lastName.val().length < 1) {
      this.setState({lastName_error: 'Bitte gebe Nachnamen an'});
      errors++;
    }
    if ($token.val().length !== 36) {
      this.setState({token_error: 'Bitte gebe einen validen Token'});
      errors++;
    }
    if (errors === 0) {
      $.getJSON(`api/contestants/?token=${$token.val()}&firstName=${$firstName.val()}&lastName=${$lastName.val()}`, (contestant) => {
        this.setState({
          descriptionText: contestant.description,
          activeRender: this.changeForm.bind(this),
          firstName: $firstName.val(),
          lastName: $lastName.val(),
          token: $token.val()
        });
      });
    }
  }

  resetErrors() {
    this.setState({
      description_error: null,
      firstName_error: null,
      lastName_error: null
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
    return (
      <form id='form' method='post'>
        <div className='group'>
          <TextField
            id='token' name='token' floatingLabelText='Aufstellungs-Token' hintText='Aufstellungs-Token aus der Aufstellungs-Mail'
            style={fullwidth}
            errorText={this.state.token_error}
          />
        </div>
        <div className='group'>
          <TextField
            id='firstName' name='firstName' floatingLabelText='Vorname' hintText='Max'
            style={fullwidth}
            errorText={this.state.firstName_error}
          />
        </div>
        <div className='group'>
          <TextField
            id='lastName' name='lastName' floatingLabelText='Nachname' hintText='Mustermann'
            style={fullwidth}
            errorText={this.state.lastName_error}
          />
        </div>
        <FlatButton
          label='Bearbeiten starten' onClick={this.getContestant.bind(this)} backgroundColor='#4a89dc'
          hoverColor='#357bd8' labelStyle={{color: '#fff'}} style={fullwidth}
        />
      </form>
    );
  }

  changeForm() {
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
                id='description'
                hintText='Schreibe hier deinen tollen Text'
                floatingLabelText='Dein Bewerbungstext'
                defaultValue={this.state.descriptionText}
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
            <center>Wenn du kein neues Bild hochladen möchtests, lasse dieses Feld leer.</center>
            <DropzoneComponent config={this.componentConfig} eventHandlers={eventHandlers} djsConfig={this.djsConfig} />
          </div>
          <center>Max Auflösung: 1024x1024. In der Liste als 125x125.</center>
          <FlatButton
              label='Bearbeiten abschließen' onClick={this.changeContestant.bind(this)} backgroundColor='#4a89dc'
              hoverColor='#357bd8' labelStyle={{color: '#fff'}} style={fullwidth}
          />
        </form>
    );

  }

  static successRender() {
    return (
      <form id='form'>
        <p>Bewerbung erfolgreich geändert
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

export default ContestantEdit;

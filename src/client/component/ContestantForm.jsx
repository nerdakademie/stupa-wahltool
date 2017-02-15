
import React, {Component} from 'react';
import $ from 'jquery';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropzoneComponent from 'react-dropzone-component';

class ContestantForm extends Component {
  constructor() {
    super();
    this.state = {
      file: false,
      name_error: null,
      course_error: null,
      year_error: null,
      description_error: null,
      activeRender: this.formRender.bind(this)
    };


    const maxImageWidth = 256,
    maxImageHeight = 256;

    this.djsConfig = {
      addRemoveLinks: true,
      maxFiles: 1,
      acceptedFiles: "image/jpeg,image/png",
      autoProcessQueue: false,
      init: function () {
        // Register for the thumbnail callback.
        // When the thumbnail is created the image dimensions are set.
        this.on("thumbnail", function (file) {
          // Do the dimension checks you want to do
          if (file.width > maxImageWidth || file.height > maxImageHeight) {
            file.rejectDimensions();
          }
          else {
            file.acceptDimensions();
          }
        });
      },

      // Instead of directly accepting / rejecting the file, setup two
      // functions on the file that can be called later to accept / reject
      // the file.
      accept: function (file, done) {
        file.acceptDimensions = done;
        file.rejectDimensions = function () {
          done("Image too big.");
        };
        // Of course you could also just put the `done` function in the file
        // and call it either with or without error in the `thumbnail` event
        // callback, but I think that this is cleaner.
      }.bind(this)
    };

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png'],
      showFiletypeIcon: true,
      postUrl: 'no-url'
    };
  }


  handleFileAdded(file) {
        this.setState({file: file});
    }

  componentDidMount() {
  }

  createContestant(e) {
    e.preventDefault();
  }

  formRender() {
    const fullwidth = {
      width: '100%',
    };

    const config = this.componentConfig;
    const djsConfig = this.djsConfig;

    // For a list of all possible events (there are many), see README.md!
    const eventHandlers = {
      addedfile: this.handleFileAdded.bind(this),
    };

    return (
      <form id="form" method="post">
      <div className="group">
      <TextField id="name" name="name" floatingLabelText="Vor und Nachname" hintText="Max Mustermann" style={fullwidth}
      errorText={this.state.name_error}/>
      </div>
      <div className="group">
      <TextField type="course" id="course" name="course" floatingLabelText="Studiengang"
      hintText="Wirtschaftsinformatik" style={fullwidth} errorText={this.state.course_error}/>
      </div>
      <div className="group">
      <TextField id="year" name="year" floatingLabelText="Jahrgang"
      hintText="2014" pattern="201[456]" style={fullwidth} errorText={this.state.year_error}/>
      </div>
      <div className="group">
      <TextField
      id="description"
      hintText="Schreibe hier deinen tollen Text"
      floatingLabelText="Dein Bewerbungstext"
      name="description"
      style={fullwidth}
      multiLine={true}
      rows={3}
      errorText={this.state.description_error}
      />
      </div>
      <div className="group">
      <p>Upload application Image</p>
      <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig}/>
      </div>
      <FlatButton label="Registrieren" onClick={this.createContestant.bind(this)} backgroundColor="#4a89dc"
      hoverColor="#357bd8" labelStyle={{color: '#fff'}} style={fullwidth}/>
      </form>
    );
  }


  successRender() {
    return (
      <form id="form" method="post">
      <p>Wir haben deinen Aufstellungswunsch erhalten. <br/>
      Bitte bestägige deine Aufstellung mit dem AktivierungsLink in deiner Email<br/>
      </p>
      </form>
    )
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

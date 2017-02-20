import React, {Component} from 'react';
import $ from 'jquery';
import {Card, CardHeader, CardText} from 'material-ui/Card';

class StudentList extends Component {
  constructor() {
    super();
    this.state = {students: []};
  }

  loadStudents() {
    $.getJSON('api/students/', (students) => {
      this.setState({
        students
      });
    });
  }

  componentDidMount() {
    this.loadStudents();
  }

  static createCard(student) {
    return (
      <Card key={student.name}>
        <CardHeader
          title={student.name}
          subtitle={student.course}
        />
        <CardText>{student.year}</CardText>
      </Card>
    );
  }

  render() {
    return (
      <div>
        {this.state.students.map(StudentList.createCard)}
      </div>
    );
  }
}

export default StudentList;

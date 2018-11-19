import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class TestComponent extends Component {
  render() {
    return (
      <Button
        bsStyle="success"
        onClick={this.props.onClick}
      >
        Adam
      </Button>
    );
  }
}

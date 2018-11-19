import React, { Component } from 'react';
import SVGGrid from '../SVGGrid'
import Store from '../../data/Store';
import {getData} from '../../data/Actions';

import { Grid, Row, Col, PageHeader } from 'react-bootstrap';

export default class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = Store.getValuesFromStore();
  }
  
  setStateFromStore = () => {
    this.setState(Store.getValuesFromStore());
  }
  
  componentDidMount() {
    Store.on("storeUpdated", this.setStateFromStore);
    setInterval(getData, 1000);
  }

  componentWillUnmount() {
    Store.removeListener("storeUpdated", this.setStateFromStore);
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col>
              <PageHeader>Real Time Bot Locations</PageHeader>
              <div>
               Red : BOT - shown with score <br />
               Gray : Node - shown with score <br />
               Green : Lines connecting a BOT to claimed nodes
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <SVGGrid
                cellSizeInPx={50}
                width={20}
                height={20}
                bots={this.state.bots}
                nodes={this.state.nodes}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

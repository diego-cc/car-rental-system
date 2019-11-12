import React from 'react';
import {Button, Form, FormControl} from "react-bootstrap";

export class SearchVehicle extends React.Component {

  render() {
	return (
	  <Form inline className="mr-lg-3">
		<FormControl
		  onChange={this.handleSearch}
		  type="text"
		  placeholder="Search for a vehicle..."
		  className="mr-sm-3 mr-lg-3"/>
		<Button variant="outline-info">Search</Button>
	  </Form>
	);
  }
}

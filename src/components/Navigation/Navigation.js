import React from 'react';
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import NavItem from "react-bootstrap/NavItem";

export class Navigation extends React.Component {
  state = {
	search: ''
  };

  handleSearch = e => {
	const {value} = e.target;
	this.setState({search: value});
  };

  render() {
	return (
	  <Navbar bg="light" variant="light" expand="lg">
		<Navbar.Brand as={Link} to="/" className="mr-lg-5">Car Rental System</Navbar.Brand>
		<Navbar.Toggle aria-controls="navbar-collapse"/>
		<Navbar.Collapse id="navbar-collapse">
		  <Nav className="mr-auto">
			<NavItem>
			  <Nav.Link as={Link} to="/" className="mr-lg-3">Home</Nav.Link>
			</NavItem>
			<NavDropdown className="mr-lg-4" title="Manage vehicles" id="manage-vehicles">
			  <NavDropdown.Item as={Link} to="/browse">Browse vehicles</NavDropdown.Item>
			  <NavDropdown.Item as={Link} to="/add">Add a new vehicle</NavDropdown.Item>
			  <NavDropdown.Item as={Link} to="/edit">Edit an existing vehicle</NavDropdown.Item>
			  <NavDropdown.Item as={Link} to="/delete">Delete a vehicle from the system</NavDropdown.Item>
			</NavDropdown>
			<NavDropdown title="Record an incident" id="record-incident">
			  <NavDropdown.Item as={Link} to="/safety-incident">Safety incident</NavDropdown.Item>
			  <NavDropdown.Item as={Link} to="/maintenance-incident">Maintenance incident</NavDropdown.Item>
			</NavDropdown>
		  </Nav>
		  <Form inline className="mr-lg-3">
			<FormControl
			  onChange={this.handleSearch}
			  type="text"
			  placeholder="Search for a vehicle..."
			  className="mr-sm-3 mr-lg-3"/>
			<Button variant="outline-info">Search</Button>
		  </Form>
		</Navbar.Collapse>
	  </Navbar>
	)
  }
}

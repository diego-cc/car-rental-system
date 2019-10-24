import React from 'react';
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';

export class Navigation extends React.Component {

    render() {
        return (
            <Navbar bg="light" variant="light" expand="lg">
                <Navbar.Brand className="mr-lg-5">Car Rental System</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-collapse"/>
                <Navbar.Collapse id="navbar-collapse">
                    <Nav className="mr-auto">
                        <Nav.Link className="mr-lg-3">Home</Nav.Link>
                        <NavDropdown className="mr-lg-4" title="Manage vehicles" id="manage-vehicles">
                            <NavDropdown.Item>Browse vehicles</NavDropdown.Item>
                            <NavDropdown.Item>Add a new vehicle</NavDropdown.Item>
                            <NavDropdown.Item>Edit an existing vehicle</NavDropdown.Item>
                            <NavDropdown.Item>Delete a vehicle from the system</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Record an incident" id="record-incident" className="mr-lg-5">
                            <NavDropdown.Item>Safety incident</NavDropdown.Item>
                            <NavDropdown.Item>Maintenance incident</NavDropdown.Item>
                        </NavDropdown>
                        <Form inline>
                            <FormControl type="text" placeholder="Search for a vehicle..." className="mr-sm-2 mr-lg-3" />
                            <Button variant="outline-info">Search</Button>
                        </Form>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
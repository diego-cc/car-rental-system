import React from 'react';
import {Container, Form, Row, Col, Button} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Notification} from "../Notification/Notification";
import {AppConsumer, AppContext} from "../../AppContext/AppContext";

export class AddVehicle extends React.Component {
  constructor(props) {
	super(props);
	this.initialState = {
	  fields: {
		manufacturer: '',
		model: '',
		year: '',
		registrationNumber: '',
		odometerReading: '',
		tankCapacity: '',
		createdAt: '',
		updatedAt: null
	  }
	};
	this.state = {...this.initialState};
	this.manufacturerInput = React.createRef();
  }

  handleSubmit = (e, vehicle) => {
	e.preventDefault();

	const updatedVehicle = {
	  ...vehicle,
	  createdAt: new Date().toLocaleString('en-AU'),
	  updatedAt: null
	};
	this.setState({...this.initialState}, () => {
	  const {addVehicle} = this.context;
	  addVehicle(updatedVehicle);
	})
  };

  handleClear = () => {
	const state = {...this.initialState};
	this.setState(state, () => this.manufacturerInput.current.focus());
  };

  handleChange = e => {
	const {id, value} = e.target;
	this.setState(prevState => ({
	  fields: {
		...prevState.fields,
		[id]: value
	  }
	}));
  };

  handleCancel = () => {
	this.props.history.push("/browse");
  };

  render() {
	return (
	  <AppConsumer>
		{
		  ({loading, notification}) => (
			<Container>
			  {
				notification.display ?
				  (
					<Notification
					  display={notification.display}
					  message={notification.message}/>
				  ) : ''
			  }
			  <Row>
				<Col>
				  <h2 className="text-center my-5">Add a new vehicle</h2>
				</Col>
			  </Row>
			  {
				loading ?
				  (
					<Row className="justify-content-center mt-5">
					  <LoadingSpinner/>
					</Row>
				  )
				  :
				  (
					<Form
					  onSubmit={e => this.handleSubmit(e, this.state.fields)}
					>
					  <Form.Row className="mb-lg-3">
						<Form.Group as={Col} controlId="manufacturer" lg="4" md="12">
						  <Form.Label>Manufacturer:</Form.Label>
						  <Form.Control
							ref={this.manufacturerInput}
							onChange={this.handleChange}
							value={this.state.fields.manufacturer}
							type="text"
							placeholder="Manufacturer..."/>
						</Form.Group>
						<Form.Group as={Col} controlId="model" lg="4" md="12">
						  <Form.Label>Model:</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.fields.model}
							type="text"
							placeholder="Model..."/>
						</Form.Group>
						<Form.Group as={Col} controlId="year" lg="4" md="12">
						  <Form.Label>Year:</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.fields.year}
							type="number"
							placeholder="Year..."/>
						</Form.Group>
					  </Form.Row>
					  <Form.Row className="mb-lg-3">
						<Form.Group as={Col} controlId="registrationNumber" lg="6" md="12">
						  <Form.Label>Registration Number:</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.fields.registrationNumber}
							type="text"
							placeholder="Registration Number..."/>
						</Form.Group>
					  </Form.Row>
					  <Form.Row className="mb-lg-3">
						<Form.Group as={Col} controlId="odometerReading" lg="6" md="12">
						  <Form.Label>Odometer Reading (in kilometres):</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.fields.odometerReading}
							type="number"
							placeholder="Odometer Reading (km)..."/>
						</Form.Group>
					  </Form.Row>
					  <Form.Row className="mb-lg-5">
						<Form.Group as={Col} controlId="tankCapacity" lg="6" md="12">
						  <Form.Label>Tank Capacity (in litres):</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.fields.tankCapacity}
							type="number"
							placeholder="Tank Capacity (L)..."/>
						</Form.Group>
					  </Form.Row>
					  <Row className="justify-content-center">
						<Button
						  variant="primary"
						  size="lg"
						  type="submit"
						  className="mr-5"
						>
						  Add vehicle
						</Button>
						<Button
						  variant="warning"
						  size="lg"
						  className="mr-5"
						  onClick={this.handleClear}
						>
						  Clear
						</Button>
						<Button
						  variant="danger"
						  size="lg"
						  onClick={this.handleCancel}
						>
						  Cancel
						</Button>
					  </Row>
					</Form>
				  )
			  }
			</Container>
		  )
		}
	  </AppConsumer>
	)
  }
}

AddVehicle.contextType = AppContext;

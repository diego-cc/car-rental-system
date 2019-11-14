import React from 'react';
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Vehicle} from "../../Model/Vehicle";
import moment from "moment";

export class EditVehicle extends React.Component {
  constructor(props) {
	super(props);
	this.initialState = {
	  vehicle: ''
	};
	this.state = {...this.initialState};
	this.manufacturerInput = React.createRef();
  }

  componentDidMount() {
	let {context} = this;
	const {vehicleId} = this.props.match.params;

	const vehicle =
	  context
		.vehicles
		.find(vehicle => vehicle.id === vehicleId);

	if (!vehicle) {
	  this.props.history.push(`/browse`);
	} else {
	  this.initialState = {
		vehicle: new Vehicle(vehicle.manufacturer, vehicle.model, vehicle.year, vehicle.odometerReading, vehicle.registrationNumber, vehicle.tankCapacity, vehicle.id, vehicle.createdAt, vehicle.updatedAt)
	  };
	  this.setState({...this.initialState});
	}
  }

  handleChange = e => {
	const {id, value} = e.target;
	this.setState(prevState => {
	  const {vehicle: prevVehicle} = prevState;
	  const vehicle = new Vehicle(prevVehicle.manufacturer, prevVehicle.model, prevVehicle.year, prevVehicle.odometerReading, prevVehicle.registrationNumber, prevVehicle.tankCapacity, prevVehicle.id, prevVehicle.createdAt, prevVehicle.updatedAt);

	  vehicle[id] = value;

	  return ({
		vehicle
	  })
	});
  };

  handleEdit = e => {
	e.preventDefault();
	const {vehicle} = this.state;
	const {editVehicle} = this.context;
	const updatedVehicle = new Vehicle(vehicle.manufacturer, vehicle.model, vehicle.year, vehicle.odometerReading, vehicle.registrationNumber, vehicle.tankCapacity, vehicle.id, vehicle.createdAt, vehicle.updatedAt);
	updatedVehicle.updatedAt = moment().format('DD/MM/YYYY hh:mm:ss A');

	editVehicle(updatedVehicle);
	this.props.history.push(`/show/${updatedVehicle.id}`);

  };

  handleRestore = () => {
	const {vehicle: initialVehicle} = this.initialState;
	this.setState({
	  vehicle: new Vehicle(initialVehicle.manufacturer, initialVehicle.model, initialVehicle.year, initialVehicle.odometerReading, initialVehicle.registrationNumber, initialVehicle.tankCapacity, initialVehicle.id, initialVehicle.createdAt, initialVehicle.updatedAt)
	}, () => this.manufacturerInput.current.focus());
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
				  <h2 className="text-center my-5">Edit vehicle details</h2>
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
					  onSubmit={e => this.handleEdit(e, this.state)}
					>
					  <Form.Row className="mb-lg-3">
						<Form.Group as={Col} controlId="manufacturer" lg="4" md="12">
						  <Form.Label column="true">Manufacturer:</Form.Label>
						  <Form.Control
							ref={this.manufacturerInput}
							onChange={this.handleChange}
							value={this.state.vehicle.manufacturer}
							type="text"
							placeholder="Manufacturer..."/>
						</Form.Group>
						<Form.Group as={Col} controlId="model" lg="4" md="12">
						  <Form.Label column="true">Model:</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.vehicle.model}
							type="text"
							placeholder="Model..."/>
						</Form.Group>
						<Form.Group as={Col} controlId="year" lg="4" md="12">
						  <Form.Label column="true">Year:</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.vehicle.year}
							type="number"
							placeholder="Year..."/>
						</Form.Group>
					  </Form.Row>
					  <Form.Row className="mb-lg-3">
						<Form.Group as={Col} controlId="registrationNumber" lg="6" md="12">
						  <Form.Label column="true">Registration Number:</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.vehicle.registrationNumber}
							type="text"
							placeholder="Registration Number..."/>
						</Form.Group>
					  </Form.Row>
					  <Form.Row className="mb-lg-3">
						<Form.Group as={Col} controlId="odometerReading" lg="6" md="12">
						  <Form.Label column="true">Odometer Reading (in kilometres):</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.vehicle.odometerReading}
							type="number"
							placeholder="Odometer Reading (km)..."/>
						</Form.Group>
					  </Form.Row>
					  <Form.Row className="mb-lg-5">
						<Form.Group as={Col} controlId="tankCapacity" lg="6" md="12">
						  <Form.Label column="true">Tank Capacity (in litres):</Form.Label>
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.vehicle.tankCapacity}
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
						  Edit vehicle
						</Button>
						<Button
						  variant="warning"
						  size="lg"
						  className="mr-5"
						  onClick={this.handleRestore}
						>
						  Restore
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

EditVehicle.contextType = AppContext;

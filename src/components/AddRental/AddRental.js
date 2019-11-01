import React from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export class AddRental extends React.Component {
  constructor(props) {
	super(props);
	this.initialState = {
	  selectedVehicle: null,
	  fields: {
		vehicleID: '',
		startDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
		endDate: '',
		startOdometer: '',
		endOdometer: '',
		rentalType: 'D'
	  }
	};

	this.state = {...this.initialState};
	this.startDate = React.createRef();
  }

  componentDidMount() {
	const {vehicleID} = this.props.match.params;
	const {vehicles} = this.context;

	const selectedVehicle = vehicles.find(vehicle => vehicle.id === vehicleID);
	this.initialState = {
	  selectedVehicle,
	  fields: {
		...this.initialState.fields,
		vehicleID
	  }
	};

	this.setState({...this.initialState});
  }

  handleSubmit = (e, rental) => {
	e.preventDefault();
	const {addRental} = this.context;

	addRental(rental);
  };

  handleChange = e => {
	const {id, value} = e.target;

	this.setState(prevState => ({
	  ...prevState,
	  fields: {
		...prevState.fields,
		[id]: value
	  }
	}))
  };

  handleRentalTypeChange = e => {
	const {value} = e.target;
	this.setState(prevState => ({
	  ...prevState,
	  fields: {
		...prevState.fields,
		rentalType: value === 'perDay' ? 'D' : 'K'
	  }
	}))
  };

  handleClear = () => {
	this.setState({...this.initialState}, () => {
	  this.startDate.current.focus();
	})
  };

  handleCancel = () => {
	this.props.history.push("/browse");
  };

  render() {
	return (
	  <AppConsumer>
		{
		  ({notification, loading}) => (
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
				  <h2 className="text-center my-5">Register new rental
					for {this.state.selectedVehicle ? `${this.state.selectedVehicle.manufacturer} ${this.state.selectedVehicle.model} (${this.state.selectedVehicle.year})` : ''}</h2>
				</Col>
			  </Row>
			  {
				loading ?
				  (
					<Row className="justify-content-center mt-5">
					  <LoadingSpinner/>
					</Row>
				  ) :
				  (
					<Form
					  onSubmit={e => this.handleSubmit(e, this.state.fields)}
					>
					  <Form.Group as={Row} controlId="rentalType">
						<Form.Label column="true" sm="2">Rental Type:</Form.Label>
						<Col sm="10">
						  <Form.Control
							as="select"
							value={this.state.fields.rentalType.trim().toUpperCase() === 'D' ? 'perDay' : 'perKm'}
							onChange={this.handleRentalTypeChange}>
							<option
							  value="perDay">
							  Per day
							</option>
							<option
							  value="perKm">
							  Per kilometer
							</option>
						  </Form.Control>
						</Col>
					  </Form.Group>
					  <Form.Group as={Row} controlId="startDate">
						<Form.Label column="true" sm="2">Start Date:</Form.Label>
						<Col sm="10">
						  <Form.Control
							ref={this.startDate}
							onChange={this.handleChange}
							value={this.state.fields.startDate}
							type="date"
							placeholder="Start Date..."/>
						</Col>
					  </Form.Group>
					  <Form.Group as={Row} controlId="endDate">
						<Form.Label column="true" sm="2">End Date:</Form.Label>
						<Col sm="10">
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.fields.endDate}
							type="date"
							placeholder="End Date..."/>
						</Col>
					  </Form.Group>
					  <Form.Group as={Row} controlId="startOdometer">
						<Form.Label column="true" sm="2">Start Odometer:</Form.Label>
						<Col sm="10">
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.fields.startOdometer}
							type="number"
							placeholder="Start Odometer..."/>
						</Col>
					  </Form.Group>
					  <Form.Group as={Row} controlId="endOdometer" className="mb-5">
						<Form.Label column="true" sm="2">End Odometer:</Form.Label>
						<Col sm="10">
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.fields.endOdometer}
							type="number"
							placeholder="End Odometer..."/>
						</Col>
					  </Form.Group>
					  <Row className="justify-content-center">
						<Button
						  variant="primary"
						  size="lg"
						  type="submit"
						  className="mr-5"
						>
						  Add rental
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

AddRental.contextType = AppContext;

import React from 'react';
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export class AddFuelPurchaseForm extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
	  vehicle: '',
	  booking: '',
	  fields: {
		id: '',
		bookingID: '',
		fuelQuantity: '',
		fuelPrice: '',
		createdAt: '',
		updatedAt: ''
	  }
	};
    this.state = {...this.initialState};
    this.fuelQuantity = React.createRef();
  }

  componentDidMount() {
    const {bookingID} = this.props.match.params;
    const {vehicles, bookings} = this.context;

    const booking = bookings.find(booking => booking.id === bookingID);
	const vehicle = vehicles.find(vehicle => vehicle.id === booking.vehicleID);

	this.initialState = {
	  ...this.initialState,
	  vehicle,
	  booking,
	  fields: {
	    ...this.initialState.fields,
		bookingID
	  }
	};

	this.setState({...this.initialState});
  }

  handleSubmit = (e, fuelPurchase) => {
	e.preventDefault();

	const {addFuelPurchase} = this.context;

	this.setState({...this.initialState}, () => {
	  addFuelPurchase(fuelPurchase);
	})
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

  handleClear = () => {
	this.setState({...this.initialState}, () => {
	  this.fuelQuantity.current.focus();
	})
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
				  <h2 className="text-center my-5">Register a new fuel purchase
					for {this.state.vehicle ? `${this.state.vehicle.manufacturer} ${this.state.vehicle.model} (${this.state.vehicle.year})` : ''},
					booked
					on {this.state.booking ? new Date(this.state.booking.startDate).toLocaleDateString('en-AU') : ''}
				  </h2>
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
					  <Form.Group as={Row} controlId="fuelQuantity">
						<Form.Label column="true" sm="2">Fuel quantity (litres):</Form.Label>
						<Col sm="10">
						  <Form.Control
							ref={this.fuelQuantity}
							onChange={this.handleChange}
							value={this.state.fields.fuelQuantity}
							type="number"
							placeholder="Fuel quantity (litres)..."/>
						</Col>
					  </Form.Group>
					  <Form.Group as={Row} controlId="fuelPrice">
						<Form.Label column="true" sm="2">Fuel price (per L):</Form.Label>
						<Col sm="10">
						  <Form.Control
							onChange={this.handleChange}
							value={this.state.fields.fuelPrice}
							type="number"
							placeholder="Fuel price ($ / L).."/>
						</Col>
					  </Form.Group>
					  <Row className="justify-content-center">
						<Button
						  variant="primary"
						  size="lg"
						  type="submit"
						  className="mr-5"
						>
						  Add fuel purchase
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
	);
  }
}

AddFuelPurchaseForm.contextType = AppContext;

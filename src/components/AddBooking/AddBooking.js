import React from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export class AddBooking extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      selectedVehicle: null,
      fields: {
        id: '',
        vehicleID: '',
        startDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
        endDate: '',
        startOdometer: '',
        bookingType: 'D',
        createdAt: '',
        updatedAt: null
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

  handleSubmit = (e, booking) => {
    e.preventDefault();
    const {addBooking} = this.context;

    const updatedBooking = {
      ...booking,
      createdAt: new Date().toLocaleString('en-AU'),
      updatedAt: null
    };

    addBooking(updatedBooking);
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

  handleBookingTypeChange = e => {
    const {value} = e.target;
    this.setState(prevState => ({
      ...prevState,
      fields: {
        ...prevState.fields,
        bookingType: value === 'perDay' ? 'D' : 'K'
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
                  <h2 className="text-center my-5">Register new booking
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
                      <Form.Group as={Row} controlId="bookingType">
                        <Form.Label column="true" sm="2">Booking Type:</Form.Label>
                        <Col sm="10">
                          <Form.Control
                            as="select"
                            value={this.state.fields.bookingType.trim().toUpperCase() === 'D' ? 'perDay' : 'perKm'}
                            onChange={this.handleBookingTypeChange}>
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
                      <Row className="justify-content-center">
                        <Button
                          variant="primary"
                          size="lg"
                          type="submit"
                          className="mr-5"
                        >
                          Add booking
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

AddBooking.contextType = AppContext;

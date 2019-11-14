import React from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {ErrorModal} from "./ErrorModal";
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import {Booking} from "../../Model/Booking";

export class AddBooking extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      selectedVehicle: null,
      vehicleDueForService: false,
      servicedAt: '',
      vehicleDueForBooking: false,
      anotherBookingStartDate: '',
      anotherBookingEndDate: '',
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
        vehicleID,
        startOdometer: selectedVehicle.odometerReading
      }
    };

    this.setState({...this.initialState});
  }

  handleSubmit = (e, booking) => {
    e.preventDefault();
    const {addResource, services, bookings} = this.context;
    const moment = extendMoment(Moment);

    const bookingStartDate = booking.startDate;
    const bookingEndDate = booking.endDate;
    const bookingRange = moment.range(moment(bookingStartDate), moment(bookingEndDate));

    const bookingFallsWithinServiceDateRange = services.some(service => {
      if (service.vehicleID === this.state.fields.vehicleID) {
        const momentServicedAt = moment(service.servicedAt);
        return momentServicedAt.within(bookingRange);
      }
      return false;
    });


    const bookingFallsWithinAnotherBookingDateRange = bookings.some(b => {
      if (b.vehicleID === this.state.fields.vehicleID) {
        const b1Range = moment.range(moment(b.startDate), moment(b.endDate));
        const b2range = moment.range(moment(booking.startDate), moment(booking.endDate));
        return b1Range.overlaps(b2range);
      }
      return false;
    });

    if (bookingFallsWithinServiceDateRange) {
      const {servicedAt} = services.find(service => {
        if (service.vehicleID === this.state.fields.vehicleID) {
          const momentServicedAt = moment(service.servicedAt);
          return momentServicedAt.within(bookingRange);
        }
        return false;
      });
      this.setState({
        vehicleDueForService: true,
        servicedAt
      })
    } else if (bookingFallsWithinAnotherBookingDateRange) {
      const {startDate: anotherBookingStartDate, endDate: anotherBookingEndDate} = bookings.find(b => {
        if (b.vehicleID === this.state.fields.vehicleID) {
          const b1Range = moment.range(moment(b.startDate), moment(b.endDate));
          const b2range = moment.range(moment(booking.startDate), moment(booking.endDate));
          return b1Range.overlaps(b2range);
        }
        return false;
      });
      this.setState({
        vehicleDueForBooking: true,
        anotherBookingStartDate,
        anotherBookingEndDate
      })
    } else {
      const {
        vehicleID,
        startDate,
        endDate,
        startOdometer,
        bookingType
      } = this.state.fields;

      const bookingToBeAdded = new Booking(vehicleID, bookingType, startDate, endDate, startOdometer);

      this.setState({...this.initialState}, () => {
        addResource('booking', bookingToBeAdded);
        this.props.history.push(`/show/${this.state.fields.vehicleID}`);
      })
    }
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
                this.state.vehicleDueForService ?
                  <ErrorModal
                    show={this.state.vehicleDueForService}
                    onHide={() => this.setState({vehicleDueForService: false})}
                    headermessage={`Vehicle is unavailable for booking between ${new Date(this.state.fields.startDate).toLocaleDateString('en-AU')} and ${new Date(this.state.fields.endDate).toLocaleDateString('en-AU')}`}
                    bodymessage={`Sorry, but this vehicle is currently unavailable for booking between ${new Date(this.state.fields.startDate).toLocaleDateString('en-AU')} and ${new Date(this.state.fields.endDate).toLocaleDateString('en-AU')}, because it due for service on ${new Date(this.state.servicedAt).toLocaleDateString('en-AU')}.`}
                  />
                  :
                  this.state.vehicleDueForBooking ?
                    <ErrorModal
                      show={this.state.vehicleDueForBooking}
                      onHide={() => this.setState({vehicleDueForBooking: false})}
                      headermessage={`Vehicle is unavailable for booking between ${new Date(this.state.fields.startDate).toLocaleDateString('en-AU')} and ${new Date(this.state.fields.endDate).toLocaleDateString('en-AU')}`}
                      bodymessage={`Sorry, but this vehicle is currently unavailable for booking between ${new Date(this.state.fields.startDate).toLocaleDateString('en-AU')} and ${new Date(this.state.fields.endDate).toLocaleDateString('en-AU')}, because another booking has been made for ${new Date(this.state.anotherBookingStartDate).toLocaleDateString('en-AU')} - ${new Date(this.state.anotherBookingEndDate).toLocaleDateString('en-AU')}.`}
                    />
                    :
                    ''
              }
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

import React from 'react';
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export class AddJourneyForm extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      vehicle: '',
      booking: '',
      fields: {
        id: '',
        bookingID: '',
        journeyStartedAt: '',
        journeyEndedAt: '',
        journeyStartOdometerReading: '',
        journeyEndOdometerReading: '',
        journeyFrom: '',
        journeyTo: '',
        createdAt: '',
        updatedAt: null
      }
    };

    this.state = {...this.initialState};
    this.journeyStartedAt = React.createRef();
  }

  componentDidMount() {
    const {bookingID} = this.props.match.params;
    const {vehicles, bookings} = this.context;

    const booking = bookings.find(booking => booking.id === bookingID);
    const vehicle = vehicles.find(vehicle => vehicle.id === booking.vehicleID);

    this.initialState = {
      booking,
      vehicle,
      fields: {
        ...this.initialState.fields,
        bookingID: booking.id
      }
    };

    this.setState({...this.initialState});
  }

  handleSubmit = (e, journey) => {
    e.preventDefault();

    const {addJourney} = this.context;

    this.setState({...this.initialState}, () => {
	  addJourney(journey);
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
      this.journeyStartedAt.current.focus();
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
                  <h2 className="text-center my-5">Add a new journey
                    for {this.state.vehicle ? `${this.state.vehicle.manufacturer} ${this.state.vehicle.model} (${this.state.vehicle.year})` : ''},
                    booked
                    for {this.state.booking ? new Date(this.state.booking.startDate).toLocaleDateString('en-AU') : ''}
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
                      <Form.Group as={Row} controlId="journeyStartedAt">
                        <Form.Label column="true" sm="2">Journey started at:</Form.Label>
                        <Col sm="10">
                          <Form.Control
                            ref={this.journeyStartedAt}
                            onChange={this.handleChange}
                            value={this.state.fields.journeyStartedAt}
                            type="date"
                            placeholder="Journey start date..."/>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="journeyEndedAt">
                        <Form.Label column="true" sm="2">Journey ended at:</Form.Label>
                        <Col sm="10">
                          <Form.Control
                            onChange={this.handleChange}
                            value={this.state.fields.journeyEndedAt}
                            type="date"
                            placeholder="Journey end date..."/>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="journeyStartOdometerReading">
                        <Form.Label column="true" sm="2">Journey start odometer reading:</Form.Label>
                        <Col sm="10">
                          <Form.Control
                            onChange={this.handleChange}
                            value={this.state.fields.journeyStartOdometerReading}
                            type="number"
                            placeholder="Journey start odometer reading..."/>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="journeyEndOdometerReading">
                        <Form.Label column="true" sm="2">Journey end odometer reading:</Form.Label>
                        <Col sm="10">
                          <Form.Control
                            onChange={this.handleChange}
                            value={this.state.fields.journeyEndOdometerReading}
                            type="number"
                            placeholder="Journey end odometer reading..."/>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="journeyFrom">
                        <Form.Label column="true" sm="2">Journey from:</Form.Label>
                        <Col sm="10">
                          <Form.Control
                            onChange={this.handleChange}
                            value={this.state.fields.journeyFrom}
                            type="text"
                            placeholder="Journey location start..."/>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="journeyTo" className="mb-5">
                        <Form.Label column="true" sm="2">Journey to:</Form.Label>
                        <Col sm="10">
                          <Form.Control
                            onChange={this.handleChange}
                            value={this.state.fields.journeyTo}
                            type="text"
                            placeholder="Journey location end..."/>
                        </Col>
                      </Form.Group>
                      <Row className="justify-content-center">
                        <Button
                          variant="primary"
                          size="lg"
                          type="submit"
                          className="mr-5"
                        >
                          Add journey
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

AddJourneyForm.contextType = AppContext;

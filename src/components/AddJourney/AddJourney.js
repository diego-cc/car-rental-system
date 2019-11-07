import React from 'react';
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Accordion, Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";

export class AddJourney extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      vehicle: '',
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
  }

  componentDidMount() {
    const {vehicleID} = this.props.match.params;
    const {vehicles} = this.context;

    const vehicle = vehicles.find(vehicle => vehicle.id === vehicleID);
    this.setState({
      ...this.initialState,
      vehicle
    });
  }

  render() {
    return (
      <AppConsumer>
        {
          ({vehicles, bookings, loading, notification}) => (
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
                  <h2 className="text-center my-5">
                    Select a booking to add a new journey for {this.state.vehicle ?
                    `${this.state.vehicle.manufacturer} ${this.state.vehicle.model} (${this.state.vehicle.year})`
                    : ''}
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
                    <Accordion>
                      {
                        bookings
                          .filter(booking => booking.vehicleID === this.state.vehicle.id)
                          .map((booking, index) => (
                            <Card key={index} style={{overflow: 'visible'}}>
                              <Card.Header>
                                <Accordion.Toggle
                                  className="mr-auto"
                                  as={Button}
                                  variant="link"
                                  eventKey={index}>
                                  {`${new Date(booking.startDate).toLocaleDateString('en-AU')}`}
                                </Accordion.Toggle>
                                <Button variant="outline-success">
                                  <FontAwesomeIcon icon={faPlus} />
                                </Button>
                              </Card.Header>
                              <Accordion.Collapse eventKey={index}>
                                <Card.Body>
                                  <ListGroup>
                                    <ListGroup.Item>
                                      Start Date: {`${new Date(booking.startDate).toLocaleDateString('en-AU')}`}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                      End Date: {`${new Date(booking.endDate).toLocaleDateString('en-AU')}`}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                      Start Odometer: {booking.startOdometer} km
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                      Booking Type: {booking.bookingType === 'D' ? 'Per day' : 'Per km'}
                                    </ListGroup.Item>
                                  </ListGroup>
                                </Card.Body>
                              </Accordion.Collapse>
                            </Card>
                          ))
                      }
                    </Accordion>
                  )
              }
            </Container>
          )
        }
      </AppConsumer>
    )
  }
}

AddJourney.contextType = AppContext;
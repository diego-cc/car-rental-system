import React from 'react';
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {Accordion, Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";

export class AddFuelPurchase extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      vehicle: ''
    };
    this.state = {...this.initialState};
  }

  componentDidMount() {
    const {vehicleID} = this.props.match.params;
    const {vehicles} = this.context;

    const vehicle = vehicles.find(vehicle => vehicle.id === vehicleID);
    this.initialState = {
      vehicle
    };
    this.setState({
      ...this.initialState
    });
  }

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
                  <h2 className="text-center my-5">
                    Select a booking to register a new fuel purchase for {this.state.vehicle ?
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
                        this.state.vehicle ?
                          (
                            this.state.vehicle
                              .bookings
                              .filter(booking => booking.vehicleID === this.state.vehicle.id)
                              .sort((booking1, booking2) => {
                                const booking1StartDate = new Date(booking1.startDate);
                                const booking2StartDate = new Date(booking2.startDate);

                                if (booking1StartDate > booking2StartDate) {
                                  return -1;
                                } else if (booking1StartDate < booking2StartDate) {
                                  return 1;
                                }
                                return 0;
                              })
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
                                    <Link to={`/addFuelPurchaseForm/${booking.id}`}>
                                      <Button variant="outline-success">
                                        <FontAwesomeIcon icon={faPlus}/>
                                      </Button>
                                    </Link>
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
                          ) : ''

                      }
                    </Accordion>
                  )
              }
			  <Button
				className="my-5"
				style={{
				  position: 'relative',
				  left: '50%',
				  transform: 'translateX(-50%)'
				}}
				variant="danger"
				size="lg"
				onClick={() => this.props.history.push(`/show/${this.state.vehicle.id}`)}
			  >
				Cancel
			  </Button>
            </Container>
          )
        }
      </AppConsumer>
    )
  }
}

AddFuelPurchase.contextType = AppContext;

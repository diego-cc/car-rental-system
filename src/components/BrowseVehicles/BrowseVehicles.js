import React from 'react';
import {Row, Col, Accordion, Card, Button, ListGroup, Container, ButtonGroup} from 'react-bootstrap'
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {AppConsumer} from "../../AppContext/AppContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog, faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom';
import {DeleteVehicle} from "../DeleteVehicle/DeleteVehicle";
import {Notification} from "../Notification/Notification";
import Dropdown from "react-bootstrap/Dropdown";

export const BrowseVehicles = props => {
  return (
    <AppConsumer>
      {
        ({loading, vehicles, services, bookings, fuelPurchases, deleteVehicle, notification}) => (
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
                <h2 className="text-center my-5">Browse vehicles</h2>
              </Col>
            </Row>
            <DeleteVehicle/>
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
                      vehicles.map((vehicle, index) => (
                        <Card key={vehicle.id} style={{overflow: 'visible'}}>
                          <Card.Header>
                            <Accordion.Toggle
                              className="mr-auto"
                              as={Button}
                              variant="link"
                              eventKey={index}>
                              {`${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})`}
                            </Accordion.Toggle>
                            <ButtonGroup aria-label="Options">
                              <Link
                                to={`/edit/${vehicle.id}`}
                                className="mr-3"
                              >
                                <Button
                                  variant="outline-warning"
                                >
                                  <FontAwesomeIcon icon={faEdit}/>
                                </Button>
                              </Link>
                              <Button
                                onClick={() => deleteVehicle.setDeleteModalShow(vehicle.id)}
                                className="mr-3"
                                variant="outline-danger">
                                <FontAwesomeIcon icon={faTrash}/>
                              </Button>
                              <Dropdown drop="right">
                                <Dropdown.Toggle variant="outline-secondary">
                                  <FontAwesomeIcon icon={faCog}/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    as={Link}
                                    to={`/addService/${vehicle.id}`}>
                                    Add service
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    as={Link}
                                    to={`/addBooking/${vehicle.id}`}>
                                    Add booking
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    as={Link}
                                    to={`/addJourney/${vehicle.id}`}>
                                    Add journey
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    as={Link}
                                    to={`/addFuelPurchase/${vehicle.id}`}>
                                    Add fuel purchase
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </ButtonGroup>
                          </Card.Header>
                          <Accordion.Collapse eventKey={index}>
                            <Card.Body>
                              <ListGroup>
                                <ListGroup.Item>
                                  Manufacturer: {vehicle.manufacturer}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  Model: {vehicle.model}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  Year: {vehicle.year}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  Registration
                                  Number: {vehicle.registrationNumber}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  Odometer Reading: {vehicle.odometerReading} km
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  Tank Capacity: {vehicle.tankCapacity} L
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <Accordion>
                                    <Card>
                                      <Card.Header>
                                        <Accordion.Toggle
                                          className="mr-auto"
                                          as={Button}
                                          variant="link"
                                          eventKey={index}>
                                          Service History
                                        </Accordion.Toggle>
                                      </Card.Header>
                                      <Accordion.Collapse
                                        eventKey={index}>
                                        <Card.Body>
                                          {
                                            services
                                              .filter(service => service.vehicleID === vehicle.id)
                                              .map((service, index) => (
                                                <Accordion key={index}>
                                                  <Card key={service.id}>
                                                    <Card.Header>
                                                      <Accordion.Toggle
                                                        className="mr-auto"
                                                        as={Button}
                                                        variant="link"
                                                        eventKey={index}>
                                                        {new Date(service.servicedAt).toLocaleDateString("en-AU")}
                                                      </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse
                                                      eventKey={index}>
                                                      <Card.Body>
                                                        <ListGroup>
                                                          <ListGroup.Item>
                                                            Serviced
                                                            at: {new Date(service.servicedAt).toLocaleDateString("en-AU")}
                                                          </ListGroup.Item>
                                                          <ListGroup.Item>
                                                            Service
                                                            odometer: {service.serviceOdometer} km
                                                          </ListGroup.Item>
                                                        </ListGroup>
                                                      </Card.Body>
                                                    </Accordion.Collapse>
                                                  </Card>
                                                </Accordion>
                                              ))
                                          }
                                        </Card.Body>
                                      </Accordion.Collapse>
                                    </Card>
                                  </Accordion>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <Accordion>
                                    <Card>
                                      <Card.Header>
                                        <Accordion.Toggle
                                          className="mr-auto"
                                          as={Button}
                                          variant="link"
                                          eventKey={index}>
                                          Booking History
                                        </Accordion.Toggle>
                                      </Card.Header>
                                      <Accordion.Collapse
                                        eventKey={index}>
                                        <Card.Body>
                                          {
                                            bookings
                                              .filter(booking => booking.vehicleID === vehicle.id)
                                              .map((booking, index) => (
                                                <Accordion key={index}>
                                                  <Card>
                                                    <Card.Header>
                                                      <Accordion.Toggle
                                                        className="mr-auto"
                                                        as={Button}
                                                        variant="link"
                                                        eventKey={index}>
                                                        {new Date(booking.startDate).toLocaleDateString("en-AU")}
                                                      </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={index}>
                                                      <Card.Body>
                                                        <ListGroup key={booking.id}>
                                                          <ListGroup.Item>
                                                            Start
                                                            Date: {new Date(booking.startDate).toLocaleDateString("en-AU")}
                                                          </ListGroup.Item>
                                                          <ListGroup.Item>
                                                            End
                                                            Date: {new Date(booking.endDate).toLocaleDateString("en-AU")}
                                                          </ListGroup.Item>
                                                          <ListGroup.Item>
                                                            Start
                                                            Odometer: {booking.startOdometer} km
                                                          </ListGroup.Item>
                                                          <ListGroup.Item>
                                                            Booking
                                                            Type: {booking.bookingType === 'D' ? 'Per day' : 'Per kilometer'}
                                                          </ListGroup.Item>
                                                        </ListGroup>
                                                      </Card.Body>
                                                    </Accordion.Collapse>
                                                  </Card>
                                                </Accordion>
                                              ))
                                          }
                                        </Card.Body>
                                      </Accordion.Collapse>
                                    </Card>
                                  </Accordion>
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
};

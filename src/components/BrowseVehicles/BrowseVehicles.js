import React from 'react';
import {Row, Col, Accordion, Card, Button, ListGroup, Container, ButtonGroup} from 'react-bootstrap'
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {AppConsumer} from "../../AppContext/AppContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom';
import {DeleteVehicle} from "../DeleteVehicle/DeleteVehicle";
import {Notification} from "../Notification/Notification";

export const BrowseVehicles = props => {
    return (
        <AppConsumer>
            {
                ({loading, vehicles, deleteVehicle, notification}) => (
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
                                                <Card key={vehicle.id}>
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
                                                                variant="outline-danger">
                                                                <FontAwesomeIcon icon={faTrash}/>
                                                            </Button>
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
                                                                    Fuel Economy: {vehicle.fuelEconomy}
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    <Accordion>
                                                                        {

                                                                        }
                                                                    </Accordion>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    <Link to="/service-history/:id">Service
                                                                        History</Link>
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

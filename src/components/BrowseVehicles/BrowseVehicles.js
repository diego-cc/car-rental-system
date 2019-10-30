import React from 'react';
import {Row, Col, Accordion, Card, Button, ListGroup, Container, ButtonGroup} from 'react-bootstrap'
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {AppConsumer} from "../../AppContext/AppContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom';

export const BrowseVehicles = props => {
    return (
        <AppConsumer>
            {
                ({loading, vehicles}) => (
                    <Container>
                        <Row>
                            <Col>
                                <h2 className="text-center my-5">Browse vehicles</h2>
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
                                            vehicles.map((vehicle, index) => (
                                                <Card key={vehicle.id}>
                                                    <Card.Header>
                                                        <Accordion.Toggle
                                                            className="mr-auto"
                                                            as={Button}
                                                            variant="link"
                                                            eventKey={index}>
                                                            {`${vehicle.data.manufacturer} ${vehicle.data.model} (${vehicle.data.year})`}
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
                                                                variant="outline-danger">
                                                                <FontAwesomeIcon icon={faTrash}/>
                                                            </Button>
                                                        </ButtonGroup>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={index}>
                                                        <Card.Body>
                                                            <ListGroup>
                                                                <ListGroup.Item>
                                                                    Manufacturer: {vehicle.data.manufacturer}
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    Model: {vehicle.data.model}
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    Year: {vehicle.data.year}
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    Registration
                                                                    Number: {vehicle.data.registrationNumber}
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    Odometer Reading: {vehicle.data.odometerReading} km
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    Tank Capacity: {vehicle.data.tankCapacity} L
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    Fuel Economy: {vehicle.data.fuelEconomy}
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

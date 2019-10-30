import React from 'react';
import {Container, Form, Row, Col, Button} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Notification} from "../Notification/Notification";
import {AppConsumer, AppContext} from "../../AppContext/AppContext";

export class AddVehicle extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            fields: {
                manufacturer: '',
                model: '',
                year: '',
                registrationNumber: '',
                odometerReading: '',
                tankCapacity: '',
                fuelPurchase: {
                    fuelEconomy: '',
                    litres: 0,
                    cost: 0
                }
            }
        };
        this.state = {...this.initialState};
        this.manufacturerInput = React.createRef();
    }

    handleSubmit = (e, vehicle) => {
        e.preventDefault();

        this.setState({...this.initialState}, () => {
            const {addVehicle} = this.context;
            addVehicle(vehicle);
        })
    };

    handleClear = () => {
        const state = {...this.initialState};
        this.setState(state, () => this.manufacturerInput.current.focus());
    };

    handleChange = e => {
        const {id, value} = e.target;
        if (id === 'fuelEconomy') {
            this.setState(prevState => ({
                fields: {
                    ...prevState.fields,
                    fuelPurchase: {
                        ...prevState.fields.fuelPurchase,
                        [id]: value
                    }
                }
            }));
        } else {
            this.setState(prevState => ({
                fields: {
                    ...prevState.fields,
                    [id]: value
                }
            }));
        }
    };

    render() {
        return (
            <AppConsumer>
                {
                    ({loading, notification}) => (
                        <Container>
                            <Row className="my-3">
                                <Col>
                                    {
                                        notification.display ?
                                            (
                                                <Notification
                                                    display={notification.display}
                                                    message={notification.message}/>
                                            ) : ''
                                    }
                                </Col>
                            </Row>
                            <Row className="mb-5">
                                <Col>
                                    <h2 className="text-center">Add a new vehicle</h2>
                                </Col>
                            </Row>
                            {
                                loading ?
                                    (
                                        <Row className="justify-content-center mt-5">
                                            <LoadingSpinner/>
                                        </Row>
                                    )
                                    :
                                    (
                                        <Form
                                            onSubmit={e => this.handleSubmit(e, this.state.fields)}
                                        >
                                            <Form.Row className="mb-lg-3">
                                                <Form.Group as={Col} controlId="manufacturer" lg="4" md="12">
                                                    <Form.Label>Manufacturer:</Form.Label>
                                                    <Form.Control
                                                        ref={this.manufacturerInput}
                                                        onChange={this.handleChange}
                                                        value={this.state.fields.manufacturer}
                                                        type="text"
                                                        placeholder="Manufacturer..."/>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="model" lg="4" md="12">
                                                    <Form.Label>Model:</Form.Label>
                                                    <Form.Control
                                                        onChange={this.handleChange}
                                                        value={this.state.fields.model}
                                                        type="text"
                                                        placeholder="Model..."/>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="year" lg="4" md="12">
                                                    <Form.Label>Year:</Form.Label>
                                                    <Form.Control
                                                        onChange={this.handleChange}
                                                        value={this.state.fields.year}
                                                        type="number"
                                                        placeholder="Year..."/>
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row className="mb-lg-3">
                                                <Form.Group as={Col} controlId="registrationNumber" lg="6" md="12">
                                                    <Form.Label>Registration Number:</Form.Label>
                                                    <Form.Control
                                                        onChange={this.handleChange}
                                                        value={this.state.fields.registrationNumber}
                                                        type="text"
                                                        placeholder="Registration Number..."/>
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row className="mb-lg-3">
                                                <Form.Group as={Col} controlId="odometerReading" lg="6" md="12">
                                                    <Form.Label>Odometer Reading (in kilometres):</Form.Label>
                                                    <Form.Control
                                                        onChange={this.handleChange}
                                                        value={this.state.fields.odometerReading}
                                                        type="number"
                                                        placeholder="Odometer Reading (km)..."/>
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row className="mb-lg-5">
                                                <Form.Group as={Col} controlId="tankCapacity" lg="6" md="12">
                                                    <Form.Label>Tank Capacity (in litres):</Form.Label>
                                                    <Form.Control
                                                        onChange={this.handleChange}
                                                        value={this.state.fields.tankCapacity}
                                                        type="number"
                                                        placeholder="Tank Capacity (L)..."/>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="fuelEconomy" lg="6" md="12">
                                                    <Form.Label>Fuel Economy:</Form.Label>
                                                    <Form.Control
                                                        onChange={this.handleChange}
                                                        value={this.state.fields.fuelPurchase.fuelEconomy}
                                                        type="number"
                                                        placeholder="Fuel Economy..."/>
                                                </Form.Group>
                                            </Form.Row>
                                            <Row className="justify-content-center">
                                                <Button
                                                    variant="primary"
                                                    size="lg"
                                                    type="submit"
                                                    className="mr-5"
                                                >
                                                    Add vehicle
                                                </Button>
                                                <Button
                                                    variant="warning"
                                                    size="lg"
                                                    onClick={this.handleClear}
                                                >
                                                    Clear
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

AddVehicle.contextType = AppContext;

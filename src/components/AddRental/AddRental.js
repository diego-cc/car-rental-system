import React from 'react';
import {Col, Container, Form, Row} from "react-bootstrap";
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export class AddRental extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedVehicle: null,
            fields: {
                vehicleID: '',
                startDate: '',
                endDate: '',
                startOdometer: '',
                endOdometer: '',
                rentalType: ''
            }
        }
    }

    componentDidMount() {
        const {vehicleID} = this.props.match.params;
        const {vehicles} = this.context;

        const selectedVehicle = vehicles.find(vehicle => vehicle.id === vehicleID);

        this.setState(prevState => ({
            selectedVehicle,
            fields: {
                ...prevState.fields,
                vehicleID
            }
        }))
    }

    handleSubmit = (e, rental) => {
        e.preventDefault();
        const {addRental} = this.context;

        addRental(rental);
    };

    render() {
        return (
            <AppConsumer>
                {
                    ({notification, loading, addRental}) => (
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
                                    <h2 className="text-center my-5">Register new rental for {this.state.selectedVehicle ? `${this.state.selectedVehicle.manufacturer} ${this.state.selectedVehicle.model} (${this.state.selectedVehicle.year})`: ''}</h2>
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

AddRental.contextType = AppContext;

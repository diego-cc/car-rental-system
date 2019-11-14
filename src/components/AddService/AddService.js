import React from 'react';
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export class AddService extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      selectedVehicle: null,
      fields: {
        id: '',
        vehicleID: '',
        serviceOdometer: '',
        servicedAt: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`,
        createdAt: '',
        updatedAt: null
      }
    };

    this.state = {...this.initialState};
    this.servicedAt = React.createRef();
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
        serviceOdometer: selectedVehicle.odometerReading
      }
    };

    this.setState({...this.initialState});
  }

  handleSubmit = (e, service) => {
    e.preventDefault();
    const {addResource} = this.context;

    const updatedService = {
      ...service,
      createdAt: new Date().toLocaleString('en-AU'),
      updatedAt: null
    };

    this.setState({...this.initialState}, () => {
      addResource('service', updatedService);
      this.props.history.push(`/show/${this.state.fields.vehicleID}`);
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
      this.servicedAt.current.focus();
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
                  <h2 className="text-center my-5">Register new service
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
                      <Form.Group as={Row} controlId="servicedAt">
                        <Form.Label column="true" sm="2">Service Date:</Form.Label>
                        <Col sm="10">
                          <Form.Control
                            ref={this.servicedAt}
                            onChange={this.handleChange}
                            value={this.state.fields.servicedAt}
                            type="date"
                            placeholder="Serviced At..."/>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="serviceOdometer" className="mb-5">
                        <Form.Label column="true" sm="2">Service Odometer:</Form.Label>
                        <Col sm="10">
                          <Form.Control
                            onChange={this.handleChange}
                            value={this.state.fields.serviceOdometer}
                            type="number"
                            placeholder="Service Odometer..."/>
                        </Col>
                      </Form.Group>

                      <Row className="justify-content-center">
                        <Button
                          variant="primary"
                          size="lg"
                          type="submit"
                          className="mr-5"
                        >
                          Add service
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

AddService.contextType = AppContext;

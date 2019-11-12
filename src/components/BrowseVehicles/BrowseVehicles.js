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
import {calculateBookingCost, calculateRevenueRecorded} from "../../BookingCost";
import moment from "moment";

export const BrowseVehicles = props => {
  const printDetails = (vehicle, vehicleBookings, vehicleJourneys, vehicleServices) => {
	return ({
	  'Vehicle': `${vehicle.manufacturer} ${vehicle.model} ${vehicle.year}`,
	  'Registration Number': vehicle.registrationNumber,
	  'Total Kilometers Travelled': `${vehicle.odometerReading} km`,
	  'Total services done': getTotalServicesDone(vehicleServices),
	  'Revenue recorded': `$ ${calculateRevenueRecorded(vehicleBookings, vehicleJourneys)}`,
	  'Kilometers since the last service': Number.parseFloat(getLastServiceOdometerReading(vehicleServices)) ? `${vehicle.odometerReading - getLastServiceOdometerReading(vehicleServices)} km` : getLastServiceOdometerReading(vehicleServices),
	  'Requires a service': requiresService(vehicleServices) ? 'Yes' : 'No'
	})
  };

  const getTotalServicesDone = services => {
	return services.filter(s => moment(s.servicedAt).isBefore(moment())).length;
  };

  const getLastServiceOdometerReading = services => {
	if (services.length) {
	  const now = moment();
	  const servicesCopy = [...services];
	  const firstServicesBeforeToday = servicesCopy.sort((firstService, secondService) => {
		const firstServiceDate = moment(firstService.servicedAt);
		const secondServiceDate = moment(secondService.servicedAt);
		return secondServiceDate.diff(firstServiceDate, 'days');
	  }).find(s => moment(s.servicedAt).isBefore(now));

	  if (firstServicesBeforeToday) {
	    return firstServicesBeforeToday.serviceOdometer;
	  }
	  return 'No services have been scheduled before today'
	}
	return 'No services have been scheduled yet';
  };

  const requiresService = services => {
	return services.some(service => moment(service.servicedAt).isAfter(moment()));
  };

  return (
	<AppConsumer>
	  {
		({loading, vehicles, services, bookings, journeys, fuelPurchases, deleteVehicle, notification}) => (
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
								{
								  Object.keys(
									printDetails(
									  vehicle,
									  bookings.filter(b => b.vehicleID === vehicle.id),
									  journeys.filter(j => bookings.some(b => b.vehicleID === vehicle.id && (b.id === j.bookingID))),
									  services.filter(s => s.vehicleID === vehicle.id)
									))
									.map((field, i) => (
									  <ListGroup.Item key={i}>
										{field}: {printDetails(
										vehicle,
										bookings.filter(b => b.vehicleID === vehicle.id),
										journeys.filter(j => bookings.some(b => b.vehicleID === vehicle.id && (b.id === j.bookingID))),
										services.filter(s => s.vehicleID === vehicle.id)
									  )[field]}
									  </ListGroup.Item>
									))
								}
								{/*<ListGroup.Item>
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
								</ListGroup.Item>*/}
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
											  .sort((service1, service2) => {
												const service1At = new Date(service1.servicedAt);
												const service2At = new Date(service2.servicedAt);

												if (service1At > service2At) {
												  return -1;
												} else if (service1At > service2At) {
												  return 1;
												}
												return 0;
											  })
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
											  .sort((booking1, booking2) => {
												const booking1StartedAt = new Date(booking1.startDate);
												const booking2StartedAt = new Date(booking2.startDate);

												if (booking1StartedAt > booking2StartedAt) {
												  return -1;
												} else if (booking1StartedAt < booking2StartedAt) {
												  return 1;
												}
												return 0;
											  })
											  .map((booking, index) => (
												<Accordion key={index}>
												  <Card>
													<Card.Header>
													  <Accordion.Toggle
														className="mr-auto"
														as={Button}
														variant="link"
														eventKey={index}>
														{`${new Date(booking.startDate).toLocaleDateString("en-AU")} - ${new Date(booking.endDate).toLocaleDateString("en-AU")}`}
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
														  <ListGroup.Item>
															Booking cost: {
															Number.isNaN(calculateBookingCost(booking, journeys.filter(journey => journey.bookingID === booking.id)))
															  ?
															  'Pending (no journeys have' +
															  ' been made for this booking' +
															  ' yet)' :
															  `$ ${Number.parseFloat(calculateBookingCost(booking, journeys.filter(journey => journey.bookingID === booking.id))).toFixed(2)}`
														  }
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
										  Journey History
										</Accordion.Toggle>
									  </Card.Header>
									  <Accordion.Collapse
										eventKey={index}>
										<Card.Body>
										  {
											journeys
											  .reduce((acc, journey) => {
												const filteredBookings = bookings.filter(booking => booking.vehicleID === vehicle.id);

												if (filteredBookings.some(b => b.id === journey.bookingID)) {
												  acc.push(journey);
												}
												return acc;
											  }, [])
											  .sort((journey1, journey2) => {
												const journey1StartedAt = new Date(journey1.journeyStartedAt);
												const journey2StartedAt = new Date(journey2.journeyStartedAt);
												if (journey1StartedAt > journey2StartedAt) {
												  return -1;
												} else if (journey1StartedAt < journey2StartedAt) {
												  return 1;
												}
												return 0;
											  })
											  .map((journey, index) => (
												<Accordion key={index}>
												  <Card>
													<Card.Header>
													  <Accordion.Toggle
														className="mr-auto"
														as={Button}
														variant="link"
														eventKey={index}>
														{`${new Date(journey.journeyStartedAt).toLocaleDateString("en-AU")} - ${new Date(journey.journeyEndedAt).toLocaleDateString("en-AU")}`}
													  </Accordion.Toggle>
													</Card.Header>
													<Accordion.Collapse eventKey={index}>
													  <Card.Body>
														<ListGroup key={journey.id}>
														  <ListGroup.Item>
															Journey started
															at: {new Date(journey.journeyStartedAt).toLocaleDateString("en-AU")}
														  </ListGroup.Item>
														  <ListGroup.Item>
															Journey ended
															at: {new Date(journey.journeyEndedAt).toLocaleDateString("en-AU")}
														  </ListGroup.Item>
														  <ListGroup.Item>
															Journey start odometer
															reading: {journey.journeyStartOdometerReading} km
														  </ListGroup.Item>
														  <ListGroup.Item>
															Journey end odometer
															reading: {journey.journeyEndOdometerReading} km
														  </ListGroup.Item>
														  <ListGroup.Item>
															Journey from: {journey.journeyFrom}
														  </ListGroup.Item>
														  <ListGroup.Item>
															Journey to: {journey.journeyTo}
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
										  Fuel Purchase History
										</Accordion.Toggle>
									  </Card.Header>
									  <Accordion.Collapse
										eventKey={index}>
										<Card.Body>
										  {
											fuelPurchases
											  .reduce((acc, fuelPurchase) => {
												const filteredBookings = bookings.filter(booking => booking.vehicleID === vehicle.id);

												if (filteredBookings.some(b => b.id === fuelPurchase.bookingID)) {
												  acc.push(fuelPurchase);
												}
												return acc;
											  }, [])
											  .sort((fuelPurchase1, fuelPurchase2) => {
												const bookingFuelPurchase1 = bookings.find(booking => booking.id === fuelPurchase1.bookingID);
												const booking1StartedAt = new Date(bookingFuelPurchase1.startDate);
												const bookingFuelPurchase2 = bookings.find(booking => booking.id === fuelPurchase2.bookingID);
												const booking2StartedAt = new Date(bookingFuelPurchase2.startDate);
												if (booking1StartedAt > booking2StartedAt) {
												  return -1;
												} else if (booking1StartedAt < booking2StartedAt) {
												  return 1;
												}
												return 0;
											  })
											  .map((fuelPurchase, index) => (
												<Accordion key={index}>
												  <Card>
													<Card.Header>
													  <Accordion.Toggle
														className="mr-auto"
														as={Button}
														variant="link"
														eventKey={index}>
														{`${new Date(bookings.find(booking => booking.id === fuelPurchase.bookingID).startDate).toLocaleDateString("en-AU")} - ${new Date(bookings.find(booking => booking.id === fuelPurchase.bookingID).endDate).toLocaleDateString("en-AU")}`}
													  </Accordion.Toggle>
													</Card.Header>
													<Accordion.Collapse eventKey={index}>
													  <Card.Body>
														<ListGroup key={fuelPurchase.id}>
														  <ListGroup.Item>
															Fuel
															quantity: {fuelPurchase.fuelQuantity} L
														  </ListGroup.Item>
														  <ListGroup.Item>
															Fuel price (per litre):
															${Number.parseFloat(fuelPurchase.fuelPrice).toFixed(2)}
														  </ListGroup.Item>
														  <ListGroup.Item>
															Total cost:
															${(Number.parseFloat(fuelPurchase.fuelQuantity) * Number.parseFloat(fuelPurchase.fuelPrice)).toFixed(2)}
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

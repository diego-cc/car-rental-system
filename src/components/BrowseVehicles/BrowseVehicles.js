import React from 'react';
import {Col, Container, Row} from 'react-bootstrap'
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {AppConsumer} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {calculateRevenueRecorded} from "../../BookingCost";
import moment from "moment";
import {DeleteResource} from "../DeleteVehicle/DeleteResource";
import {VehicleDetails} from "../ShowVehicle/VehicleDetails";

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

export const printDetails = (vehicle, vehicleBookings, vehicleJourneys, vehicleServices) => {
  return ({
	'Vehicle': `${vehicle.manufacturer} ${vehicle.model} ${vehicle.year}`,
	'Registration Number': vehicle.registrationNumber,
	'Total Kilometers Travelled': `${vehicle.odometerReading} km`,
	'Total services done': getTotalServicesDone(vehicleServices),
	'Revenue recorded': `$ ${calculateRevenueRecorded(vehicleBookings, vehicleJourneys)}`,
	'Kilometers since the last service': Number.parseFloat(getLastServiceOdometerReading(vehicleServices)) ? `${vehicle.odometerReading - getLastServiceOdometerReading(vehicleServices)} km` : getLastServiceOdometerReading(vehicleServices),
	'Requires service': requiresService(vehicleServices) ? 'Yes' : 'No'
  })
};

export const BrowseVehicles = props => {
  return (
	<AppConsumer>
	  {
		({loading, vehicles, services, bookings, journeys, fuelPurchases, notification}) => (
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
			<DeleteResource/>
			{
			  loading ?
				(
				  <Row className="justify-content-center mt-5">
					<LoadingSpinner/>
				  </Row>
				) :
				(
				  vehicles.map((v, i) => (
					<VehicleDetails
					  key={i}
					  vehicle={v}
					  bookings={bookings.filter(b => b.vehicleID === v.id)}
					  journeys={journeys.filter(j => bookings.filter(b => b.vehicleID === v.id).some(b => b.id === j.bookingID))}
					  services={services.filter(s => s.vehicleID === v.id)}
					  fuelPurchases={fuelPurchases.filter(f => bookings.filter(b => b.vehicleID === v.id).some(b => b.id === f.bookingID))}
					/>
				  ))
				)
			}
		  </Container>
		)
	  }
	</AppConsumer>
  )
};

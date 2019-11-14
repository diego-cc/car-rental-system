import React from 'react';
import {Col, Container, Row} from 'react-bootstrap'
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {AppConsumer} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {calculateRevenueRecorded} from "../../BookingCost";
import moment from "moment";
import {DeleteResource} from "../DeleteResource/DeleteResource";
import {VehicleDetails} from "../ShowVehicle/VehicleDetails";

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

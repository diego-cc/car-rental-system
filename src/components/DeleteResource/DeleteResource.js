import React, {useContext} from 'react';
import {Button, ListGroup, Modal} from "react-bootstrap";
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {calculateBookingCost} from "../../BookingCost";
import moment from "moment";

export const DeleteResource = props => {
  const {vehicles, deleteResource} = useContext(AppContext);
  const {resource, resourceType} = deleteResource;
  let vehicle, journeys;

  if (resourceType && resourceType.trim().toLowerCase() !== 'vehicle') {
	switch (resourceType.trim().toLowerCase()) {
	  case 'booking':
		vehicle = vehicles.find(v => v.bookings.some(b => b.id === resource.id));
		break;

	  case 'journey':
	  case 'fuelpurchase':
	  case 'fuel purchase':
	    vehicle = vehicles.find(v => v.bookings.some(b => b.id === resource.bookingID));
		break;

	  case 'service':
		vehicle = vehicles.find(v => v.id === resource.vehicleID);
		break;

	  default:
		break;
	}
	journeys = vehicle.bookings.reduce((journeys, b) => {
	  b.journeys.forEach(j => {
	    journeys.push(j);
	  });
	  return journeys;
	}, []);
  }

  const renderResourceInfo = (resourceType, resource) => {
	if (resourceType && resource) {
	  switch (resourceType.trim().toLowerCase()) {
		case 'vehicle':
		  return (
			<ListGroup>
			  <ListGroup.Item>Manufacturer: {resource ? resource.manufacturer : ''}</ListGroup.Item>
			  <ListGroup.Item>Model: {resource ? resource.model : ''}</ListGroup.Item>
			  <ListGroup.Item>Year: {resource ? resource.year : ''}</ListGroup.Item>
			  <ListGroup.Item>Registration
				number: {resource ? resource.registrationNumber : ''}</ListGroup.Item>
			  <ListGroup.Item>Odometer
				reading: {resource ? resource.odometerReading : 0} km</ListGroup.Item>
			  <ListGroup.Item>Tank
				capacity: {resource ? resource.tankCapacity : 0} L</ListGroup.Item>
			</ListGroup>
		  );

		case 'journey':
		  return (
			<ListGroup>
			  <ListGroup.Item>
				Journey
				vehicle: {vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey start date: {resource ? moment(resource.journeyStartedAt).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey end date: {resource ? moment(resource.journeyEndedAt).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey start odometer
				reading: {resource ? `${resource.journeyStartOdometerReading} km` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey end odometer
				reading: {resource ? `${resource.journeyEndOdometerReading} km` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey from: {resource ? resource.journeyFrom : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Journey to: {resource ? resource.journeyTo : ''}
			  </ListGroup.Item>
			</ListGroup>
		  );

		case 'booking':
		  return (
			<ListGroup>
			  <ListGroup.Item>
				Booking
				vehicle: {vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking start date: {resource ? moment(resource.startDate).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking end date: {resource ? moment(resource.endDate).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking start odometer reading: {resource ? `${resource.startOdometer} km` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking type: {resource ? resource.bookingType === 'K' ? 'Per kilometer' : 'Per' +
				' day' : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Booking cost: {
				Number.isNaN(calculateBookingCost(resource, journeys.filter(journey => journey.bookingID === resource.id)))
				  ?
				  'Pending (no journeys have' +
				  ' been made for this booking' +
				  ' yet)' :
				  `$ ${Number.parseFloat(calculateBookingCost(resource, journeys.filter(journey => journey.bookingID === resource.id))).toFixed(2)}`
			  }
			  </ListGroup.Item>
			</ListGroup>
		  );

		case 'service':
		  return (
			<ListGroup>
			  <ListGroup.Item>
				Service
				vehicle: {vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Serviced at: {resource ? moment(resource.servicedAt).format('DD/MM/YYYY') : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Service odometer reading: {resource ? `${resource.serviceOdometer} km` : ''}
			  </ListGroup.Item>
			</ListGroup>
		  );

		case 'fuelpurchase':
		case 'fuel purchase':
		  return (
			<ListGroup>
			  <ListGroup.Item>
				Fuel purchased for
				vehicle: {vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Fuel quantity: {resource ? `${resource.fuelQuantity} L` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Fuel
				price: {resource ? `$ ${Number.parseFloat(resource.fuelPrice).toFixed(2)}` : ''}
			  </ListGroup.Item>
			  <ListGroup.Item>
				Total cost: {resource ? `$ ${(resource.fuelQuantity * resource.fuelPrice).toFixed(2)}` : ``}
			  </ListGroup.Item>
			</ListGroup>
		  );

		default:
		  return (
			<p className="text-center">Error: resource info not found</p>
		  );
	  }
	}
  };

  return (
	<AppConsumer>
	  {
		({deleteResource}) => {
		  return (
			<Modal
			  size="lg"
			  show={deleteResource.showDeleteResourceModal}
			  onHide={() => deleteResource.setDeleteResourceModalShow(null, null)}
			  aria-labelledby="delete-modal"
			  centered
			>
			  <Modal.Header closeButton>
				<Modal.Title id="delete-modal">
				  Delete confirmation
				</Modal.Title>
			  </Modal.Header>
			  <Modal.Body>
				<h3 className="mb-4">Are you sure that you want to delete this {resourceType} from
				  the
				  system?</h3>
				<h4>{resourceType} information:</h4>
			  </Modal.Body>
			  {renderResourceInfo(resourceType, resource)}
			  <Modal.Footer>
				<Button
				  variant="danger"
				  size="lg"
				  className="mr-3"
				  onClick={() => deleteResource.resource ? deleteResource.confirmDeleteResource(resourceType, resource) : ''}
				>
				  Delete
				</Button>
				<Button
				  variant="info"
				  size="lg"
				  onClick={() => deleteResource.setDeleteResourceModalShow(null)}
				>
				  Cancel
				</Button>
			  </Modal.Footer>
			</Modal>
		  )
		}
	  }
	</AppConsumer>
  )
};

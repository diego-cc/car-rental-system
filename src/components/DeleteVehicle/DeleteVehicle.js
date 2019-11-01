import React, {useContext} from 'react';
import {Button, ListGroup, Modal} from "react-bootstrap";
import {AppConsumer, AppContext} from '../../AppContext/AppContext';

export const DeleteVehicle = props => {
  let vehicleToBeDeleted;
  const {deleteVehicle, vehicles} = useContext(AppContext);
  if (deleteVehicle.selectedVehicleId) {
	vehicleToBeDeleted = vehicles.find(vehicle => vehicle.id === deleteVehicle.selectedVehicleId);
  }
  return (
	<AppConsumer>
	  {
		({deleteVehicle}) => (
		  <Modal
			size="lg"
			show={deleteVehicle.showDeleteModal}
			onHide={() => deleteVehicle.setDeleteModalShow(null)}
			aria-labelledby="delete-modal"
			centered
		  >
			<Modal.Header closeButton>
			  <Modal.Title id="delete-modal">
				Delete confirmation
			  </Modal.Title>
			</Modal.Header>
			<Modal.Body>
			  <h3 className="mb-4">Are you sure that you want to delete this vehicle from the system?</h3>
			  <h4>Vehicle information:</h4>
			  <ListGroup>
				<ListGroup.Item>Manufacturer: {vehicleToBeDeleted ? vehicleToBeDeleted.manufacturer : ''}</ListGroup.Item>
				<ListGroup.Item>Model: {vehicleToBeDeleted ? vehicleToBeDeleted.model : ''}</ListGroup.Item>
				<ListGroup.Item>Year: {vehicleToBeDeleted ? vehicleToBeDeleted.year : ''}</ListGroup.Item>
				<ListGroup.Item>Registration number: {vehicleToBeDeleted ? vehicleToBeDeleted.registrationNumber : ''}</ListGroup.Item>
				<ListGroup.Item>Odometer reading: {vehicleToBeDeleted ? vehicleToBeDeleted.odometerReading : ''}</ListGroup.Item>
				<ListGroup.Item>Tank capacity: {vehicleToBeDeleted ? vehicleToBeDeleted.tankCapacity : ''}</ListGroup.Item>
			  </ListGroup>
			</Modal.Body>
			<Modal.Footer>
			  <Button
				variant="danger"
				size="lg"
				className="mr-3"
				onClick={() => deleteVehicle.selectedVehicleId ? deleteVehicle.confirmDeleteVehicle(deleteVehicle.selectedVehicleId) : ''}
			  >
				Delete
			  </Button>
			  <Button
				variant="info"
				size="lg"
				onClick={() => deleteVehicle.setDeleteModalShow(null)}
			  >
				Cancel
			  </Button>
			</Modal.Footer>
		  </Modal>
		)
	  }
	</AppConsumer>
  )
};

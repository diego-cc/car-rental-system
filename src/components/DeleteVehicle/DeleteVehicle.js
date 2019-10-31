import React, {useContext} from 'react';
import {Button, Modal} from "react-bootstrap";
import {AppConsumer, AppContext} from '../../AppContext/AppContext';

export const DeleteVehicle = props => {
    const context = useContext(AppContext);
    console.dir(context);
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
                            <h3>Are you sure that you want to delete this vehicle from the system?</h3>
                            <p>Vehicle ID: {deleteVehicle.selectedVehicleId ? deleteVehicle.selectedVehicleId : ''}</p>
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
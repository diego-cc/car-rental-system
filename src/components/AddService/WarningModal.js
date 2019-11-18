import React from 'react';
import {Button, Modal} from "react-bootstrap";

export const WarningModal = props => {
  return (
	<Modal
	  show={props.show}
	  onHide={props.cancelhandler}
	  size="xl"
	  aria-labelledby="contained-modal-title-vcenter"
	  centered
	>
	  <Modal.Header closeButton>
		<Modal.Title id="contained-modal-title-vcenter">
		  Warning
		</Modal.Title>
	  </Modal.Header>
	  <Modal.Body>
		<h4>{props.header}</h4>
		<p>
		  {props.body}
		</p>
	  </Modal.Body>
	  <Modal.Footer>
		<Button
		onClick={props.accepthandler}
		size="lg"
		variant="danger"
		>
		  {props.accept}
		</Button>
		<Button
		  variant="info"
		  size="lg"
		  onClick={props.cancelhandler}>
		  {props.cancel}
		</Button>
	  </Modal.Footer>
	</Modal>
  )
};

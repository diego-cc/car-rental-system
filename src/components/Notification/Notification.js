import React, {useState} from 'react';
import {Toast} from "react-bootstrap";

export const Notification = props => {
  const [show, setShow] = useState(true);

  return (
	<Toast
	  style={{
		display: props.display ? "block" : "none",
		position: 'relative',
		top: 0,
		left: '50%',
		transform: 'translateX(-50%)'
	  }}
	  onClose={() => setShow(false)}
	  show={show}
	  delay={3000}
	  autohide>
	  <Toast.Header>
		<strong className="mr-auto">Notification</strong>
	  </Toast.Header>
	  <Toast.Body>
		{props.message}
	  </Toast.Body>
	</Toast>
  )
};

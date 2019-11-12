import React, {useContext} from 'react';
import {AppContext} from "../../AppContext/AppContext";
import {Col, Container, ListGroup, Row} from "react-bootstrap";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export const ShowVehicle = props => {
  const {vehicles, loading} = useContext(AppContext);
  const vehicle = vehicles.find(v => v.id === props.match.params.vehicleID);

  return (
    <Container>
	  <Row>
		<Col>
		  {
		    vehicle ?
			  (
				<h2 className="text-center my-5">{`${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})`}</h2>
			  )
			  :
			  (
			    <p className="text-center my-5">Sorry, no vehicles were found</p>
			  )
		  }
		</Col>
	  </Row>
	  {
	    loading ?
		  (
			<Row className="justify-content-center mt-5">
			  <LoadingSpinner/>
			</Row>
		  )
		  :
		  (
			<ListGroup>
			  {
				vehicle &&
				Object.keys(vehicle)
				  .map((field, index) => (
					<ListGroup.Item key={index}>
					  {field}: {vehicle[field]}
					</ListGroup.Item>
				  ))
			  }
			</ListGroup>
		  )
	  }
	</Container>
  )
};

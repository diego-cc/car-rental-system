import React, {useContext} from 'react';
import {Container, Row} from "react-bootstrap";
import {Header} from "../Header/Header";
import {AppContext} from "../../AppContext/AppContext";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";

export const Dashboard = () => {
  const {vehicles, loading} = useContext(AppContext);
  return (
	<Container>
	  <Header headerText="Welcome to the Car Rental System"/>
	  {
		loading ?
		  (
			<Row className="justify-content-center mt-5">
			  <LoadingSpinner/>
			</Row>
		  ) :
		  (
		    <h2>Content goes here</h2>
		  )
	  }
	</Container>
  )
};

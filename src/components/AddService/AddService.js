import React, {useContext} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {AppContext} from "../../AppContext/AppContext";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Service} from "../../Model/Service";
import {Formik} from "formik";
import moment from "moment";
import * as yup from "yup";

const cloneDeep = require('lodash.clonedeep');


export const AddService = () => {
  const {loading, notification, vehicles, addResource} = useContext(AppContext);
  const {vehicleID} = useParams();
  const history = useHistory();

  const vehicleToBeModified = vehicles.find(v => v.id === vehicleID);
  const vehicle = cloneDeep(vehicleToBeModified);

  const schema = yup.object().shape({
	servicedAt: yup
	  .date()
	  .min(moment().subtract(1, 'day'), 'Invalid date')
	  .required('This field is required'),
	serviceOdometer: yup
	  .number()
	  .min(vehicle ? vehicle.odometerReading : 0,
		'Invalid service odometer')
	  .required('This field is required')
  });

  return (
	<Container>
	  {
		notification && notification.display ?
		  (
			<Notification
			  display={notification.display}
			  message={notification.message}/>
		  ) : ''
	  }
	  <Row>
		<Col>
		  <h2 className="text-center my-5">Register new service
			for: {vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})` : ''}</h2>
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
			<Formik
			  validationSchema={schema}
			  onSubmit={(values) => {
				const {serviceOdometer, servicedAt} = values;
				const service = new Service(vehicle.id, serviceOdometer, servicedAt);
				addResource('service', service);
				history.push(`/show/${vehicle.id}`);
			  }}
			  initialValues={{
				servicedAt: '',
				serviceOdometer: vehicle ? vehicle.odometerReading : 0
			  }}
			>
			  {({
				  handleSubmit,
				  handleChange,
				  resetForm,
				  values,
				  touched,
				  errors,
				  isSubmitting
				}) => (
				<Form noValidate onSubmit={handleSubmit}>
				  <Form.Group as={Row} controlId="servicedAt">
					<Form.Label column="true" sm="2">Serviced at:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="servicedAt"
						value={values.servicedAt}
						type="date"
						placeholder={new Date()}
						isInvalid={!!errors.servicedAt}
						isValid={touched.servicedAt && !errors.servicedAt}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.servicedAt}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>

				  <Form.Group as={Row} controlId="serviceOdometer">
					<Form.Label column="true" sm="2">Service odometer:<span
					  className="text-danger">*</span></Form.Label>
					<Col sm="10">
					  <Form.Control
						onChange={handleChange}
						name="serviceOdometer"
						value={values.serviceOdometer}
						type="number"
						placeholder="Service odometer..."
						isValid={touched.serviceOdometer && !errors.serviceOdometer}
						isInvalid={!!errors.serviceOdometer}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.serviceOdometer}
					  </Form.Control.Feedback>
					</Col>
				  </Form.Group>

				  <Row className="justify-content-center">
					<Button
					  variant="primary"
					  size="lg"
					  type="submit"
					  className="mr-5"
					  disabled={isSubmitting}
					>
					  Add service
					</Button>
					<Button
					  variant="warning"
					  size="lg"
					  className="mr-5"
					  onClick={() => {
						resetForm();
					  }}
					>
					  Clear
					</Button>
					<Button
					  variant="danger"
					  size="lg"
					  onClick={() => history.push(`/browse`)}
					>
					  Cancel
					</Button>
				  </Row>
				</Form>
			  )}
			</Formik>
		  )
	  }
	</Container>
  )
};

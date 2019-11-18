import React, {useContext, useRef} from 'react';
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Notification} from "../Notification/Notification";
import {AppContext} from "../../AppContext/AppContext";
import {Vehicle} from "../../Model/Vehicle";
import {Formik} from 'formik';
import * as yup from 'yup';
import moment from "moment";

const schema = yup.object().shape({
  manufacturer: yup.string().trim().required('This field is required'),
  model: yup.string().trim().required('This field is required'),
  year: yup
	.number()
	.min(moment().subtract(70, 'years').get("year"), 'Too old')
	.max(
	  moment()
		.add(1, 'year')
		.get('year'),
	  'Invalid year'),
  registrationNumber: yup
	.string()
	.trim()
	.length(7, '7 characters are required')
	.matches(/^[A-Za-z0-9]{7}$/, 'Only letters and numbers are valid')
	.required('This field is required'),
  odometerReading: yup.number().min(0, 'Invalid reading').required('This field is required'),
  tankCapacity: yup.number().min(0, 'Invalid tank capacity')
});

export const AddVehicle = props => {
  const {loading, notification, addResource} = useContext(AppContext);
  const history = useHistory();
  const manufacturerInputRef = useRef(null);

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
		  <h2 className="text-center my-5">Add a new vehicle</h2>
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
				console.log("submitting...");
				const {manufacturer, model, year, odometerReading, registrationNumber, tankCapacity} = values;
				const vehicleToBeAdded = new Vehicle(manufacturer, model, year, odometerReading, registrationNumber, tankCapacity);
				addResource('vehicle', vehicleToBeAdded);
				history.push(`/show/${vehicleToBeAdded.id}`);
			  }}
			  initialValues={{
				manufacturer: '',
				model: '',
				year: '',
				registrationNumber: '',
				odometerReading: '',
				tankCapacity: ''
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
				  <Form.Row className="mb-lg-3">
					<Form.Group as={Col} controlId="manufacturer" lg="4" md="12">
					  <Form.Label>Manufacturer:<span className="text-danger">*</span></Form.Label>
					  <Form.Control
						ref={manufacturerInputRef}
						onChange={handleChange}
						name="manufacturer"
						value={values.manufacturer}
						type="text"
						placeholder="Manufacturer..."
						isInvalid={!!errors.manufacturer}
						isValid={touched.manufacturer && !errors.manufacturer}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.manufacturer}
					  </Form.Control.Feedback>
					</Form.Group>

					<Form.Group as={Col} controlId="model" lg="4" md="12">
					  <Form.Label>Model:<span className="text-danger">*</span></Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="model"
						value={values.model}
						type="text"
						placeholder="Model..."
						isValid={touched.model && !errors.model}
						isInvalid={!!errors.model}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.model}
					  </Form.Control.Feedback>
					</Form.Group>

					<Form.Group as={Col} controlId="year" lg="4" md="12">
					  <Form.Label>Year:</Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="year"
						value={values.year}
						type="number"
						min={moment().subtract(60, 'years').get("year")}
						max={moment().add(1, 'year').get("year")}
						step="1"
						placeholder="Year..."
						isValid={touched.year && !errors.year}
						isInvalid={!!errors.year}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.year}
					  </Form.Control.Feedback>
					</Form.Group>

				  </Form.Row>
				  <Form.Row className="mb-lg-3">
					<Form.Group as={Col} controlId="registrationNumber" lg="6" md="12">
					  <Form.Label>Registration Number:<span className="text-danger">*</span></Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="registrationNumber"
						value={values.registrationNumber}
						type="text"
						placeholder="Registration Number..."
						isValid={touched.registrationNumber && !errors.registrationNumber}
						isInvalid={!!errors.registrationNumber}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.registrationNumber}
					  </Form.Control.Feedback>
					</Form.Group>
				  </Form.Row>

				  <Form.Row className="mb-lg-3">
					<Form.Group as={Col} controlId="odometerReading" lg="6" md="12">
					  <Form.Label>Odometer Reading (in kilometres):<span className="text-danger">*</span></Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="odometerReading"
						value={values.odometerReading}
						type="number"
						placeholder="Odometer Reading..."
						isValid={touched.odometerReading && !errors.odometerReading}
						isInvalid={!!errors.odometerReading}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.odometerReading}
					  </Form.Control.Feedback>
					</Form.Group>
				  </Form.Row>

				  <Form.Row className="mb-lg-5">
					<Form.Group as={Col} controlId="tankCapacity" lg="6" md="12">
					  <Form.Label>Tank Capacity (in litres):</Form.Label>
					  <Form.Control
						onChange={handleChange}
						name="tankCapacity"
						value={values.tankCapacity}
						type="number"
						placeholder="Tank Capacity..."
						isValid={touched.tankCapacity && !errors.tankCapacity}
						isInvalid={!!errors.tankCapacity}
					  />
					  <Form.Control.Feedback type="invalid">
						{errors.tankCapacity}
					  </Form.Control.Feedback>
					</Form.Group>
				  </Form.Row>
				  <Row className="justify-content-center">
					<Button
					  variant="primary"
					  size="lg"
					  type="submit"
					  className="mr-5"
					  disabled={isSubmitting}
					>
					  Add vehicle
					</Button>
					<Button
					  variant="warning"
					  size="lg"
					  className="mr-5"
					  onClick={() => {
						resetForm();
						manufacturerInputRef.current.focus()
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

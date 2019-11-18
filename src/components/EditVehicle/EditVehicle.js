import React, {useContext, useRef} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {AppConsumer, AppContext} from "../../AppContext/AppContext";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Notification} from "../Notification/Notification";
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {Vehicle} from "../../Model/Vehicle";
import moment from "moment";
import {schema} from '../AddVehicle/AddVehicle';
import {Formik} from "formik";
import {VehicleForm} from "../VehicleForm/VehicleForm";

const cloneDeep = require('lodash.clonedeep');

export const EditVehicle = () => {
  const {vehicles, editVehicle} = useContext(AppContext);
  const history = useHistory();
  const {vehicleID} = useParams();

  const vehicleToBeEdited = vehicles.find(v => v.id === vehicleID);
  let vehicle = cloneDeep(vehicleToBeEdited);

  return (
	<VehicleForm
	  type="edit"
	  vehicle={vehicle}
	  handleSubmit={values => {
		const {manufacturer, model, year, odometerReading, registrationNumber, tankCapacity} = values;
		vehicle = new Vehicle(manufacturer, model, year, odometerReading, registrationNumber, tankCapacity, vehicle.id, vehicle.createdAt, moment().format('DD/MM/YYYY hh:mm:ss A'));

		editVehicle(vehicle);
		history.push(`/browse/${vehicle.id}`);
	  }}
	/>
  )
};

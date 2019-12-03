const {getPoolConnection} = require('../db');
/**
 * Adds a resource to the database
 * @param {string} resourceName - one of: "vehicle", "booking", "journey", "fuelPurchase",
 * "fuel purchase", "fuel_purchase" or "service"
 * @param {Object} resource - raw data from the resource request
 * @returns {{error: string}}
 */
const addResource = async (resourceName, resource) => {
  const pool = await getPoolConnection();

  if (!resource || !resource['_id']) {
	return {
	  error: 'invalid resource data'
	}
  }
  resourceName = resourceName ? resourceName.trim().toLowerCase() : resourceName;
  let response;
  if (!resourceName) {
	response = {
	  error: 'invalid resource name'
	};
	return response;
  }

  let queryString, valuesArray;
  switch (resourceName) {
	case 'vehicle':
	  const {
		_id: vehicleUUID,
		_manufacturer,
		_model,
		_year,
		_odometerReading,
		_registrationNumber,
		_tankCapacity
	  } = resource;

	  queryString = `INSERT INTO nmt_fleet_manager.vehicles(uuid, manufacturer, model, year, odometer, registration, tank_size) VALUES (?, ?, ?, ?, ?, ?, ?)`;
	  valuesArray = [vehicleUUID, _manufacturer, _model, _year, _odometerReading, _registrationNumber, _tankCapacity];
	  break;

	case 'booking':
	  const {
		_id: vehicleBookingUUID,
		_vehicleID,
		_bookingType,
		_bookingCost,
		_startDate,
		_endDate,
		_startOdometer,
		_endOdometer
	  } = resource;

	  // get the vehicle associated with this booking from the database
	  const associatedVehicleQueryResults = await pool.query(`SELECT id FROM vehicles WHERE uuid = ?`, [_vehicleID]);
	  if (!associatedVehicleQueryResults[0][0] || !associatedVehicleQueryResults[0][0].id) {
		response = {
		  error: 'No vehicle associated with this booking was found'
		}
	  } else {
		queryString = `INSERT INTO nmt_fleet_manager.bookings(uuid, vehicle_id, vehicle_uuid, started_at, ended_at, start_odometer, type, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
		valuesArray = [vehicleBookingUUID, associatedVehicleQueryResults[0][0].id, _vehicleID, _startDate, _endDate, _startOdometer, _bookingType, _bookingCost]
	  }
	  break;

	case `journey`:
	  const {
		_id: journeyUUID,
		_bookingID: journeyBookingUUID,
		_journeyStartOdometerReading,
		_journeyEndOdometerReading,
		_journeyStartedAt,
		_journeyEndedAt,
		_journeyFrom,
		_journeyTo
	  } = resource;

	  // get the booking associated with this journey
	  const associatedJourneyBookingQueryResults = await pool.query(`SELECT id, uuid, vehicle_id, vehicle_uuid FROM bookings WHERE uuid = ?`, [journeyBookingUUID]);

	  if (!associatedJourneyBookingQueryResults[0] ||
		!associatedJourneyBookingQueryResults[0][0]) {
		response = {
		  error: 'No booking associated with this journey was found'
		}
	  } else {
		queryString = `INSERT INTO nmt_fleet_manager.journeys(uuid, booking_id, booking_uuid, vehicle_id, vehicle_uuid, started_at, ended_at, journey_from, journey_to, start_odometer, end_odometer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		valuesArray =
		  [
			journeyUUID,
			associatedJourneyBookingQueryResults[0][0].id,
			associatedJourneyBookingQueryResults[0][0].uuid,
			associatedJourneyBookingQueryResults[0][0].vehicle_id,
			associatedJourneyBookingQueryResults[0][0].vehicle_uuid,
			_journeyStartedAt,
			_journeyEndedAt,
			_journeyFrom,
			_journeyTo,
			_journeyStartOdometerReading,
			_journeyEndOdometerReading
		  ];
	  }
	  break;

	case `fuel purchase`:
	case `fuel_purchase`:
	case `fuelpurchase`:
	  const {
		_id: fuelPurchaseUUID,
		_bookingID: fuelPurchaseBookingUUID,
		_fuelPrice,
		_fuelQuantity
	  } = resource;

	  // get the booking associated with this fuel purchase
	  const associatedFuelPurchaseBookingQueryResults = await pool.query(`SELECT id, uuid, vehicle_id, vehicle_uuid FROM bookings WHERE uuid = ?`, [fuelPurchaseBookingUUID]);

	  if (!associatedFuelPurchaseBookingQueryResults[0] ||
		!associatedFuelPurchaseBookingQueryResults[0][0]) {
		response = {
		  error: 'No booking associated with this fuel purchase was found'
		}
	  } else {
		queryString = `INSERT INTO nmt_fleet_manager.fuel_purchases(uuid, booking_id, booking_uuid, vehicle_id, vehicle_uuid, fuel_quantity, fuel_price) VALUES (?, ?, ?, ?, ?, ?, ?)`;
		valuesArray =
		  [
			fuelPurchaseUUID,
			associatedFuelPurchaseBookingQueryResults[0][0].id,
			associatedFuelPurchaseBookingQueryResults[0][0].uuid,
			associatedFuelPurchaseBookingQueryResults[0][0].vehicle_id,
			associatedFuelPurchaseBookingQueryResults[0][0].vehicle_uuid,
			_fuelQuantity,
			_fuelPrice
		  ];
	  }
	  break;

	case `service`:
	  const {
		_id: serviceUUID,
		_vehicleID: serviceVehicleUUID,
		_serviceOdometer,
		_servicedAt
	  } = resource;

	  // get the vehicle associated with this service
	  const associatedVehicleServiceQueryResults = await pool.query(`SELECT id, uuid FROM vehicles WHERE uuid = ?`, [serviceVehicleUUID]);

	  if (!associatedVehicleServiceQueryResults[0]
		|| !associatedVehicleServiceQueryResults[0][0]) {
		response = {
		  error: 'No vehicle associated with this service was found'
		}
	  } else {
		queryString = `INSERT INTO nmt_fleet_manager.services(uuid, vehicle_id, vehicle_uuid, odometer, serviced_at) VALUES (?, ?, ?, ?, ?)`;
		valuesArray = [
		  serviceUUID,
		  associatedVehicleServiceQueryResults[0][0].id,
		  associatedVehicleServiceQueryResults[0][0].uuid,
		  _serviceOdometer,
		  _servicedAt
		];
	  }
	  break;

	default:
	  response = {
		error: 'Invalid resource to be added'
	  };
	  break;
  }
  if (queryString && valuesArray.length && !response) {
	response = await pool.query(queryString, valuesArray);
  }
  return response;
};

const handlePostResource = (req, res, resourceName, resource) => {
  res.set({
	'Content-Type': 'application/json; charset=utf-8'
  });
  try {
	const response = addResource(resourceName, resource);
	res.json(response);
  } catch (err) {
	res.json(err);
  }
};

module.exports = {handlePostResource};

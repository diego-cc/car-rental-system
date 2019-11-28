const express = require('express');
const mysql = require('mysql2');

const app = express();
const router = express.Router();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * Opens a connection pool to the MySQL database, assuming that
 * you have already set it up locally
 * You may need change the connection parameters to suit your local database
 * @type {Pool} pool
 */
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  port: '3306',
  user: 'nmt_fleet_manager',
  password: 'Fleet2019S2',
  database: 'nmt_fleet_manager'
})
  .promise();

/**
 * Basic connection error handling
 * (To be properly implemented, perhaps write a middleware and pass it to the router)
 */
pool.on('error', err => {
  console.dir(err);
});

/**
 * Functions to get a resource from the database
 */
/**
 * Gets a resource from the database (e.g. vehicles, bookings, journeys, etc.)
 * @param {string} resourceName - one of: "vehicle(s)", "booking(s)", "journey(s)",
 * "service(s)", "fuel purchase(s)", "fuelPurchase(s)"
 * @param {string|null} resourceID - an optional ID string to get a specific resource instead
 */
const getResource = async (resourceName, resourceID = null) => {
  let results = [];
  resourceName = resourceName ? resourceName.trim().toLowerCase() : resourceName;
  if (!resourceName) {
	return ({
	  error: 'invalid resource name'
	})
  }

  let query;
  switch (resourceName) {
	case 'vehicles':
	case 'bookings':
	case 'journeys':
	case 'fuel purchases':
	case 'fuelpurchases':
	case 'fuel_purchases':
	case 'services':
	  if (resourceName === 'fuel purchases' || resourceName === 'fuelpurchases') {
		resourceName = 'fuel_purchases';
	  }
	  query = `SELECT * FROM ${resourceName}`;
	  const [rows] = await pool.query(query);
	  results = rows;
	  return results;

	case 'vehicle':
	case 'booking':
	case 'journey':
	case 'fuel purchase':
	case 'fuelpurchase':
	case 'fuel_purchase':
	case 'service':
	  if (!resourceID) {
		throw new Error(`Invalid resourceID provided: ${resourceID}`);
	  }
	  if (resourceName === 'fuel purchase' || resourceName === 'fuelpurchase') {
		resourceName = 'fuel_purchase';
	  }
	  query = `SELECT * FROM \`${resourceName}s\` WHERE \`uuid\` = ?`;
	  const queryResult = await pool.execute(query, [resourceID]);
	  results = queryResult[0][0];
	  return results;

	default:
	  return results;
  }
};

/**
 * Handles GET requests by fetching resources and returning json responses
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {string} resourceName - one of: "vehicle(s)", "booking(s)", "journey(s)",
 * "service(s)", "fuel purchase(s)", "fuelPurchase(s)"
 * @param {string|null} resourceID - an optional ID string to get a specific resource
 * instead
 */
const handleFetchResource = async (req, res, resourceName, resourceID = null) => {
  res.set({
	'Content-Type': 'application/json; charset=utf-8'
  });
  try {
	const resource = await getResource(resourceName, resourceID);
	res.json(resource);
  } catch (err) {
	res.json(err);
  }
};

/**
 * GET ROUTES
 */
// GET /api/vehicles
router.get(`/vehicles`, async (req, res) => {
  await handleFetchResource(req, res, 'vehicles');
});

// GET /api/bookings
router.get(`/bookings`, async (req, res) => {
  await handleFetchResource(req, res, 'bookings');
});

// GET /api/journeys
router.get(`/journeys`, async (req, res) => {
  await handleFetchResource(req, res, 'journeys');
});

// GET /api/fuel_purchases
router.get(`/fuel_purchases`, async (req, res) => {
  await handleFetchResource(req, res, 'fuel_purchases');
});

// GET /api/services
router.get(`/services`, async (req, res) => {
  await handleFetchResource(req, res, 'services');
});

// GET /api/vehicles/:vehicleID
router.get(`/vehicles/:vehicleID`, async (req, res) => {
  await handleFetchResource(req, res, 'vehicle', req.params.vehicleID);
});

// GET /api/bookings/:bookingID
router.get(`/bookings/:bookingID`, async (req, res) => {
  await handleFetchResource(req, res, 'booking', req.params.bookingID);
});

// GET /api/journeys/:journeyID
router.get(`/journeys/:journeyID`, async (req, res) => {
  await handleFetchResource(req, res, 'journey', req.params.journeyID);
});

// GET /api/fuel_purchases/:fuelPurchaseID
router.get(`/fuel_purchases/:fuelPurchaseID`, async (req, res) => {
  await handleFetchResource(req, res, 'fuel_purchase', req.params.fuelPurchaseID);
});

// GET /api/services/:serviceID
router.get(`/services/:serviceID`, async (req, res) => {
  await handleFetchResource(req, res, 'service', req.params.serviceID);
});

/**
 * TODO:
 * Implement addResource for bookings, journeys, fuel purchases and services
 * Handle errors
 * Functions to POST a resource to the database
 */
/**
 * Adds a resource to the database
 * @param {string} resourceName - one of: "vehicle", "booking", "journey", "fuelPurchase",
 * "fuel purchase", "fuel_purchase" or "service"
 * @param {Object} resource - raw data from the resource request
 * @returns {{error: string}}
 */
const addResource = async (resourceName, resource) => {
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

/**
 * POST ROUTES
 */
// POST /api/vehicles
router.post(`/vehicles`, (req, res) => {
  handlePostResource(req, res, 'vehicle', req.body);
});

// POST /api/bookings
router.post(`/bookings`, (req, res) => {
  handlePostResource(req, res, 'booking', req.body);
});

router.post(`/journeys`, (req, res) => {
  handlePostResource(req, res, 'journey', req.body);
});

router.post(`/fuel_purchases`, (req, res) => {
  handlePostResource(req, res, 'fuel_purchase', req.body);
});

router.post(`/services`, (req, res) => {
  handlePostResource(req, res, 'service', req.body);
});

/**
 * DELETE a resource from the database
 */
/**
 * Deletes a resource from the database
 * @param {string} resourceName - one of: "vehicle", "journey", "fuel purchase",
 * "fuel_purchase", "fuelpurchase", "booking" or "service"
 * @param {string} resourceUUID - The resource to be removed from the database
 */
const deleteResource = async (resourceName, resourceUUID) => {
  if (!resourceUUID) {
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
  if (resourceName === 'fuel purchase' || resourceName === 'fuelpurchase') {
    resourceName = `fuel_purchase`;
  }
  // make sure that the resource exists in the database
  const resourceQueryResults = await pool.query(`SELECT id, uuid FROM ${resourceName}s WHERE uuid = ?`, [resourceUUID]);

  if (!resourceQueryResults[0] || !resourceQueryResults[0][0]) {
    response = {
      error: 'resource not found in DB'
	};
	return response;
  }

  // delete resource
  response = await pool.query(`DELETE FROM nmt_fleet_manager.${resourceName}s WHERE id = ? AND uuid = ?`, [resourceQueryResults[0][0].id, resourceUUID]);
  return response;
};

const handleDeleteResource = async (req, res, resourceName, resourceUUID) => {
  res.set('json');
  const response = await deleteResource(resourceName, resourceUUID);
  res.json({
	response
  })
};

/**
 * DELETE ROUTES
 */
// DELETE /vehicles/:vehicleUUID
router.delete(`/vehicles/:vehicleUUID`, async (req, res) => {
  await handleDeleteResource(req, res, 'vehicle', req.params.vehicleUUID);
});

// DELETE /bookings/:bookingUUID
router.delete(`/bookings/:bookingUUID`, async (req, res) => {
  await handleDeleteResource(req, res, 'booking', req.params.bookingUUID);
});

// DELETE /journeys/:journeyUUID
router.delete(`/journeys/:journeyUUID`, async (req, res) => {
  await handleDeleteResource(req, res, 'journey', req.params.journeyUUID);
});

// DELETE /fuel_purchases/:fuelPurchaseUUID
router.delete(`/fuel_purchases/:fuelPurchaseUUID`, async (req, res) => {
  await handleDeleteResource(req, res, 'fuel_purchase', req.params.fuelPurchaseUUID);
});

// DELETE /services/:serviceUUID
router.delete(`/services/:serviceUUID`, async (req, res) => {
  await handleDeleteResource(req, res, 'service', req.params.serviceUUID);
});


// 404
router.all('*', (req, res) => {
  res.set({
	'Content-Type': 'application/json; charset=utf-8'
  });

  res.status(404).json({
	error: `Endpoint not found`
  });
});

app.use('/api', router);
app.listen(port, () => console.log(`Server running on port ${port}`));

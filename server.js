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
 * @type {Pool} pool
 */
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  port: '3306',
  user: 'nmt_fleet_manager',
  password: 'Fleet2019S2',
  database: 'nmt_fleet_manager'
}).promise();

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
	  query = `SELECT * FROM \`${resourceName}s\` WHERE \`id\` = ?`;
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
router.get(`/bookings`, async(req, res) => {
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
 *
 * @param resourceName
 * @param resource
 * @returns {{error: string}}
 */
const addResource = async (resourceName, resource) => {
	let results = [];
  resourceName = resourceName ? resourceName.trim().toLowerCase() : resourceName;
  let response;
  if (!resourceName) {
	return ({
	  error: 'invalid resource name'
	})
  }

  switch (resourceName) {
	case 'vehicle':
	  resourceName = 'vehicles';
	  if (!resource || !resource['_id']) {
		return {
		  error: 'invalid vehicle data'
		}
	  }
	  const {
		_id,
		_manufacturer,
		_model,
		_year,
		_odometerReading,
		_registrationNumber,
		_tankCapacity
	  } = resource;

	  const vehiclesQueryResults = await pool.query(`INSERT INTO nmt_fleet_manager.vehicles(uuid, manufacturer, model, year, odometer, registration, tank_size) VALUES (?, ?, ?, ?, ?, ?, ?)`, [_id, _manufacturer, _model, _year, _odometerReading, _registrationNumber, _tankCapacity]);
		results = vehiclesQueryResults[0][0];
		return results;

	default:
	  response = {
		error: 'Invalid resource to be added'
	  };
	  break;
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


// 404
router.all('*', (req, res) => {
  res.set({
	'Content-Type': 'application/json; charset=utf-8'
  });

  res.json({
	error: `Endpoint not found`
  });
});

app.use('/api', router);
app.listen(port, () => console.log(`Server running on port ${port}`));
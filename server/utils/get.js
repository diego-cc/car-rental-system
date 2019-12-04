const {getPoolConnection} = require('../db');
/**
 * Functions to get a resource from the database
 */
/**
 * Gets a resource from the database (e.g. vehicles, bookings, journeys, etc.)
 * @param {string} resourceName - one of: "vehicle(s)", "booking(s)", "journey(s)",
 * "service(s)", "fuel purchase(s)", "fuelPurchase(s)"
 * @param {string|null} resourceUUID - an optional ID string to get a specific resource instead
 */
const getResource = async (resourceName, resourceUUID = null) => {
  let pool;
  try {
	pool = await getPoolConnection();

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
		if (!resourceUUID) {
		  throw new Error(`Invalid resourceID provided: ${resourceUUID}`);
		}
		if (resourceName === 'fuel purchase' || resourceName === 'fuelpurchase') {
		  resourceName = 'fuel_purchase';
		}
		query = `SELECT * FROM \`${resourceName}s\` WHERE \`uuid\` = ?`;
		const queryResult = await pool.execute(query, [resourceUUID]);
		results = queryResult[0][0];
		return results;

	  default:
		return results;
	}
  } catch (err) {
	return {
	  error: 'Could not connect to the database',
	  message: err
	}
  }
};

/**
 * Handles GET requests by fetching resources and returning json responses
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {string} resourceName - one of: "vehicle(s)", "booking(s)", "journey(s)",
 * "service(s)", "fuel purchase(s)", "fuelPurchase(s)"
 * @param {string|null} resourceUUID - an optional ID string to get a specific resource
 * instead
 */
const handleFetchResource = async (req, res, resourceName, resourceUUID = null) => {
  res.set({
	'Content-Type': 'application/json; charset=utf-8'
  });
  try {
	const resource = await getResource(resourceName, resourceUUID);
	res.json(resource);
  } catch (err) {
	res.json(err);
  }
};

module.exports = {handleFetchResource};

const {getPoolConnection} = require('../db');

const updateResource = async (resourceName, resourceUUID, resource) => {
  let pool, response;
  try {
	pool = await getPoolConnection();

	resourceName = resourceName ? resourceName.trim().toLowerCase() : resourceName;
	if (!resourceName || !resourceUUID || !resource) {
	  response = {
		error: 'Invalid resource data'
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

		console.log(resource);

		queryString = `UPDATE vehicles SET manufacturer = ?, model = ?, year = ?, odometer = ?, registration = ?, tank_size = ? WHERE uuid = ?`;
		valuesArray = [_manufacturer, _model, _year, _odometerReading, _registrationNumber, _tankCapacity, vehicleUUID];
		break;

	  case 'booking':
		const {
		  _id: bookingUUID,
		  _bookingType,
		  _bookingCost,
		  _startDate,
		  _endDate,
		  _startOdometer,
		  _endOdometer
		} = resource;
		

	  default:
		response = {
		  error: 'Invalid resource to be updated'
		};
		break;
	}
	if (queryString && valuesArray) {
	  try {
		response = await pool.query(queryString, valuesArray);
	  } catch (err) {
		response = {
		  error: err.message
		}
	  }
	}
	return response;
  } catch (err) {
	return ({
	  error: 'Could not connect to the database',
	  message: err
	})
  }
};

const handlePutResource = async (req, res, resourceName, resourceUUID, resource) => {
  res.set({
	'Content-Type': 'application/json; charset=utf-8'
  });
  try {
	const response = await updateResource(resourceName, resourceUUID, resource);
	res.json(response);
  } catch (err) {
	res.json(err);
  }
};

module.exports = {handlePutResource};

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
		  _startOdometer
		} = resource;
		queryString = `UPDATE bookings SET type = ?, cost = ?, started_at = ?, ended_at = ?, start_odometer = ? WHERE uuid = ?`;
		valuesArray = [_bookingType, _bookingCost, _startDate, _endDate, _startOdometer, bookingUUID];
		break;

	  case 'journey':
		const {
		  _id: journeyUUID,
		  _journeyStartOdometerReading,
		  _journeyEndOdometerReading,
		  _journeyStartedAt,
		  _journeyEndedAt,
		  _journeyFrom,
		  _journeyTo
		} = resource;
		queryString = `UPDATE journeys SET start_odometer = ?, end_odometer = ?, started_at = ?, ended_at = ?, journey_from = ?, journey_to = ? WHERE uuid = ?`;
		valuesArray = [_journeyStartOdometerReading, _journeyEndOdometerReading, _journeyStartedAt, _journeyEndedAt, _journeyFrom, _journeyTo, journeyUUID];
		break;

	  case 'fuelpurchase':
	  case 'fuel purchase':
	  case 'fuel_purchase':
		const {
		  _id: fuelPurchaseUUID,
		  _fuelPrice,
		  _fuelQuantity,
		} = resource;
		queryString = `UPDATE fuel_purchases SET fuel_price = ?, fuel_quantity = ? WHERE uuid = ?`;
		valuesArray = [_fuelPrice, _fuelQuantity, fuelPurchaseUUID];
		break;

	  case 'service':
		const {
		  _id: serviceUUID,
		  _serviceOdometer,
		  _servicedAt
		} = resource;
	    queryString = `UPDATE services SET odometer = ?, serviced_at = ? WHERE uuid = ?`;
	    valuesArray = [_serviceOdometer, _servicedAt, serviceUUID];
	    break;

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

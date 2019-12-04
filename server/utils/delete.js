const {getPoolConnection} = require('../db');
/**
 * Deletes a resource from the database
 * @param {string} resourceName - one of: "vehicle", "journey", "fuel purchase",
 * "fuel_purchase", "fuelpurchase", "booking" or "service"
 * @param {string} resourceUUID - The resource to be removed from the database
 */
const deleteResource = async (resourceName, resourceUUID) => {
  let pool, response;
  try {
	pool = await getPoolConnection();

	if (!resourceUUID) {
	  return {
		error: 'invalid resource data'
	  }
	}
	resourceName = resourceName ? resourceName.trim().toLowerCase() : resourceName;
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
  } catch (err) {
	return ({
	  error: 'Could not connect to the database',
	  message: err
	})
  }
};

const handleDeleteResource = async (req, res, resourceName, resourceUUID) => {
  res.set('json');
  const response = await deleteResource(resourceName, resourceUUID);
  res.json({
	response
  })
};

module.exports = {handleDeleteResource};

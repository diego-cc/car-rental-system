const {getPoolConnection} = require('../db');

const updateResource = async (resourceName, resourceUUID, resource) => {
  const pool = await getPoolConnection();
  let response;

  if (!resourceName || !resourceUUID || !resource) {
    response = {
      error: 'Invalid resource data'
	}
  }
};

const handlePutResource = async (req, res, resourceName, resourceUUID, resource) => {
  const pool = await getPoolConnection();

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

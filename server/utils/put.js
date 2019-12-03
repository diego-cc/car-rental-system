const {getPoolConnection} = require('../db');

const handlePutResource = async (req, res, resourceName, resource) => {
  const pool = await getPoolConnection();
  // to be implemented
};

module.exports = {handlePutResource};

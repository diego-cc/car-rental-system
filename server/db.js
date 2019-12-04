const mysql = require('mysql2/promise');

const getPoolConnection = async () => {
  let pool;
  try {
	pool = await mysql.createPool({
	  connectionLimit: 10,
	  host: 'localhost',
	  port: '3306',
	  user: 'nmt_fleet_manager',
	  password: 'Fleet2019S2',
	  database: 'nmt_fleet_manager'
	});
	return pool;
  } catch (err) {
	throw err;
  }
};

module.exports = {getPoolConnection};

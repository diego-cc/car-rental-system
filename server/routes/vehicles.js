/**
 * vehicles.js
 * GET, POST, PUT and DELETE for /api/vehicles
 */
const {handleFetchResource} = require('../utils/get');
const {handlePutResource} = require('../utils/put');
const {handleDeleteResource} = require('../utils/delete');
const {handlePostResource} = require('../utils/post');

const express = require('express');
const vehiclesRouter = express.Router();

vehiclesRouter
  .get(`/`, async (req, res) => {
	await handleFetchResource(req, res, 'vehicles');
  })
  .get(`/:vehicleUUID`, async (req, res) => {
	await handleFetchResource(req, res, 'vehicle', req.params.vehicleUUID);
  })
  .post(`/`, async (req, res) => {
	await handlePostResource(req, res, 'vehicle', req.body);
  })
  .put(`/:vehicleUUID`, async (req, res) => {
	await handlePutResource(req, res, 'vehicle', req.params.vehicleUUID, req.body);
  })
  .delete(`/:vehicleID`, async (req, res) => {
	await handleDeleteResource(req, res, 'vehicle', req.params.vehicleID);
  });

module.exports = {vehiclesRouter};

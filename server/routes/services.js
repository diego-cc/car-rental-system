/**
 * services.js
 * GET, POST, PUT and DELETE for /api/services
 */
const {handleFetchResource} = require('../utils/get');
const {handlePutResource} = require('../utils/put');
const {handleDeleteResource} = require('../utils/delete');
const {handlePostResource} = require('../utils/post');

const express = require('express');
const servicesRouter = express.Router();

servicesRouter
  .get(`/`, async (req, res) => {
	await handleFetchResource(req, res, 'services');
  })
  .get(`/:serviceID`, async (req, res) => {
	await handleFetchResource(req, res, 'service', req.params.serviceID);
  })
  .post(`/`, async (req, res) => {
	await handlePostResource(req, res, 'service', req.body);
  })
  .put(`/:serviceID`, async (req, res) => {
	await handlePutResource(req, res, 'service', req.body);
  })
  .delete(`/:serviceID`, async (req, res) => {
	await handleDeleteResource(req, res, 'service', req.params.serviceID);
  });

module.exports = {servicesRouter};

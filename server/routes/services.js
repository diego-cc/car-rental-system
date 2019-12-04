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
  .get(`/:serviceUUID`, async (req, res) => {
	await handleFetchResource(req, res, 'service', req.params.serviceUUID);
  })
  .post(`/`, async (req, res) => {
	await handlePostResource(req, res, 'service', req.body);
  })
  .put(`/:serviceUUID`, async (req, res) => {
	await handlePutResource(req, res, 'service', req.params.serviceUUID, req.body);
  })
  .delete(`/:serviceUUID`, async (req, res) => {
	await handleDeleteResource(req, res, 'service', req.params.serviceUUID);
  });

module.exports = {servicesRouter};

/**
 * journeys.js
 * GET, POST, PUT and DELETE for /api/journeys
 */
const {handleFetchResource} = require('../utils/get');
const {handlePutResource} = require('../utils/put');
const {handleDeleteResource} = require('../utils/delete');
const {handlePostResource} = require('../utils/post');

const express = require('express');
const journeysRouter = express.Router();

journeysRouter
  .get(`/`, async (req, res) => {
	await handleFetchResource(req, res, 'journeys');
  })
  .get(`/:journeyUUID`, async (req, res) => {
	await handleFetchResource(req, res, 'journey', req.params.journeyUUID);
  })
  .post(`/`, async (req, res) => {
	await handlePostResource(req, res, 'journey', req.body);
  })
  .put(`/:journeyUUID`, async (req, res) => {
	await handlePutResource(req, res, 'journey', req.params.journeyUUID, req.body);
  })
  .delete(`/:journeyUUID`, async (req, res) => {
	await handleDeleteResource(req, res, 'journey', req.params.journeyUUID);
  });

module.exports = {journeysRouter};

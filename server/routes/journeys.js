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
  .get(`/:journeyID`, async (req, res) => {
	await handleFetchResource(req, res, 'journey', req.params.journeyID);
  })
  .post(`/`, async (req, res) => {
	await handlePostResource(req, res, 'journey', req.body);
  })
  .put(`/:journeyID`, async (req, res) => {
	await handlePutResource(req, res, 'journey', req.body);
  })
  .delete(`/:journeyID`, async (req, res) => {
	await handleDeleteResource(req, res, 'journey', req.params.journeyID);
  });

module.exports = {journeysRouter};

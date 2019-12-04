/**
 * bookings.js
 * GET, POST, PUT and DELETE for /api/bookings
 */
const {handleFetchResource} = require('../utils/get');
const {handlePutResource} = require('../utils/put');
const {handleDeleteResource} = require('../utils/delete');
const {handlePostResource} = require('../utils/post');

const express = require('express');
const bookingsRouter = express.Router();

bookingsRouter
  .get(`/`, async (req, res) => {
	await handleFetchResource(req, res, 'bookings');
  })
  .get(`/:bookingUUID`, async (req, res) => {
	await handleFetchResource(req, res, 'booking', req.params.bookingUUID);
  })
  .post(`/`, async (req, res) => {
	await handlePostResource(req, res, 'booking', req.body);
  })
  .put(`/:bookingUUID`, async (req, res) => {
	await handlePutResource(req, res, 'booking', req.params.bookingUUID, req.body);
  })
  .delete(`/:bookingUUID`, async (req, res) => {
	await handleDeleteResource(req, res, 'booking', req.params.bookingUUID);
  });

module.exports = {bookingsRouter};

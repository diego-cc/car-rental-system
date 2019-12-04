/**
 * fuel_purchases.js
 * GET, POST, PUT and DELETE for /api/fuel_purchases
 */
const {handleFetchResource} = require('../utils/get');
const {handlePutResource} = require('../utils/put');
const {handleDeleteResource} = require('../utils/delete');
const {handlePostResource} = require('../utils/post');

const express = require('express');
const fuelPurchasesRouter = express.Router();

fuelPurchasesRouter
  .get(`/`, async (req, res) => {
	await handleFetchResource(req, res, 'fuel_purchases');
  })
  .get(`/:fuelPurchaseUUID`, async (req, res) => {
	await handleFetchResource(req, res, 'fuel_purchase', req.params.fuelPurchaseUUID);
  })
  .post(`/`, async (req, res) => {
	await handlePostResource(req, res, 'fuel_purchase', req.body);
  })
  .put(`/:fuelPurchaseUUID`, async (req, res) => {
	await handlePutResource(req, res, 'fuel_purchase', req.params.fuelPurchaseUUID, req.body);
  })
  .delete(`/:fuelPurchaseUUID`, async (req, res) => {
	await handleDeleteResource(req, res, 'fuel_purchase', req.params.fuelPurchaseUUID);
  });

module.exports = {fuelPurchasesRouter};

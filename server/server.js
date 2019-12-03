const {vehiclesRouter} = require('./routes/vehicles');
const {bookingsRouter} = require('./routes/bookings');
const {journeysRouter} = require('./routes/journeys');
const {fuelPurchasesRouter} = require('./routes/fuel_purchases');
const {servicesRouter} = require('./routes/services');

const express = require('express');

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/vehicles', vehiclesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/journeys', journeysRouter);
app.use('/api/fuel_purchases', fuelPurchasesRouter);
app.use('/api/services', servicesRouter);

app.all('*', (req, res) => {
  res.set({
	'Content-Type': 'application/json; charset=utf-8'
  });

  res.status(404).json({
	error: `Endpoint not found`
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

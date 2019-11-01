export class FuelPurchase {
  _fuelEconomy;
  _litres = 0;
  _cost = 0;

  getFuelEconomy() {
	return this._fuelEconomy;
  }

  getFuel() {
	return this._litres;
  }

  setFuelEconomy(fuelEconomy) {
	this._fuelEconomy = fuelEconomy;
  }

  purchaseFuel(litres, price) {
	this._litres += litres;
	this._cost += price;
  }
}

export class Service {
  /**
   * Constant to indicate that the vehicle needs to be serviced every 10,000 km
   * @returns {number}
   * @constructor
   */
  static get SERVICE_KILOMETRE_LIMIT() {
	return 10000;
  }
  _lastServiceOdometerKm = 0;
  _serviceCount = 0;
  _lastServiceDate;

  getLastServiceOdometerKm() {
	return this._lastServiceOdometerKm;
  }

  recordService(distance) {
	this._lastServiceOdometerKm = distance;
	this._serviceCount++;
  }

  getServiceCount() {
	return this._serviceCount;
  }

  getTotalScheduledServices() {
	return Math.floor(this.getLastServiceOdometerKm() / Service.SERVICE_KILOMETRE_LIMIT);
  }
}

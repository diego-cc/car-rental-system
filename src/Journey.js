export class Journey {
  _kilometres;

  constructor() {
	this._kilometres = 0;
  }

  addKilometres(kilometres) {
	this._kilometres += kilometres;
  }

  getKilometres() {
	return this._kilometres;
  }
}

import moment from "moment";

export class Journey {
  _id;
  _bookingID;
  _journeyStartOdometerReading;
  _journeyEndOdometerReading;
  _journeyStartedAt;
  _journeyEndedAt;
  _journeyFrom;
  _journeyTo;
  _createdAt;
  _updatedAt;

  constructor(id = require('uuid/v4')(), bookingID, journeyStartOdometerReading, journeyEndOdometerReading, journeyStartedAt, journeyEndedAt, journeyFrom, journeyTo, createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
    this._id = id;
    this._bookingID = bookingID;
    this._journeyStartOdometerReading = journeyStartOdometerReading;
    this._journeyEndOdometerReading = journeyEndOdometerReading;
    this._journeyStartedAt = journeyStartedAt;
    this._journeyEndedAt = journeyEndedAt;
    this._journeyFrom = journeyFrom;
    this._journeyTo = journeyTo;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get bookingID() {
    return this._bookingID;
  }

  set bookingID(value) {
    this._bookingID = value;
  }

  get journeyStartOdometerReading() {
    return this._journeyStartOdometerReading;
  }

  set journeyStartOdometerReading(value) {
    this._journeyStartOdometerReading = value;
  }

  get journeyEndOdometerReading() {
    return this._journeyEndOdometerReading;
  }

  set journeyEndOdometerReading(value) {
    this._journeyEndOdometerReading = value;
  }

  get journeyStartedAt() {
    return this._journeyStartedAt;
  }

  set journeyStartedAt(value) {
    this._journeyStartedAt = value;
  }

  get journeyEndedAt() {
    return this._journeyEndedAt;
  }

  set journeyEndedAt(value) {
    this._journeyEndedAt = value;
  }

  get journeyFrom() {
    return this._journeyFrom;
  }

  set journeyFrom(value) {
    this._journeyFrom = value;
  }

  get journeyTo() {
    return this._journeyTo;
  }

  set journeyTo(value) {
    this._journeyTo = value;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    this._createdAt = value;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(value) {
    this._updatedAt = value;
  }
}

# Car Rental System
A basic car rental system developed for an assignment at North Metropolitan TAFE. The frontend
 uses [React](https://reactjs.org/ "React") and the
 backend in this branch consists of [Express](http://expressjs.com/ "ExpressJS") and [MySQL](https://www.mysql.com/ "MySQL") (using the [node-mysql2](https://github.com/sidorares/node-mysql2 "node-mysql2") package).

## Download
`git clone https://github.com/diego-cc/car-rental-system.git`

## Install
`yarn` 

## Run
__NOTE__: _**Make sure that your database has been set up and initialised first before proceeding any further (see [DCC-FleetManager.sql](https://github.com/diego-cc/car-rental-system/blob/mysql/DCC-FleetManager.sql "DCC-FleetManager.sql") for instructions).**_

`yarn start`

## Test
`yarn test`

## Build
`yarn build`

## Key features
With this system, users are able to:

- Add / Edit / Delete / Browse / Search for vehicles
- Add / Delete bookings, journeys, services and fuel purchases
- Analyse revenue data in a bar chart, by month and year

Some of the technical features of this app include:

- Form validation with [formik](https://github.com/jaredpalmer/formik "Formik") and [yup](https://github.com/jquense/yup "yup")
- Type ahead on search form with [react-bootstrap-typeahead](https://github.com/ericgio/react-bootstrap-typeahead "react-bootstrap-typeahead")
- Conflict resolution (e.g. when a booking is scheduled when a service is due)
- Bar chart with [recharts](https://github.com/recharts/recharts "recharts")
- Automatic odometer updates

## License
[MIT](https://github.com/diego-cc/car-rental-system/blob/master/LICENSE "MIT License")

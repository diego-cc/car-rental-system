# Car Rental System
A basic car rental system developed for an assignment at North Metropolitan TAFE. The frontend
 uses [React](https://reactjs.org/ "React") and the
 backend is
 currently handled by [Firebase](https://firebase.google.com/ "Firebase").

## Download
`git clone https://github.com/diego-cc/car-rental-system.git`

## Install
`yarn` 

## Run
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

import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {Header} from "../Header/Header";
import {BrowseVehicles} from "../BrowseVehicles/BrowseVehicles";
import {Switch, Route} from 'react-router-dom';
import {AddVehicle} from "../AddVehicle/AddVehicle";
import {firebase} from "../../Firebase/Firebase";
import {AppProvider} from "../../AppContext/AppContext";
import {EditVehicle} from "../EditVehicle/EditVehicle";

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.addVehicle = vehicle => {
            this.setState({
                loading: true
            }, () => {
                // TODO: Validate fields before submission
                /*Object.values(vehicle).some(value => value.trim() && ...)
                let emptyField = false;
                for(let field in this.state) {
                    ...
                }*/
                const {vehicles} = this.state;
                const vehicleId = require('uuid/v4')();
                vehicles.push({
                    id: vehicleId,
                    data: vehicle
                });
                this.setState({
                    vehicles
                }, () => {
                    const db = firebase.firestore();
                    db
                        .collection('vehicles')
                        .doc(`${vehicle.manufacturer}_${vehicle.model}_${vehicle.year}_${vehicle.registrationNumber}`)
                        .set({
                            id: vehicleId,
                            data: vehicle
                        })
                        .then(() => {
                            this.setState({
                                notification: {
                                    display: true,
                                    message: 'The vehicle has been successfully added to the system'
                                },
                                loading: false
                            }, () => {
                                setTimeout(() => {
                                    this.setState({
                                        notification: {
                                            display: false,
                                            message: ''
                                        }
                                    });
                                }, 3500)
                            })
                        })
                        .catch(e => {
                            this.setState({
                                loading: false,
                                notification: {
                                    display: true,
                                    message: 'The vehicle could not be added to the system. Please try again.'
                                }
                            }, () => {
                                console.dir(e);
                                setTimeout(() => {
                                    this.setState({
                                        notification: {
                                            display: false,
                                            message: ''
                                        }
                                    });
                                }, 3500)
                            })
                        });
                })
            })
        };

        this.editVehicle = vehicle => {
            this.setState({
                loading: true
            }, () => {
                const { vehicles } = this.state;

            })
        };

        this.state = {
            loading: true,
            vehicles: [],
            addVehicle: this.addVehicle,
            notification: {
                display: false,
                message: ''
            }
        };
    }

    componentDidMount() {
        const db = firebase.firestore();
        db
            .collection('vehicles')
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                this.setState({
                    loading: false,
                    vehicles: [...data]
                })
            })
            .catch(e => {
                this.setState({
                    loading: false
                }, () => {
                    console.dir(e);
                })
            })
    }

    render() {
        return (
            <AppProvider value={this.state}>
                <Navigation/>
                <Switch>
                    <Route exact path="/">
                        <Header headerText="Welcome to the Car Rental System"/>
                    </Route>
                    <Route path="/browse">
                        <BrowseVehicles/>
                    </Route>
                    <Route path="/add">
                        <AddVehicle/>
                    </Route>
                    <Route path="/edit/:vehicleId" render={(props) => <EditVehicle {...props} />} />
                </Switch>
            </AppProvider>
        )
    }
}

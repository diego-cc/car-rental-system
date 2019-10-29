import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {Header} from "../Header/Header";
import {BrowseVehicles} from "../BrowseVehicles/BrowseVehicles";
import {Switch, Route} from 'react-router-dom';
import {AddVehicle} from "../AddVehicle/AddVehicle";
import {firebase} from "../../Firebase/Firebase";
import {AppProvider} from "../../AppContext/AppContext";

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.addVehicle = (e, vehicle) => {
            e.preventDefault();

            const {vehicles} = this.state;
            vehicles.push({
                id: require('uuid/v4')(),
                data: vehicle
            });
            this.setState({
                vehicles
            })
        };

        this.state = {
            loading: true,
            vehicles: [],
            addVehicle: this.addVehicle
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
                </Switch>
            </AppProvider>
        )
    }
}

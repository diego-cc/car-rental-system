import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {Header} from "../Header/Header";
import {BrowseVehicles} from "../BrowseVehicles/BrowseVehicles";

export class App extends React.Component {
    render() {
        return (
            <>
                <Navigation />
                <Header headerText="Welcome to the Car Rental System" />
                <BrowseVehicles />
            </>
        )
    }
}

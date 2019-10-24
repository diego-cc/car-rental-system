import React from 'react';
import {VehicleStarter} from "../../VehicleStarter";
import {Navigation} from "../Navigation/Navigation";
import {Header} from "../Header/Header";

export class App extends React.Component {
    render() {
        return (
            <>
                <Navigation />
                <Header headerText="Welcome to the Car Rental System" />
            </>
        )
    }
}
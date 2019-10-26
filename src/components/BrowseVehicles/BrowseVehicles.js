import React from 'react';
import {firebase} from "../../Firebase/Firebase";

export class BrowseVehicles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicles: []
        };
    };

    componentDidMount() {
        /*const db = firebase.firestore();
        db
            .collection('vehicles')
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                console.dir(data);
            })*/
    }

    render() {
        return (
            <>
                <h2>Browse Vehicles component</h2>
            </>
        )
    }
}

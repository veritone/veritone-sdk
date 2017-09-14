import React from 'react';
import VeritoneWidget from '../shared/VeritoneWidget'

class EditProfileWrapper extends VeritoneWidget {
    constructor(parameters={}) {
        super(EditProfile, parameters);
    }
}

class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name || "Mr. Robot"
        };
    }

    render() {
        return (
            <h1>Hello { this.state.name }</h1>
        )
    }

    refresh = (name) => {
        this.setState({name: name});
    } 

    componentWillUnmount() {
        console.log("Unmounted edit profile");
    }
}

export default EditProfileWrapper ;
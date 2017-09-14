import React from 'react';
import EditProfile from '../EditProfile';


// We would make this into an internal page with component documentation
class Bootstrap extends React.Component {
    async componentDidMount() {
        // For developers not using React.JS, this would effectively be a <script> </script> block.
    
        const mountPoint = document.getElementById('mountPoint');
        const editProfile = new EditProfile();
        await editProfile.mount(mountPoint);
        console.log("Done mounting, will destroy the component in 5 seconds");

        setTimeout( async () => {
            let result = await editProfile.destroy();
            console.log("Edit profile destroyed", result);

            console.log("Saying hello to Rick James");
            editProfile = new EditProfile({name: "Rick James"});
            await editProfile.mount(mountPoint);
            console.log("Asking Rick James to change his name to Darth Vader in 3 seconds");
            setTimeout( () => {
                editProfile.ref.refresh("Darth Vader");
            }, 3000);
        }, 5000);

    }

    render() {
        return (
            <div>
                <h1>Veritone Widgets</h1>
                <h2>"Edit Profile" Component</h2>
                <div style={ { border: "1px solid black", width: "300px" } }>
                    <div id="mountPoint">

                    </div>
                </div>
            </div>
        )
    }
}

export default Bootstrap;
import React from 'react';
import EditProfile from '../EditProfile';


// We would make this into an internal page with component documentation
class Bootstrap extends React.Component {
    async componentDidMount() {
        // For developers not using React.JS, this would effectively be a <script> </script> block.
    
        const mountPoint = document.getElementById('mountPoint');

        console.log("Creating a new EditProfile component with no parameters");
        const editProfile = new EditProfile();
        await editProfile.mount(mountPoint);
        console.log("Done mounting, will destroy the component in 5 seconds");

        setTimeout( async () => {
            let result = await editProfile.destroy();
            console.log("Edit profile destroyed", result);

            console.log("Creating a new EditProfileComponent() to say hello to Rick James");
            const editProfile2 = new EditProfile({name: "Rick James"});
            await editProfile2.mount(mountPoint);
            console.log("New EditProfile component", editProfile2);
            console.log("Asking Rick James to change his name to Darth Vader in 5 seconds");
            setTimeout( () => {
                editProfile2.refresh("Darth Vader");
            }, 5000);
            
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
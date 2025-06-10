import { useEffect, useState } from 'react';
import { resetDisplayName, resetPfp, uploadUserProfilePhoto } from '../utils/usersUtils';


const AccountPage = ({ user, setUser }) => {

    //declaring state variables managing pfp, name, and selected file
    const [newPfp, setNewPfp] = useState(null); //new pfp shows the file we currently selected or the users actual pfp is none is selected
    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    //change name and pfp if user is changed
    useEffect(() => {
        if (user) {
            setName(user.displayName || user.username);
            setNewPfp(user.photoURL || user.profilePicture);
        }
    }, [user]);

    const handleFileChange = async (e) => {
        //e.target means the HTML object in the DOM that triggered the event
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            //triggers after a reading operation is performed
            reader.onloadend = () => {
                setNewPfp(reader.result); //set new pfp as the file we selected (but this isn't permanent until we press upload)
            };
            //convert file into a DATA url - this triggers the onloadend()
            reader.readAsDataURL(file);
            setSelectedFile(file); // Store the selected file
        }
    };

    //NOTE: error encounterd if we try and upload a file as the pfp that's too large - consider adding a check for file size (dont allow users select file)
    //certain extensions - uBlock origin interfere with uploading the file
    const handleUploadClick = async () => {
        try {
            //check there is a new pfp and file selected
            if (newPfp && selectedFile) {
                user.photoURL = newPfp; //set photoUrl to new pfp which is set by changing file
                setUser(user);
                localStorage.setItem('lastUser', JSON.stringify(user)); //store modified user in localStorage(), this is then retrieve in app.js and passed to header component

                //await = allow CPU to execute other instructions while waiting for this one to complete
                await uploadUserProfilePhoto(user.uid, selectedFile);
            }
        } catch (error) {
            console.log("Error uploading new pfp...");
            throw error;
        }
    };

    const handleResetPfp = async () => {
        //reset URL to pfp that matches google account
        user.photoURL = user.profilePicture;
        setNewPfp(user.profilePicture);
        //set user back to self
        setUser(user);
        //store user in local storage
        localStorage.setItem('lastUser', JSON.stringify(user));

        await resetPfp(user.uid, user.profilePicture);
    };

    const handleResetName = async () => {
        //set display name (name on website) back to username (unique account name)
        user.displayName = user.username;
        setName(user.username);
        setUser(user);
        localStorage.setItem('lastUser', JSON.stringify(user));

        await resetDisplayName(user.uid, user.username);
    };

    const handleNameChange = async (e) => {
        e.preventDefault();
        //set display name to new name
        user.displayName = name;
        //update user
        setUser(user);
        localStorage.setItem('lastUser', JSON.stringify(user));
        //set display name to what was input
        await resetDisplayName(user.uid, user.displayName);
    };

    return (
        <div className='account-page'>
            <div className='account-header'>
                {/*name matches whatever is in the input name field*/}
                <h1 id="account-pfp-name" className='text-3xl font-bold m-5'>{name}</h1>
                {/*note how the src of the image is the newPfp variable*/}
                <img src={newPfp} alt="" id="account-pfp-img" className="rounded-xl m-5 h-40 w-40" />
            </div>
            <div className='upload-section'>
                {/*selecting file for new pfp*/}
                <input type="file" accept="image/*" onChange={handleFileChange} className='name-input rounded-xl text-black bg-gray-300 p-2 m-5' />
                <button onClick={handleUploadClick} className="text-black font-semibold bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2">Upload New PFP</button>
                <button onClick={handleResetPfp} className="text-black font-semibold bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 p-2 ml-2">Reset PFP</button>
                <form onSubmit={handleNameChange}>
                    {/*as we change the name in the field, the name above our pfp at the top of the page changes too*/}
                    <input type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter new name"
                        className='name-input rounded-xl bg-gray-300 text-black p-2 m-5 mt-0'
                    />
                    <button type="submit" className="text-black font-semibold bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2">Change Profile Name</button>
                    <button onClick={handleResetName} className="text-black font-semibold bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 p-2 ml-2">Reset Profile Name</button>
                </form>
            </div>
        </div>
    );
};

export default AccountPage;

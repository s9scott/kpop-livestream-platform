import { useEffect, useState } from 'react';
import { resetDisplayName, resetPfp, uploadUserProfilePhoto } from '../utils/firestoreUtils';

const AccountPage = ({ user, setUser }) => {
    const [newPfp, setNewPfp] = useState(null);
    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.displayName || user.username);
            setNewPfp(user.photoURL || user.profilePicture);
        }
    }, [user]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPfp(reader.result);
            };
            reader.readAsDataURL(file);
            setSelectedFile(file); // Store the selected file
        }
    };

    const handleUploadClick = async () => {
        try {
            if (newPfp && selectedFile) {
                user.photoURL = newPfp;
                setUser(user);
                localStorage.setItem('lastUser', JSON.stringify(user));

                await uploadUserProfilePhoto(user.uid, selectedFile);
            }
        } catch (error) {
            console.log("Error uploading new pfp...");
            throw error;
        }
    };

    const handleResetPfp = async () => {
        user.photoURL = user.profilePicture;
        setNewPfp(user.profilePicture);
        setUser(user);
        localStorage.setItem('lastUser', JSON.stringify(user));

        await resetPfp(user.uid, user.profilePicture);
    };

    const handleResetName = async () => {
        user.displayName = user.username;
        setName(user.username);
        setUser(user);
        localStorage.setItem('lastUser', JSON.stringify(user));

        await resetDisplayName(user.uid, user.username);
    };

    const handleNameChange = async (e) => {
        e.preventDefault();
        user.displayName = name;
        setUser(user);
        localStorage.setItem('lastUser', JSON.stringify(user));

        await resetDisplayName(user.uid, user.displayName);
    };

    return (
        <div className='account-page'>
            <div className='account-header'>
                <h1 id="account-pfp-name" className='text-3xl font-bold m-5'>{name}</h1>
                <img src={newPfp} alt="" id="account-pfp-img" className="rounded-xl m-5 h-40 w-40" />
            </div>
            <div className='upload-section'>
                <input type="file" accept="image/*" onChange={handleFileChange} className='name-input rounded-xl text-black bg-gray-300 p-2 m-5' />
                <button onClick={handleUploadClick} className="text-black font-semibold bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2">Upload New PFP</button>
                <button onClick={handleResetPfp} className="text-black font-semibold bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 p-2 ml-2">Reset PFP</button>
                <form onSubmit={handleNameChange}>
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

import '../styles/pages.css';
import '../styles/AccountPage.css';
import { addUser } from '../utils/firestoreUtils';
import { useEffect, useState } from 'react';

const AccountPage = ({ user, setUser }) => {
    const [newPfp, setNewPfp] = useState(null);
    const [name, setName] = useState("");

    useEffect(() => {
        if (user) {
            document.getElementById("account-pfp-img").src = user.photoURL;
            document.getElementById("account-pfp-img").alt = "Profile Photo";
            document.getElementById("account-pfp-name").textContent = user.displayName;
        } else {
            document.getElementById("account-pfp-name").textContent = "Please login again...";
        }
    }, [user]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPfp(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        if (newPfp) {
            document.getElementById("account-pfp-img").src = newPfp;
            document.getElementById("pfp-img").src = newPfp;
            user.photoURL = newPfp;
            console.log(user);
            setUser(user);
            localStorage.setItem('lastUser', JSON.stringify(user));
        }
    };

    const handleNameChange = (e) => {
        e.preventDefault();
        document.getElementById("account-pfp-name").textContent = name;
        document.getElementById("pfp-name").textContent = name;
        user.displayName = name
        console.log(user);
        setUser(user);
        localStorage.setItem('lastUser', JSON.stringify(user));
    };

    return (
        <div className='account-page'>
            <div className='account-header'>
                <h1 id="account-pfp-name"></h1>
                <img src="" alt="" id="account-pfp-img" className="account-pfp" />
            </div>
            <div className='upload-section'>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button onClick={handleUploadClick}>Upload New PFP</button>
                <form onSubmit={handleNameChange}>
                    <input type="text" 
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder="Enter new name"
                           className='name-input'
                    />       
                    <button type="submit" >Change Profile Name</button>
                </form>
            </div>
        </div>
    );
};

export default AccountPage;
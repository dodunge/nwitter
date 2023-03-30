import { authService, dbService } from "fbase";
import { useState, useEffect } from "react";
import Nweet from "components/Nweet";
import { useNavigate } from 'react-router-dom';

const Profile = ({ userObj, refreshUser }) => {
    const navigate = useNavigate();
    const [nweets, setNweets] = useState([]);
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event ;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName){
            await userObj.updateProfile({displayName: newDisplayName });
            refreshUser();
        }
    };

    useEffect(() => {
        dbService
        .collection("nweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt", "asc")
        .onSnapshot((snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        });
    }, [userObj]);

    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                    onChange={onChange}
                    type="text" 
                    placeholder="Display name" 
                    value={newDisplayName}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet 
                        key={nweet.id} 
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth, logout, storage } from '../firebase';
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

export default function Profile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [tempUsername, setTempUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureURL, setProfilePictureURL] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, "users"), where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    setUsername(userData.username);
                    setEmail(userData.email);
                    setTempUsername(userData.username); 
                    setProfilePictureURL(userData.profilePicture || '');
                });
            } else {
                console.error("The user is not currently authenticated.");
            }
        } catch (error) {
            console.error("Can't fetch user data:", error);
        }
    };
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
    };
    
    const uploadProfilePicture = async () => {
        try {
            const user = auth.currentUser;
            if (user && profilePicture) {
                const storageRef = ref(storage, `profilePictures/${user.uid}`);
                const uploadTask = uploadBytesResumable(storageRef, profilePicture);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                    },
                    (error) => {
                        console.error('Error uploading profile picture:', error);
                        setSnackbarMessage('Error uploading profile picture');
                    },
                    () => {
                        getDownloadURL(storageRef).then((downloadURL) => {
                            setProfilePictureURL(downloadURL);
                            const q = query(collection(db, "users"), where("uid", "==", user.uid));
                            getDocs(q).then((querySnapshot) => {
                                if (!querySnapshot.empty) {
                                    const docRef = querySnapshot.docs[0].ref;
                                    const updatedData = { profilePicture: downloadURL };
                                    updateDoc(docRef, updatedData).then(() => {
                                        console.log('Profile picture updated successfully!');
                                        setSnackbarMessage('Profile picture updated successfully!');
                                    }).catch((error) => {
                                        console.error('Error updating user document:', error);
                                        setSnackbarMessage('Error updating user document');
                                    });
                                } else {
                                    console.error('User document not found');
                                    setSnackbarMessage('User document not found');
                                }
                            }).catch((error) => {
                                console.error('Error fetching user document:', error);
                                setSnackbarMessage('Error fetching user document');
                            });
                        }).catch((error) => {
                            console.error('Error: cannot download URL:', error);
                            toast.error('Error: cannot download URL');
                        });
                    }
                );
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            setSnackbarMessage('Error uploading profile picture');
        }
    };

    const handleSaveUsername = async () => {
      const user = auth.currentUser;
      if (user) {
          try {
              const q = query(collection(db, "users"), where("uid", "==", user.uid));
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                  const docRef = querySnapshot.docs[0].ref;
                  const updatedData = { username: tempUsername };
                  await updateDoc(docRef, updatedData);
                  setUsername(tempUsername);
                  console.log('Username updated successfully!');
                  setSnackbarMessage('Username updated successfully!');
              } else {
                  throw new Error('User document not found');
              }
          } catch (error) {
              console.error('Error updating username:', error);
              setSnackbarMessage(error.message); 
          }
      }
  };  

    const handleUsernameChange = (e) => {
      if (e.target.value.includes(' ')) {
        setSnackbarMessage('Username cannot contain spaces');
        return;
      }
      setTempUsername(e.target.value); 
    };
    
    const handleLogout = () => {
      logout(db).then(val=> {
        console.log(val,"val")
        navigate("/"); // Redirect the user to the register page after logout
      })
    };

    return (
        <div className="container mx-auto mt-8">
          <div className="bg-stone-50 w-96 p-8 rounded-xl shadow-2xl">
            <div className="mb-4 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-2 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 flex justify-center items-center">
                {profilePictureURL ? (
                  <img src={profilePictureURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                )}
              </div>
              <input type="file" onChange={handleProfilePictureChange} accept="image/*" className="border border-gray-300 rounded-md p-2 w-full mt-2 mx-auto" />
              <div className="flex justify-end mt-2 text-right w-full">
                <button onClick={uploadProfilePicture} className="bg-lime-900 hover:bg-lime-800 text-white font-medium w-full py-1 px-4 my-2 rounded">
                  Upload Profile Picture
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold tracking-widest mb-2">Email:</label>
              <input type="text" value={email} disabled className="border border-gray-300 rounded-md p-2 w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold tracking-widest mb-2">Username:</label>
              <input type="text" value={tempUsername} onChange={handleUsernameChange} className="border border-gray-300 rounded-md p-2 w-full" />
              <div className="flex justify-end mt-2">
                <button onClick={handleSaveUsername} className="bg-lime-900 hover:bg-lime-800 text-white font-medium py-1 px-4 my-2 rounded">
                  Save Username
                </button>
              </div>
            </div>
            
            <div className="absolute top-0 left-0 mt-4 ml-4 flex items-center">
              <Link to="/landing">
              <button className="bg-stone-300 rounded p-1" onClick={() => {navigate("/landing")}} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </button>
              </Link>

            </div>

            <div>
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
              >
                <SnackbarContent
                  style={{
                  backgroundColor: '#f44336',
                  color: '#fff',
                  }}
                message={snackbarMessage}
                />
              </Snackbar>
            </div>
          </div>

          <div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white font-medium py-1 px-4 my-2 rounded">
              Log out
            </button>
          </div>
        </div>
      );
    }
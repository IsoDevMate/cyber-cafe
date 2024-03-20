/*import React from 'react';
import { useAuth } from '../../auth/context/auth';


export const ProfilePage = ({ user }) => {
const updateUserProfilePicture = async (pictureURL) => {
  const { user } = useAuth(); // Assuming you have access to the authenticated user object

  if (user) {
    try {
      // Update the user's document in Firestore
      await db.collection('users').doc(user.uid).update({
        profilePicture: pictureURL,
      });
      console.log('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  } else {
    console.error('User not authenticated');
  }
};
  
  return (
    <div className="my-4 max-w-screen-md mx-auto border px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4">
      <div className="flex flex-col border-b py-4 sm:flex-row sm:items-start">
        <div className="shrink-0 mr-auto sm:py-3">
          <p className="font-medium">Account Details</p>
          <p className="text-sm text-gray-600">Edit your account details</p>
        </div>
        <button className="mr-2 hidden rounded-lg border-2 px-4 py-2 font-medium text-gray-500 sm:inline focus:outline-none focus:ring hover:bg-gray-200">
          Cancel
        </button>
        <button className="hidden rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white sm:inline focus:outline-none focus:ring hover:bg-blue-700">
          Save
        </button>
      </div>
      <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
        <p className="shrink-0 w-32 font-medium">Name</p>
        <input
          placeholder="First Name"
          defaultValue={user?.displayName?.split(' ')[0] || ''}
          className="mb-2 w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 sm:mr-4 sm:mb-0 focus:ring-1"
        />
        <input
          placeholder="Last Name"
          defaultValue={user?.displayName?.split(' ')[1] || ''}
          className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
        />
      </div>
      <div className="flex flex-col gap-4 border-b py-4 sm:flex-row">
        <p className="shrink-0 w-32 font-medium">Email</p>
        <input
          placeholder="your.email@domain.com"
          defaultValue={user?.email || ''}
          className="w-full rounded-md border bg-white px-2 py-2 outline-none ring-blue-600 focus:ring-1"
        />
      </div>
      <div className="flex flex-col gap-4 py-4 lg:flex-row">
        <div className="shrink-0 w-32 sm:py-4">
          <p className="mb-auto font-medium">Avatar</p>
          <p className="text-sm text-gray-600">Change your avatar</p>
        </div>
        <div className="flex h-56 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 p-5 text-center">
          <img
            src="/images/ddHJYlQqOzyOKm4CSCY8o.png"
            className="h-16 w-16 rounded-full"
            alt="Avatar"
          />
          <p className="text-sm text-gray-600">
            Drop your desired image file here to start the upload
          </p>
          <input
            type="file"
            className="max-w-full rounded-lg px-2 font-medium text-blue-600 outline-none ring-blue-600 focus:ring-1"
          />
        </div>
      </div>

      <div className="flex justify-end py-4 sm:hidden">
        <button className="mr-2 rounded-lg border-2 px-4 py-2 font-medium text-gray-500 focus:outline-none focus:ring hover:bg-gray-200">
          Cancel
        </button>
        <button className="rounded-lg border-2 border-transparent bg-blue-600 px-4 py-2 font-medium text-white focus:outline-none focus:ring hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  );
};

*/
import React, { useState } from 'react';
import { useAuth } from '../../auth/context/auth';
import { storage,db} from '../../firebase';
import {getDoc,addDoc,doc,updateDoc, collection, getDocs, query, where, orderBy, limit, Timestamp} from 'firebase/firestore';
import { PuffLoader } from 'react-spinners';
import { FaCloudUploadAlt } from "react-icons/fa";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"


export const ProfilePage = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.photoURL || '');
  const { user: authUser } = useAuth(); 
   console.log("userID",authUser.uid)
 
 const updateUserProfilePicture = async (pictureURL) => {
    if (authUser) {
      try {
        const userDocRef = doc(db, 'users', authUser.uid);
        await updateDoc(userDocRef, {
          profilePicture: pictureURL,
        });
        console.log('Profile picture updated successfully');
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    } else {
      console.error('User not authenticated');
    }
  };
  const handleImageUpload = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    try {
      const fileRef = ref(storage, `/profile/${fileName}`);
      const downloadURL = await uploadBytesResumable(fileRef, file);
      setProfilePicture(downloadURL);

      await updateUserProfilePicture(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }

  };


  return (
    <div className="my-4 max-w-screen-md mx-auto border px-4 shadow-xl sm:mx-4 sm:rounded-xl sm:px-4 sm:py-4">
      <div className="flex flex-col gap-4 py-4 lg:flex-row">
        <div className="shrink-0 w-32 sm:py-4">
          <p className="mb-auto font-medium">Avatar</p>
          <p className="text-sm text-gray-600">Change your avatar</p>
        </div>
        <div className="flex h-56 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-300 p-5 text-center">
          <label
            htmlFor="profile-picture"
            className="relative h-16 w-16 cursor-pointer rounded-full overflow-hidden"
          >
            {isLoading ? (
              <p>Processing  <PuffLoader size={32} color="#3B82F6" /></p>
            ) : (
              <FaCloudUploadAlt
                color={'#3B82F6'}
                title={"Upload"}
                className="absolute h-full w-full"
                height="100%"
                width="100%"
              />
            )}
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          <p className="text-sm text-gray-600">Click to change avatar</p>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

const Profile = () => {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  // Functions
  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update the display name if it is not the same as it was
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in the firestore db
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { name });
      }
    } catch (error) {
      toast.error('Could not update profile details! Try again later!');
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>

        <button type="button" onClick={onLogout} className="logOut">
          Log Out
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails(!changeDetails);
            }}
          >
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
              required
            />

            <input
              type="email"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
              required
            />
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
      </main>
    </div>
  );
};

export default Profile;

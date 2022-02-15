import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import Spinner from '../components/Spinner';

const CreateListing = () => {
  const [geolocation, setGeolocation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    images: {},
    latitute: 0,
    longitude: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountPrice,
    images,
    latititude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();

  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else navigate('/sign-in');
      });
    }

    return () => (isMounted.current = false);
    // eslint-disable-next-line
  }, [isMounted]);

  if (loading) {
    return <Spinner />;
  }

  return <div>Create</div>;
};

export default CreateListing;

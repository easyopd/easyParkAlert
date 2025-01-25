import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

export default function Home() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is an admin
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  // Check user authentication and role on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === 'admin'); // Set isAdmin if the user has an 'admin' role
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db]);

  return (
    <div className='max-w-2xl px-5 mx-auto'>
      <Navbar back={false} />
      <div className='mt-10'>
        <h1 className='font-bold text-xl'>Welcome to Easypark Alert</h1>
        <p>Get emergency contact number of vehicles.</p>
      </div>
      <form
        className='mt-8 pt-8 border-t border-dashed border-black/20'
        onSubmit={() => navigate(`/${vehicleNumber.replace(/\s+/g, '').toUpperCase()}`)}
      >
        <label htmlFor='searchVehicle'>
          <p className='font-semibold uppercase text-sm'>Search by Vehicle number</p>
        </label>
        <div className='mt-2 flex items-center rounded-xl overflow-hidden shadow-md'>
          <input
            className='flex-1 w-full border-none rounded-l-xl focus:outline-none px-4 py-5 focus:ring-1 ring-inset focus:ring-blue-600'
            id='searchVehicle'
            type='search'
            name='search vehicle'
            placeholder='Eg. JK01O1234 '
            value={vehicleNumber.toUpperCase()}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
          <button
            className='px-4 py-5 cursor-pointer bg-blue-600 text-semibold text-white hover:bg-blue-800 transition'
            type='submit'
            disabled={vehicleNumber === '' ? true : false}
          >
            Search
          </button>
        </div>
      </form>
      <div className='grid grid-cols-2 gap-4 justify-stretch items-stretch content-stretch mt-8 pt-8 border-t border-dashed border-black/20'>
        <button
          className='h-full p-4 flex flex-col items-start justify-between text-left rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition'
          onClick={() => navigate('/addVehicle')}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-12 h-12'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <div>
            <p className='text-base md:text-lg font-bold mt-12 leading-tight'>Add vehicle</p>
            <p className='text-xs md:text-sm leading-tight text-white/80'>
              Add your vehicle details, emergency contact and help others
            </p>
          </div>
        </button>
        <div className='flex flex-col gap-4'>
          <button
            className='h-full p-4 flex flex-col items-start justify-between text-left text-white rounded-xl bg-gradient-to-br from-gray-800 to-black hover:shadow-xl transition'
            onClick={() => navigate('/parkings')}
          >
            <div>
              <p className='text-base md:text-lg font-bold leading-tight'>Nearby Parking</p>
              <p className='text-xs md:text-sm leading-tight text-white/80'>
                Locate nearby parking spots and their availability status.
              </p>
            </div>
          </button>
          {/* Conditionally render 'Add Parking' button if user is an admin */}
          {isAdmin && (
            <button
              className='h-full p-4 flex flex-col items-start justify-between text-left text-white rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 hover:shadow-xl transition'
              onClick={() => navigate('/addParking')}
            >
              <div>
                <p className='text-base md:text-lg font-bold leading-tight'>Add parking</p>
                <p className='text-xs md:text-sm leading-tight text-white/80'>
                  Assist others in locating available parking spaces.
                </p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

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
      <div className='mt-10 '>
        <h1 className='font-bold text-xl flex items-center justify-center space-x-3'>Welcome to Easypark Alert</h1>
        <p className='text-l flex items-center justify-center space-x-3'>Get emergency contact number of vehicles.</p>
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
           <svg
  xmlns='http://www.w3.org/2000/svg'
  fill='none'
  viewBox='0 0 24 24'
  strokeWidth={1.5}
  stroke='currentColor'
  className='w-12 h-12'
>
  <path
    strokeLinecap='round'
    strokeLinejoin='round'
    d='M12 2C8.134 2 5 5.134 5 8c0 3.316 3 6.234 7 11 4-4.766 7-7.684 7-11 0-2.866-3.134-6-7-6z'
  />
  <circle
    cx='12'
    cy='8'
    r='3'
    stroke='currentColor'
    strokeWidth='1.5'
    fill='none'
  />
</svg>

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
      <footer className='mt-10 py-5 text-center bg-gray-800 text-white rounded-xl'>
  <div className="flex items-center justify-center space-x-3 mx-5">
    {/* Logo */}
    <img 
      src="/images/cpad.jfif" 
      alt="Easypark Alert Logo" 
      className="w-11 h-11 rounded-full border-2 border-white"
          />
      <div> 
    <p className='text-sm'>
      &copy; 2025 Easypark Alert. All rights reserved.
    </p>
   
          

  <div className="flex items-center justify-center space-x-3">
             <p className="text-sm-center flex items-center justify-center space-x-1">
    Reach us on :  
    <a href="https://www.instagram.com/Easyparkalert" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.75 2C4.02208 2 1 5.02208 1 8.75V15.25C1 18.9779 4.02208 22 7.75 22H15.25C18.9779 22 22 18.9779 22 15.25V8.75C22 5.02208 18.9779 2 15.25 2H7.75ZM7.75 4H15.25C17.8503 4 20 6.14974 20 8.75V15.25C20 17.8503 17.8503 20 15.25 20H7.75C5.14974 20 3 17.8503 3 15.25V8.75C3 6.14974 5.14974 4 7.75 4ZM17 6C16.4477 6 16 6.44772 16 7C16 7.55228 16.4477 8 17 8C17.5523 8 18 7.55228 18 7C18 6.44772 17.5523 6 17 6ZM12.5 7C9.46243 7 7 9.46243 7 12.5C7 15.5376 9.46243 18 12.5 18C15.5376 18 18 15.5376 18 12.5C18 9.46243 15.5376 7 12.5 7ZM12.5 9C14.4325 9 16 10.5675 16 12.5C16 14.4325 14.4325 16 12.5 16C10.5675 16 9 14.4325 9 12.5C9 10.5675 10.5675 9 12.5 9Z" fill="currentColor"/>
      </svg>
    </a>
              </p>
                      </div>  

          </div>
          </div> 
          
</footer>

      
    </div>
  );
}

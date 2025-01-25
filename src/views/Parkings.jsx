import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { districtsJammuAndKashmir } from '../districts';
import Navbar from '../components/Navbar';
import toTitleCase from '../utils/toTitleCase';
import { useNavigate } from 'react-router-dom';

const ViewParkingPage = () => {
	const navigate = useNavigate();
	const [parkings, setParkings] = useState([]);
	const [districtFilter, setDistrictFilter] = useState('');
	const [typeFilter, setTypeFilter] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);

	const NoParking = () => {
		return (
			<div className="h-[80vh] flex flex-col items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-black/30">
					<path d="M11.625 16.5a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" />
					<path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 001.06-1.06l-1.047-1.048A3.375 3.375 0 1011.625 18z" clipRule="evenodd" />
					<path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
				</svg>
				<h1 className="text-2xl font-bold mt-3">No parking found</h1>
				<p className="w-1/2 text-center text-sm text-gray-500">Help others to find parkings.</p>
				<button onClick={() => navigate(`/addParking`)} className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">Add parking</button>
			</div>
		);
	};

	const getParkings = async () => {
		setLoading(true);
		const parkings = [];
		const parkingsRef = collection(db, "parking");
		let q = parkingsRef;

		if (districtFilter) {
			q = query(parkingsRef, where("district", "==", districtFilter));
		} else if (typeFilter) {
			q = query(parkingsRef, where("type", "==", typeFilter));
		} else if (searchQuery) {
			q = query(parkingsRef, where('address', '>=', searchQuery), where('address', '<=', searchQuery + '\uf8ff'));
		}

		const snapshot = await getDocs(q);
		snapshot.forEach((doc) => {
			parkings.push(doc.data());
		});
		setLoading(false);
		setParkings(parkings);
	};

	const handleDistrictChange = (value) => {
		setDistrictFilter(value);
		setTypeFilter('');
		setSearchQuery('');
	};

	const handleTypeChange = (value) => {
		setDistrictFilter('');
		setTypeFilter(value);
		setSearchQuery('');
	};

	const handleSearchChange = (value) => {
		setDistrictFilter('');
		setTypeFilter('');
		setSearchQuery(value);
	};

	useEffect(() => {
		getParkings()
	}, [districtFilter, typeFilter, searchQuery])

	return (
		<div className='max-w-2xl mx-auto px-5'>
			<Navbar title='View Parkings' />
			<div>
				<div>
					<input
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						type="search"
						name="search"
						placeholder='Search by address, eg, Lal Chowk'
						value={searchQuery}
						onChange={(e) => handleSearchChange(e.target.value)}
						required
					/>
				</div>
				<p className='mt-3 pb-1 text-xs uppercase font-semibold'>Filter</p>
				<div className='flex gap-3 items-center'>
					<div className='flex-1'>
						<select id='district' name="district" value={districtFilter}
							onChange={(e) => handleDistrictChange(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
							<option value="">Select District</option>
							{districtsJammuAndKashmir.map((district) => (
								<option key={district} value={district}>{district}</option>
							))}
						</select>
					</div>
					<div className='flex-1'>
						<select id='parkingType' name="type" value={typeFilter}
							onChange={(e) => handleTypeChange(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
							<option value="">Select Type</option>
							<option value="Paid">Paid</option>
							<option value="Free">Free</option>
						</select>
					</div>
				</div>
			</div>
			<div>
				<h2 className=' mt-4 text-sm uppercase font-semibold'>Parkings</h2>
				{loading ? (
					<p>Loading...</p>
				) : (
					<>
						{parkings.length === 0 ? (
							<NoParking />
						) : (
							<ul className='mt-2 flex flex-col gap-4'>
								{parkings.map((parking) => (
									<li key={parking.id} className='bg-black/5 rounded-xl p-5 flex flex-col gap-2'>
										<div>
											<p className='text-base font-bold'>{parking.name}</p>
										</div>
										<div className='mt-3 grid grid-cols-2 divide-x divide-black/10'>
											<div>
												<p className='text-xs'>District</p>
												<p className='text-sm font-semibold'>{parking.district}</p>
											</div>
											<div className='pl-5'>
												<p className='text-xs'>Parking type</p>
												<p className='text-sm font-semibold'>{parking.type}</p>
											</div>
										</div>
										<div>
											<p className='text-xs'>Address</p>
											<p className='text-sm font-semibold'>{toTitleCase(parking.address)}</p>
										</div>
									</li>
								))}
							</ul>
						)}
					</>
				)}

			</div>
		</div>
	);
};

export default ViewParkingPage;

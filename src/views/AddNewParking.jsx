import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { districtsJammuAndKashmir } from '../districts';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AddParkingPage = () => {
	const [user] = useAuthState(auth);
	const navigate = useNavigate();
	const [parkingData, setParkingData] = useState({
		name: '',
		type: '',
		district: '',
		address: '',
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setParkingData({ ...parkingData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			let docRef = await addDoc(collection(db, "parking"), {
				...parkingData,
				address: parkingData.address.toLowerCase(),
				createdBy: user.uid
			});

			await updateDoc(doc(db, "parking", docRef.id), {
				id: docRef.id
			})


			toast.success('Parking added successfully');
			navigate('/');
		} catch (error) {
			toast.error('Error adding parking');
		}
	};

	useEffect(() => {
		if (!user) {
			navigate('/login')
		}
	}, [user])

	return (
		<div className='max-w-2xl mx-auto px-5'>
			<Navbar title='Add new parking' />
			<form onSubmit={handleSubmit} className='flex flex-col gap-3'>
				<div>
					<label htmlFor="parkingName" className="block mb-2 text-sm font-medium text-gray-900">Parking Name</label>
					<input
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						id='parkingName'
						type="text"
						name="name"
						placeholder='eg, ABC Parking'
						value={parkingData.name}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="parkingType" className="block mb-2 text-sm font-medium text-gray-900">Parking Type</label>
					<select id='parkingType' name="type" value={parkingData.type} onChange={handleInputChange} required className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
						<option value="">Select Type</option>
						<option value="Paid">Paid</option>
						<option value="Free">Free</option>
					</select>
				</div>
				<div>
					<label htmlFor="district" className="block mb-2 text-sm font-medium text-gray-900">District</label>
					<select id='district' name="district" value={parkingData.district} onChange={handleInputChange} required className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
						<option value="">Select District</option>
						{districtsJammuAndKashmir.map((district) => (
							<option key={district} value={district}>{district}</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
					<input
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						id='address'
						type="text"
						name="address"
						placeholder='eg, 123, ABC Colony, XYZ Road'
						value={parkingData.address}
						onChange={handleInputChange}
						required
					/>
				</div>
				<button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">Add Parking</button>
			</form>
		</div>
	);
};

export default AddParkingPage;

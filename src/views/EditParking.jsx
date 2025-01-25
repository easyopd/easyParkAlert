import { useParams, useNavigate } from "react-router-dom"
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { districtsJammuAndKashmir } from "../districts";

export default function EditParking() {
	const { id } = useParams()
	const navigate = useNavigate();
	const [parkingData, setParkingData] = useState({
		name: '',
		type: '',
		district: '',
		address: '',
	});

	useEffect(() => {
		console.log(id);
		const getParkingData = async () => {
			const parkingRef = doc(db, "parking", id);
			const docSnap = await getDoc(parkingRef);
			if (docSnap.exists()) {
				setParkingData(docSnap.data())
			}
		}
		getParkingData()
	}, [])

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setParkingData({ ...parkingData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const parkingRef = doc(db, "parking", id);
			await updateDoc(parkingRef, {
				...parkingData,
				address: parkingData.address.toLowerCase(),
			});

			toast.success('Parking Updated successfully');
			navigate('/manageParkings');
		} catch (error) {
			toast.error('Something went wrong!');
		}
	};

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
				<button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">Update Parking</button>
			</form>
		</div>
	);
}

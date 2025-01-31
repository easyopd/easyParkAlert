import { useParams, useNavigate } from "react-router-dom"
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";


export default function ViewVehicle() {
	const { plateNumber } = useParams()
	const [user] = useAuthState(auth);
	const navigate = useNavigate();
	const [vehicleData, setVehicleData] = useState({
		make: '',
		model: '',
		contactNumber: '',
		owner: '',
		numberPlate: plateNumber || '',
	});

	useEffect(() => {
		const getVehicleData = async () => {
			const vehicleRef = doc(db, "vehicles", plateNumber);
			const docSnap = await getDoc(vehicleRef);
			if (docSnap.exists()) {
				setVehicleData(docSnap.data())
				console.log(vehicleData);
			}
		}
		getVehicleData()
	}, [])

	const handleChange = (e) => {
		const { name, value } = e.target;
		setVehicleData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const vehicleRef = doc(db, "vehicles", plateNumber);
		await updateDoc(vehicleRef, {
			make: vehicleData.make,
			model: vehicleData.model,
			numberPlate: vehicleData.numberPlate,
			contactNumber: vehicleData.contactNumber,
			alternateNumber: vehicleData.alternateNumber,
			owner: vehicleData.owner,
			UserID: user.uid,
		})
		toast.success('Vehicle updated successfully');
		navigate(-1);
	};

	return (
		<div className='max-w-2xl mx-auto px-5'>
			<Navbar />
			<form onSubmit={handleSubmit} className='flex flex-col gap-3'>
				<div>
					<label htmlFor="vehicleNumber" className="block mb-2 text-sm font-medium text-gray-900">Vehicle number</label>
					<input
						id='vehicleNumber'
						type="text"
						name="numberPlate"
						value={vehicleData.numberPlate}
						onChange={handleChange}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 uppercase"
						placeholder="eg, JK01O1234"
						required
						disabled
					/>
				</div>
				<div>
					<label htmlFor="vehicleManufacturer" className="block mb-2 text-sm font-medium text-gray-900">Vehicle manufacturer</label>
					<input
						id='vehicleManufacturer'
						type="text"
						name="make"
						value={vehicleData.make}
						onChange={handleChange}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						placeholder="eg, Maruti Suzuki"
						required
					/>
				</div>
				<div>
					<label htmlFor="vehicleModel" className="block mb-2 text-sm font-medium text-gray-900">Vehicle model</label>
					<input
						id='vehicleModel'
						type="text"
						name="model"
						value={vehicleData.model}
						onChange={handleChange}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						placeholder="eg, Swift"
						required
					/>
				</div>
				<div>
					<label htmlFor="vehicleOwner" className="block mb-2 text-sm font-medium text-gray-900">Vehicle owner</label>
					<input
						id='vehicleOwner'
						type="text"
						name="owner"
						value={vehicleData.owner}
						onChange={handleChange}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						placeholder="eg, Swift"
						required
					/>
				</div>
				<div>
					<label htmlFor="EmergencyContact" className="block mb-2 text-sm font-medium text-gray-900">Emergency contact number</label>
					<input
						id='EmergencyContact'
						type="tel"
						name="contactNumber"
						value={vehicleData.contactNumber}
						onChange={handleChange}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						placeholder="eg, 990000000"
						required
						minLength={10}
						maxLength={10}
						inputMode="numeric"
						pattern="[0-9]*"
					/>
				</div><div>
					<label htmlFor="AlternateContact" className="block mb-2 text-sm font-medium text-gray-900">Alternate contact number</label>
					<input
						id='AlternateContact'
						type="tel"
						name="alternateNumber"
						value={vehicleData.alternateNumber}
						onChange={handleChange}
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						placeholder="eg, 990000000"
						required
						minLength={10}
						maxLength={10}
						inputMode="numeric"
						pattern="[0-9]*"
					/>
				</div>
				<button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">Update Vehicle</button>
			</form>
		</div>
	)
}

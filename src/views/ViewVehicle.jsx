import { useParams, useNavigate } from "react-router-dom"
import { db, auth } from '../firebase';
import { deleteDoc, doc, getDoc } from "firebase/firestore";
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
		numberPlate: '',
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		const getVehicleData = async () => {
			const vehicleRef = doc(db, "vehicles", plateNumber);
			const docSnap = await getDoc(vehicleRef);
			if (docSnap.exists()) {
				setVehicleData(docSnap.data())
				console.log(vehicleData);
			}
			setLoading(false);
		}
		getVehicleData()
	}, [plateNumber])

	const deleteVehicle = async (numberPlate) => {
		const vehicleRef = doc(db, "vehicles", numberPlate);
		deleteDoc(vehicleRef).then(() => {
			toast.success('Vehicle deleted successfully');
			navigate('/')
		}).catch((error) => {
			toast.error('Error deleting vehicle');
		});
	}

	const RenderVehicle = ({ vehicle }) => {
		return (
			<div className='w-full flex flex-col gap-2 mt-8'>
				<div className="flex gap-5 items-center justify-between">
					<div>
						<p className='text-sm'>Vehicle number</p>
						<h1 className='text-2xl font-bold'>{vehicle.numberPlate}</h1>
					</div>
					<svg width="150" height="150" viewBox="0 0 366 390" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g >
							<path d="M315.342 228.973H302.58L269.755 154.84C268.269 151.486 265.846 148.637 262.78 146.637C259.714 144.637 256.136 143.572 252.479 143.572H113.52C109.864 143.572 106.286 144.637 103.219 146.637C100.153 148.637 97.7306 151.486 96.2451 154.84L63.4196 228.973H50.6581C48.151 228.973 45.7466 229.972 43.9738 231.752C42.201 233.531 41.2051 235.945 41.2051 238.461C41.2051 240.978 42.201 243.392 43.9738 245.171C45.7466 246.951 48.151 247.95 50.6581 247.95H60.111V342.84C60.111 347.873 62.1029 352.7 65.6485 356.259C69.194 359.818 74.0028 361.817 79.017 361.817H107.376C112.39 361.817 117.199 359.818 120.744 356.259C124.29 352.7 126.282 347.873 126.282 342.84V323.862H239.718V342.84C239.718 347.873 241.71 352.7 245.255 356.259C248.801 359.818 253.61 361.817 258.624 361.817H286.983C291.997 361.817 296.806 359.818 300.351 356.259C303.897 352.7 305.889 347.873 305.889 342.84V247.95H315.342C317.849 247.95 320.253 246.951 322.026 245.171C323.799 243.392 324.795 240.978 324.795 238.461C324.795 235.945 323.799 233.531 322.026 231.752C320.253 229.972 317.849 228.973 315.342 228.973ZM126.282 285.906H107.376C104.869 285.906 102.464 284.906 100.692 283.127C98.9189 281.347 97.923 278.934 97.923 276.417C97.923 273.901 98.9189 271.487 100.692 269.707C102.464 267.928 104.869 266.928 107.376 266.928H126.282C128.789 266.928 131.193 267.928 132.966 269.707C134.739 271.487 135.735 273.901 135.735 276.417C135.735 278.934 134.739 281.347 132.966 283.127C131.193 284.906 128.789 285.906 126.282 285.906ZM239.718 285.906C237.211 285.906 234.806 284.906 233.033 283.127C231.261 281.347 230.265 278.934 230.265 276.417C230.265 273.901 231.261 271.487 233.033 269.707C234.806 267.928 237.211 266.928 239.718 266.928H258.624C261.131 266.928 263.535 267.928 265.308 269.707C267.081 271.487 268.077 273.901 268.077 276.417C268.077 278.934 267.081 281.347 265.308 283.127C263.535 284.906 261.131 285.906 258.624 285.906H239.718Z" fill="black" fillOpacity="0.62" />
							<path d="M95.0917 113.795C97.9588 116.673 102.52 116.937 105.697 114.409L136.208 90.1372C138.119 88.6168 139.233 86.3033 139.233 83.8555L139.233 59.8979C139.233 56.4277 141.452 53.3294 144.78 52.3906C169.818 45.3275 196.316 45.3275 221.354 52.3906C224.682 53.3294 226.901 56.4277 226.901 59.8979L226.901 83.9869C226.901 86.4359 228.016 88.7505 229.929 90.2707L260.304 114.414C263.482 116.939 268.041 116.674 270.907 113.797L297.196 87.409C300.189 84.4041 300.335 79.5542 297.375 76.516C234.579 12.0586 131.422 12.0586 68.6261 76.516C65.6662 79.5542 65.8119 84.4041 68.8054 87.409L95.0917 113.795Z" fill="black" fillOpacity="0.62" />
							<path d="M95.0917 113.795C97.9588 116.673 102.52 116.937 105.697 114.409L136.208 90.1372C138.119 88.6168 139.233 86.3033 139.233 83.8555L139.233 59.8979C139.233 56.4277 141.452 53.3294 144.78 52.3906C169.818 45.3275 196.316 45.3275 221.354 52.3906C224.682 53.3294 226.901 56.4277 226.901 59.8979L226.901 83.9869C226.901 86.4359 228.016 88.7505 229.929 90.2707L260.304 114.414C263.482 116.939 268.041 116.674 270.907 113.797L297.196 87.409C300.189 84.4041 300.335 79.5542 297.375 76.516C234.579 12.0586 131.422 12.0586 68.6261 76.516C65.6662 79.5542 65.8119 84.4041 68.8054 87.409L95.0917 113.795Z" fill="black" fillOpacity="0.62" />
						</g>
					</svg>
				</div>
				<div className='mt-3 grid grid-cols-2 divide-x divide-black/10'>
					<div>
						<p className='text-sm'>Make</p>
						<p className='text-lg font-semibold'>{vehicle.make}</p>
					</div>
					<div className='pl-5'>
						<p className='text-sm'>Model</p>
						<p className='text-lg font-semibold'>{vehicle.model}</p>
					</div>
				</div>
				<div className='mt-3 grid grid-cols-2 divide-x divide-black/10'>
					<div >
						<p className='text-sm'>Owner</p>
						<p className='text-lg font-semibold'>{vehicle.owner}</p>
					</div>
					<div className='pl-5'>
						<p className='text-sm'>Contact number</p>
						<a href={`tel:${vehicle.contactNumber}`} className='text-lg font-semibold flex items-center gap-5'>{vehicle.contactNumber}
							<div className="p-3 text-white rounded-full bg-blue-600">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
									<path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
								</svg>
							</div>
						</a>
					</div>
				</div>
				{vehicle.UserID === user?.uid &&
					<div className='mt-10 text-center grid grid-cols-2 border-t border-dashed border-black/20'>
						<button className='p-3' onClick={() => navigate(`/editVehicle/${vehicle.numberPlate}`)}>Edit</button>
						<button className='p-3 text-red-600' onClick={() => deleteVehicle(vehicle.numberPlate)}>Delete</button>
					</div>
				}
				<p className="fixed bottom-0 p-5 text-center max-w-1/2 left-1/2 -translate-x-1/2">Is this information inaccurate? Please send us an email.
							      <a href="mailto:example@example.com" className="text-blue-500 underline ml-1">shahaabid599@gmail.com</a>
</p>
			</div>

		)
	}


	return (
		<div className="max-w-2xl mx-auto px-5">
			<Navbar title="View Vehicle" />
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="w-full flex flex-col items-center">
					{vehicleData.make ? (
						<RenderVehicle vehicle={vehicleData} />
					) : (
						<div className="min-h-[80vh] flex flex-col items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-24 h-24 text-black/30"
							>
								<path d="M11.625 16.5a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" />
								<path
									fillRule="evenodd"
									d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 001.06-1.06l-1.047-1.048A3.375 3.375 0 1011.625 18z"
									clipRule="evenodd"
								/>
								<path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
							</svg>
							<h1 className="text-2xl font-bold mt-3">Vehicle not found</h1>
							<p className="w-1/2 text-center text-sm text-gray-500">
								Details for <span className="font-bold">{plateNumber}</span> doesn&apos;t exist. Do you want to add details for this vehicle?
							</p>
							<button
								onClick={() => navigate(`/addVehicle/${plateNumber}`)}
								className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
							>
								Add Vehicle
							</button>
						</div>
					)}
				</div>
			)}
		</div >

	)
}


import { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore'
import Navbar from '../components/Navbar'
import { toast } from 'react-hot-toast'
import toTitleCase from '../utils/toTitleCase'


export default function ManageParkings() {
	const [parkings, setParkings] = useState([{}]);
	const [loading, setLoading] = useState(true);
	const [user] = useAuthState(auth);
	const navigate = useNavigate();

	const getAllParkingsOfUser = async () => {
		setLoading(true);
		setParkings([])
		const parkings = [];
		const parkingsRef = collection(db, "parking");
		const q = query(parkingsRef, where("createdBy", "==", user.uid));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			parkings.push(doc.data());
		});
		setParkings(parkings);
		setLoading(false);
	}

	useEffect(() => {
		if (!user) {
			navigate('/login')
		} else {
			getAllParkingsOfUser()
		}
	}, [user])

	const deleteParking = async (id) => {
		const parkingRef = doc(db, "parking", id);
		deleteDoc(parkingRef).then(() => {
			toast.success('parking deleted successfully');
			getAllParkingsOfUser()
		}).catch((error) => {
			console.error("Error removing document: ", error);
		});
	}

	const ParkingCard = ({ parking }) => {
		return (
			<div className='bg-black/5 rounded-xl p-5 pb-0 flex flex-col gap-2'>
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
				{console.log(parking
				)}
				<div>
					<p className='text-xs'>Address</p>
					<p className='text-sm font-semibold'>{toTitleCase(parking.address || "")}</p>
				</div>
				<div className='mt-3 text-center grid grid-cols-2 border-t border-dashed border-black/20'>
					<button className='p-3' onClick={() => navigate(`/editParking/${parking.id}`)}>Edit</button>
					<button className='p-3 text-red-600' onClick={() => deleteParking(parking.id)}>Delete</button>
				</div>
			</div>
		)
	}

	const NoParkingFound = () => {
		return (
			<div className="min-h-[80vh] flex flex-col items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-black/30">
					<path d="M11.625 16.5a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" />
					<path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 001.06-1.06l-1.047-1.048A3.375 3.375 0 1011.625 18z" clipRule="evenodd" />
					<path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
				</svg>
				<h1 className="text-2xl font-bold mt-3">Oops, No Parking</h1>
				<p className="w-1/2 text-center text-sm text-gray-500">You haven&apos;t added any parking yet.</p>
				<button onClick={() => navigate(`/addParking`)} className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none">Add parking</button>
			</div>
		)
	}

	return (
		<div className='max-w-2xl px-5 mx-auto'>
			<Navbar title='Manage parkings' />
			{loading ? (
				<p>Loading...</p>
			) : parkings.length === 0 ? (
				<NoParkingFound />
			) : (
				<div className="flex flex-col gap-5 mt-5">
					<button
						type="button"
						className="text-blue-700 bg-white hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						onClick={() => navigate('/addParking')}
					>
						Add new parking
					</button>
					{parkings.map((parking) => (
						<ParkingCard key={parking.numberPlate} parking={parking} />
					))}
				</div>
			)}
		</div>
	)
}

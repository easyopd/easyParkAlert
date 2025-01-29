import { auth, logout, signInWithGoogle } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useReactPWAInstall } from "react-pwa-install";

// eslint-disable-next-line react/prop-types
export default function Navbar({ back = true, title = 'Easypark Alert' }) {
	const [user, loading] = useAuthState(auth)
	const navigate = useNavigate()
	const { pwaInstall, supported, isInstalled } = useReactPWAInstall();

	const handlePwaInstall = () => {
		pwaInstall({
			title: "Easypark Alert",
			logo: "/images/logo-new.png",
			description: "This is a very good app that does a lot of useful stuff. ",
		})
			.then(() => alert("App installed successfully or instructions for install shown"))
			.catch(() => alert("User opted out from installing"));
	};

	return (
		<div className='flex items-center justify-between'>
			
			<img src="/images/logo-new.png" alt="Easypark Logo" className="w-20 h-20" />
			<p className='font-bold text-2xl'>{title}</p>
			<div>
				{loading ? <div className='my-3 w-10 h-10 bg-slate-100 rounded-full animate-pulse'></div> :
					user ? (
						<div className='relative group'>
							<div className='py-3'>
								<img tabIndex={0} className='w-10 h-10 rounded-full' src={user.photoURL} />
							</div>
							<div className={`w-max absolute top-14 right-0 flex-col items-start text-left bg-white rounded-lg shadow-xl hidden group-focus-within:flex group-hover:flex overflow-hidden`}>
								<Link className='py-3 px-5 hover:bg-gray-100 transition' to="/manageVehicles">Manage vehicles</Link>
								<Link className='py-3 px-5 hover:bg-gray-100 transition' to="/manageParkings">Manage parkings</Link>
								{supported() && !isInstalled() && (
									<button className='text-left w-full py-3 px-5 hover:bg-gray-100 transition' type="button" onClick={handlePwaInstall}>
										Install App
									</button>
								)}
								<button className='text-left w-full py-3 px-5 hover:bg-gray-100 transition' onClick={() => logout()}>Sign out</button>
							</div>
						</div>
					) : (
						<div className='py-3 flex justify-center'>
							<button className='h-10' onClick={() => signInWithGoogle()}>Sign in</button>
						</div>
					)}
			</div>
			<div className="w-6 h-6">{back ?
				<button onClick={() => navigate(-1)} aria-label='Go back'>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
					</svg>
				</button>
				: null}
			</div>
		</div>
		
	)
}

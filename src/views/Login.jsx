
import { signInWithGoogle, auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

export default function Login() {
	const navigate = useNavigate()
	const [user] = useAuthState(auth);

	const handleSignIn = async () => {
		await signInWithGoogle()
	}

	useEffect(() => {
		if (user) {
			navigate(-2)
		}
	}, [user])

	return (
		<div className='min-h-[80vh] max-w-2xl mx-auto px-5 flex items-center justify-center'>
			<div className='flex flex-col items-center'>
				<img src="/images/logo-new.png" alt="Easypark Alert logo" />
				<h1 className='text-2xl font-bold mb-5 text-center'>Sign into Easypark Alert</h1>
				<button onClick={handleSignIn} type="button" className="text-white bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
					<svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
						<path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd" />
					</svg>
					Sign in with Google
				</button>
				<button className='mt-2 text-blue-600 font-semibold' onClick={() => navigate('/')}>Home</button>
			</div>
		</div>
	)
}

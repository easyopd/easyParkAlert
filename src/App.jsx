
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import AddNewVehicle from './views/AddNewVehicle'
import EditVehicle from './views/EditVehicle'
import ViewVehicle from './views/ViewVehicle'
import AddNewParking from './views/AddNewParking'
import Login from './views/Login'
import ManageVehicles from './views/ManageVehicles'
import { Toaster } from 'react-hot-toast'
import Parkings from './views/Parkings'
import ManageParkings from './views/ManageParkings'
import EditParking from './views/EditParking'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:plateNumber" element={<ViewVehicle />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addVehicle" element={<AddNewVehicle />} />
        <Route path="/addVehicle/:plateNumber" element={<AddNewVehicle />} />
        <Route path="/editVehicle/:plateNumber" element={<EditVehicle />} />
        <Route path="/manageVehicles" element={<ManageVehicles />} />
        <Route path="/manageParkings" element={<ManageParkings />} />

        <Route path="/parkings" element={<Parkings />} />
        <Route path="/addParking" element={<AddNewParking />} />
        <Route path="/editParking/:id" element={<EditParking />} />


      </Routes>
      <Toaster position='bottom-center' />
    </div>
  )
}

export default App

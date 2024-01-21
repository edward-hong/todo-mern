import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PrivateRoute from '../PrivateRoute'
import PublicRoute from '../PublicRoute'
import Home from '../Home'
import Signup from '../Signup'
import Signin from '../Signin'
import Navbar from '../Navbar'
import Forgot from '../Forgot'
import Reset from '../Reset'
import Activate from '../Activate'

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<PrivateRoute page={Home} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot" element={<PublicRoute page={Forgot} />} />
      <Route path="/reset/:token" element={<PublicRoute page={Reset} />} />
      <Route
        path="/activate/:token"
        element={<PublicRoute page={Activate} />}
      />
    </Routes>
  </BrowserRouter>
)

export default App

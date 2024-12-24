import {Routes,Route} from "react-router-dom"
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Reset from "./pages/Reset";
import { ToastContainer } from "react-toastify";
import EmailVerify from "./pages/EmailVerify";

function App() {
  
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/email-verify" element={<EmailVerify />} />
      </Routes>
    </>
  )
}

export default App

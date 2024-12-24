import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useContext } from "react"
import { AppContent } from "../Context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"

function Landing() {
  const navigate = useNavigate()

  const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContent)

  const sendVerificationOtp = async() => {
    try {
      axios.defaults.withCredentials = true

      const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp")

      if(data.success){
        navigate("/email-verify")
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async() => {
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl + "/api/auth/logout")
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate("/")

    } catch (error) {
      toast.error(error.message)
    }
  }
  
  return (
    <>
        <header className='fixed top-0 left-0 w-full bg-white flex justify-between py-6 px-10 shadow-lg'>
        <div onClick={() => navigate("/")} className=" font-[ojuju] font-bold cursor-pointer">SB_TRACKER</div>   

            {userData ? <div className="w-8 h-8 flex justify-center items-center
            rounded-full bg-blue-500 text-white relative group">{userData.name[0].toUpperCase()}
              <div className="absolute hidden group-hover:block top-0 right-0
              z-10 text-black rounded pt-10">
                <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                  {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">verify email</li>}
                  
                  <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
                </ul>
              </div>
            </div> : <button className="rounded-full bg-blue-800 text-white px-7 py-1"
            onClick={() => navigate("/login")}>Login</button>}
        </header>

        <section className="bg-[url('counter.jpg')] flex flex-col h-[calc(100vh-75px)] mt-[75px] px-10">
        <div className="flex-1 py-3 h-4">
            <img src={assets.finance} alt="" className="h-full w-full object-fill" />
          </div>
          <div className="flex-1 flex flex-col gap-2 items-center justify-center">
            <h1 className='text-4xl text-center font-bold font-[poppins]'>WELCOME TO SB_TRACKER</h1>
            <p className="w-[60%] max-sm:w-full text-center font-[roboto] ">Take Control of Your Finances  
            Manage your expenses effortlessly with <span className="font-bold text-blue-800">Student Budget Tracker</span> — the ultimate tool for students to budget smarter, save more, and achieve financial freedom. Start tracking today!  
            </p>

            <button className="bg-blue-800 p-3 px-4 rounded-full text-white"
            onClick={() => userData ? navigate("/dashboard") : navigate("/login")}>Get started &#8594;</button>
          </div>
          
        </section>
    </>
  )
}

export default Landing
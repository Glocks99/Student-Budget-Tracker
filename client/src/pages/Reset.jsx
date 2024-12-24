import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Reset() {
  const navigate = useNavigate()

  const {backendUrl} = useContext(AppContent)
  axios.defaults.withCredentials = true

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isEmailSent, setIsEmailSent] = useState("")
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const inputRefs = useRef([])

  const handleInput = (e,index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
        inputRefs.current[index + 1].focus()
    }
}

const handleKeyDown = (e,index) => {
    if(e.key === "Backspace" && e.target.value === "" && index > 0){
        inputRefs.current[index - 1].focus()
    } 
}

const onSubmitEmail = async(e) => {
    e.preventDefault()
    try {
        const {data} = await axios.post(backendUrl + "/api/auth/send-reset-otp", 
            {email}
        )

        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsEmailSent(true)
    } catch (error) {
        toast.error(error.message)
    }
}

const onSubmitOtp = async(e) => {
    e.preventDefault()
    try {
        const optArray = inputRefs.current.map(e => e.value)
        setOtp(optArray.join(""))
        setIsOtpSubmitted(true)
    } catch (error) {
        toast.error(error.message)
    }
}

const onSubmitNewPassword =  async(e) => {
    e.preventDefault()
    try {
        const {data} = await axios.post(backendUrl + "/api/auth/reset-password",
            {
                email,otp,newPassword
            }
        )
        data.success ?toast.success(data.message) : toast.error(data.message)
        data.success && navigate("/login")
    } catch (error) {
        toast.error(error.message)
    }
}

  return (
    <>
        <div className="font-[ojuju] px-10 py-2 cursor-pointer font-bold" onClick={e => navigate("/")}>SB_TRACKER</div>

    {!isEmailSent && 
      <form onSubmit={onSubmitEmail} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-32">
                
                <h1 className='text-center text-4xl font-[poppins]'>Reset Password</h1>
                <p className='text-center mb-4'>Enter your registered email address</p>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Email
                    </label>
                    <input
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Submit
                </button>
        </form>
        }

        {!isOtpSubmitted && isEmailSent &&

        <form onSubmit={onSubmitOtp} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-32">
        <h1 className='text-center text-4xl font-[poppins]'>Reset Password OTP</h1>
        <p className='text-center mb-4'>Enter the 6 digit code sent to your email</p>

        <div className="flex justify-between mb-8">
            {
                Array(6).fill(0).map((_,index) => (
                    <input type="text" maxLength="1" key={index} required 
                    className='w-12 h-12 border border-solid border-gray-300 shadow-lg text-center text-xl rounded-md'
                    ref={e => inputRefs.current[index] = e}
                    onInput={e => handleInput(e, index)}
                    onKeyDown={e => handleKeyDown(e,index)} />
                ))
            }
        </div>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Submit</button>
    </form>
    }

    {isOtpSubmitted && isEmailSent && 
    <form onSubmit={onSubmitNewPassword} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-32">
                
                <h1 className='text-center text-4xl font-[poppins]'>New Password</h1>
                <p className='text-center mb-4'>Enter the new password below</p>
 
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        Password
                    </label>
                    <input
                    type="password"
                    onChange={e => setNewPassword(e.target.value)}
                    value={newPassword}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Submit
                </button>
        </form>
        }
    </>
  )
}

export default Reset
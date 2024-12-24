import axios from 'axios'
import React, { useContext, useEffect, useRef } from 'react'
import { AppContent } from '../Context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


function EmailVerify() {
    const navigate = useNavigate()
    const inputRefs = useRef([])
    axios.defaults.withCredentials = true
    const {backendUrl,getUserData, userData,isLoggedIn,setIsLoggedIn} = useContext(AppContent)

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

    const onSubmitHandler = async(e) => {
        try {
            e.preventDefault()
            const optArray = inputRefs.current.map(e => e.value)
            const otp = optArray.join("")
            const {data} = await axios.post(backendUrl + "/api/auth/verify-account", {otp})

            if(data.success){
                toast.success
                getUserData()
                navigate("/")
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        isLoggedIn && userData && userData.isAccountVerified && navigate("/")
    },[isLoggedIn, userData])
    
  return (
    <>
        <div className="font-[ojuju] px-10 py-2 cursor-pointer font-bold" onClick={e => navigate("/")}>SB_TRACKER</div>
        <form onSubmit={onSubmitHandler} className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-32'>
            <h1 className='text-5xl text-[poppins] font-bold text-center'>Email verify OTP</h1>
            <p className='text-center mt-3 mb-3'>Enter the 6 digit code sent to your email</p>

            <div className="flex justify-between mb-8">
                {
                    Array(6).fill(0).map((_,index) => (
                        <input type="text" ref={e => inputRefs.current[index] = e}
                        onInput={e => handleInput(e, index)}
                        onKeyDown={e => handleKeyDown(e,index)} maxLength={1} key={index} required 
                        className='w-12 h-12 shadow-lg border border-gray-300 text-center text-xl rounded-md' />
                    ))
                }
            </div>

            <button className='w-full py-3 rounded-full bg-blue-500 text-white'>verify email</button>
        </form>
    </>
  )
}

export default EmailVerify
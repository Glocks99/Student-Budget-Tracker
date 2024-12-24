import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext'
import { toast, ToastContainer } from 'react-toastify'
import axios from "axios"
import LoadingSpinner from './Loading'

function Login() {
    const navigate = useNavigate()

    const {backendUrl, setIsLoggedin, getUserData} = useContext(AppContent)

    const [state, setState] = useState("Sign up")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async(e) => {
        try {
            e.preventDefault()

            axios.defaults.withCredentials = true

            if(state === "Sign up"){
                const {data} = await axios.post(backendUrl + "/api/auth/register", {
                    username, email, password
                })

                if(data.success){
                    setIsLoggedin(true)
                    getUserData()
                    navigate("/")
                }
                else{
                    toast.error(data.message)
                }
            }
            else{
                const {data} = await axios.post(backendUrl + "/api/auth/login", {
                    email, password
                })

                if(data.success){
                    setIsLoggedin(true)
                    getUserData()
                    navigate("/")
                }
                else{
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleForgetPassword = async(e) => {
        navigate("/reset")
    }

  return (
    <>
        <ToastContainer />
        <div onClick={() => navigate("/")} className="px-10 py-3 font-[ojuju] font-bold cursor-pointer">SB_TRACKER</div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-32">
                <h2 className='text-3xl text-center font-[poppins]'>{state === "Sign up" ? "Create Account" : "Login"}</h2>
                <p className='text-center mt-2'>{state === "Sign up" ? "create your account" : "Login into your account"}</p>

                {state === "Sign up" && (
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Username
                        </label>
                        <input
                        type="text"
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your username"
                        />
                    </div>
                )}

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
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirm-password" className="block text-gray-700 font-medium mb-2">
                    Password
                    </label>
                    <input
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                    />
                </div>

                <div className="">

                </div>

                <div onClick={handleForgetPassword} className="mt-2 mb-2 text-indigo-500 cursor-pointer">
                    Forgot Password ?
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    {state}
                </button>

                {state === "Sign up" ? (
                    <div className="mt-6 text-center">Already have an account ? <span onClick={() => setState("Login")}className='text-indigo-500 cursor-pointer underline'>Login here</span></div>
                ): (
                    <div className="mt-6 text-center">Dont have an account ? <span onClick={() => setState("Sign up")} className='text-indigo-500 cursor-pointer underline'>Sign up</span></div>
                )}
                
        </form>
    </>
  )
}

export default Login
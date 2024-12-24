import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Navbar() {

    const {userData,setUserData,backendUrl,setIsLoggedin} = useContext(AppContent)

    const navigate = useNavigate()

    const handleOpenModal = () => {
        setIsOpenModal(true)
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
        <header className='fixed top-0 left-0 w-full bg-white 
        border shadow-md flex justify-between items-center px-[40px] h-16'>

            <div className="font-[ojuju] font-bold cursor-pointer" onClick={() => navigate("/")}>SB-Tracker</div>

            <div className="flex gap-2">
                
                {userData &&
                    <div className="flex flex-col items-center justify-center"> 
                    <div className="w-8 h-8 flex justify-center items-center
                    rounded-full bg-blue-500 text-white relative group">{userData.name[0].toUpperCase()}
                      <div className="absolute hidden group-hover:block top-0 right-0
                      z-10 text-black rounded pt-10">
                        <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                          <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
                        </ul>
                      </div>
                    </div>
                    <div className='font-[Roboto]'>{userData.name.length > 5 ? userData.name.slice(0,5) + "..." : userData.name}</div>
                    </div>
                }
            </div>
            
        </header>
    </>
    
  )
}

export default Navbar
import React, { useCallback, useContext, useEffect, useState } from 'react'
import LineChart from './LineChart'
import Navbar from './Navbar'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notificationSound from '../../src/assets/notiSound.mp3';
import axios from 'axios';
import { AppContent } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate()

    const [type, setType] = useState("expense")
    const [amount, setAmount] = useState(0)
    const [description, setDescription] = useState("")
    const [transactions, setTransactions] = useState([])
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)
    const [refresh, setRefresh] = useState(false);

    const {userData, backendUrl, setUserData, setIsLoggedin, isLoggedIn} = useContext(AppContent)

    const FormData = {
        type,
        amount,
        description,
        date: new Date().toLocaleDateString(),
        user_id: userData.name
    }
   

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.defaults.withCredentials = true;
                const { data } = await axios.get(backendUrl + "/api/trans/get-trans/" + userData.name);
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchData();
    }, [refresh, userData.name, backendUrl]);

    

    

    //adds the data to the transactions database
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + "/api/trans/post-trans", FormData);
    
            if (data.message) {
                toast.success(data.message, {
                    onOpen: playSound()
                });
                setRefresh(!refresh); // Trigger refresh
            } else if (data.error) {
                toast.error(data.error, {
                    onOpen: playSound()
                });
            }
        } catch (err) {
            toast.error(err.message, {
                onOpen: playSound()
            });
        }
    
        setAmount(0);
        setDescription("");
    };
    

    //deletes a transaction from mongodb
    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(backendUrl + `/api/trans/del-trans/${id}`);
    
            if (data.message) {
                toast.success(data.message, {
                    onOpen: playSound()
                });
                setRefresh(!refresh); // Trigger refresh
            } else if (data.error) {
                toast.error(data.error, {
                    onOpen: playSound()
                });
            }
        } catch (error) {
            toast.error(error.message, {
                onOpen: playSound()
            });
        }
    };

     // Calculate income, expense, and savings whenever transactions change
     useEffect(() => {
        const calculateTotals = () => {
            let totalIncome = 0;
            let totalExpense = 0;

            transactions.forEach((transaction) => {
                if (transaction.type === "income") {
                    totalIncome += transaction.amount;
                } else if (transaction.type === "expense") {
                    totalExpense += transaction.amount;
                }
            });

            setIncome(totalIncome);
            setExpense(totalExpense);
        };

        calculateTotals();
    }, [transactions]);
    

    // Function to play sound
    const playSound = () => {
        const audio = new Audio(notificationSound);
        audio.play();
    };
    

  return (
    <>
        <ToastContainer/>

        <Navbar />

        <form onSubmit={handleSubmit} className='flex flex-col px-[40px] gap-2 mb-6 mt-[80px]'>
            <label htmlFor="type">Type</label>
            <select id='type' onChange={e => setType(e.target.value)} value={type} className='border h-10 rounded px-2'>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>

            <label htmlFor="amt">Amount</label>
            <input type="number" id='amt' onChange={e => setAmount(e.target.value)} value={FormData.amount} placeholder='Enter the amount' className='border h-10 rounded px-2' required/>

            <label htmlFor="desc">Description</label>
            <input type="text" id='desc' onChange={e => setDescription(e.target.value)} value={FormData.description} placeholder='Describe the type' className='border h-10 rounded px-2' required/>

            <button className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 transition duration-300'>Submit</button>
        </form>

        <div className="flex flex-wrap justify-between bg-gray-200 px-[40px] gap-2">

            <div className="w-[30%]">
                <h1 className='text-2xl mb-6 font-bold'>Summary</h1>
                <div className="font-[poppins]">
                    <div className="flex justify-between">Income: <span >{income} GHC</span></div>
                    <div className="flex justify-between">Expense: <span>{expense} GHC</span></div>
                    <div className="flex justify-between">Savings: <span>{income - expense} GHC</span></div>
                </div>
            </div>

            <div className="overflow-auto">
                <h1 className='text-2xl font-bold'>Chart Summary</h1>
                <LineChart />
            </div>
        </div>

        <h1 className='mt-6 mb-6 text-2xl px-2 font-bold'>Transactions</h1>
        <div className="overflow-x-auto">

            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-6 py-3 text-gray-700 font-bold">#</th>
                    <th className="border border-gray-300 px-6 py-3 text-gray-700 font-bold">Date</th>
                    <th className="border border-gray-300 px-6 py-3 text-gray-700 font-bold">Description</th>
                    <th className="border border-gray-300 px-6 py-3 text-gray-700 font-bold">Amount</th>
                    <th className="border border-gray-300 px-6 py-3 text-gray-700 font-bold">Actions</th>
                </tr>
                </thead>

                
                <tbody>
                    {transactions.length == 0 
                        ? <tr><td colSpan={5} className='text-center text-4xl px-6 py-6'>No Transactions &#10005;</td></tr>
                        : transactions.map((items,index) => (
                            <tr className="bg-white hover:bg-gray-100" key={index}>
                                <td className="border border-gray-300 px-6 py-3">{index + 1}</td>
                                <td className="border border-gray-300 px-6 py-3">{items.date}</td>
                                <td className="border border-gray-300 px-6 py-3">{items.description}</td>
                                <td className="border border-gray-300 px-6 py-3">{items.amount}</td>
                                <td className="border border-gray-300 px-6 py-3">
                                <button onClick={e => handleDelete(items._id)} className="text-white ml-4 bg-[red] py-2 px-4 rounded ">Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

    </>
  )
}

export default Dashboard
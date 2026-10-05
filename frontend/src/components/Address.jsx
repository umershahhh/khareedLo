import React, { useContext, useState } from 'react'
import AppContext from '../context/AppContext'
import { useNavigate } from 'react-router-dom'


function Address() {
  const {shippingAddress, userAddress} = useContext(AppContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phoneNumber: "",
  })

  const {fullName, address, city, state, country, phoneNumber} = formData

  const onChangeHandler = (e) =>{
    const {name, value} = e.target
    setFormData({...formData, [name]:value})
  }

  const onSubmitHandler = async (e) =>{
    e.preventDefault()
    const result =   await shippingAddress(fullName, address, city, state, country, phoneNumber)
    if(result.success) {
      navigate('/checkout')
    }
  }
  
  return (
    <div className='w-[80%] mx-auto flex justify-center items-center my-10'>
      <form onSubmit={onSubmitHandler} action="">
        <div className="flex flex-col gap-2">
        <input onChange={onChangeHandler} name='fullName' type="text" placeholder='full name' />
        <input onChange={onChangeHandler} name='country' type="text" placeholder='country' />
        <input onChange={onChangeHandler} name='city' type="text" placeholder='city' />
        <input onChange={onChangeHandler} name='state' type="text" placeholder='state' />
        <input onChange={onChangeHandler} name='phoneNumber' type="text" placeholder='Phone Number' />
        <input onChange={onChangeHandler} name='address' type="text" placeholder='Address' />
        <button className='bg-green-400 text-white font-bold'>Continue</button>
        </div>
      </form>
      {userAddress && (
        <>
        <div onClick={()=> {
        navigate('/checkout', {state: {userAddress}})
      }} className="ml-4 text-blue-500 cursor-pointer">
        use old address
      </div>
        </>
      )}
      
    </div>
  )
}

export default Address

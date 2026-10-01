import React, { useContext, useState } from 'react'
import AppContext from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'


function Login() {
  const {login} = useContext(AppContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const { email, password} = formData

  const onChangeHandler = (e) =>{
    const {name, value} = e.target
    setFormData({...formData, [name]:value})
  }

  const onSubmitHandler = async (e) =>{
    e.preventDefault()
    const result =   await login( email, password)
    if(result.success) {
      navigate('/')
    }
  }

  return (
    <div className='w-[80%] mx-auto flex justify-center items-center my-10'>
      <form onSubmit={onSubmitHandler} action="">
        <div className="flex flex-col gap-2">
        <input onChange={onChangeHandler} name='email' type="text" placeholder='email' />
        <input onChange={onChangeHandler} name='password' type="password" placeholder='password' />
        <button className='bg-green-400 text-white font-bold'>login</button>
        </div>
      </form>
    </div>
  )
}

export default Login

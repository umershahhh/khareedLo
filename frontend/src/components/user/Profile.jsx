import React from 'react'
import {useContext} from 'react'
import AppContext from '../../context/AppContext';


const Profile = () => {
  const {user} = useContext(AppContext);
  return (
    <>
      <h1>Profile</h1>
      <p>user name: {user?.name}</p>
      <p>user email: {user?.email}</p>

      </>
  )
}

export default Profile

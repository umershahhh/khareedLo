import React from 'react'
import AppContext from './context/AppContext'
import { useContext } from 'react'
import ShowProduct from './components/product/ShowProduct'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import ProductDetail from './components/product/ProductDetail'
import Navbar from './components/Navbar'
import SearchProduct from './components/product/SearchProduct'
import Register from './components/user/Register'
import Login from './components/user/Login'

const App = () => {
  
  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route path='/' element={<ShowProduct/>}/>
      <Route path='/products/:id' element={<ProductDetail/>}/>
      <Route path='/products/search/:item' element={<SearchProduct/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App

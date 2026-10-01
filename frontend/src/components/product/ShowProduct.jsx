import React, { useContext } from 'react'
import AppContext from '../../context/AppContext'
import { Link } from 'react-router-dom'

function ShowProduct() {
  const {products, filterData} = useContext(AppContext)
  return (
    <div className='grid grid-cols-3 gap-4 my-5 mx-5 '>
      {filterData?.map((product)=><div key={product._id} className="border-2  justify-center items-center flex flex-col">
        <Link to={`/products/${product._id}`}>
        <div className="">{product.title}</div>
        <div className="">{product.description}</div>
        <div className="">{product.price}</div>
        <div className="">{product.category}</div>
        <div className="">{product.imgSrc}</div>
        <button className='bg-amber-400 w-full '>Add To Cart</button>
        </Link>
        </div>
      )}
    </div>
  )
}

export default ShowProduct

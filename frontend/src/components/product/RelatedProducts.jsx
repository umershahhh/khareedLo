import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../context/AppContext'
import { Link } from 'react-router-dom'

function RelatedProducts({category}) {
  const {products} = useContext(AppContext)
  const [relatedProducts, setRelatedProducts] = useState([])
  useEffect(() => {
    if(category && products){
      setRelatedProducts(products.filter((data)=>data.category.toLowerCase() == 
      category.toLowerCase()));}
  }, [category, products])
  

  return (
    <div>
     <h1>Related Products</h1>

      <div className='grid grid-cols-3 gap-4 my-5 mx-5 '>
      {relatedProducts?.map((product)=><div key={product._id} className="border-2  justify-center items-center flex flex-col">
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
    </div>
  )
}

export default RelatedProducts

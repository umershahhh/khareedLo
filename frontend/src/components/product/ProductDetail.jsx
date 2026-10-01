import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RelatedProducts from "./RelatedProducts";

function ProductDetail() {
  const [product, setproduct] = useState(null);
  const { id } = useParams();
  const url = "http://localhost:4000/api";

  useEffect(() => {
    const fetchProducts = async () => {
      const api = await axios.get(`${url}/products/getOne/${id}`, {
        headers: {
          "content-type": "Application/json",
        },
        withCredentials: true,
      });
      
       setproduct(api.data.product);
       console.log(api.data.product)
    };
    fetchProducts();
  }, [id]);
  return (
  <div>
    {!product? (
      <p>Loading...</p>
    ) : (
      <>
      <div className="">{product.title}</div>
      <div className="">{product.description}</div>
      <div className="">{product.price}</div>
      <div className="">{product.category}</div>
      <div className="">{product.imgSrc}</div>
      </>
    )
    }
  <RelatedProducts category = {product?.category}/>
  </div>
  )
}

export default ProductDetail;

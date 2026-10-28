import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {

  PackageOpen,
  Search,

} from "lucide-react";

import AppContext from "../../context/AppContext";
import Navbar from "../Navbar";

function ProductView() {
  const { adminProducts, filterData, deleteProduct, updateProductDetail } =
    useContext(AppContext);

  const displayedProducts = Array.isArray(filterData)
    ? filterData
    : Array.isArray(adminProducts)
      ? adminProducts
      : [];

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imgSrc: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const openUpdateModal = (product) => {
    setSelectedProduct(product);

    // Pre-fill every field with the existing product details.
    setFormData({
      title: product.title ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      category: product.category ?? "",
      imgSrc: product.imgSrc ?? "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!selectedProduct) return;

    setIsUpdating(true);

    try {
      const updatedFields = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category.trim(),
        imgSrc: formData.imgSrc.trim(),
      };

      // Only send fields that have changed.
      const changedFields = {};

      for (const key of Object.keys(updatedFields)) {
        const originalValue = selectedProduct[key] ?? "";
        const newValue = updatedFields[key];

        if (String(originalValue) !== String(newValue)) {
          changedFields[key] = newValue;
        }
      }

      if (Object.keys(changedFields).length === 0) {
        alert("No changes were made.");
        return;
      }

      const success = await updateProductDetail(selectedProduct._id, changedFields);

      if (success) {
        alert("Product updated successfully.");
        setSelectedProduct(null);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pb-16 pt-36">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          {/* Page heading */}
          <section className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Admin Products View Page
              </h1>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <PackageOpen size={18} className="text-emerald-700" />
              <span>
                <strong className="font-semibold text-slate-900">
                  {displayedProducts.length}
                </strong>{" "}
                {displayedProducts.length === 1 ? "product" : "products"}
              </span>
            </div>
          </section>

          {/* Product grid */}
          {displayedProducts.length > 0 ? (
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
              {displayedProducts.map((product) => {
                return (
                  <article
                    key={product._id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/70"
                  >
                    {/* Product image */}
                    
  
                      <div className="flex h-60 items-center justify-center overflow-hidden p-5 sm:h-64">
                        {product.imgSrc ? (
                          <img
                            src={product.imgSrc}
                            alt={product.title || "Product"}
                            loading="lazy"
                            className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <PackageOpen size={42} strokeWidth={1.3} />
                            <span className="text-xs">Image unavailable</span>
                          </div>
                        )}
                     

                      <span className="absolute left-4 top-4 max-w-[70%] truncate rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 shadow-sm backdrop-blur">
                        {product.category || "General"}
                      </span>
                      </div>
                   

                    {/* Product information */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                     
                      <div className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-900 transition hover:text-emerald-700">
                        
                      
                        {product.title}
                        </div>
                     

                      <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
                        {product.description ||
                          "Explore this product in detail."}
                      </p>

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            Price
                          </p>
                          <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                            Rs. {formatPrice(product.price)}
                          </p>
                        </div>

                      </div>

                      {/* Add to cart */}
                      <button
                        type="button"
                        onClick={() => deleteProduct(product?._id)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                      >
                        Delete Product
                      </button>

                      <button
                        type="button"
                        onClick={() => openUpdateModal(product)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                      >
                        Update Product
                      </button>
                    </div>
                  </article>

                );
              })}
            </section>
          ) : (
            /* Empty state */
            <section className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Search size={29} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No products found
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                There are no products matching the selected filter. Try another
                category or view the full collection.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (Array.isArray(adminProducts)) {
                    // Reset the displayed collection through the context setter.
                    // If your context does not expose setFilterData, add it below.
                  }
                }}
                className="mt-6 hidden"
              >
                Reset filters
              </button>

              
            </section>
          )}
        </div>
        
{selectedProduct && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Update Product
        </h2>

        <button
          type="button"
          onClick={() => setSelectedProduct(null)}
          className="text-2xl text-gray-500 hover:text-gray-900"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleUpdateProduct} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Product Name
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Price
          </label>
          <input
            type="number"
            name="price"
            min="0"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Category
          </label>
          <input
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Image URL
          </label>
          <input
            name="imgSrc"
            value={formData.imgSrc}
            onChange={handleInputChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className="w-1/2 rounded-lg border px-4 py-3"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-1/2 rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </main>
    </>
  );
}

export default ProductView;

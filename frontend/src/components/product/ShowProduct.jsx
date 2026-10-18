import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ArrowUpRight,
  PackageOpen,
  Search,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
} from "lucide-react";

import AppContext from "../../context/AppContext";
import Navbar from "../Navbar";

function ShowProduct() {
  const { products, filterData, addToCart } = useContext(AppContext);

  const [addingProduct, setAddingProduct] = useState(null);
  const [cartFeedback, setCartFeedback] = useState({});

  const displayedProducts = Array.isArray(filterData)
    ? filterData
    : Array.isArray(products)
      ? products
      : [];

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingProduct) return;

    setAddingProduct(product._id);
    setCartFeedback((prev) => ({ ...prev, [product._id]: null }));

    try {
      const result = await addToCart(
        product._id,
        product.title,
        product.price,
        1,
        product.category,
        product.imgSrc
      );

      if (result?.success === false) {
        setCartFeedback((prev) => ({
          ...prev,
          [product._id]: {
            success: false,
            message: result.message || "Unable to add this product.",
          },
        }));
      } else {
        setCartFeedback((prev) => ({
          ...prev,
          [product._id]: {
            success: true,
            message: "Added to cart",
          },
        }));
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);

      setCartFeedback((prev) => ({
        ...prev,
        [product._id]: {
          success: false,
          message:
            error.response?.data?.message ||
            "Could not add this product. Please try again.",
        },
      }));
    } finally {
      setAddingProduct(null);
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
                Find your next favorite.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Explore our collection and discover products that fit your
                everyday life.
              </p>
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
                const feedback = cartFeedback[product._id];
                const isAdding = addingProduct === product._id;

                return (
                  <article
                    key={product._id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/70"
                  >
                    {/* Product image */}
                    <Link
                      to={`/products/${product._id}`}
                      className="relative block overflow-hidden bg-slate-50"
                    >
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
                      </div>

                      <span className="absolute left-4 top-4 max-w-[70%] truncate rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 shadow-sm backdrop-blur">
                        {product.category || "General"}
                      </span>

                     
                    </Link>

                    {/* Product information */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <Link
                        to={`/products/${product._id}`}
                        className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-900 transition hover:text-emerald-700"
                      >
                        {product.title}
                      </Link>

                      <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
                        {product.description || "Explore this product in detail."}
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

                        <Link
                          to={`/products/${product._id}`}
                          aria-label={`View ${product.title}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <ArrowUpRight size={17} />
                        </Link>
                      </div>

                      {/* Add to cart */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isAdding || addingProduct !== null}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                      >
                        {isAdding ? (
                          <>
                            <LoaderCircle size={17} className="animate-spin" />
                            Adding...
                          </>
                        ) : feedback?.success ? (
                          <>
                            <CheckCircle2 size={17} />
                            Added to Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={17} />
                            Add to Cart
                          </>
                        )}
                      </button>

                      {feedback && (
                        <p
                          role="status"
                          className={`mt-2 flex items-start gap-1.5 text-xs ${
                            feedback.success
                              ? "text-emerald-700"
                              : "text-red-600"
                          }`}
                        >
                          {feedback.success ? (
                            <CheckCircle2
                              size={14}
                              className="mt-0.5 shrink-0"
                            />
                          ) : (
                            <CircleAlert
                              size={14}
                              className="mt-0.5 shrink-0"
                            />
                          )}
                          <span>{feedback.message}</span>
                        </p>
                      )}
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
                  if (Array.isArray(products)) {
                    // Reset the displayed collection through the context setter.
                    // If your context does not expose setFilterData, add it below.
                  }
                }}
                className="mt-6 hidden"
              >
                Reset filters
              </button>

              <Link
                to="/products"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Browse products
              </Link>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

export default ShowProduct;
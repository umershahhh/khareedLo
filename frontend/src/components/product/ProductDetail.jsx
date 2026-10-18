import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  CircleAlert,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import RelatedProducts from "./RelatedProducts";
import Navbar from "../Navbar";
import AppContext from "../../context/AppContext";

function ProductDetail() {
  const { addToCart, url } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const apiUrl = url || "http://localhost:4000/api";

        const response = await axios.get(
          `${apiUrl}/products/getOne/${id}`,
          {
            withCredentials: true,
          }
        );

        if (isMounted) {
          if (response.data?.product) {
            setProduct(response.data.product);
          } else {
            setError("This product could not be found.");
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);

        if (isMounted) {
          setError(
            err.response?.status === 404
              ? "This product could not be found."
              : "Unable to load this product. Please try again."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id, url]);

  const handleAddToCart = async () => {
    if (addingToCart || !product) return;

    try {
      setAddingToCart(true);
      setCartMessage("");

      const result = await addToCart(
        product._id,
        product.title,
        product.price,
        1,
        product.category,
        product.imgSrc
      );

      // Display success only if addToCart does not explicitly report failure.
      if (result?.success === false) {
        setCartMessage(
          result.message || "Could not add this product to your cart."
        );
      } else {
        setCartMessage("Product added to your cart successfully.");
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);

      setCartMessage(
        err.response?.data?.message ||
          err.message ||
          "Unable to add this product to your cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-7 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="transition hover:text-emerald-700">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="transition hover:text-emerald-700"
            >
              Products
            </Link>
            <span>/</span>
            <span className="max-w-[180px] truncate font-medium text-slate-800">
              {product?.title || "Product details"}
            </span>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid animate-pulse grid-cols-1 gap-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8 lg:grid-cols-2">
              <div className="min-h-[300px] rounded-2xl bg-slate-100 sm:min-h-[440px]" />

              <div className="flex flex-col justify-center gap-5 py-5">
                <div className="h-4 w-28 rounded bg-slate-100" />
                <div className="h-9 w-3/4 rounded bg-slate-100" />
                <div className="h-8 w-36 rounded bg-slate-100" />
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-5/6 rounded bg-slate-100" />
                <div className="mt-5 h-12 w-full rounded-xl bg-slate-100" />
              </div>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <CircleAlert size={30} />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-900">
                Product unavailable
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {error}
              </p>

              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <ArrowLeft size={17} />
                Browse products
              </Link>
            </div>
          )}

          {/* Product details */}
          {!loading && !error && product && (
            <>
              <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Product image */}
                  <div className="relative flex min-h-[320px] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 p-6 sm:min-h-[460px] sm:p-10 lg:p-12">
                    <div className="absolute left-6 top-6 rounded-full border border-emerald-100 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 shadow-sm">
                      {product.category || "Featured product"}
                    </div>

                    <div className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white/80 text-slate-400 shadow-sm">
                      <Package size={22} />
                    </div>

                    {product.imgSrc ? (
                      <img
                        src={product.imgSrc}
                        alt={product.title || "Product image"}
                        className="relative z-10 max-h-[380px] w-full object-contain transition duration-500 hover:scale-105 sm:max-h-[430px]"
                      />
                    ) : (
                      <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-slate-400">
                        <Package size={64} strokeWidth={1.2} />
                        <p className="text-sm">Image unavailable</p>
                      </div>
                    )}
                  </div>

                  {/* Product information */}
                  <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Maple Street Collection
                    </div>

                    <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl xl:text-[42px]">
                      {product.title}
                    </h1>

                    <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                      {product.description ||
                        "Explore this product and add it to your collection."}
                    </p>

                    <div className="my-5 border-t border-slate-100" />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Price
                      </p>

                      <div className="mt-2 flex flex-wrap items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                          Rs. {formatPrice(product.price)}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        Final amount may depend on your checkout details.
                      </p>
                    </div>

                    {/* Add to cart */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-300 hover:bg-emerald-600 hover:shadow-emerald-600/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {addingToCart ? (
                        <>
                          <LoaderCircle size={20} className="animate-spin" />
                          Adding to cart...
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          Add to Cart
                        </>
                      )}
                    </button>

                    {cartMessage && (
                      <div
                        role="status"
                        className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${
                          cartMessage.toLowerCase().includes("successfully")
                            ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                            : "border-red-100 bg-red-50 text-red-700"
                        }`}
                      >
                        {cartMessage.toLowerCase().includes("successfully") ? (
                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0"
                          />
                        ) : (
                          <CircleAlert
                            size={18}
                            className="mt-0.5 shrink-0"
                          />
                        )}
                        <span>{cartMessage}</span>
                      </div>
                    )}

                    <Link
                      to="/products"
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <ArrowLeft size={17} />
                      Continue shopping
                    </Link>

                    {/* Service highlights */}
                    <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                        <Truck
                          size={21}
                          className="shrink-0 text-emerald-700"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            Delivery
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            At checkout
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                        <ShieldCheck
                          size={21}
                          className="shrink-0 text-emerald-700"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            Secure orders
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Account protected
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                        <RotateCcw
                          size={21}
                          className="shrink-0 text-emerald-700"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            Order support
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            View your orders
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Related products */}
              <section className="mt-16">
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Keep exploring
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                      You may also like
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      More products from the same category.
                    </p>
                  </div>

                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
                  >
                    All products
                    <ArrowLeft size={16} className="rotate-180" />
                  </Link>
                </div>

                <RelatedProducts category={product.category} />
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default ProductDetail;
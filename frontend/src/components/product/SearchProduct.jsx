
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { Search, ShoppingBag, ArrowRight, Package } from "lucide-react";
import Navbar from "../Navbar";

function SearchProduct() {
  const { products, addToCart } = useContext(AppContext);
  const { item } = useParams();

  const [searchProducts, setSearchProducts] = useState([]);
  const [addingProduct, setAddingProduct] = useState(null);
  const [addedProduct, setAddedProduct] = useState(null);

  const searchTerm = decodeURIComponent(item || "").trim();

  useEffect(() => {
    const availableProducts = Array.isArray(products) ? products : [];

    const filteredProducts = availableProducts.filter((product) => {
      const title = product?.title?.toLowerCase() || "";
      const description = product?.description?.toLowerCase() || "";
      const category = product?.category?.toLowerCase() || "";
      const query = searchTerm.toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });

    setSearchProducts(filteredProducts);
  }, [searchTerm, products]);

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  const handleAddToCart = async (product) => {
    try {
      setAddingProduct(product._id);

      await addToCart(
        product._id,
        product.title,
        product.price,
        1,
        product.category,
        product.imgSrc
      );

      setAddedProduct(product._id);
      setTimeout(() => setAddedProduct(null), 1800);
    } catch (error) {
      console.error("Unable to add product to cart:", error);
    } finally {
      setAddingProduct(null);
    }
  };

  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-slate-50 pb-16 pt-32 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search heading */}
        <section className="mb-8 rounded-3xl bg-slate-900 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
              <Search size={24} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                Maple Street Collection
              </p>

              <h1 className="mt-2 break-words text-2xl font-bold sm:text-3xl">
                Search Results
              </h1>

              <p className="mt-2 break-words text-sm text-slate-300 sm:text-base">
                Results for{" "}
                <span className="font-semibold text-white">
                  "{searchTerm}"
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">
                {searchProducts.length}
              </span>{" "}
              {searchProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>
        </section>

        {/* Product results */}
        {searchProducts.length > 0 ? (
          <section>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Products for you
              </h2>

              <Link
                to="/products"
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
              >
                All products
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchProducts.map((product) => (
                <article
                  key={product._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  {/* Product image */}
                  <Link
                    to={`/products/${product._id}`}
                    className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-100 p-5"
                  >
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-sm">
                      {product.category || "Product"}
                    </span>

                    {product.imgSrc ? (
                      <img
                        src={product.imgSrc}
                        alt={product.title || "Product"}
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Package size={44} className="text-slate-300" />
                    )}
                  </Link>

                  {/* Product details */}
                  <div className="flex flex-1 flex-col p-4">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-800 transition hover:text-emerald-700">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                      {product.description || "Explore this product from our collection."}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <p className="text-lg font-bold text-slate-900">
                        {formatPrice(product.price)}
                      </p>

                      <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {product.category || "Featured"}
                      </span>
                    </div>

                    {/* Add to cart */}
                    <button
                      type="button"
                      disabled={addingProduct === product._id}
                      onClick={() => handleAddToCart(product)}
                      className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        addedProduct === product._id
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-900 text-white hover:bg-emerald-700"
                      } disabled:cursor-wait disabled:opacity-70`}
                    >
                      <ShoppingBag size={16} />

                      {addingProduct === product._id
                        ? "Adding..."
                        : addedProduct === product._id
                        ? "Added to Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          /* Empty search state */
          <section className="rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
              No products found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              We couldn't find any products matching "{searchTerm}". Try a
              different keyword or explore our full collection.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Browse all products
              <ArrowRight size={17} />
            </Link>
          </section>
        )}
      </div>
    </main>
    </>
  );
}

export default SearchProduct;

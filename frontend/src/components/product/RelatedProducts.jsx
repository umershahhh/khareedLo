
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";

function RelatedProducts({ category, currentProductId }) {
  const { products, addToCart } = useContext(AppContext);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingProduct, setAddingProduct] = useState(null);
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    if (!Array.isArray(products) || !category) {
      setRelatedProducts([]);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product._id !== currentProductId &&
        typeof product.category === "string" &&
        product.category.toLowerCase() === category.toLowerCase()
    );

    setRelatedProducts(filtered.slice(0, 4));
  }, [category, products, currentProductId]);

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

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="my-14 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
              You may also like
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Related Products
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Discover more from this collection.
            </p>
          </div>

          <Link
            to="/products"
            className="mb-1 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((product) => (
            <article
              key={product._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/60"
            >
              {/* Product image */}
              <Link
                to={`/products/${product._id}`}
                className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-50 p-5"
              >
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-sm">
                  {product.category}
                </span>

                {product.imgSrc ? (
                  <img
                    src={product.imgSrc}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-contain transition duration-500 "
                  />
                ) : (
                  <Package size={44} className="text-slate-300" />
                )}
              </Link>

              {/* Product information */}
              <div className="flex flex-1 flex-col p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-slate-800 transition hover:text-emerald-700">
                    {product.title}
                  </h3>
                </Link>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-lg font-bold text-slate-900">
                    {formatPrice(product.price)}
                  </p>

                  <span className="text-xs font-medium text-emerald-700">
                    In stock
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
      </div>
    </section>
  );
}

export default RelatedProducts;

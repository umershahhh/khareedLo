
import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Package,
} from "lucide-react";

const Cart = () => {
  const {
    cartData,
    decreaseQty,
    addToCart,
    removeFromCart,
    clearCart,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const items = Array.isArray(cartData?.items) ? cartData.items : [];

  // Each cart item's price represents its line total.
  const totalPrice = items.reduce(
    (total, item) => total + Number(item.price || 0),
    0
  );

  const totalQty = items.reduce(
    (total, item) => total + Number(item.qty || 0),
    0
  );

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  const handleIncrease = (product) => {
    addToCart(
      product.productId,
      product.title,
      Number(product.price || 0) / Math.max(Number(product.qty || 1), 1),
      1,
      product.category,
      product.imgSrc
    );
  };

  const handleDecrease = (product) => {
    if (Number(product.qty) > 1) {
      decreaseQty(product.productId, 1);
    } else {
      removeFromCart(product.productId);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pb-16 pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                Your shopping bag
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Shopping Cart
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Review your items before proceeding to checkout.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
            >
              Continue shopping
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* Cart summary banner */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShoppingBag size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total items</p>
                <p className="text-xl font-bold text-slate-900">
                  {totalQty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Package size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Different products</p>
                <p className="text-xl font-bold text-slate-900">
                  {items.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Order total</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatPrice(totalPrice)}
                </p>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            /* Empty cart */
            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                <ShoppingBag size={36} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Looks like you haven't added anything yet. Explore our
                collection and find something you'll love.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Start shopping
                <ArrowRight size={17} />
              </Link>
            </section>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
              {/* Cart items */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Your items
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {totalQty} {totalQty === 1 ? "item" : "items"} in your cart
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Clear cart</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map((product) => {
                    const unitPrice =
                      Number(product.price || 0) /
                      Math.max(Number(product.qty || 1), 1);

                    return (
                      <article
                        key={product.productId}
                        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6"
                      >
                        {/* Product image and details */}
                        <Link
                          to={`/products/${product.productId}`}
                          className="flex min-w-0 flex-1 items-center gap-4"
                        >
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 sm:h-28 sm:w-28">
                            {product.imgSrc ? (
                              <img
                                src={product.imgSrc}
                                alt={product.title || "Product"}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <Package
                                size={30}
                                className="text-slate-300"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                              {product.category || "Product"}
                            </p>

                            <h3 className="line-clamp-2 font-semibold text-slate-900 transition hover:text-emerald-700">
                              {product.title}
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                              {formatPrice(unitPrice)} per item
                            </p>
                          </div>
                        </Link>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between gap-4 flex-row ">
                          <div className="flex items-center rounded-xl border border-slate-200 bg-white">
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${product.title}`}
                              onClick={() => handleIncrease(product)}
                              className="flex h-10 w-10 items-center justify-center text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Plus size={16} />
                            </button>

                            <span className="min-w-9 text-center text-sm font-semibold text-slate-900">
                              {product.qty}
                            </span>

                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${product.title}`}
                              onClick={() => handleDecrease(product)}
                              className="flex h-10 w-10 items-center justify-center text-slate-600 transition hover:bg-slate-100"
                            >
                              <Minus size={16} />
                            </button>
                          </div>

                          <p className="font-bold text-slate-900">
                            {formatPrice(product.price)}
                          </p>

                        {/* Remove product */}
                        <button
                          type="button"
                          aria-label={`Remove ${product.title} from cart`}
                          onClick={() => removeFromCart(product.productId)}
                          className="self-end rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 sm:self-center"
                        >
                          <Trash2 size={18} />
                        </button>

                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Truck size={19} className="shrink-0 text-emerald-700" />
                    <p>
                      Shipping charges, if applicable, will be shown during
                      checkout.
                    </p>
                  </div>
                </div>
              </section>

              {/* Order summary */}
              <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
                <h2 className="text-xl font-bold text-slate-900">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500">
                      Subtotal ({totalQty} items)
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-medium text-slate-600">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-slate-900">
                        Estimated total
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Final shipping costs may change your total at checkout.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/shipping")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>

                <Link
                  to="/products"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-700"
                  />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      Secure checkout
                    </p>
                    <p className="mt-1 text-xs leading-5 text-emerald-800">
                      Review your order and shipping information before
                      confirming your purchase.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Cart;


import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Phone,
  UserRound,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Package,
} from "lucide-react";

const Checkout = () => {
  const {
    cartData,
    decreaseQty,
    addToCart,
    removeFromCart,
    clearCart,
    userAddress,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const items = Array.isArray(cartData?.items) ? cartData.items : [];

  // Assumes each cart item's price is its line total.
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

  const hasAddress = Boolean(
    userAddress?.address &&
    userAddress?.city &&
    userAddress?.phoneNumber
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pb-16 pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-8">
            <Link
              to="/getCart"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
            >
              <ArrowLeft size={16} />
              Back to cart
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
              Almost yours
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Review Your Order
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Check your products and delivery details before confirming.
            </p>
          </div>

          {/* Checkout progress */}
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-900">
                Review before you confirm
              </p>
              <p className="mt-1 text-xs leading-5 text-emerald-800 sm:text-sm">
                Verify your order and shipping address to help ensure a smooth
                delivery.
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            /* Empty order */
            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                <ShoppingBag size={36} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                There are no products to check out. Browse our collection to
                add items to your cart.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Explore products
                <ArrowRight size={17} />
              </Link>
            </section>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
              {/* Product details */}
              <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Products Details
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {items.length}{" "}
                      {items.length === 1 ? "product" : "products"} ·{" "}
                      {totalQty} total items
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer text-red-600 transition hover:bg-red-50 sm:self-auto"
                  >
                    <Trash2 size={16} />
                    Clear order
                  </button>
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-4 font-semibold">Product</th>
                        <th className="px-4 py-4 font-semibold">Price</th>
                        <th className="px-4 py-4 text-center font-semibold">
                          Quantity
                        </th>
                        <th className="px-5 py-4 text-right font-semibold">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {items.map((product) => {
                        const qty = Math.max(Number(product.qty || 1), 1);
                        const lineTotal = Number(product.price || 0);
                        const unitPrice = lineTotal / qty;

                        return (
                          <tr
                            key={product.productId}
                            className="transition hover:bg-slate-50/70"
                          >
                            <td className="px-5 py-5">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2">
                                  {product.imgSrc ? (
                                    <img
                                      src={product.imgSrc}
                                      alt={product.title || "Product"}
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    <Package
                                      size={24}
                                      className="text-slate-300"
                                    />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="line-clamp-2 font-semibold text-slate-800">
                                    {product.title}
                                  </p>
                                  <p className="mt-1 text-xs capitalize text-slate-500">
                                    {product.category || "Product"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="whitespace-nowrap px-4 py-5 text-sm text-slate-600">
                              {formatPrice(unitPrice)}
                            </td>

                            <td className="px-4 py-5">
                              <div className="flex items-center justify-center">
                                <div className="flex items-center rounded-lg border border-slate-200">
                                  <button
                                    type="button"
                                    aria-label={`Decrease ${product.title} quantity`}
                                    onClick={() => handleDecrease(product)}
                                    className="flex h-8 w-8 items-center justify-center text-slate-600 transition hover:bg-slate-100"
                                  >
                                    <Minus size={14} />
                                  </button>

                                  <span className="min-w-8 text-center text-sm font-semibold text-slate-800">
                                    {product.qty}
                                  </span>

                                  <button
                                    type="button"
                                    aria-label={`Increase ${product.title} quantity`}
                                    onClick={() => handleIncrease(product)}
                                    className="flex h-8 w-8 items-center justify-center text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                            </td>

                            <td className="whitespace-nowrap px-5 py-5 text-right">
                              <p className="text-sm font-bold text-slate-900">
                                {formatPrice(lineTotal)}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart(product.productId)
                                }
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-red-600"
                              >
                                <Trash2 size={13} />
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile product cards */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {items.map((product) => {
                    const qty = Math.max(Number(product.qty || 1), 1);
                    const unitPrice = Number(product.price || 0) / qty;

                    return (
                      <article key={product.productId} className="p-4">
                        <div className="flex gap-4">
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2">
                            {product.imgSrc ? (
                              <img
                                src={product.imgSrc}
                                alt={product.title || "Product"}
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <Package
                                size={28}
                                className="text-slate-300"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 font-semibold text-slate-900">
                              {product.title}
                            </p>
                            <p className="mt-1 text-xs capitalize text-slate-500">
                              {product.category || "Product"}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                              {formatPrice(unitPrice)} each
                            </p>
                            <p className="mt-1 font-bold text-slate-900">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-slate-200">
                            <button
                              type="button"
                              aria-label={`Decrease ${product.title} quantity`}
                              onClick={() => handleDecrease(product)}
                              className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-100"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-9 text-center text-sm font-semibold">
                              {product.qty}
                            </span>

                            <button
                              type="button"
                              aria-label={`Increase ${product.title} quantity`}
                              onClick={() => handleIncrease(product)}
                              className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.productId)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                            Remove
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
                      Shipping costs, if applicable, will be confirmed during
                      checkout.
                    </p>
                  </div>
                </div>
              </section>

              {/* Shipping address and summary */}
              <aside className="space-y-6 lg:sticky lg:top-28">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <MapPin size={21} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Shipping Address
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Delivery destination
                      </p>
                    </div>
                  </div>

                  {hasAddress ? (
                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                      {userAddress?.name && (
                        <p className="flex items-start gap-2 text-sm text-slate-700">
                          <UserRound
                            size={16}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />
                          {userAddress.name}
                        </p>
                      )}

                      <p className="text-sm leading-6 text-slate-700">
                        {userAddress.address}
                      </p>

                      <p className="text-sm leading-6 text-slate-600">
                        {[userAddress.city, userAddress.state, userAddress.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      <p className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone
                          size={15}
                          className="shrink-0 text-slate-400"
                        />
                        {userAddress.phoneNumber}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-amber-900">
                        Shipping address unavailable
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        Please check your saved address before confirming the
                        order.
                      </p>
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Order Summary
                  </h2>

                  <div className="mt-5 space-y-4">
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
                      <span className="text-right text-sm text-slate-500">
                        Calculated separately
                      </span>
                    </div>

                    <div className="border-t border-dashed border-slate-200 pt-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-900">
                          Estimated total
                        </span>
                        <span className="text-xl font-bold text-slate-900">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Shipping fees may change the final amount.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!hasAddress || items.length === 0}
                    onClick={() => navigate("/confirmOrder")}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Confirm Order
                    <ArrowRight size={18} />
                  </button>

                  {!hasAddress && (
                    <p className="mt-3 text-xs leading-5 text-amber-700">
                      A valid shipping address is required before confirming
                      your order.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    Continue Shopping
                  </button>

                  <div className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
                    <ShieldCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />
                    <p className="text-xs leading-5 text-emerald-900">
                      Confirm your product quantities and delivery address
                      before submitting your order.
                    </p>
                  </div>
                </section>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Checkout;

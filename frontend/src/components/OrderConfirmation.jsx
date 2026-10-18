
import React, { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import {
  CircleCheckBig,
  ShoppingBag,
  MapPin,
  Phone,
  UserRound,
  ArrowLeft,
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
  AlertCircle,
} from "lucide-react";

const OrderConfirmation = () => {
  const { cartData, clearCart, userAddress, url } = useContext(AppContext);

  const navigate = useNavigate();
  const items = Array.isArray(cartData?.items) ? cartData.items : [];

  const [showModal, setShowModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Assumes item.price stores the total price for that cart line.
  const totalPrice = items.reduce(
    (total, item) => total + Number(item.price || 0),
    0
  );

  const totalQty = items.reduce(
    (total, item) => total + Number(item.qty || 0),
    0
  );

  // This is the delivery charge shown by the UI.
  const deliveryCharges = 10;
  const totalAmount = totalPrice + deliveryCharges;

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  const hasAddress = Boolean(
    userAddress?.address &&
    userAddress?.city &&
    userAddress?.phoneNumber
  );

  const handlePayNow = async () => {
    if (placingOrder) return;

    try {
      setPlacingOrder(true);
      setOrderError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setOrderError("Please log in before placing your order.");
        return;
      }

      if (!hasAddress) {
        setOrderError("Please select a valid shipping address.");
        return;
      }

      if (items.length === 0) {
        setOrderError("Your cart is empty.");
        return;
      }

      const response = await axios.post(
        `${url}/orders/create`,
        {
          shippingAddress: userAddress,
          paymentMethod: "not-integrated",
        },
        {
          headers: {
            Auth: token,
          },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Unable to place your order."
        );
      }

      setConfirmedOrder(response.data.order);
      setShowModal(true);
    } catch (error) {
      setOrderError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleViewOrder = () => {
    setShowModal(false);
    navigate("/getProfile");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/products");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pb-16 pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-8">
            <Link
              to="/shipping"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
            >
              <ArrowLeft size={16} />
              Back to shipping
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
              One last step
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Confirm Your Order
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Review your items, delivery address, and order total before
              placing your order.
            </p>
          </div>

          {/* Notice */}
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-emerald-700"
            />
            <div>
              <p className="text-sm font-bold text-emerald-900">
                Review your order carefully
              </p>
              <p className="mt-1 text-xs leading-5 text-emerald-800 sm:text-sm">
                Online payment is not integrated yet. Placing your order will
                submit it for confirmation, with payment remaining pending.
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <section className="rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                <ShoppingBag size={36} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No items to confirm
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Your cart is empty. Add products before proceeding to order
                confirmation.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
              >
                Browse products
                <ArrowRight size={17} />
              </Link>
            </section>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
              {/* Order items */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Order Items
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {items.length}{" "}
                      {items.length === 1 ? "product" : "products"} ·{" "}
                      {totalQty} total items
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Package size={22} />
                  </div>
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-4 font-semibold">Product</th>
                        <th className="px-4 py-4 font-semibold">Unit Price</th>
                        <th className="px-4 py-4 text-center font-semibold">
                          Qty
                        </th>
                        <th className="px-5 py-4 text-right font-semibold">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {items.map((product) => {
                        const quantity = Math.max(
                          Number(product.qty || 1),
                          1
                        );
                        const lineTotal = Number(product.price || 0);
                        const unitPrice = lineTotal / quantity;

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

                            <td className="px-4 py-5 text-center text-sm font-semibold text-slate-800">
                              {product.qty}
                            </td>

                            <td className="whitespace-nowrap px-5 py-5 text-right text-sm font-bold text-slate-900">
                              {formatPrice(lineTotal)}
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
                    const quantity = Math.max(
                      Number(product.qty || 1),
                      1
                    );
                    const unitPrice =
                      Number(product.price || 0) / quantity;

                    return (
                      <article
                        key={product.productId}
                        className="flex gap-4 p-4"
                      >
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2">
                          {product.imgSrc ? (
                            <img
                              src={product.imgSrc}
                              alt={product.title || "Product"}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Package size={28} className="text-slate-300" />
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

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-500">
                              Qty: {product.qty}
                            </span>
                            <span className="font-bold text-slate-900">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Truck size={19} className="shrink-0 text-emerald-700" />
                    <p>
                      Delivery charges are shown separately in the order
                      summary.
                    </p>
                  </div>
                </div>
              </section>

              {/* Address and order summary */}
              <aside className="space-y-6 lg:sticky lg:top-28">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <MapPin size={21} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Delivery Address
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Your order will be sent here
                      </p>
                    </div>
                  </div>

                  {hasAddress ? (
                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                      {userAddress.name && (
                        <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <UserRound
                            size={16}
                            className="shrink-0 text-slate-400"
                          />
                          {userAddress.name}
                        </p>
                      )}

                      <p className="text-sm leading-6 text-slate-700">
                        {userAddress.address}
                      </p>

                      <p className="text-sm leading-6 text-slate-600">
                        {[
                          userAddress.city,
                          userAddress.state,
                          userAddress.country,
                        ]
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
                        Address unavailable
                      </p>
                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        Please return to shipping and select a valid address.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate("/shipping")}
                        className="mt-3 text-sm font-bold text-amber-900 underline"
                      >
                        Update address
                      </button>
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Payment Summary
                  </h2>

                  <div className="mt-5 space-y-4">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-slate-500">
                        Products ({totalQty} items)
                      </span>
                      <span className="font-semibold text-slate-900">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-slate-500">Delivery charges</span>
                      <span className="font-semibold text-slate-900">
                        {formatPrice(deliveryCharges)}
                      </span>
                    </div>

                    <div className="border-t border-dashed border-slate-200 pt-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-900">
                          Total Amount
                        </span>
                        <span className="text-xl font-bold text-slate-900">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-900">
                      Payment method
                    </p>
                    <p className="mt-1 text-sm text-amber-800">
                      Payment pending — online payment is not integrated.
                    </p>
                  </div>

                  {orderError && (
                    <div
                      role="alert"
                      className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
                    >
                      <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0"
                      />
                      <p>{orderError}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePayNow}
                    disabled={placingOrder || !hasAddress || items.length === 0}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {placingOrder ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Confirm Order
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                    No online payment will be collected on this screen.
                  </p>
                </section>
              </aside>
            </div>
          )}
        </div>
      </main>

      {/* Success modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-2xl sm:p-9">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CircleCheckBig
                size={48}
                className="text-emerald-600"
              />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              Order submitted
            </p>

            <h2
              id="order-success-title"
              className="mt-2 text-2xl font-bold text-slate-900"
            >
              Order Placed Successfully!
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your order has been submitted. Payment remains pending because
              an online payment gateway is not integrated yet.
            </p>

            {confirmedOrder?._id && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Order reference
                </p>
                <p className="mt-1 break-all font-semibold text-slate-900">
                  {confirmedOrder._id}
                </p>
              </div>
            )}

            <button
              type="button"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700"
              onClick={handleViewOrder}
            >
              View My Orders
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={handleCloseModal}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderConfirmation;

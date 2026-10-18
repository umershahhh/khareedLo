
import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import {
  UserRound,
  Mail,
  Package,
  ShoppingBag,
  Clock3,
  Truck,
  CreditCard,
  RefreshCw,
  MapPin,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  CircleAlert,
  ReceiptText,
  LogIn,
  ExternalLink,
} from "lucide-react";
import AppContext from "../../context/AppContext";

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  })}`;

const formatStatus = (status) => {
  if (!status || typeof status !== "string") {
    return "Not available";
  }

  return status
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusStyle = (status = "") => {
  const value =
    typeof status === "string" ? status.toLowerCase() : "";

  if (
    ["paid", "delivered", "confirmed", "completed"].includes(value)
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  }

  if (
    ["failed", "cancelled", "canceled", "rejected"].includes(value)
  ) {
    return "bg-red-50 text-red-700 ring-red-600/20";
  }

  if (["shipped", "in-transit", "in_transit"].includes(value)) {
    return "bg-blue-50 text-blue-700 ring-blue-600/20";
  }

  return "bg-amber-50 text-amber-700 ring-amber-600/20";
};

const getItemQuantity = (item) =>
  Math.max(0, Number(item?.quantity ?? item?.qty ?? 0) || 0);

const getItemUnitPrice = (item) => {
  const explicitUnitPrice = Number(item?.unitPrice);

  if (item?.unitPrice != null && Number.isFinite(explicitUnitPrice)) {
    return explicitUnitPrice;
  }

  const price = Number(item?.price || 0);
  const quantity = getItemQuantity(item);

  // Some cart/order implementations save price as a line total.
  if (quantity > 0 && item?.priceIsLineTotal === true) {
    return price / quantity;
  }

  return price;
};

const getItemLineTotal = (item) => {
  const explicitLineTotal = Number(item?.lineTotal);

  if (
    item?.lineTotal != null &&
    Number.isFinite(explicitLineTotal)
  ) {
    return explicitLineTotal;
  }

  const explicitTotal = Number(item?.totalPrice);

  if (
    item?.totalPrice != null &&
    Number.isFinite(explicitTotal)
  ) {
    return explicitTotal;
  }

  return getItemUnitPrice(item) * getItemQuantity(item);
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Profile = () => {
  const { user, url } = useContext(AppContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const fetchMyOrders = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setOrders([]);
      setOrdersError("Please log in to view your order history.");
      setIsLoggedOut(true);
      setOrdersLoading(false);
      return;
    }

    if (!url) {
      setOrdersError("The API URL is not configured in AppContext.");
      setOrdersLoading(false);
      return;
    }

    try {
      setOrdersLoading(true);
      setOrdersError("");
      setIsLoggedOut(false);

      const response = await axios.get(`${url}/orders/my-orders`, {
        headers: { Auth: token },
        withCredentials: true,
      });

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Unable to retrieve your orders."
        );
      }

      const fetchedOrders = response.data?.orders;

      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error.response?.data || error.message
      );

      const statusCode = error.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        setIsLoggedOut(true);
        setOrdersError(
          "Your session may have expired. Please log in again."
        );
      } else {
        setOrdersError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load your orders. Please try again."
        );
      }
    } finally {
      setOrdersLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const totalSpent = orders.reduce((total, order) => {
    const amount = Number(order?.totalAmount ?? 0);
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const totalItems = orders.reduce((total, order) => {
    const items = Array.isArray(order?.items) ? order.items : [];

    return (
      total +
      items.reduce((itemTotal, item) => {
        return itemTotal + getItemQuantity(item);
      }, 0)
    );
  }, 0);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 pb-16 pt-20 sm:pt-24">
        {/* Profile header */}
        <section className="relative overflow-hidden bg-slate-950">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-sm sm:h-24 sm:w-24">
                  <UserRound size={38} strokeWidth={1.5} />
                </div>

                <div className="min-w-0">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">
                    Maple Street / My Account
                  </p>

                  <h1 className="break-words text-2xl font-bold tracking-tight text-white sm:text-4xl">
                    {user?.name || "Welcome back"}
                  </h1>

                  <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-slate-300">
                    <Mail size={16} className="shrink-0" />
                    <span className="truncate">
                      {user?.email || "Your account details"}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchMyOrders}
                disabled={ordersLoading}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
              >
                <RefreshCw
                  size={16}
                  className={ordersLoading ? "animate-spin" : ""}
                />
                Refresh orders
              </button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
              <Link to="/" className="transition hover:text-white">
                Home
              </Link>
              <span>/</span>
              <span className="text-white">My Profile</span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Summary cards */}
          <section className="grid gap-4 pt-7 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total orders
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {ordersLoading ? "—" : orders.length}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Orders placed from your account
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                  <ShoppingBag size={23} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Items ordered
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {ordersLoading ? "—" : totalItems}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Total quantity across all orders
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Package size={23} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:col-span-2 sm:p-6 lg:col-span-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Order value
                  </p>
                  <p className="mt-3 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
                    {ordersLoading ? "—" : formatCurrency(totalSpent)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Combined value of your orders
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                  <ReceiptText size={23} />
                </div>
              </div>
            </div>
          </section>

          {/* Account information */}
          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Account information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your basic account details
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                  <UserRound size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full name
                  </p>
                  <p className="mt-1 truncate font-semibold text-slate-800">
                    {user?.name || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                  <Mail size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email address
                  </p>
                  <p className="mt-1 truncate font-semibold text-slate-800">
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Order history */}
          <section className="mt-12">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    My Orders
                  </h2>

                  {!ordersLoading && !ordersError && orders.length > 0 && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {orders.length} {orders.length === 1 ? "order" : "orders"}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  View your purchases, payment status, and delivery progress.
                </p>
              </div>
            </div>

            {ordersLoading ? (
              <div className="space-y-5">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="h-5 w-40 rounded bg-slate-200" />
                    <div className="mt-4 h-4 w-64 max-w-full rounded bg-slate-100" />
                    <div className="mt-6 h-20 rounded-xl bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : ordersError ? (
              <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <CircleAlert size={26} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {isLoggedOut
                    ? "Log in to view your orders"
                    : "We couldn't load your orders"}
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  {ordersError}
                </p>

                {isLoggedOut ? (
                  <button
                    type="button"
                    onClick={handleLoginRedirect}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <LogIn size={16} />
                    Go to login
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={fetchMyOrders}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <RefreshCw size={16} />
                    Try again
                  </button>
                )}
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <ShoppingBag size={29} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Your order history is empty
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Once you place an order, you'll find its details, items, and
                  status here.
                </p>

                <Link
                  to="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Explore products
                  <ArrowRight size={17} />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, orderIndex) => {
                  const orderItems = Array.isArray(order?.items)
                    ? order.items
                    : [];

                  const orderId = order?._id || `order-${orderIndex}`;

                  return (
                    <article
                      key={orderId}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                    >
                      {/* Order heading */}
                      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:px-6">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-bold text-slate-900">
                              Order #
                              {String(order?._id || "N/A")
                                .slice(-8)
                                .toUpperCase()}
                            </h3>

                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
                                order?.orderStatus
                              )}`}
                            >
                              {formatStatus(order?.orderStatus)}
                            </span>
                          </div>

                          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays size={15} className="shrink-0" />
                            {formatDate(order?.createdAt)}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Order total
                          </p>
                          <p className="mt-1 text-2xl font-bold text-slate-900">
                            {formatCurrency(order?.totalAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Status summary */}
                      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3 sm:px-6">
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                          <div className="rounded-lg bg-white p-2 text-emerald-700 shadow-sm">
                            <CreditCard size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">Payment</p>
                            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                              {formatStatus(order?.paymentStatus)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                          <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
                            <Truck size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">Delivery</p>
                            <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                              {formatStatus(order?.deliveryStatus)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                          <div className="rounded-lg bg-white p-2 text-emerald-700 shadow-sm">
                            <ShieldCheck size={19} />
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Items</p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {orderItems.reduce(
                                (sum, item) => sum + getItemQuantity(item),
                                0
                              )}{" "}
                              item(s)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Products */}
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                          Order items
                        </h4>

                        {orderItems.length === 0 ? (
                          <p className="rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                            No item details are available for this order.
                          </p>
                        ) : (
                          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                            {orderItems.map((item, index) => {
                              const quantity = getItemQuantity(item);
                              const unitPrice = getItemUnitPrice(item);
                              const lineTotal = getItemLineTotal(item);

                              return (
                                <div
                                  key={`${item?.productId || item?.title || "item"}-${index}`}
                                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4"
                                >
                                  <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                    {item?.imgSrc ? (
                                      <img
                                        src={item.imgSrc}
                                        alt={item?.title || "Ordered product"}
                                        className="h-full w-full object-contain p-1"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <Package
                                        size={28}
                                        className="text-slate-300"
                                      />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="line-clamp-2 font-semibold text-slate-800">
                                      {item?.title || "Product"}
                                    </p>

                                    {item?.category && (
                                      <p className="mt-1 text-xs capitalize text-slate-500">
                                        {item.category}
                                      </p>
                                    )}

                                    <p className="mt-2 text-sm text-slate-500">
                                      Quantity: {quantity}
                                    </p>
                                  </div>

                                  <div className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                                    <div>
                                      <p className="text-xs text-slate-500 sm:hidden">
                                        Line total
                                      </p>
                                      <p className="font-bold text-slate-900">
                                        {formatCurrency(lineTotal)}
                                      </p>
                                    </div>

                                    <p className="text-xs text-slate-500 sm:mt-1">
                                      {formatCurrency(unitPrice)} each
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Shipping address */}
                        {order?.shippingAddress &&
                          typeof order.shippingAddress === "object" && (
                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                              <MapPin
                                size={19}
                                className="mt-0.5 shrink-0 text-slate-500"
                              />

                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800">
                                  Shipping address
                                </p>

                                <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                                  {[
                                    order.shippingAddress.address,
                                    order.shippingAddress.city,
                                    order.shippingAddress.state,
                                    order.shippingAddress.country,
                                  ]
                                    .filter(Boolean)
                                    .join(", ") || "Address saved with order"}
                                </p>

                                {order.shippingAddress.phoneNumber && (
                                  <p className="mt-1 text-sm text-slate-500">
                                    {order.shippingAddress.phoneNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
            <Clock3 size={14} />
            Order and payment statuses reflect the latest information available.
          </p>

          <div className="mt-6 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
            >
              Continue shopping
              <ExternalLink size={15} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;

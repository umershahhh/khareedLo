import { useContext, useState } from "react";
import {
  ShoppingBag,
  Users,
  Package,
  Plus,
  TrendingUp,
  ClipboardList,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  CircleDollarSign,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Eye, X, MapPin, CreditCard } from "lucide-react";
import AppContext from "../../context/AppContext";

const Dashboard = () => {
  const {
    allOrders = [],
    allUsers = [],
    publishNewProduct,
    updateOrderStatus,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imgSrc: "",
    qty: "",
    price: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const { title, description, imgSrc, category, qty, price } = formData;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await publishNewProduct(
        title.trim(),
        description.trim(),
        imgSrc.trim(),
        category.trim(),
        qty,
        price,
      );

      if (result?.success) {
        setSuccess("Your product has been published successfully.");
        setFormData({
          title: "",
          description: "",
          imgSrc: "",
          qty: "",
          price: "",
          category: "",
        });
      } else {
        setError(
          result?.message || "Unable to publish the product. Please try again.",
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, field, value) => {
    setUpdatingOrder(`${orderId}-${field}`);
    setError("");

    try {
      const result = await updateOrderStatus(orderId, {
        [field]: value,
      });

      if (!result) {
        setError("Failed to update the order status. Please try again.");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      setError("Something went wrong while updating the order.");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || amount === "") {
      return "—";
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) return "—";

    return `Rs. ${numericAmount.toLocaleString("en-PK")}`;
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (["paid", "delivered", "confirmed"].includes(normalizedStatus)) {
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    }

    if (["failed", "cancelled", "refunded"].includes(normalizedStatus)) {
      return "bg-red-50 text-red-700 ring-red-600/20";
    }

    if (["shipped"].includes(normalizedStatus)) {
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    }

    return "bg-amber-50 text-amber-700 ring-amber-600/20";
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

  const selectClass =
    "w-full min-w-[145px] cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50";

  const stats = [
    {
      title: "Total Orders",
      value: allOrders.length,
      description: "Orders placed by customers",
      icon: ShoppingBag,
      iconStyle: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Registered Users",
      value: allUsers.length,
      description: "Accounts in your store",
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-700",
    },
    {
      title: "Order Revenue",
      value: formatCurrency(
        allOrders.reduce(
          (total, order) =>
            total + (Number(order.totalAmount ?? order.amount) || 0),
          0,
        ),
      ),
      description: "Combined value of listed orders",
      icon: CircleDollarSign,
      iconStyle: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-6 text-slate-800 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-[1600px] space-y-8">
        {/* Dashboard Header */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-60 w-60 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-300">
                <ShieldCheck size={15} />
                Administrator Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage customer orders, monitor your users, and publish products
                from one place.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 md:self-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
                <TrendingUp size={21} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Store overview</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Management Center
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/adminDashboard/productView")}
            className="inline-flex items-center justify-center gap-2 rounded-xl
    bg-emerald-500 px-5 py-3 text-sm font-semibold text-white
    transition hover:bg-emerald-600 focus:outline-none
    focus:ring-4 focus:ring-emerald-500/20"
          >
            <Eye size={18} />
            View Listed Products
          </button>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <h2 className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {stat.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.iconStyle}`}
                  >
                    <Icon size={23} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Global feedback */}
        {(error || success) && (
          <div
            role="alert"
            className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {error ? (
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
            ) : (
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            )}
            <p>{error || success}</p>
          </div>
        )}

        {/* Orders */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ClipboardList size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Order Management
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review orders and update their statuses.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <ShoppingBag size={14} />
              {allOrders.length} orders
            </span>
          </div>

          {allOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <ShoppingBag size={29} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">
                No orders yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4 font-semibold">Order</th>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Total</th>
                    <th className="px-5 py-4 font-semibold">Payment</th>
                    <th className="px-5 py-4 font-semibold">Order Status</th>
                    <th className="px-5 py-4 font-semibold">Delivery</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {allOrders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      // onClick={() => console.log(order)}
                      className="cursor-pointer transition hover:bg-emerald-50/60"
                      title="Click to view order details"
                    >
                      <td className="px-5 py-5">
                        <span className="font-mono text-xs text-slate-500">
                          #{String(order._id).slice(-8).toUpperCase()}
                        </span>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-semibold text-slate-800">
                          {order.shippingAddress?.fullName || "N/A"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">Customer</p>
                      </td>

                      <td className="px-5 py-5 font-semibold text-slate-900">
                        {formatCurrency(order.totalAmount ?? order.amount)}
                      </td>

                      <td className="px-5 py-5">
                        <select
                          aria-label={`Payment status for order ${order._id}`}
                          value={order.paymentStatus || "pending"}
                          onClick={(e) => e.stopPropagation()}
                          disabled={
                            updatingOrder === `${order._id}-paymentStatus`
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              "paymentStatus",
                              e.target.value,
                            )
                          }
                          className={`${selectClass} ${getStatusStyle(
                            order.paymentStatus,
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      <td className="px-5 py-5">
                        <select
                          aria-label={`Order status for order ${order._id}`}
                          value={order.orderStatus || "pending-confirmation"}
                          onClick={(e) => e.stopPropagation()}
                          disabled={
                            updatingOrder === `${order._id}-orderStatus`
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              "orderStatus",
                              e.target.value,
                            )
                          }
                          className={`${selectClass} ${getStatusStyle(
                            order.orderStatus,
                          )}`}
                        >
                          <option value="pending-confirmation">
                            Pending Confirmation
                          </option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="px-5 py-5">
                        <select
                          aria-label={`Delivery status for order ${order._id}`}
                          onClick={(e) => e.stopPropagation()}
                          value={order.deliveryStatus || "not-dispatched"}
                          disabled={
                            updatingOrder === `${order._id}-deliveryStatus`
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              "deliveryStatus",
                              e.target.value,
                            )
                          }
                          className={`${selectClass} ${getStatusStyle(
                            order.deliveryStatus,
                          )}`}
                        >
                          <option value="not-dispatched">Not Dispatched</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>

                        {updatingOrder?.startsWith(`${order._id}-`) && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                            <LoaderCircle size={12} className="animate-spin" />
                            Updating...
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Users */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Registered Users
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  View account information and registration dates.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              <Users size={14} />
              {allUsers.length} users
            </span>
          </div>

          {allUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Users size={26} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">
                No users found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Registered accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold">Joined</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {allUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold uppercase text-emerald-700">
                            {user?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {user?.name || "Unnamed user"}
                            </p>
                            <p className="mt-1 font-mono text-[10px] text-slate-400">
                              {String(user._id).slice(-10)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {user?.email || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                            user?.role === "admin"
                              ? "bg-violet-50 text-violet-700 ring-violet-600/20"
                              : "bg-slate-100 text-slate-600 ring-slate-500/10"
                          }`}
                        >
                          {user?.role || "user"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                          <CalendarDays size={14} />
                          {formatDate(user?.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedOrder && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center
      bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-modal-title"
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto
        rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className="sticky top-0 z-10 flex items-start justify-between
        gap-4 border-b border-slate-100 bg-white px-6 py-5 sm:px-8"
              >
                <div>
                  <div
                    className="mb-2 inline-flex items-center gap-2 rounded-full
            bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    <ShoppingBag size={14} />
                    Order Details
                  </div>

                  <h2
                    id="order-modal-title"
                    className="text-xl font-bold text-slate-900 sm:text-2xl"
                  >
                    Order #{String(selectedOrder._id).slice(-8).toUpperCase()}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  aria-label="Close order details"
                  className="flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl bg-slate-100 text-slate-600 transition
            hover:bg-slate-200 hover:text-slate-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                {/* Customer and Order Information */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                      <Users size={18} />
                      <h3 className="text-sm font-semibold">Customer</h3>
                    </div>

                    <p className="font-bold text-slate-900">
                      {selectedOrder.shippingAddress?.fullName ||
                        selectedOrder.shippingAddress?.name ||
                        selectedOrder.user?.name ||
                        selectedOrder.userId?.name ||
                        "Not available"}
                    </p>

                    

                    <p className="mt-2 text-xs text-slate-400">
                      Order ID: {selectedOrder._id}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <div className="mb-3 flex items-center gap-2 text-slate-500">
                      <CreditCard size={18} />
                      <h3 className="text-sm font-semibold">
                        Payment Information
                      </h3>
                    </div>

                    <p className="text-sm text-slate-500">Payment method</p>
                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {String(
                        selectedOrder.paymentMethod ||
                          selectedOrder.paymentInfo?.method ||
                          "Not specified",
                      ).replaceAll("-", " ")}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-slate-500">
                        Payment status:
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold
                  ${getStatusStyle(selectedOrder.paymentStatus)}`}
                      >
                        {selectedOrder.paymentStatus || "pending"}
                      </span>
                    </div>

                    {selectedOrder.paymentInfo?.transactionId && (
                      <p className="mt-3 break-all text-xs text-slate-500">
                        Transaction ID:{" "}
                        {selectedOrder.paymentInfo.transactionId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="rounded-2xl border border-slate-200 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin size={19} className="text-emerald-600" />
                    <h3 className="font-bold text-slate-900">
                      Shipping Address
                    </h3>
                  </div>

                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-400">Full name</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {selectedOrder.shippingAddress?.fullName ||
                          selectedOrder.shippingAddress?.name ||
                          "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Phone number</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {selectedOrder.shippingAddress?.phoneNumber ||
                          selectedOrder.shippingAddress?.phone ||
                          "Not available"}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs text-slate-400">Street address</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {selectedOrder.shippingAddress?.address ||
                          "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">City / State</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {[
                          selectedOrder.shippingAddress?.city,
                          selectedOrder.shippingAddress?.state,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Country</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {selectedOrder.shippingAddress?.country ||
                          "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div
                    className="flex items-center justify-between gap-3
            border-b border-slate-100 bg-slate-50 px-5 py-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Ordered Items
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Products included in this order
                      </p>
                    </div>

                    <Package size={21} className="text-slate-400" />
                  </div>

                  {(() => {
                    const items =
                      selectedOrder.items ||
                      selectedOrder.orderItems ||
                      selectedOrder.cartItems ||
                      [];

                    if (!items.length) {
                      return (
                        <div className="px-5 py-8 text-center text-sm text-slate-500">
                          No cart items were found in this order's response.
                        </div>
                      );
                    }

                    return (
                      <div className="divide-y divide-slate-100">
                        {items.map((item, index) => {
                          const quantity = Number(
                            item.qty ?? item.quantity ?? 1,
                          );
                          const price = Number(
                            item.unitPrice ?? item.productId?.price ?? 0,
                          );
                          const name =
                            item.title ||
                            item.name ||
                            item.product?.title ||
                            item.productId?.title ||
                            "Product";

                          return (
                            <div
                              key={item._id || item.productId?._id || index}
                              className="flex items-center gap-4 px-5 py-4"
                            >
                              {item.imgSrc ||
                              item.image ||
                              item.product?.imgSrc ||
                              item.productId?.imgSrc ? (
                                <img
                                  src={
                                    item.imgSrc ||
                                    item.image ||
                                    item.product?.imgSrc ||
                                    item.productId?.imgSrc
                                  }
                                  alt={name}
                                  className="h-16 w-16 shrink-0 rounded-xl
                            border border-slate-100 object-cover"
                                />
                              ) : (
                                <div
                                  className="flex h-16 w-16 shrink-0
                          items-center justify-center rounded-xl
                          bg-slate-100 text-slate-400"
                                >
                                  <Package size={24} />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-slate-900">
                                  {name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Quantity: {quantity}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Unit price: {formatCurrency(price)}
                                </p>
                              </div>

                              <p className="shrink-0 text-sm font-bold text-slate-900">
                                {formatCurrency(price * quantity)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Order and Delivery Status */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Order status</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1.5
                text-xs font-semibold ${getStatusStyle(
                  selectedOrder.orderStatus,
                )}`}
                    >
                      {selectedOrder.orderStatus || "pending-confirmation"}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Delivery status</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1.5
                text-xs font-semibold ${getStatusStyle(
                  selectedOrder.deliveryStatus,
                )}`}
                    >
                      {selectedOrder.deliveryStatus || "not-dispatched"}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="rounded-2xl bg-slate-950 p-6 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300">Order Total</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Total amount recorded for this order
                      </p>
                    </div>

                    <p className="text-2xl font-bold tracking-tight">
                      {formatCurrency(
                        selectedOrder.totalAmount ?? selectedOrder.amount,
                      )}
                    </p>
                  </div>

                  {selectedOrder.shippingFee != null && (
                    <div
                      className="mt-4 flex justify-between border-t
              border-white/10 pt-4 text-sm text-slate-300"
                    >
                      <span>Shipping fee</span>
                      <span>{formatCurrency(selectedOrder.shippingFee)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-xl bg-slate-100 px-5 py-3 text-sm
              font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Publish Product */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Package size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Publish New Product
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add a new item to your store catalogue.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Product title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={onChangeHandler}
                  placeholder="e.g. Premium Wireless Headphones"
                  autoComplete="off"
                  minLength={2}
                  maxLength={80}
                  className={inputClass}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={category}
                  onChange={onChangeHandler}
                  placeholder="e.g. Electronics"
                  minLength={2}
                  maxLength={80}
                  className={inputClass}
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Price (PKR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                    Rs.
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={price}
                    onChange={onChangeHandler}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={`${inputClass} pl-12`}
                    required
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label
                  htmlFor="qty"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Available Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  id="qty"
                  name="qty"
                  type="number"
                  value={qty}
                  onChange={onChangeHandler}
                  placeholder="Enter stock quantity"
                  min="0"
                  step="1"
                  className={inputClass}
                  required
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="imgSrc"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Product Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="imgSrc"
                  name="imgSrc"
                  type="url"
                  value={imgSrc}
                  onChange={onChangeHandler}
                  placeholder="https://example.com/product-image.jpg"
                  className={inputClass}
                  required
                />
                <p className="text-xs text-slate-400">
                  Paste a direct URL to the product image.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={onChangeHandler}
                  placeholder="Describe the product's features and details..."
                  minLength={2}
                  rows={4}
                  className={`${inputClass} resize-y`}
                  required
                />
              </div>
            </div>

            {/* Form feedback */}
            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                Fields marked with * are required.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:bg-emerald-600 hover:shadow-emerald-600/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Publishing Product...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Publish Product
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
          <p>Maple Street · Store Administration</p>
          <p className="flex items-center gap-1.5">
            <RefreshCw size={12} />
            Dashboard overview
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Dashboard;

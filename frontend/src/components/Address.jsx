import React, { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, MapPin, Phone, ShieldCheck } from "lucide-react";
import Navbar from "./Navbar";

function Address() {
  const { shippingAddress, userAddress } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phoneNumber: "",
  });

  const { fullName, address, city, state, country, phoneNumber } = formData;
  const inputClassName =
    "mt-2 w-full rounded-md border border-[#d9d6ce] bg-white px-3.5 py-3 text-sm text-[#252822] placeholder:text-[#96968e] outline-none transition focus:border-[#26382b] focus:ring-2 focus:ring-[#26382b]/10";

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const result = await shippingAddress(fullName, address, city, state, country, phoneNumber);
    if (result.success) {
      navigate("/checkout");
    }
  };

  return (
    <>
    <Navbar/>
    <main className="min-h-[calc(100vh-5rem)] mt-16 bg-[#fcfaf7] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-[#e7e2d9] pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#777970]">
            Checkout <span className="px-1.5 text-[#d8b98c]">/</span> Delivery
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold text-[#26382b] sm:text-4xl">Where should we deliver?</h1>
              <p className="mt-2 text-sm text-[#777970]">Add your shipping details to continue with your order.</p>
            </div>
            <span className="text-sm font-medium text-[#777970]">01 <span className="text-[#d8b98c]">/</span> 02</span>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)] lg:gap-8">
        <form
          onSubmit={onSubmitHandler}
          className="w-full rounded-lg border border-[#e7e2d9] bg-white p-5 shadow-[0_8px_28px_rgba(38,56,43,0.04)] sm:p-8"
        >
          <div className="mb-7 flex items-start gap-3 border-b border-[#eeeae3] pb-5">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#f4f1e9] text-[#26382b]">
              <MapPin size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#252822]">Shipping information</h2>
              <p className="mt-1 text-sm text-[#777970]">Please enter the details for your delivery.</p>
            </div>
          </div>

          <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-[#41443d] sm:col-span-2">
              Full name
              <input onChange={onChangeHandler} name="fullName" type="text" autoComplete="name" placeholder="Name on the order" required className={inputClassName} />
            </label>
            <label className="text-sm font-medium text-[#41443d] sm:col-span-2">
              Street address
              <input onChange={onChangeHandler} name="address" type="text" autoComplete="street-address" placeholder="House number and street" required className={inputClassName} />
            </label>
            <label className="text-sm font-medium text-[#41443d]">
              City
              <input onChange={onChangeHandler} name="city" type="text" autoComplete="address-level2" placeholder="City" required className={inputClassName} />
            </label>
            <label className="text-sm font-medium text-[#41443d]">
              State / Region
              <input onChange={onChangeHandler} name="state" type="text" autoComplete="address-level1" placeholder="State or region" required className={inputClassName} />
            </label>
            <label className="text-sm font-medium text-[#41443d]">
              Country
              <input onChange={onChangeHandler} name="country" type="text" autoComplete="country-name" placeholder="Country" required className={inputClassName} />
            </label>
            <label className="text-sm font-medium text-[#41443d]">
              Phone number
              <input onChange={onChangeHandler} name="phoneNumber" type="tel" autoComplete="tel" placeholder="For delivery updates" required className={inputClassName} />
            </label>
          </div>

          <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-[#eeeae3] pt-6 sm:flex-row">
            <p className="flex items-center gap-2 text-xs text-[#777970]">
              <ShieldCheck size={16} className="text-[#687b68]" aria-hidden="true" />
              Your details are used only to fulfill this order.
            </p>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#26382b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#354b39] focus:outline-none focus:ring-2 focus:ring-[#26382b] focus:ring-offset-2 sm:w-auto"
            >
              Continue to checkout <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </form>

        <aside className="rounded-lg border border-[#e7e2d9] bg-[#f5f2eb] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#777970]">Saved details</p>
          <h2 className="mt-2 text-lg font-semibold text-[#252822]">Use a previous address</h2>
          {userAddress ? (
            <div className="mt-5 rounded-md border border-[#e7e2d9] bg-white p-4">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[#687b68]" aria-hidden="true" />
                <div className="min-w-0 text-sm leading-6 text-[#55584f]">
                  <p className="font-semibold text-[#252822]">{userAddress.fullName}</p>
                  <p>{userAddress.address}</p>
                  <p>{userAddress.city}, {userAddress.state} {userAddress.country}</p>
                  <p className="mt-2 flex items-center gap-2 text-[#777970]">
                    <Phone size={14} aria-hidden="true" /> {userAddress.phoneNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/checkout", { state: { userAddress } })}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-[#26382b] px-4 py-3 text-sm font-semibold text-[#26382b] transition hover:bg-[#26382b] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#26382b] focus:ring-offset-2"
              >
                <Check size={16} aria-hidden="true" /> Use this address
              </button>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#777970]">
              Once you have an address saved, you can select it here to check out faster next time.
            </p>
          )}
          <p className="mt-5 border-t border-[#e2ddd3] pt-4 text-xs leading-5 text-[#777970]">
            Need to make a change? You can update your delivery details before placing your order.
          </p>
        </aside>
        </div>
      </div>
    </main>
    </>
  );
}

export default Address;

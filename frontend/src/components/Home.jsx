
import React from "react";
import banner from "../../public/assets/banner2.jpg";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ShieldCheck,
  CircleDollarSign,
  Award,
  ArrowRight,
  Sparkles,
  Headphones,
  Truck,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Convenient Shopping",
    description: "A simple and smooth shopping experience.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description: "Your order details stay protected.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Award,
    title: "Quality Products",
    description: "Explore gadgets for everyday life.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    icon: CircleDollarSign,
    title: "Great Value",
    description: "Discover products at competitive prices.",
    color: "bg-violet-50 text-violet-700",
  },
];

const Home = () => {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden  bg-white">
        {/* Hero section */}
        <section className="relative min-h-[620px] h-[calc(90vh-76px)] max-h-[850px] w-full overflow-hidden bg-slate-950">
          <img
            src={banner}
            alt="Explore the latest gadgets at Maple Street"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10" />

          {/* Hero content */}
          <div className="relative mx-auto mt-10 flex h-full max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-12">
            <div className="max-w-2xl">
              


              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Your next
                <span className="mt-1 block text-emerald-300">
                  favorite gadget
                </span>
                starts here.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                Discover everyday essentials and exciting tech finds, all in
                one place. Find the products you love and shop with confidence.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-500 px-7 py-4 font-semibold text-white shadow-lg shadow-emerald-950/20 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  Explore Products
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-emerald-300" />
                  Secure shopping
                </div>
                <div className="flex items-center gap-2">
                  <Star size={17} className="text-emerald-300" />
                  Quality-focused selection
                </div>
              </div>
            </div>
          </div>

          {/* Decorative accent */}
          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-1.5 w-1/3 bg-emerald-400 sm:block" />
        </section>

        {/* Benefits section */}
        <section className="relative bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                The Maple Street difference
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Shopping made simple
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                Everything you need for a convenient and confident shopping
                experience.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-7"
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} transition duration-300 group-hover:scale-105`}
                    >
                      <Icon size={27} strokeWidth={1.8} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Promotional CTA */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <Headphones size={18} />
                  Your next discovery awaits
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Find something you'll love.
                </h2>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                  Browse our collection, compare your options, and find the
                  right products for your needs.
                </p>
              </div>

              <Link
                to="/products"
                className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-6 py-4 font-semibold text-slate-950 transition duration-300 hover:bg-emerald-300"
              >
                Browse Collection
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 py-7 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
              Maple <span className="text-emerald-600">Street.</span>
            </Link>

            <p className="text-sm text-slate-500">
              Your everyday destination for great finds.
            </p>

            <Link
              to="/products"
              className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
            >
              Shop now <span aria-hidden="true">→</span>
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;

import React, { useContext, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";
import {
  ShoppingCart,
  UserRound,
  Search,
  LogOut,
  Menu,
  X,
  SlidersHorizontal,
  ChevronDown,
  Store,
} from "lucide-react";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All products");

  const navigate = useNavigate();
  const location = useLocation();

  const {
    products,
    setFilterData,
    logout,
    isAuthenticated,
    cartData,
  } = useContext(AppContext);

  const cartCount = Array.isArray(cartData?.items)
    ? cartData.items.reduce((total, item) => total + (Number(item.qty) || 1), 0)
    : 0;

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const query = searchText.trim();
    if (!query) return;

    navigate(`/products/search/${encodeURIComponent(query)}`);
    setMobileMenuOpen(false);
  };

  const filterByCategory = (category, label) => {
    if (!products) return;

    setActiveFilter(label);

    setFilterData(
      products.filter(
        (data) =>
          data?.category?.toLowerCase() === category.toLowerCase()
      )
    );
  };

  const filterByPrice = (price, label) => {
    if (!products) return;

    setActiveFilter(label);
    setFilterData(
      products.filter((data) => Number(data?.price) >= price)
    );
  };

  const resetFilters = () => {
    setActiveFilter("All products");
    setFilterData(products || []);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isProductsPage = location.pathname === "/products";

  const filterItems = [
    { label: "All products", action: resetFilters },
    {
      label: "Mobiles",
      action: () => filterByCategory("mobile", "Mobiles"),
    },
    {
      label: "Laptops",
      action: () => filterByCategory("laptop", "Laptops"),
    },
    {
      label: "Accessories",
      action: () => filterByCategory("accessories", "Accessories"),
    },
    {
      label: "Headphones",
      action: () => filterByCategory("headphone", "Headphones"),
    },
    {
      label: "Rs. 10,000+",
      action: () => filterByPrice(10000, "Rs. 10,000+"),
    },
    {
      label: "Rs. 5,000+",
      action: () => filterByPrice(5000, "Rs. 5,000+"),
    },
  ];

  return (
    <header className="relative z-50 w-full">
      {/* Main navbar */}
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-slate-950/95 text-white shadow-lg shadow-slate-950/5 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          {/* Brand */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex shrink-0 items-center gap-3"
          >
            

            <div className="flex flex-col">
              <span className="great-vibes text-2xl font-bold leading-none text-white sm:text-3xl">
                Maple Street
              </span>
              <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.24em] text-emerald-400 sm:block">
                Shop your style
              </span>
            </div>
          </Link>

          {/* Desktop search */}
          <form
            onSubmit={onSubmitHandler}
            className="mx-4 hidden max-w-xl flex-1 md:block"
          >
            <div className="group relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-emerald-400"
              />

              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="search"
                placeholder="Search for products..."
                aria-label="Search products"
                className="w-full rounded-full border border-white/10 bg-white/[0.07] py-3 pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-400/60 focus:bg-white/10 focus:ring-4 focus:ring-emerald-400/10"
              />
            </div>
          </form>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/getCart"
                  aria-label={`Shopping cart, ${cartCount} items`}
                  className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-white"
                >
                  <ShoppingCart
                    size={19}
                    className="transition group-hover:text-emerald-400"
                  />
                  <span>Cart</span>

                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-[11px] font-bold text-slate-950">
                    {cartCount}
                  </span>
                </Link>

                <Link
                  to="/getProfile"
                  aria-label="My profile"
                  title="My profile"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-400"
                >
                  <UserRound size={20} />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/20"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            {isAuthenticated && (
              <Link
                to="/getCart"
                aria-label="Shopping cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <ShoppingCart size={20} />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-slate-950">
                  {cartCount}
                </span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] transition hover:bg-white/10"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-slate-950 px-4 pb-5 pt-4 md:hidden">
            <form onSubmit={onSubmitHandler} className="mb-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  type="search"
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.07] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-emerald-400"
                />
              </div>
            </form>

            {isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/getProfile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-white transition hover:bg-white/10"
                >
                  <UserRound size={18} />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-white/10 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-emerald-400 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Product filters */}
      {isProductsPage && (
        <div className="fixed left-0 top-[76px] z-40 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1600px] items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-10">
            <div className="mr-1 flex shrink-0 items-center gap-2 pr-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filters</span>
            </div>

            {filterItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition duration-200 sm:text-sm ${
                  activeFilter === item.label
                    ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
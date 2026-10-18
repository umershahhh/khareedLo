import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  CircleAlert,
  LoaderCircle,
} from "lucide-react";

function Login() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { email, password } = formData;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await login(email.trim(), password);

      if (result?.success) {
        navigate("/");
      } else {
        setError(result?.message || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to log in right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-2">
          {/* Left welcome panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-14">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                <ShoppingBag size={25} strokeWidth={2.2} />
              </div>

              <p className="mt-10 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Welcome back
              </p>

              <h1 className="mt-4 max-w-md text-4xl font-bold leading-tight xl:text-5xl">
                Your next great find is just a login away.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
                Sign in to explore products, manage your orders, and keep
                everything you love in one place.
              </p>
            </div>

            <div className="relative z-10 mt-16 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-400">
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Your account, all in one place
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Access your profile, track your purchases, and review your
                    order history.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login form */}
          <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 xl:py-14">
            <div className="w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-emerald-400">
                  <ShoppingBag size={25} />
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  Welcome back
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Sign in
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  Enter your details below to access your account.
                </p>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      onChange={onChangeHandler}
                      value={email}
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      onChange={onChangeHandler}
                      value={password}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700"
                  >
                    <CircleAlert size={19} className="mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:bg-emerald-600 hover:shadow-emerald-600/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to your account
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  New here?
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline"
                >
                  Create one
                </Link>
              </p>

              <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                By signing in, you can access your account and manage your
                shopping activity.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;
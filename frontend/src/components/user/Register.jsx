import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  CircleAlert,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../Navbar";

function Register() {
  const { register } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { name, email, password } = formData;

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
      const result = await register(name.trim(), email.trim(), password);

      if (result?.success) {
        navigate("/login");
      } else {
        setError(result?.message || "Unable to create your account. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-2">
        {/* Left welcome panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                <ShoppingBag size={25} strokeWidth={2.2} />
              </div>
              <span className="text-lg font-bold tracking-wide">Your Store</span>
            </Link>

            <p className="mt-12 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Join our community
            </p>

            <h1 className="mt-4 max-w-md text-4xl font-bold leading-tight xl:text-5xl">
              Good things start with a new account.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
              Create your account to discover products, manage your orders,
              and enjoy a more convenient shopping experience.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
                  <CheckCircle2 size={19} />
                </div>
                <p className="text-sm text-slate-200">
                  Keep your orders organized
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
                  <CheckCircle2 size={19} />
                </div>
                <p className="text-sm text-slate-200">
                  Access your personal profile
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
                  <CheckCircle2 size={19} />
                </div>
                <p className="text-sm text-slate-200">
                  Review your shopping history
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="flex items-start gap-4">
              <ShieldCheck size={24} className="shrink-0 text-emerald-400" />
              <div>
                <h3 className="font-semibold">A simpler shopping experience</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  One account to manage your shopping activity in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration form */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16 xl:py-14">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-emerald-400">
                  <ShoppingBag size={23} />
                </div>
                <span className="text-lg font-bold text-slate-900">
                  Your Store
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Get started today
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Create account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Fill in your details to create your account.
              </p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-5">
              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    onChange={onChangeHandler}
                    value={name}
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    minLength={2}
                    maxLength={80}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

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
                    placeholder="Create a password"
                    autoComplete="new-password"
                    minLength={8}
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

                <p className="mt-2 text-xs text-slate-400">
                  Use at least 8 characters.
                </p>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create your account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Already a member?
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              By creating an account, you agree to use the store in accordance
              with its terms and policies.
            </p>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}

export default Register;
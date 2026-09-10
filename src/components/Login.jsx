import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "../utils/api.js";
import { readApiResponse } from "../utils/response.js";
import { bookingReturnPath } from "../utils/bookingDraft.js";

export default function Login() {
  const [mode, setMode] = useState("otp"),
    [otpPurpose, setOtpPurpose] = useState("login"),
    [otpSent, setOtpSent] = useState(false),
    [fullName, setFullName] = useState(""),
    [email, setEmail] = useState(""),
    [mobile, setMobile] = useState(""),
    [password, setPassword] = useState(""),
    [otp, setOtp] = useState(""),
    [showPassword, setShowPassword] = useState(false),
    [message, setMessage] = useState(""),
    [loading, setLoading] = useState(false);
  const navigate = useNavigate(),
    location = useLocation();
  const finishLogin = (data) => {
    sessionStorage.setItem("chalakgo_user_token", data.token);
    localStorage.setItem("chalakgo_user_token", data.token);
    localStorage.setItem("chalakgo_user", JSON.stringify(data.user));
    toast.success("Welcome back to ChalakGo.");
    navigate(bookingReturnPath(location.state?.returnTo), { replace: true });
  };
  const sendOtp = async () => {
    setMessage("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setMessage("Enter a valid email address.");
    if (otpPurpose === "signup" && !fullName.trim())
      return setMessage("Enter your full name.");
    if (otpPurpose === "signup" && !/^[6-9][0-9]{9}$/.test(mobile))
      return setMessage("Enter a valid 10-digit mobile number.");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/otp/request`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          signup: otpPurpose === "signup",
          fullName,
          mobile,
        }),
      });
      await readApiResponse(response);
      setOtpSent(true);
      toast.success("OTP sent to your email.");
    } catch (error) {
      setMessage(error.message || "Could not send OTP.");
      toast.error(error.message || "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (mode === "otp" && !otpSent) return sendOtp();
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}${mode === "otp" ? "/api/users/otp/verify" : "/api/users/login"}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "otp" ? { email, otp } : { mobile, password },
          ),
        },
      );
      finishLogin(await readApiResponse(response));
    } catch (error) {
      setMessage(error.message || "Login failed.");
      toast.error(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };
  const switchMode = (next) => {
    setMode(next);
    setOtpSent(false);
    setOtp("");
    setMessage("");
  };
  const switchOtpPurpose = (next) => {
    setOtpPurpose(next);
    setOtpSent(false);
    setOtp("");
    setMessage("");
  };
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#dbeafe,_transparent_34rem),radial-gradient(circle_at_bottom_left,_#e0f2fe,_transparent_30rem),#f6f9ff] px-5 py-12 text-[#10213f] sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_28px_80px_rgba(25,54,96,.18)] lg:grid-cols-[.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-[#0a1b38] p-8 text-white sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[36px] border-blue-400/15" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500">
                <Sparkles size={21} />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                ChalakGo
              </span>
            </div>
            <p className="mt-20 text-sm font-bold uppercase tracking-[.2em] text-blue-300">
              Move with confidence
            </p>
            <h1 className="mt-4 max-w-sm text-4xl font-extrabold leading-tight sm:text-5xl">
              Your trusted driver is one login away.
            </h1>
            <p className="mt-5 max-w-sm leading-7 text-slate-300">
              Manage bookings, save your details, and get a smoother travel
              experience every time.
            </p>
            <div className="mt-10 grid gap-4 text-sm text-slate-200">
              <p className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-cyan-300" /> Verified
                professional drivers
              </p>
              <p className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-cyan-300" /> Secure
                password or email OTP login
              </p>
              <p className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-cyan-300" /> Quick,
                simple booking
              </p>
            </div>
          </div>
        </section>
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-7 sm:p-12"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
            <LockKeyhole size={17} /> CUSTOMER ACCESS
          </div>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            {mode === "otp" && otpPurpose === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {mode === "otp" && otpPurpose === "signup"
              ? "Verify your email with a one-time password to create your ChalakGo account."
              : "Sign in with email OTP or mobile number and password."}
          </p>
          <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => switchMode("password")}
              className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold ${mode === "password" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
            >
              <LockKeyhole size={16} /> Password
            </button>
            <button
              type="button"
              onClick={() => switchMode("otp")}
              className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold ${mode === "otp" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
            >
              <KeyRound size={16} /> Email OTP
            </button>
          </div>
          <div className="mt-7 grid gap-5">
            {mode === "otp" ? (
              <>
                {!otpSent && (
                  <div className="grid grid-cols-2 rounded-xl border border-slate-200 p-1 text-sm font-bold">
                    <button type="button" onClick={() => switchOtpPurpose("login")} className={`rounded-lg py-2 ${otpPurpose === "login" ? "bg-blue-600 text-white" : "text-slate-500"}`}>Login with OTP</button>
                    <button type="button" onClick={() => switchOtpPurpose("signup")} className={`rounded-lg py-2 ${otpPurpose === "signup" ? "bg-blue-600 text-white" : "text-slate-500"}`}>New user signup</button>
                  </div>
                )}
                {otpPurpose === "signup" && !otpSent && (
                  <>
                    <label className="text-sm font-bold">Full name
                      <input className="input" placeholder="Your full name" value={fullName} onChange={(event) => setFullName(event.target.value)} required autoComplete="name" />
                    </label>
                    <label className="text-sm font-bold">Mobile number
                      <input className="input" placeholder="10-digit mobile number" value={mobile} onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))} required inputMode="numeric" autoComplete="tel" />
                    </label>
                  </>
                )}
                <label className="text-sm font-bold">
                  {otpPurpose === "signup" ? "Email address" : "Registered email address"}
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                  />
                </label>
                {otpSent && (
                  <label className="text-sm font-bold">
                    6-digit OTP
                    <input
                      className="input tracking-[.35em]"
                      inputMode="numeric"
                      maxLength="6"
                      placeholder="000000"
                      value={otp}
                      onChange={(event) =>
                        setOtp(
                          event.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      required
                      autoComplete="one-time-code"
                    />
                  </label>
                )}
              </>
            ) : (
              <>
                <label className="text-sm font-bold">
                  Mobile number
                  <input
                    className="input"
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(event) =>
                      setMobile(
                        event.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    required
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                </label>
                <label className="text-sm font-bold">
                  Password
                  <div className="relative">
                    <input
                      className="input pr-12"
                      placeholder="Your password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength="8"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
              </>
            )}
          </div>
          {message && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {message}
            </p>
          )}
          {mode === "otp" && !otpSent ? (
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : otpPurpose === "signup" ? "Create account & send OTP" : "Send OTP to email"}
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "otp"
                  ? "Verify OTP & login"
                  : "Login securely"}
              {!loading && <ArrowRight size={18} />}
            </button>
          )}
          {mode === "otp" && otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="mt-3 w-full text-sm font-bold text-blue-600"
            >
              Resend OTP
            </button>
          )}
          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} /> Secure cookie and token session
          </p>
        </motion.form>
      </div>
    </main>
  );
}

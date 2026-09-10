import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, LockKeyhole, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "../utils/api.js";
import { readApiResponse } from "../utils/response.js";
import { bookingReturnPath } from "../utils/bookingDraft.js";

export default function Login() {
  const [mode, setMode] = useState("login"), [step, setStep] = useState("details");
  const [mobile, setMobile] = useState(""), [username, setUsername] = useState(""), [email, setEmail] = useState(""), [otp, setOtp] = useState("");
  const [message, setMessage] = useState(""), [loading, setLoading] = useState(false);
  const navigate = useNavigate(), location = useLocation();
  const finishLogin = (data) => {
    sessionStorage.setItem("chalakgo_user_token", data.token); localStorage.setItem("chalakgo_user_token", data.token);
    localStorage.setItem("chalakgo_user", JSON.stringify(data.user));
    toast.success(mode === "signup" ? "Account verified. Welcome to ChalakGo." : "Welcome back to ChalakGo.");
    navigate(bookingReturnPath(location.state?.returnTo), { replace: true });
  };
  const requestOtp = async (event) => {
    event?.preventDefault(); setMessage(""); setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/otp/request`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mode === "signup" ? { signup: true, mobile, username, email } : { email }) });
      const data = await readApiResponse(response); setStep("otp"); toast.success(data.message || "OTP sent to your email.");
    } catch (error) { setMessage(error.message || "Unable to send OTP."); toast.error(error.message || "Unable to send OTP."); } finally { setLoading(false); }
  };
  const verifyOtp = async (event) => {
    event.preventDefault(); setMessage(""); setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/otp/verify`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp, signup: mode === "signup" }) });
      finishLogin(await readApiResponse(response));
    } catch (error) { setMessage(error.message || "Unable to verify OTP."); toast.error(error.message || "Unable to verify OTP."); } finally { setLoading(false); }
  };
  const switchMode = (next) => { setMode(next); setStep("details"); setMessage(""); setOtp(""); };
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#dbeafe,_transparent_34rem),radial-gradient(circle_at_bottom_left,_#e0f2fe,_transparent_30rem),#f6f9ff] px-5 py-12 text-[#10213f] sm:py-20">
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_28px_80px_rgba(25,54,96,.18)] lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative overflow-hidden bg-[#0a1b38] p-8 text-white sm:p-12"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[36px] border-blue-400/15" /><div className="relative"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500"><Sparkles size={21} /></div><span className="text-lg font-extrabold">ChalakGo</span></div><p className="mt-20 text-sm font-bold uppercase tracking-[.2em] text-blue-300">Move with confidence</p><h1 className="mt-4 max-w-sm text-4xl font-extrabold leading-tight sm:text-5xl">Your trusted driver is one login away.</h1><p className="mt-5 max-w-sm leading-7 text-slate-300">A quick email OTP keeps your account secure, without remembering a password.</p><div className="mt-10 grid gap-4 text-sm text-slate-200"><p className="flex gap-3"><CheckCircle2 size={18} className="text-cyan-300" /> Verified professional drivers</p><p className="flex gap-3"><CheckCircle2 size={18} className="text-cyan-300" /> Secure email OTP verification</p><p className="flex gap-3"><CheckCircle2 size={18} className="text-cyan-300" /> Quick, simple booking</p></div></div></section>
      <div className="p-7 sm:p-12"><div className="flex items-center gap-2 text-sm font-bold text-blue-600"><LockKeyhole size={17} /> CUSTOMER ACCESS</div><h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">{step === "otp" ? "Verify your email" : mode === "signup" ? "Create your account" : "Welcome back"}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{step === "otp" ? `We sent a 6-digit OTP to ${email}.` : mode === "signup" ? "Enter your details and we will send an OTP to verify your email." : "Enter your email and we will send you a secure OTP."}</p><div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => switchMode("login")} className={`rounded-lg py-3 text-sm font-bold ${mode === "login" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Login</button><button type="button" onClick={() => switchMode("signup")} className={`rounded-lg py-3 text-sm font-bold ${mode === "signup" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>Sign up</button></div>
        {step === "details" ? <form onSubmit={requestOtp} className="mt-7 grid gap-5">{mode === "signup" && <><label className="text-sm font-bold">Mobile number<input className="input" placeholder="10-digit mobile number" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} required inputMode="numeric" /></label><label className="text-sm font-bold">Username<input className="input" placeholder="e.g. chalakgo_user" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30))} required minLength="3" /></label></>}<label className="text-sm font-bold">Email address<input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>{message && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{message}</p>}<button disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 disabled:opacity-60">{loading ? "Sending OTP..." : "Send OTP"}<ArrowRight size={18} /></button></form> : <form onSubmit={verifyOtp} className="mt-7 grid gap-5"><label className="text-sm font-bold">6-digit OTP<input className="input text-center text-xl tracking-[.45em]" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} required inputMode="numeric" autoFocus /></label>{message && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{message}</p>}<button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 disabled:opacity-60">{loading ? "Verifying..." : "Verify & login"}<MailCheck size={18} /></button><button type="button" disabled={loading} onClick={requestOtp} className="text-sm font-bold text-blue-600 disabled:opacity-60">Resend OTP</button><button type="button" onClick={() => { setStep("details"); setMessage(""); }} className="text-sm text-slate-500">Change details</button></form>}<p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck size={15} /> Secure OTP verification</p></div>
    </div>
  </main>;
}

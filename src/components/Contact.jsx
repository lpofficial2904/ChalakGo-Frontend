import { useLiveEffect } from "./LiveSite";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "../utils/api.js";

const fallback = {
  phone: "+91 97845 10845",
  email: "support@chalakgo.in",
  address: "Virasat Homes, Narayan Vihar, Jaipur, Rajasthan, India",
};
const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

export default function Contact() {
  const [settings, setSettings] = useState(fallback);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  useLiveEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (x) => x && setSettings((value) => ({ ...fallback, ...value, ...x })),
      )
      .catch(() => {});
  }, []);
  const update = (event) =>
    setForm((value) => ({
      ...value,
      [event.target.name]:
        event.target.name === "phone"
          ? event.target.value.replace(/\D/g, "").slice(0, 10)
          : event.target.value,
    }));
  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    try {
      const response = await fetch(`${API_BASE}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.message);
      setForm({ name: "", phone: "", email: "", message: "" });
      if (data.emailSent) {
        toast.success("Message sent successfully.", {
          description: "Our team will contact you shortly.",
        });
      } else {
        toast.warning("Message saved, but email notification is unavailable.", {
          description:
            "Our team can still view your message in the admin panel.",
        });
      }
    } catch (error) {
      toast.error("Message could not be sent.", {
        description: error.message || "Please try again in a moment.",
      });
    } finally {
      setSending(false);
    }
  };
  const details = [
    [
      Phone,
      "Call us",
      settings.phone,
      `tel:${(settings.phone || "").replace(/\s/g, "")}`,
    ],
    [Mail, "Email us", settings.email, `mailto:${settings.email}`],
    [MapPin, "Visit us", settings.address],
    [Clock3, "Always available", "24/7 booking assistance"],
  ];
  const mapQuery = encodeURIComponent("Mansarovar, Jaipur, Rajasthan, India");

  return (
    <main className="overflow-hidden bg-[#f6f9ff] text-[#10213f]">
      <section className="relative isolate overflow-hidden bg-[#081a38] px-5 py-20 text-white sm:py-28">
        <div
          aria-hidden="true"
          className="absolute -left-28 top-0 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 right-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-white/10 px-4 py-2 text-xs font-extrabold tracking-[.14em] text-blue-100">
            <ShieldCheck size={15} className="text-cyan-300" /> CHALAKGO SUPPORT
          </p>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Let&rsquo;s plan your{" "}
            <span className="text-blue-300">next journey.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Whether you need a driver today or a long-term plan, our team is
            ready to help you choose with confidence.
          </p>
        </motion.div>
      </section>
      <section className="relative mx-auto max-w-[1180px] px-5 pb-20 sm:pb-28">
        <div className="grid gap-6 lg:grid-cols-[.84fr_1.16fr]">
          <motion.aside
            {...reveal}
            className="-mt-10 rounded-3xl bg-[#102651] p-7 text-white shadow-2xl shadow-blue-950/20 sm:p-9"
          >
            <p className="text-xs font-extrabold tracking-[.14em] text-blue-200">
              WAYS TO REACH US
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">
              Talk to a ChalakGo specialist.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              Tell us about your route, timing and service needs. We&rsquo;ll
              guide you to the right option.
            </p>
            <div className="mt-8 space-y-5">
              {details.map(([Icon, title, text, href]) => {
                const content = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-400/15 text-cyan-300">
                      <Icon size={20} />
                    </span>
                    <span>
                      <b className="block text-sm text-white">{title}</b>
                      <span className="mt-1 block text-sm leading-5 text-blue-100">
                        {text}
                      </span>
                    </span>
                  </>
                );
                return href ? (
                  <a
                    key={title}
                    href={href}
                    className="flex items-start gap-3 transition hover:translate-x-1"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={title} className="flex items-start gap-3">
                    {content}
                  </div>
                );
              })}
            </div>
            <div className="mt-9 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-blue-100">
              Your details are used only to respond to your request.
            </div>
          </motion.aside>
          <motion.form
            {...reveal}
            transition={{ delay: 0.1 }}
            onSubmit={submit}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_16px_45px_rgba(25,54,96,.10)] sm:p-10"
          >
            <p className="text-xs font-extrabold tracking-[.14em] text-blue-600">
              SEND A MESSAGE
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">How can we help?</h2>
            <p className="mt-2 text-slate-500">
              We usually respond quickly during working hours.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-extrabold">
                Your name
                <input
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Enter your name"
                  required
                />
              </label>
              <label className="text-sm font-extrabold">
                Mobile number
                <input
                  className="input"
                  name="phone"
                  value={form.phone}
                  onChange={update}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength="10"
                  required
                />
              </label>
              <label className="text-sm font-extrabold sm:col-span-2">
                Email address
                <input
                  className="input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="text-sm font-extrabold sm:col-span-2">
                Your message
                <textarea
                  className="input min-h-32 py-3"
                  name="message"
                  value={form.message}
                  onChange={update}
                  placeholder="Tell us about your trip or driver requirement"
                  required
                />
              </label>
            </div>
            <button
              disabled={sending}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {sending ? "Sending your message…" : "Send message"}{" "}
              <Send size={18} />
            </button>
          </motion.form>
        </div>
        <motion.section
          {...reveal}
          className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_45px_rgba(25,54,96,.10)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-7 py-6 sm:px-9">
            <div>
              <p className="text-xs font-extrabold tracking-[.14em] text-blue-600">
                FIND US
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#10213f]">
                Find us in Mansarovar, Jaipur
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Mansarovar, Jaipur, Rajasthan, India
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700"
            >
              Open in Google Maps <MapPin size={17} />
            </a>
          </div>
          <iframe
            title="Mansarovar Jaipur map"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-72 w-full border-0 sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.section>
        <motion.div
          {...reveal}
          className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl border border-blue-100 bg-blue-50 px-7 py-6 text-center sm:flex-row sm:text-left"
        >
          <div>
            <p className="font-extrabold text-[#10213f]">
              Ready to book instead?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Browse services and send a booking request in a few simple steps.
            </p>
          </div>
          <a
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#102651] px-5 py-3 text-sm font-extrabold text-white"
          >
            View services <ArrowRight size={17} />
          </a>
        </motion.div>
      </section>
    </main>
  );
}

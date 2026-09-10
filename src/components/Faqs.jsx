import { useState } from "react";
import { motion } from "framer-motion";

const faqs = [
  [
    "How are driver backgrounds checked?",
    "We use identity verification, driving-record checks, references, and local background checks before a driver joins ChalakGo.",
  ],
  [
    "What insurance coverage applies to own-car services?",
    "Each trip includes service support and applicable coverage. Exact cover depends on service type and city.",
  ],
  [
    "How do I secure a permanent chauffeur?",
    "Choose Permanent Driver, complete the request form, and our team will contact you to tailor a monthly plan.",
  ],
];
export default function Faqs() {
  const [open, setOpen] = useState(0);
  return (
    <main className="min-h-screen bg-white text-[#101a31]">
      <section className="border-b bg-blue-600 py-12 text-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 text-center sm:grid-cols-4">
          {[
            ["50,000+", "TRIPS COMPLETED"],
            ["4.92 / 5", "AVERAGE RATING"],
            ["1,200+", "VERIFIED DRIVERS"],
            ["24 / 7", "PRIORITY SUPPORT"],
          ].map(([number, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold">{number}</p>
              <p className="mt-1 text-xs text-blue-200">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm font-bold text-blue-600">FAQ</p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-5 text-lg text-slate-500">
            Everything you need to know about safety, payments, and driver
            service.
          </p>
        </motion.div>
        <div className="mt-14 space-y-4">
          {faqs.map(([question, answer], i) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              key={question}
              className="rounded-2xl border border-slate-200 bg-slate-50"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between p-6 text-left font-extrabold"
              >
                {question}
                <span className="text-xl text-blue-600">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <p className="px-6 pb-6 leading-6 text-slate-500">{answer}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

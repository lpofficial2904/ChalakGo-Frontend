import { motion } from "framer-motion";

const vehicles = [
  [
    "Elite Eco Sedan",
    "Tesla Model S Plaid",
    "4 Passengers",
    "2 Bags",
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "Presidential Class",
    "Mercedes Benz S-Class",
    "4 Passengers",
    "3 Bags",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "Bespoke SUV Cruiser",
    "Cadillac Escalade ESV",
    "6 Passengers",
    "6 Bags",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=85",
  ],
];
const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
};

export default function Fleet() {
  return (
    <main className="min-h-screen bg-[#090f20] text-white">
      <section className="mx-auto max-w-[1280px] px-6 py-20 sm:py-28">
        <motion.div {...reveal} className="text-center">
          <p className="text-sm font-bold text-blue-500">OUR VEHICLES</p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-6xl">
            The Elite Fleet
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-slate-400">
            Flagship vehicles configured with priority comfort, pristine
            sanitization, and complimentary services.
          </p>
        </motion.div>
        <div className="mt-16 grid gap-7 lg:grid-cols-3">
          {vehicles.map(([tag, name, seats, bags, image], i) => (
            <motion.article
              {...reveal}
              transition={{ delay: i * 0.12 }}
              key={name}
              className="overflow-hidden rounded-2xl border border-slate-700 bg-[#131d31]"
            >
              <img
                src={image}
                alt={name}
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <p className="text-xs font-bold uppercase text-blue-500">
                  {tag}
                </p>
                <h2 className="mt-3 text-2xl font-extrabold">{name}</h2>
                <p className="mt-4 text-sm text-slate-400">
                  ♙ {seats}&nbsp;&nbsp;&nbsp; ▣ {bags}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}

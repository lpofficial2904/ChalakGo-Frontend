import { CalendarDays, CarFront, Clock3, UsersRound } from "lucide-react";
import { calculateDistanceFare } from "../utils/fare.js";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function FareRow({ icon: Icon = Clock3, title, subtitle, amount, note, dark }) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`flex items-center gap-1.5 text-sm font-bold ${dark ? "text-white" : "text-[#10213f]"}`}
          >
            <Icon size={13} aria-hidden="true" /> {title}
          </p>
          {subtitle && (
            <p
              className={`mt-1 text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}
            >
              {subtitle}
            </p>
          )}
        </div>
        <p
          className={`shrink-0 text-right text-lg font-extrabold tabular-nums ${dark ? "text-cyan-200" : "text-blue-700"}`}
        >
          {amount}
        </p>
      </div>
      {note && (
        <p
          className={`mt-2 text-xs ${dark ? "text-slate-300" : "text-slate-600"}`}
        >
          {note}
        </p>
      )}
    </div>
  );
}

export default function CabPricing({ service, dark = false }) {
  const panel = dark
    ? "border-white/15 bg-white/5"
    : "border-blue-100 bg-blue-50/50";
  const divider = dark
    ? "divide-white/10 border-white/10"
    : "divide-blue-100 border-blue-100";
  const distanceBased =
    service.pricingType === "distance" || service.slug === "car-driver";
  const monthlyBased =
    service.pricingType === "monthly" || service.slug === "permanent-driver";
  const tourBased =
    service.pricingType === "fixed" && service.tourPlans?.length;
  const heading = distanceBased
    ? "Choose your ride"
    : monthlyBased
      ? "Choose your plan"
      : tourBased
        ? "Choose your tour"
        : "Service price";
  const HeadingIcon = distanceBased
    ? CarFront
    : tourBased
      ? CalendarDays
      : Clock3;
  const vehicles = [
    ["Hatchback", "5 seater", "Hatchback"],
    ["SUV", "5 / 7 seater", "SUV"],
    ["Haravan Traveller", "Group travel", "Haravan Traveller"],
  ];

  return (
    <section
      aria-label={`${service.name} pricing`}
      className={`mt-7 overflow-hidden rounded-2xl border ${panel}`}
    >
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 ${divider} ${dark ? "text-blue-200" : "text-blue-700"}`}
      >
        <HeadingIcon size={16} aria-hidden="true" />
        <h3 className="text-xs font-bold uppercase tracking-widest">
          {heading}
        </h3>
      </div>
      <div className={`divide-y ${divider}`}>
        {distanceBased &&
          vehicles.map(([name, seats, carType]) => {
            const fare = calculateDistanceFare({
              carType,
              distanceKm: 250,
              vehicleRates: service.vehicleRates,
            });
            return (
              <FareRow
                key={name}
                icon={UsersRound}
                title={name}
                subtitle={seats}
                amount={
                  fare.baseFare
                    ? money(fare.baseFare)
                    : `${money(fare.ratePerKm)} / km`
                }
                note={
                  fare.baseFare ? (
                    <>
                      Flat fare · up to {fare.includedKm} km{" "}
                      <span
                        className={`ml-2 font-bold ${dark ? "text-cyan-300" : "text-blue-700"}`}
                      >
                        Then {money(fare.ratePerKm)} / extra km
                      </span>
                    </>
                  ) : undefined
                }
                dark={dark}
              />
            );
          })}
        {monthlyBased &&
          [
            ["6–8 hours / day", service.monthlyRates?.sixToEight],
            ["8–10 hours / day", service.monthlyRates?.eightToTen],
            ["10–12 hours / day", service.monthlyRates?.tenToTwelve],
          ]
            .filter(([, rate]) => Number(rate) > 0)
            .map(([plan, rate]) => (
              <FareRow
                key={plan}
                title={plan}
                subtitle="Dedicated monthly driver"
                amount={`${money(rate)} / month`}
                dark={dark}
              />
            ))}
        {tourBased &&
          service.tourPlans.map((plan) => (
            <FareRow
              key={plan.days}
              icon={CalendarDays}
              title={`${plan.days}-day Jaipur Tour`}
              subtitle={
                plan.places?.length
                  ? `${plan.places.length} places included`
                  : "Private sightseeing plan"
              }
              amount={plan.price}
              dark={dark}
            />
          ))}
        {!distanceBased && !monthlyBased && !tourBased && (
          <FareRow
            title={service.price || "Contact us for pricing"}
            amount=""
            dark={dark}
          />
        )}
      </div>
    </section>
  );
}

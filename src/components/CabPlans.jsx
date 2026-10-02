import { calculateDistanceFare } from "../utils/fare.js";
import { useState } from "react";
import { contentOf } from "../shared/serviceContent.js";

const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;
const defaultVehicles = [
  { key: "hatchback", name: "Hatchback", value: "Hatchback (5 seater)", seats: "5 seater", description: "Comfortable city rides and everyday trips." },
  { key: "suv", name: "SUV", value: "SUV (5 seater)", seats: "5 / 7 seater", description: "Spacious travel for families and longer journeys." },
  { key: "traveller", name: "Haravan Traveller", value: "Haravan Traveller", seats: "Group travel", description: "Travel together on group outings and tours." },
];

export default function CabPlans({ service, selected, onSelect }) {
  const [collapsed, setCollapsed] = useState(false);
  const content = contentOf(service);
  const vehicles = service.cabPlans?.length ? service.cabPlans.map((plan) => ({
    ...plan, value: plan.carType,
  })) : defaultVehicles;
  return (
    <section className="mt-10" aria-label="Cab pricing plans">
      <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-extrabold">{content.cabPlansTitle}</h2>{collapsed && <button type="button" onClick={() => setCollapsed(false)} className="text-sm font-bold text-blue-700">{content.cabChangePlanLabel}</button>}</div>
      <p className="mt-2 text-sm text-slate-600">{content.cabPlansDescription}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {vehicles.map((vehicle) => {
          const active = vehicle.key === "suv" ? selected === vehicle.value || selected?.startsWith("SUV") : selected === vehicle.value;
          const fare = calculateDistanceFare({ carType: vehicle.value, distanceKm: Number(vehicle.includedKm) || 1, vehicleRates: service.vehicleRates, cabPlans: service.cabPlans });
          return (
            <article key={vehicle.name} className={`${active || !collapsed ? "flex" : "hidden sm:flex"} flex-col rounded-2xl border p-5 shadow-sm ${active ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600" : "border-slate-200 bg-white"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-blue-600">
                <h3 className="rounded-full bg-blue-100 px-2 py-1">{vehicle.name}</h3>
                {active && <span>{content.cabSelectedLabel} ✓</span>}
              </div>
              <p className="mt-4"><strong className="text-2xl font-extrabold">{money(fare.baseFare || fare.ratePerKm)}</strong><span className="text-xs text-slate-500"> / {fare.baseFare ? `${content.cabUpToLabel} ${fare.includedKm} ${content.cabKmLabel}` : content.cabKmLabel}</span></p>
              <p className="mt-2 text-sm font-semibold">{vehicle.seats}</p>
              <p className="mb-5 mt-2 text-sm text-slate-600">{vehicle.description}</p>
              <div className="mt-auto border-t border-slate-100 pt-3">
                <p className="mb-3 text-xs text-slate-500">{fare.baseFare ? `${content.cabThenLabel} ${money(fare.ratePerKm)} / ${content.cabExtraKmLabel}` : `${money(fare.ratePerKm)} / ${content.cabKmLabel} · ${content.cabDistanceChargeNote}`}</p>
                <button type="button" aria-label={`Select ${vehicle.name}`} aria-pressed={Boolean(active)} onClick={() => { onSelect(active ? selected : vehicle.value); setCollapsed(true); }} className={`w-full rounded-lg px-2 py-2 text-sm font-semibold ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800 hover:bg-blue-100"}`}>{active ? `${content.cabSelectedLabel} ✓` : `${content.cabSelectPlanLabel} →`}</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export const fareMoney = value => `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function ServiceFareEstimate({ kind, selected, fare, preview, duration, days, error }) {
  const value = fare || preview;
  const rows = [];
  let note = "";
  if (kind === "distance") {
    rows.push(["Base Package Fare:", value?.baseFare ? `${fareMoney(value.baseFare)} (up to ${value.includedKm} km included)` : "Distance-based fare"]);
    rows.push(["Trip Distance:", fare ? `${fare.distanceKm} km` : "Enter trip distance"]);
    rows.push([value?.baseFare ? `Additional Distance (@ ${fareMoney(value.ratePerKm)}/km):` : `Distance Charge (@ ${fareMoney(value?.ratePerKm || 0)}/km):`, fare ? `${fare.additionalKm} km · ${fareMoney(fare.additionalFare)}${fare.additionalKm === 0 ? " (Within package)" : ""}` : "—"]);
    note = "The estimate updates with your selected vehicle and distance. Tolls, parking and other applicable charges are extra.";
  } else if (kind === "monthly") {
    rows.push(["Daily Working Hours:", duration]);
    rows.push(["Monthly Package Fare:", fare ? `${fareMoney(fare.monthlyRate)}/month` : "—"]);
    rows.push(["Billing Period:", "1 month"]);
    note = "Monthly estimate for the selected daily shift. The selected trip dates do not multiply the monthly package price.";
  } else if (kind === "fixed") {
    rows.push(["Base Package Fare:", fare ? fareMoney(fare.totalFare) : "—"]);
    rows.push(["Trip Duration:", `${days} day${days === 1 ? "" : "s"} tour`]);
    rows.push(["Package Charges:", "Fixed price for the selected tour"]);
    note = "The estimate updates when you select a different tour plan.";
  } else {
    rows.push(["Base Package Fare:", fare ? `${fareMoney(fare.baseFare)} (${fare.baseHours} hours included)` : "—"]);
    rows.push(["Trip Duration:", fare?.duration || "Select start and end date/time"]);
    rows.push(["Additional Hours:", fare ? `${Number(fare.additionalHours.toFixed(2))} hrs @ ${fareMoney(fare.additionalHourlyRate)}/hr = ${fareMoney(fare.additionalFare)}` : "—"]);
    if (fare?.discount) rows.push(["Discount:", `−${fareMoney(fare.discount)}`]);
  }
  const total = fare?.totalFare ?? (preview?.baseFare > 0 ? preview.baseFare : null);
  return <section aria-live="polite" className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 text-sm text-[#10213f] sm:col-span-2">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-base font-extrabold">{kind === "monthly" ? "Monthly Fare Estimate" : "Fare Estimate"}</h3><span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">Plan: {selected}</span></div>
    <dl className="mt-4">
      <div className="mb-2 flex flex-wrap justify-between gap-2 border-b border-blue-100 pb-3"><dt>Selected Package:</dt><dd className="font-bold">{selected}</dd></div>
      {rows.map(([label, amount]) => <div key={label} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-1"><dt>{label}</dt><dd className="font-medium sm:text-right">{amount}</dd></div>)}
    </dl>
    {error && <p className="mt-2 text-red-700">{error}</p>}
    <div className="mt-3 flex justify-between gap-4 border-t border-blue-200 pt-4 text-base font-extrabold"><span>TOTAL ESTIMATE</span><span className="text-xl text-blue-600">{total == null || error ? "—" : `${fareMoney(total)}${kind === "monthly" ? "/month" : ""}`}</span></div>
    {!fare && preview && <p className="mt-2 text-xs text-slate-500">Base estimate. Enter trip distance to calculate the total.</p>}
    {note && <p className="mt-3 text-xs text-slate-500">{note}</p>}
  </section>;
}

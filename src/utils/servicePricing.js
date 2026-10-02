import { driverPricing } from "../shared/driverPricing.js";

const money = (value) => Number(value).toLocaleString("en-IN");

function configuredRates(rates) {
  return Object.values(rates || {})
    .map(Number)
    .filter((rate) => Number.isFinite(rate) && rate > 0);
}

export function servicePriceLabel(service) {
  if (service.slug === "driver-only") {
    const plans = driverPricing(service.driverPricing).plans;
    return `Plans from ₹${money(Math.min(...plans.map((plan) => plan.price)))}`;
  }

  if (service.pricingType === "distance" || service.slug === "car-driver") {
    const rates = configuredRates(service.vehicleRates);
    return rates.length
      ? `Cab fares from ₹${money(Math.min(...rates))}/km`
      : service.price || "Cab fares available";
  }

  if (service.pricingType === "monthly" || service.slug === "permanent-driver") {
    const rates = configuredRates(service.monthlyRates);
    return rates.length
      ? `Plans from ₹${money(Math.min(...rates))}/month`
      : service.price || "Monthly plans";
  }

  if (service.pricingType === "fixed" && service.tourPlans?.length) {
    const plans = service.tourPlans
      .map((plan) => ({ price: plan.price, amount: Number(String(plan.price || "").replace(/[^0-9.]/g, "")) }))
      .filter((plan) => Number.isFinite(plan.amount) && plan.amount > 0)
      .sort((a, b) => a.amount - b.amount);
    return plans.length
      ? `Plans from ${plans[0].price}`
      : service.price || "Tour pricing available";
  }

  return service.price || "Flexible pricing";
}

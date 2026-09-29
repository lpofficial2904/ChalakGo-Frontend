import { createContext, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import logo from "../assets/Chalakgo logo.png";

const Context = createContext(null);

export const serviceSeoPages = {
  "/chauffeur-service-jaipur": {
    slug: "car-driver",
    title: "Chauffeur Service in Jaipur | Premium Car with Driver | ChalakGo",
    description: "Book professional chauffeur service in Jaipur with premium cars and experienced drivers. Ideal for airport transfers, business travel, sightseeing and private journeys with ChalakGo.",
    h1: "Premium Car with Professional Chauffeur in Jaipur",
    supportingHeading: "Your Car, Our Expert Driver",
    serviceName: "Chauffeur Service in Jaipur",
    serviceType: "Private chauffeur and premium car with driver",
    intro: "Arrange a private car with a professional driver for business travel, airport transfers, sightseeing and local journeys in Jaipur. ChalakGo's car-and-driver booking lets you request a vehicle and driver together.",
    sections: [
      ["A private chauffeur for your Jaipur journey", "Choose the car-and-driver service when you want to travel in a private vehicle without driving yourself. The existing service offers vehicle choices including executive sedan and SUV options; confirm the available vehicle and journey details while booking."],
      ["Airport transfers, business travel and sightseeing", "Request a chauffeur-driven car for an airport transfer, a work journey or a sightseeing day. Share your pickup details and timing in the booking form so the team can follow up about your request."],
      ["How to request a chauffeur", "Select this service, choose the available vehicle and enter your journey and pickup details. Review the estimate shown for your selection, sign in if prompted, and submit the booking request for follow-up."],
    ],
    faqs: [
      ["What is a chauffeur service in Jaipur?", "It is a private car booking that includes a professional driver for your requested journey."],
      ["Can I request a car with a professional driver?", "Yes. Choose the car-and-driver service and submit your vehicle, pickup and journey details."],
      ["Can I request an airport transfer or sightseeing journey?", "Airport transfers and sightseeing are listed uses for the car-and-driver service. Add your itinerary to the request so the team can confirm availability."],
    ],
    related: ["/cab-car-driver-jaipur", "/driver-on-demand-jaipur", "/jaipur-tour-by-car"],
  },
  "/cab-car-driver-jaipur": {
    slug: "car-driver",
    title: "Cab Service in Jaipur | Car Rental with Driver | ChalakGo",
    description: "Book a reliable cab and car-with-driver service in Jaipur with ChalakGo. Convenient local travel, sightseeing and airport transfers for your planned journey.",
    h1: "Cab Service in Jaipur — Car + Professional Driver",
    supportingHeading: "Car + Driver Service",
    serviceName: "Cab Service in Jaipur",
    serviceType: "Private cab and car rental with driver",
    intro: "Book a car and professional driver together for a private Jaipur journey. Share your pickup, destination and travel details to request local travel, airport transfers or sightseeing in one booking.",
    sections: [
      ["Local Jaipur cab service", "Request a private cab for your planned local journey. Vehicle choices and distance-based estimates are presented in the existing booking flow; confirm the final journey details with the team."],
      ["Airport transfers and sightseeing", "The car-and-driver service lists airport transfers and sightseeing among its uses. Add flight or itinerary details to your request so the team can review timing and availability."],
      ["How cab booking works", "Open the booking form, select a vehicle, add pickup and journey details, then review the available estimate and submit your request. The team follows up about the booking."],
    ],
    faqs: [
      ["Can I book a cab with a driver in Jaipur?", "Yes. Select Cab (Car + Driver), choose an available vehicle and submit your pickup and journey details."],
      ["Can I use the cab for Jaipur sightseeing?", "Sightseeing is listed as a use for the service. Share your places and timing in the request to confirm availability."],
      ["How do I request an airport cab?", "Choose the car-and-driver service and include your airport pickup or drop-off details in the booking form."],
    ],
    related: ["/chauffeur-service-jaipur", "/driver-on-demand-jaipur", "/jaipur-tour-by-car"],
  },
  "/driver-on-demand-jaipur": {
    slug: "driver-only",
    title: "Driver Service in Jaipur | Hire Professional Driver | ChalakGo",
    description: "Hire a professional driver in Jaipur for your own car. ChalakGo offers convenient driver-on-demand, temporary and full-day driver services based on availability.",
    h1: "Your Car, Our Expert Driver",
    supportingHeading: "Professional Driver-on-Demand Service in Jaipur",
    serviceName: "Driver Service in Jaipur",
    serviceType: "On-demand driver for the customer's own car",
    intro: "Need a driver for your own car? Request ChalakGo's driver-only service for local journeys. Select an available hourly or daily plan and provide pickup and schedule details for the team to review.",
    sections: [
      ["A driver for your own car", "With driver-only booking, you provide the vehicle and request a professional driver to drive it. The service lists hourly, daily and weekly options; current availability and plan details appear in the booking flow."],
      ["Temporary and full-day driver requests", "Choose a plan that fits the duration you need, then enter your pickup location, date and timing. Longer or outstation requests should be confirmed with the team before travel."],
      ["How to book a driver", "Select Driver Only, choose an available plan, enter your pickup and schedule details, then submit the request. Sign in if prompted to complete the booking request."],
    ],
    faqs: [
      ["Can I hire a driver for my own car?", "Yes. Driver Only is the service for requesting a driver to drive your own vehicle."],
      ["Can I request a temporary or full-day driver?", "The service lists hourly and daily plans. Choose an available duration in the booking flow."],
      ["How does driver booking work?", "Select a plan, add your pickup and schedule details, and submit a booking request for follow-up."],
    ],
    related: ["/permanent-driver-jaipur", "/chauffeur-service-jaipur", "/cab-car-driver-jaipur"],
  },
  "/jaipur-tour-by-car": {
    slug: "jaipur-tour",
    title: "Jaipur Sightseeing Tour by Car | Private Jaipur Tour | ChalakGo",
    description: "Explore Jaipur with a private car and professional driver. Visit Jaipur's major attractions with a convenient sightseeing tour by car from ChalakGo.",
    h1: "Private Jaipur Sightseeing Tour by Car",
    supportingHeading: "Explore the Pink City with a Private Car and Driver",
    serviceName: "Jaipur Sightseeing Tour by Car",
    serviceType: "Private Jaipur sightseeing tour with car and driver",
    intro: "Explore Jaipur with a private car and professional driver. ChalakGo currently lists one-day and two-day sightseeing plans, with places and details shown for each selected plan.",
    sections: [
      ["One-day Jaipur sightseeing by car", "The listed one-day itinerary includes Amber Fort, Jal Mahal, Hawa Mahal, City Palace and Jantar Mantar. Select the plan to review its details and submit a booking request."],
      ["Two-day Jaipur tour", "The listed two-day itinerary includes the one-day places plus Nahargarh Fort, Jaigarh Fort and Albert Hall Museum. The places included are shown with the plan before you send a request."],
      ["Plan and request your private tour", "Choose a one-day or two-day plan, review the included places, then add your pickup and contact details in the booking form. Requests are subject to confirmation by the ChalakGo team."],
    ],
    faqs: [
      ["How long are the Jaipur sightseeing tours?", "The current plans shown on this page are one day and two days."],
      ["Which places are included in the Jaipur tour?", "The page lists Amber Fort, Jal Mahal, Hawa Mahal, City Palace, Jantar Mantar, Nahargarh Fort, Jaigarh Fort and Albert Hall Museum across its one-day and two-day plans."],
      ["Can I book a private Jaipur sightseeing tour?", "Yes. Choose a listed tour plan and submit your pickup and contact details for the team to confirm."],
    ],
    related: ["/cab-car-driver-jaipur", "/chauffeur-service-jaipur"],
  },
  "/permanent-driver-jaipur": {
    slug: "permanent-driver",
    title: "Permanent Driver in Jaipur | Monthly & Full-Time Driver | ChalakGo",
    description: "Find a dedicated permanent or monthly driver in Jaipur for your personal or family vehicle. Explore ChalakGo's professional driver service and booking options.",
    h1: "Your Dedicated Monthly Chauffeur in Jaipur",
    supportingHeading: "Professional Permanent Driver for Your Car",
    serviceName: "Permanent Driver Service in Jaipur",
    serviceType: "Permanent and monthly personal driver service",
    intro: "Request a dedicated driver for your car and regular routine in Jaipur. The permanent-driver service is designed for daily family travel and office commutes, with monthly schedules and plan options shown on the page.",
    sections: [
      ["A regular driver for your car", "A permanent driver plan is for customers looking for a consistent driver for daily journeys. Share your expected schedule and requirements so the team can discuss a suitable plan."],
      ["Monthly driver plans", "The page displays monthly options by daily hours. Review the current schedule and pricing information on the page, then submit a request for follow-up."],
      ["How to request a permanent driver", "Choose Permanent Driver, review the available plan details and add your schedule and contact information in the booking form. The team will follow up to discuss your request."],
    ],
    faqs: [
      ["What is a permanent driver service?", "It is a driver arrangement intended for recurring daily travel rather than a single journey."],
      ["Can I request a monthly driver?", "Yes. Monthly driver plans are shown on this page; submit your schedule and requirements for follow-up."],
      ["Can this service work for family travel?", "The service description includes daily family travel. Share your routine and requirements so the team can discuss a suitable plan."],
    ],
    related: ["/driver-on-demand-jaipur", "/chauffeur-service-jaipur"],
  },
};

const pages = {
  "/": ["Chauffeur Service in Jaipur | Car with Driver & Cab | ChalakGo", "ChalakGo provides professional chauffeur, cab with driver, driver-on-demand, Jaipur sightseeing and permanent driver services in Jaipur. Book your ride or driver today."],
  "/about": ["About Us", "Learn about ChalakGo and our professional driver services for safe, comfortable journeys."],
  "/contact": ["Contact Us", "Contact ChalakGo for driver bookings, service enquiries and booking support."],
  "/pricing": ["Driver Service Pricing", "Explore ChalakGo driver service pricing and choose a plan for your travel needs."],
  "/services": ["Driver & Cab Services in Jaipur | ChalakGo", "Compare driver on hire, chauffeur-driven car rental, permanent monthly driver and private Jaipur sightseeing tour services. Choose a plan and book online with ChalakGo."],
  "/blog": ["Travel & Driver Service Blog", "Read travel tips, driver service guides and updates from ChalakGo."],
  "/how-it-works": ["How Driver Booking Works", "Learn how to choose a ChalakGo service, book a driver and prepare for your journey."],
  "/fleet": ["Our Fleet", "Explore vehicle options for comfortable travel with ChalakGo."],
  "/reviews": ["Customer Reviews", "Read customer experiences and reviews of ChalakGo driver services."],
  "/faqs": ["Frequently Asked Questions", "Find answers about ChalakGo driver bookings, pricing, services and travel."],
  "/terms-and-conditions": ["Terms & Conditions", "Read the terms for ChalakGo driver hiring, cab bookings, service fees and replacement support."],
  "/login": ["Customer Login", "Log in to ChalakGo to book a driver and manage your bookings."],
};

// One Helmet instance prevents competing metadata tags in React 19.
export function SeoProvider({ children }) {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  const [override, setOverride] = useState(null);
  const dynamic = /^\/(blog|services|p)\/[^/]+$/.test(path);
  const seoPage = serviceSeoPages[path];
  const fallback = seoPage ? [seoPage.title, seoPage.description] : pages[path] || [dynamic ? "ChalakGo" : "Page Not Found", pages["/"][1]];
  const data = override?.pathname === pathname ? override : {};
  const name = data.title || fallback[0];
  const title = name.includes("ChalakGo") ? name : `${name} | ChalakGo`;
  const description = (data.description || fallback[1]).replace(/\s+/g, " ").trim().slice(0, 180);
  const canonical = `https://chalakgo.com${path}`;
  const image = new URL(data.image || logo, "https://chalakgo.com").href;
  const noindex = data.noindex || path === "/login" || (!pages[path] && !seoPage && !dynamic);
  const business = {
    "@type": "LocalBusiness",
    "@id": "https://chalakgo.com/#business",
    name: "ChalakGo",
    url: "https://chalakgo.com/",
    image,
    telephone: "+91 97845 10845",
    email: "support@chalakgo.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2nd Floor, S-22, Apna Bazar, near Lata Circle, Krishna Colony, Jhotwara",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302012",
      addressCountry: "IN",
    },
    areaServed: { "@type": "City", name: "Jaipur" },
  };
  const structuredData = path === "/" ? {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://chalakgo.com/#organization", name: "ChalakGo", url: "https://chalakgo.com/", logo: image },
      { "@type": "WebSite", "@id": "https://chalakgo.com/#website", url: "https://chalakgo.com/", name: "ChalakGo", publisher: { "@id": "https://chalakgo.com/#organization" }, inLanguage: "en-IN" },
      { ...business, description },
    ],
  } : seoPage ? {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "@id": `${canonical}#service`, name: seoPage.serviceName, serviceType: seoPage.serviceType, description, url: canonical, provider: { "@id": "https://chalakgo.com/#business" }, areaServed: { "@type": "City", name: "Jaipur" } },
      { "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://chalakgo.com/" },
        { "@type": "ListItem", position: 2, name: "Services", item: "https://chalakgo.com/services" },
        { "@type": "ListItem", position: 3, name: seoPage.serviceName, item: canonical },
      ] },
    ],
  } : null;

  return (
    <Context.Provider value={setOverride}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
        <link rel="canonical" href={canonical} />
        <meta property="og:site_name" content="ChalakGo" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:type" content={data.type || "website"} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
      </Helmet>
      {children}
    </Context.Provider>
  );
}

export function usePageSeo({ title, description, image, type, noindex } = {}) {
  const setOverride = useContext(Context);
  const { pathname } = useLocation();
  useEffect(() => {
    const value = { pathname, title, description, image, type, noindex };
    setOverride(value);
    return () => setOverride((current) => current === value ? null : current);
  }, [setOverride, pathname, title, description, image, type, noindex]);
}

export function UnavailableSeo() {
  usePageSeo({ title: "Page Unavailable", noindex: true });
  return null;
}

const serviceRoutes = {
  "car-driver": "/cab-car-driver-jaipur",
  "driver-only": "/driver-on-demand-jaipur",
  "jaipur-tour": "/jaipur-tour-by-car",
  "permanent-driver": "/permanent-driver-jaipur",
};

export function servicePath(slug) {
  return serviceRoutes[slug] || `/services/${slug}`;
}

export const legacyServicePaths = Object.fromEntries(
  Object.entries(serviceRoutes).map(([slug, path]) => [`/services/${slug}`, path]),
);

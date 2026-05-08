export async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "YourAppName/1.0 (contact@email.com)",
    },
  });

  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error("Address not found");
  }

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  };
}
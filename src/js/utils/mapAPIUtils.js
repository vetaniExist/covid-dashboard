export async function nominatimOSMRequest(countryName) {
  try {
    // "https://nominatim.openstreetmap.org/details?osmtype=R&osmid=175905&format=json"
    const url = `https://nominatim.openstreetmap.org/search?country=${countryName}&format=json`;
    console.log("url");
    console.log(url);
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
    });
    return await response.json();
  } catch (err) {
    console.error("error in nominatimOSMRequest function (cant get data from api)");
  }
  return null;
}

export async function getGeoJSON() {
  try {
    // http://127.0.0.1:5500/src/assets/geoData/countries.geojson src/assets/geoData/countries.geojson
    const url = `./../../src/assets/geoData/countries.geojson`;
    const response = await fetch(url, {
      method: "GET",
    });
    return await response.json();
  } catch (err) {
    console.error("error in nominatimOSMRequest function (cant get data from api)");
  }
  return null;
}

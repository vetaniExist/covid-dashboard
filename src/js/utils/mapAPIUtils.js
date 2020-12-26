export async function getGeoJSON() {
  try {
    const url = "https://raw.githubusercontent.com/vetaniExist/geojson/master/countries.geojson";
    const response = await fetch(url, {
      method: "GET",
    });
    return await response.json();
  } catch (err) {
    console.error("error in nominatimOSMRequest function (cant get data from api)");
  }
  return null;
}

export default getGeoJSON;

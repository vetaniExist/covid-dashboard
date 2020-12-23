async function getAsyncRequest(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
    });
    return await response.json();
  } catch (err) {
    console.error("error in getCountries function (cant get data from api)");
  }
  return null;
}

export async function getCountries() {
  return getAsyncRequest("https://api.covid19api.com/summary");
}

export async function getPopulationAndFlag() {
  return getAsyncRequest("https://restcountries.eu/rest/v2/all?fields=name;population;flag");
}

export default getCountries;

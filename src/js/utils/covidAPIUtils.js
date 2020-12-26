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

export async function getTimelineForCountry(country = "all") {
  try {
    return getAsyncRequest(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=366`);
  } catch (err) {
    return null;
  }
}

export default getCountries;

export async function getCountries() {
  try {
    const response = await fetch("https://api.covid19api.com/summary", {
      method: "GET",
      mode: "cors",
    });
    // parses JSON response into native JavaScript objects
    return await response.json();
  } catch (err) {
    console.error("error in getCountries function (cant get data from api)");
  }
  return null;
}

export default getCountries;

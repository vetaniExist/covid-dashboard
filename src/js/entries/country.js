export class Country {
  constructor(obj) {
    this.name = obj.Country;
    this.slug = obj.Slug;
    this.iso2 = obj.CountryCode; // ISO2 in https://api.covid19api.com/summary

    this.totalDeath = obj.TotalDeaths;
    this.totalConfirmed = obj.TotalConfirmed;
    this.totalRecovered = obj.TotalRecovered;

    this.todayDeath = obj.NewDeaths;
    this.todayConfirmed = obj.NewConfirmed;
    this.todayRecovered = obj.NewRecovered;
  }

  getTotalCases() {
    return this.totalConfirmed;
  }
}

export function createWorldCountry(data) {
  const worldObj = {
    Country: "World",
    Slug: "world",
    ISO2: "WD",

    TotalDeaths: data.TotalDeaths,
    TotalConfirmed: data.TotalConfirmed,
    TotalRecovered: data.TotalRecovered,

    NewDeaths: data.NewDeaths,
    NewConfirmed: data.NewConfirmed,
    NewRecovered: data.NewRecovered,
  };

  const world = new Country(worldObj);
  return world;
}

export default Country;

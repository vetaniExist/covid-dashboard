export class Country {
  constructor(obj) {
    this.name = obj.Country;
    this.slug = obj.Slug;
    this.iso2 = obj.ISO2;

    this.totalDeath = obj.TotalDeaths;
    this.totalConfirmed = obj.TotalConfirmed;
    this.totalRecovered = obj.TotalRecovered;
  }

  getTotalCases() {
    return this.totalConfirmed;
  }
}

export default Country;

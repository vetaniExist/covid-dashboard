import { Country } from "./country";

import { getCountries } from "../utils/covidAPIUtils";

export class CovidData {
  constructor() {
    this.getAllCountries();
  }

  getAllCountries() {
    getCountries().then((data) => {
      this.countries = data.map((el) => new Country(el));
      console.log(this.countries[0]);
    });
  }
}

export default CovidData;

import { Country } from "./country";

import { getCountries } from "../utils/covidAPIUtils";

let covidDataInstance = null;

export class CovidData {
  constructor() {
    if (!covidDataInstance) {
      covidDataInstance = this;
      this.getAllCountries();
    }
    return covidDataInstance;
  }

  getAllCountries() {
    if (this.countries) {
      console.log("Возвращаем");
      return this.countries;
    }
    return getCountries().then((data) => {
      this.fullData = data;
      console.log(data);
      this.countries = data.Countries.map((el) => new Country(el));
      console.log(this.countries[0]);
      return this.countries;
    });

  }
}

export default CovidData;

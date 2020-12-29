import { Country, createWorldCountry } from "./country";

import { getCountries, getPopulationAndFlag } from "../utils/covidAPIUtils";

let covidDataInstance = null;

export class CovidData {
  constructor() {
    if (!covidDataInstance) {
      covidDataInstance = this;
    }
    return covidDataInstance;
  }

  async parseData() {
    await getCountries().then(async (data) => {
      this.worldData = data.Global;
      this.worldCountry = createWorldCountry(this.worldData);

      let flags;
      await getPopulationAndFlag().then((data2) => {
        flags = data2;
      });

      this.countries = data.Countries.map((el) => {
        const curFlag = flags.find((flag) => flag.name === el.Country);
        if (curFlag) {
          const country = new Country(el);
          country.flag = curFlag.flag;
          country.population = curFlag.population;
          return country;
        }
        return new Country(el);
      });
    });
  }

  async getAllCountries() {
    if (this.countries) {
      return this.countries;
    }
    await this.parseData();
    return this.countries;
  }

  async getCountryWorld() {
    if (this.worldCountry) {
      return this.worldCountry;
    }
    await this.parseData();
    return this.worldCountry;
  }

  async getWorldTotalCases() {
    if (this.worldData) {
      return this.worldData.TotalConfirmed;
    }
    await this.parseData();
    return this.worldData.TotalConfirmed;
  }
}

export default CovidData;

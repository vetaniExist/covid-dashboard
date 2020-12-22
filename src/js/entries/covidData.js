import { Country, createWorldCountry } from "./country";

import { getCountries } from "../utils/covidAPIUtils";

let covidDataInstance = null;

export class CovidData {
  constructor() {
    if (!covidDataInstance) {
      covidDataInstance = this;
      this.parseData();
    }
    return covidDataInstance;
  }

  async parseData() {
    await getCountries().then((data) => {
      this.worldData = data.Global;
      this.worldCountry = createWorldCountry(this.worldData);
      console.log(this.worldData);
      this.countries = data.Countries.map((el) => new Country(el));
      console.log("вот тут");
    });
  }

  async getAllCountries() {
    if (this.countries) {
      console.log("Возвращаем");
      return this.countries;
    }
    await this.parseData();
    return this.countries;
  }

  async getCountryWorld() {
    if (this.worldCountry) {
      console.log("Возвращаем worldCountry");
      return this.worldCountry;
    }
    await this.parseData();
    return this.worldCountry;
  }


  async getWorldTotalCases() {
    if (this.worldData) {
      console.log("Возвращаем");
      return this.worldData.TotalConfirmed;
    }
    await this.parseData();
    return this.worldData.TotalConfirmed;
  }

  async getWorldTotalCases() {
    if (this.world) {
      console.log("Возвращаем world");
      return this.world;
    }
    await this.parseData();
    return this.worldData.TotalConfirmed;
  }
}

export default CovidData;

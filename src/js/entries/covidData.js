import { Country, createWorldCountry } from "./country";

import { getCountries } from "../utils/covidAPIUtils";

let covidDataInstance = null;

export class CovidData {
  constructor() {
    if (!covidDataInstance) {
      covidDataInstance = this;
    }
    return covidDataInstance;
  }

  async parseData() {
    await getCountries().then((data) => {
      console.log("заполняем данные");
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
    console.log("Ждем выполнение getAllCountries");
    await this.parseData();
    return this.countries;
  }

  async getCountryWorld() {
    if (this.worldCountry) {
      console.log("Возвращаем worldCountry");
      return this.worldCountry;
    }
    console.log("Ждем выполнение getCountryWorld");
    await this.parseData();
    return this.worldCountry;
  }


  async getWorldTotalCases() {
    if (this.worldData) {
      console.log("Возвращаем");
      return this.worldData.TotalConfirmed;
    }
    console.log("Ждем выполнение getWorldTotalCases");
    await this.parseData();
    return this.worldData.TotalConfirmed;
  }

/*   async getWorld() {
    if (this.worldCountry) {
      console.log("Возвращаем world");
      return this.worldCountry;
    }
    console.log("Ждем выполнение getWorld");
    await this.parseData();
    return this.worldCountry;
  } */
}

export default CovidData;

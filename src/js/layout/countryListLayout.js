import { createElement as createEl } from "../utils/elementsUtils";

export class CountryList {
  constructor(parentNode) {
    console.log("CountryList not impl");
    this.countryList = createEl("div", "covid_country_list", parentNode);
  }
}

export default CountryList;

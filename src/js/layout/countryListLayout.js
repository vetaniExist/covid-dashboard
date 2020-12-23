import { createElement as createEl/* , configurateButton as createButton */ } from "../utils/elementsUtils";

export class CountryList {
  constructor(parentNode) {
    console.log("CountryList not impl");
    this.countryList = createEl("div", "flex flex_wrap covid_country_list", parentNode);
  }

  async constructListOfButtons(dataLink) {
    this.countryList.appendChild(dataLink.getDivListOfButtons());
  }
}

export default CountryList;

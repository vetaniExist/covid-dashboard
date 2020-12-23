import { createElement as createEl/* , configurateButton as createButton */ } from "../utils/elementsUtils";

export class CountryList {
  constructor(parentNode) {
    console.log("CountryList not impl");
    this.countryList = createEl("div", "flex flex_wrap covid_country_list", parentNode);
    this.filter = "";
  }

  async constructListOfButtons(dataLink) {
    this.inputField = createEl("input", "input_search-field", this.countryList);
    this.countryList.appendChild(dataLink.getDivListOfButtons());
    this.activateInputField(dataLink);
  }

  activateInputField(dataLink) {
    this.inputField.addEventListener("keydown", (e) => {
      console.log("keydiwn");
      if (e.key !== "Backspace") {
        this.filter = this.inputField.value + e.key;
        console.log("this filter", this.filter);
        dataLink.filterButtonsUsingCountryName(this.filter);
      } else if (this.filter.length) {
        this.filter = this.filter.substring(0, this.filter.length - 1);
        dataLink.filterButtonsUsingCountryName(this.filter);
      }
    });
  }
}

export default CountryList;

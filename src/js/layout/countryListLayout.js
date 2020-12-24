import { createElement as createEl } from "../utils/elementsUtils";

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
    this.inputField.addEventListener("keypress", (e) => {
      this.filter = this.inputField.value + e.key;
      console.log("this filter", this.filter);
      dataLink.filterButtonsUsingCountryName(this.filter);
    });

    this.inputField.addEventListener("keydown", (e) => {
      console.log("keydiwn");
      if (this.filter.length && e.key === "Backspace") {
        this.filter = this.filter.substring(0, this.filter.length - 1);
        dataLink.filterButtonsUsingCountryName(this.filter);
      }
    });
  }
}

export default CountryList;

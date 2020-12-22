import { createElement as createEl, configurateButton as createButton } from "../utils/elementsUtils";

export class CountryList {
  constructor(parentNode) {
    console.log("CountryList not impl");
    this.countryList = createEl("div", "flex flex_wrap covid_country_list", parentNode);
  }

  async constructListOfButtons(data) {
    const listOfCountries = await data.getAllCountries();
    listOfCountries.forEach((el) => {
      const countryButton = createButton(el.name, "country_button", this.countryList);
      countryButton.addEventListener("click", () => {
        console.log(el.name);
      });
    });
  }
}

export default CountryList;

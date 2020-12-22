import { createElement as createEl, configurateButton as createButton } from "../utils/elementsUtils";

export class CountryList {
  constructor(parentNode) {
    console.log("CountryList not impl");
    this.countryList = createEl("div", "flex flex_wrap covid_country_list", parentNode);
  }

  async constructListOfButtons(data, textField = null) {
    const listOfCountries = await data.getAllCountries();
    listOfCountries.push(await data.getCountryWorld());
    console.log(listOfCountries);
    console.log("world country :");
    console.log(listOfCountries[listOfCountries.length - 1]);
    listOfCountries.sort((elA, elB) => elB.totalConfirmed - elA.totalConfirmed);
    listOfCountries.forEach((el) => {
      const countryButton = createButton(el.totalConfirmed + " " + el.name, "country_button", this.countryList);
      countryButton.addEventListener("click", () => {
        console.log(el.name);
        if (textField) {
          textField.textContent = el.getTotalCases();
        }
      });
    });
  }
}

export default CountryList;

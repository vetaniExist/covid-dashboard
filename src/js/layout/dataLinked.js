import { createElement as createEl, configurateButton } from "../utils/elementsUtils";

export class DataLinked {
  constructor() {
    this.countryListButtons = [];
    this.dataTypesArrayTotal = ["totalCases", "totalDeaths", "totalRecovered"/* , "totalCasesPer100", "totalDeathPer100", "totalRecoveredPer100" */];
    this.dataTypesArrayToday = ["todayCases", "todayDeaths", "todayRecovered"/* , "todayCasesPer100", "todayDeathPer100", "todayRecoveredPer100" */];
    this.currenMode = this.dataTypesArrayTotal;
  }

  async configurateData(data) {
    this.globalCasesTitle = createEl("p", "text");
    this.TextCasesTextContent = createEl("p", "text", this.globalCases);
    this.setTextCases(await data.getWorldTotalCases());

    this.listOfCountries = await data.getAllCountries();
    this.listOfCountries.push(await data.getCountryWorld());

    let sortConfig;
    this.listOfCountries.sort((elA, elB) => {
      sortConfig = this.getDataSortFunc(this.currenMode[0], elA, elB);
      return sortConfig[0];
    });

    this.divListOfCountries =  createEl("div", "flex flex_wrap");
    this.listOfCountries.forEach((el) => {
      const countryButton = configurateButton(el.name.concat(" ").concat(sortConfig[1]).concat(" ").concat(el[sortConfig[2]]), "country_button");
      this.countryListButtons.push(countryButton);
      this.divListOfCountries.appendChild(countryButton);
      countryButton.addEventListener("click", () => {
        console.log(el.name);
        this.setGlobalCasesTitle(el.name + " " + sortConfig[1]);
        this.setTextCases(el.getTotalCases());
      });
    });
  }

  getDivListOfButtons() {
    return this.divListOfCountries;
  }

/*   getListOfButtons() {
    return this.countryListButtons;
  } */

  getGlobalCasesTitle() {
    return this.globalCasesTitle;
  }

  setGlobalCasesTitle(newText) {
    this.globalCasesTitle.textContent = newText;
  }

  getTextCases() {
    return this.TextCasesTextContent;
  }

  setTextCases(newText) {
    this.TextCasesTextContent.textContent = newText;
  }


  getDataSortFunc(currentControlPanelDataText, elA, elB) {
    switch (currentControlPanelDataText) {
      case "totalCases": {
        return [elB.totalConfirmed - elA.totalConfirmed, "cases", "totalConfirmed"];
      }
      case "totalDeaths": {
        return [elB.totalDeath - elA.totalDeath, "deaths", "totalDeath"];
      }
      case "totalRecovered": {
        return [elB.totalRecovered - elA.totalRecovered, "revoc", "totalRecovered"];
      }
      case "totalCasesPer100": {
        break;
      }
      case "totalDeathPer100": {
        break;
      }
      case "totalRecoveredPer100": {
        break;
      }

      case "todayCases": {
        return [elB.todayConfirmed - elA.todayConfirmed, "cases", "todayConfirmed"];
      }
      case "todayDeaths": {
        return [elB.todayDeath - elA.todayDeath, "deaths", "todayDeath"];
      }
      case "todayRecovered": {
        return [elB.todayRecovered - elA.todayRecovered, "cases", "todayRecovered"];
      }
      case "todayCasesPer100": {
        break;
      }
      case "todayDeathPer100": {
        break;
      }
      case "todayRecoveredPer100": {
        break;
      }
    }
  }
}
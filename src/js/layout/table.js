import { createElement as createEl, configurateButton } from "../utils/elementsUtils";

export class DashboardTable {
  constructor(parentNode, data) {
    console.log("dashboard table not impl");
    this.table = createEl("div", "covid_table", parentNode);
    this.dataTypesArrayTotal = ["totalCases", "totalDeaths", "totalRecovered"/* , "totalCasesPer100", "totalDeathPer100", "totalRecoveredPer100" */];
    this.dataTypesArrayToday = ["todayCases", "todayDeaths", "todayRecovered"/* , "todayCasesPer100", "todayDeathPer100", "todayRecoveredPer100" */];
    this.currenMode = this.dataTypesArrayTotal;

    this.constructListOfButtons(data);
  }

  async constructListOfButtons(data) {
    this.listOfCountries = await data.getAllCountries();
    this.controlPanel = createEl("div", "flex covid_table-control_panel", this.table);
    this.lArrow = configurateButton("", "lArrow", this.controlPanel);
    this.controlPanelData = createEl("div", "text covid_table-control_panel-data", this.controlPanel);
    this.totalBtn = configurateButton("total", "", this.controlPanel);
    this.todayBtn = configurateButton("today", "", this.controlPanel);
    this.rArrow = configurateButton("", "rArrow", this.controlPanel);

    this.countryList = createEl("div", "flex flex_wrap covid_country_list covid_country_list_table", this.table);
    this.countryListButtons = [];

    this.setcontrolPanelDataText(this.currenMode[0]);

    this.activateLeftArrowClick();
    this.activateRightArrowClick();
    this.activateTotalButton();
    this.activateTodayButton();

    this.updateCountryListButtons(this.currenMode[0]);

  }

  updateCountryListButtons(mode) {
    let sortConfig;
    this.listOfCountries.sort((elA, elB) => {
      sortConfig = this.getDataSortFunc(mode, elA, elB);
      return sortConfig[0];
    });
    this.countryList.innerText = "";
    this.countryListButtons = [];
    this.listOfCountries.forEach((el) => {
      // const countryButton = configurateButton(el.totalConfirmed + " " + el.name, "country_button", this.countryList);
      const countryButton = configurateButton(el.name.concat(" ").concat(sortConfig[1]).concat(" ").concat(el[sortConfig[2]]), "country_button", this.countryList);
      this.countryListButtons.push(countryButton);
    });
  }

  setcontrolPanelDataText(newText) {
    this.controlPanelData.textContent = newText;
  }

  getcontrolPanelDataText() {
    return this.controlPanelData.textContent;
  }

  activateLeftArrowClick() {
    this.lArrow.addEventListener("click", () => {
      const curModeIndex = this.currenMode.indexOf(this.getcontrolPanelDataText());
      if (curModeIndex === 0) {
        const newModeIndex = this.currenMode.length - 1;
        this.setcontrolPanelDataText(this.currenMode[newModeIndex]);
        this.updateCountryListButtons(this.currenMode[newModeIndex]);
      } else {
        this.setcontrolPanelDataText(this.currenMode[curModeIndex - 1]);
        this.updateCountryListButtons(this.currenMode[curModeIndex - 1]);
      }
    });
  }

  activateRightArrowClick() {
    this.rArrow.addEventListener("click", () => {
      const curModeIndex = this.currenMode.indexOf(this.getcontrolPanelDataText());
      if (curModeIndex === this.currenMode.length - 1) {
        this.setcontrolPanelDataText(this.currenMode[0]);
        this.updateCountryListButtons(this.currenMode[0]);
      } else {
        this.setcontrolPanelDataText(this.currenMode[curModeIndex + 1]);
        this.updateCountryListButtons(this.currenMode[curModeIndex + 1]);
      }
    });
  }

  activateTotalButton() {
    this.totalBtn.addEventListener("click", () => {
      console.log("totalButton");
      const curModeIndex = this.currenMode.indexOf(this.getcontrolPanelDataText());
      if (this.currenMode !== this.dataTypesArrayTotal) {
        this.currenMode = this.dataTypesArrayTotal;
        this.setcontrolPanelDataText(this.currenMode[curModeIndex]);
        this.updateCountryListButtons(this.currenMode[curModeIndex]);
      }
    });
  }

  activateTodayButton() {
    this.todayBtn.addEventListener("click", () => {
      console.log("todayButton");
      const curModeIndex = this.currenMode.indexOf(this.getcontrolPanelDataText());
      if (this.currenMode !== this.dataTypesArrayToday) {
        this.currenMode = this.dataTypesArrayToday;
        this.setcontrolPanelDataText(this.currenMode[curModeIndex]);
        this.updateCountryListButtons(this.currenMode[curModeIndex]);
      }
    });
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

export default DashboardTable;

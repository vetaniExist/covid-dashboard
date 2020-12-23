import { createElement as createEl, configurateButton } from "../utils/elementsUtils";

export class DataLinked {
  constructor() {
    this.countryListButtons = [];
    this.dataTypesArrayTotal = ["totalCases", "totalDeaths", "totalRecovered"/* , "totalCasesPer100", "totalDeathPer100", "totalRecoveredPer100" */];
    this.dataTypesArrayToday = ["todayCases", "todayDeaths", "todayRecovered"/* , "todayCasesPer100", "todayDeathPer100", "todayRecoveredPer100" */];
    this.currenMode = this.dataTypesArrayTotal;
  }

  async configurateData(data) {
    const worldCountry = await data.getCountryWorld();
    const worldTotalCases = worldCountry.totalConfirmed;

    this.globalCasesTitle = createEl("p", "text");
    this.TextCasesTextContent = createEl("p", "text", this.globalCases);
    this.setTextCases(worldTotalCases);

    this.listOfCountries = await data.getAllCountries();
    this.listOfCountries.push(worldCountry);

    this.tableDataButton = createEl("div");
    this.updateTableDataButton(worldCountry, this.currenMode[0]);

    let sortConfig;
    this.listOfCountries.sort((elA, elB) => {
      sortConfig = this.getDataSortFunc(this.currenMode[0], elA, elB);
      return sortConfig[0];
    });

    this.divListOfCountries = createEl("div", "flex flex_wrap");
    this.listOfCountries.forEach((el) => {
      const countryButton = configurateButton(el.name.concat(" ")
        .concat(sortConfig[1])
        .concat(" ")
        .concat(el[sortConfig[2]]), "country_button");

      this.countryListButtons.push(countryButton);
      this.divListOfCountries.appendChild(countryButton);

      countryButton.addEventListener("click", () => {
        this.countryButtonClick(el, sortConfig, this.currenMode[0]);
        /*         console.log(el.name);
                this.setGlobalCasesTitle(el.name.concat(" ").concat(sortConfig[1]));
                this.setTextCases(el.getTotalCases());
                this.updateTableDataButton(el, this.currenMode[0]); */
      });
    });

    this.configurateControlButtons();
  }

  async configurateControlButtons() {
    this.lArrow = configurateButton("", "lArrow");
    this.controlPanelData = createEl("div", "text covid_table-control_panel-data");
    this.totalBtn = configurateButton("total", "");
    this.todayBtn = configurateButton("today", "");
    this.rArrow = configurateButton("", "rArrow");

    this.activateLeftArrowClick();
    this.activateRightArrowClick();
    this.activateTotalButton();
    this.activateTodayButton();

    this.setcontrolPanelDataText(this.currenMode[0]);
  }

  getTableDataButton() {
    return this.tableDataButton;
  }

  getNameFromTable() {
    return this.tableDataButton.textContent.split('')[0];
  }

  getCountryByName(name) {
    for (let i = 0; i < this.listOfCountries.length; i += 1) {
      const curCountry = this.listOfCountries[i];
      if (curCountry.name.indexOf(name) > -1) {
        return curCountry;
      }
    }
    return null;
  }

  updateTableDataButton(el = null, mode) {
    if (!el) {
      const curCountry = this.getCountryByName(this.getNameFromTable());
      if (curCountry) {
        return this.updateTableDataButton(curCountry, mode);
      }
      return null;
    }
    const tableData = this.dataTypesArrayTotal.indexOf(mode) > -1 ? {
      confirmed: "totalConfirmed",
      recovered: "totalRecovered",
      death: "totalDeath",
    }
      : {
        confirmed: "todayConfirmed",
        recovered: "todayRecovered",
        death: "todayDeath",
      };

    this.tableDataButton.textContent = el.name.concat(" cases: ")
      .concat(el[tableData.confirmed])
      .concat("\n\nrecovered ")
      .concat(el[tableData.recovered])
      .concat("\ndeath ")
      .concat(el[tableData.death]);
  }

  countryButtonClick(el, sortConfig, mode) {
    console.log(el.name);
    this.setGlobalCasesTitle(el.name.concat(" ").concat(sortConfig[1]));
    this.setTextCases(el.getTotalCases());
    this.updateTableDataButton(el, mode);
  }

  getDivListOfButtons() {
    return this.divListOfCountries;
  }

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

  getLArrow() {
    return this.lArrow;
  }

  getRArrow() {
    return this.rArrow;
  }

  getControlPanelData() {
    return this.controlPanelData;
  }

  getTotalBtn() {
    return this.totalBtn;
  }

  getTodayBtn() {
    return this.todayBtn;
  }

  setcontrolPanelDataText(newText) {
    this.controlPanelData.textContent = newText;
  }

  getcontrolPanelDataText() {
    return this.controlPanelData.textContent;
  }

  updateCountryListButtons(mode) {
    let sortConfig;
    this.listOfCountries.sort((elA, elB) => {
      sortConfig = this.getDataSortFunc(mode, elA, elB);
      return sortConfig[0];
    });
    this.divListOfCountries.innerText = "";
    this.countryListButtons = [];
    this.listOfCountries.forEach((el) => {
      const countryButton = configurateButton(el.name.concat(" ")
        .concat(sortConfig[1])
        .concat(" ")
        .concat(el[sortConfig[2]]), "country_button", this.divListOfCountries);

      this.countryListButtons.push(countryButton);
      countryButton.addEventListener("click", () => {
        this.countryButtonClick(el, sortConfig, mode);
      });
    });
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
        this.updateTableDataButton(null, this.currenMode[curModeIndex]);
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
        this.updateTableDataButton(null, this.currenMode[curModeIndex]);
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

      default: {
        break;
      }
    }
    return null;
  }
}

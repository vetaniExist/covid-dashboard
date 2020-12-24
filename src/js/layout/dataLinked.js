import { createElement as createEl, configurateButton } from "../utils/elementsUtils";

function shouldGetInfoInPercentes(mode) {
  return mode.indexOf("Per") > -1;
}

function getDataSortFunc(currentControlPanelDataText, elA, elB) {
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
      return [(elB.totalConfirmed / elB.population) * 100000
        - (elA.totalConfirmed / elA.population) * 100000, "cases", "totalConfirmed"];
    }
    case "totalDeathPer100": {
      return [(elB.totalDeath / elB.population) * 100000
        - (elA.totalDeath / elA.population) * 100000, "cases", "totalDeath"];
    }
    case "totalRecoveredPer100": {
      return [(elB.totalRecovered / elB.population) * 100000
        - (elA.totalRecovered / elA.population) * 100000, "cases", "totalRecovered"];
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
      return [(elB.todayConfirmed / elB.population) * 100000
        - (elA.todayConfirmed / elA.population) * 100000, "cases", "todayConfirmed"];
    }
    case "todayDeathPer100": {
      return [(elB.todayDeath / elB.population) * 100000
        - (elA.todayDeath / elA.population) * 100000, "cases", "todayDeath"];
    }
    case "todayRecoveredPer100": {
      return [(elB.todayRecovered / elB.population) * 100000
        - (elA.todayRecovered / elA.population) * 100000, "cases", "todayRecovered"];
    }

    default: {
      break;
    }
  }
  return null;
}

export class DataLinked {
  constructor() {
    this.countryListButtons = [];
    this.dataTypesArrayTotal = ["totalCases", "totalDeaths", "totalRecovered",
      "totalCasesPer100", "totalDeathPer100", "totalRecoveredPer100"];

    this.dataTypesArrayToday = ["todayCases", "todayDeaths", "todayRecovered",
      "todayCasesPer100", "todayDeathPer100", "todayRecoveredPer100"];
    this.currenMode = this.dataTypesArrayTotal;
  }

  async configurateData(data) {
    const worldCountry = await data.getCountryWorld();
    const worldTotalCases = worldCountry.totalConfirmed;

    this.globalCasesTitle = createEl("p", "text");
    this.TextCasesTextContent = createEl("p", "text", this.globalCases);
    this.setTextCases(worldTotalCases);

    this.listOfCountries = await data.getAllCountries();
    console.log(this.listOfCountries);
    this.loadFlags(this.listOfCountries);
    this.listOfCountries.push(worldCountry);

    this.tableDataButton = createEl("div");
    this.updateTableDataButton(worldCountry, this.currenMode[0]);

    let sortConfig;
    this.listOfCountries.sort((elA, elB) => {
      sortConfig = getDataSortFunc(this.currenMode[0], elA, elB);
      return sortConfig[0];
    });

    this.divListOfCountries = createEl("div", "countries_button_container");
    this.listOfCountries.forEach((el) => {
      const countryButton = configurateButton(el.name.concat(" ")
        .concat(sortConfig[1])
        .concat(" ")
        .concat(el[sortConfig[2]]), "country_button");

      if (el.name !== "World" && el.flag) {
        const flag = new Image();
        flag.classList.add("flag_img");
        flag.src = el.flag;
        flag.loading = "lazy";
        console.log(flag);
        countryButton.appendChild(flag);
      }

      this.countryListButtons.push(countryButton);
      this.divListOfCountries.appendChild(countryButton);

      countryButton.addEventListener("click", () => {
        this.countryButtonClick(el, sortConfig, this.currenMode[0]);
      });
    });

    worldCountry.population = this.listOfCountries.filter((el) => el.population)
      .reduce((acc, el) => acc + el.population, 0);

    this.configurateControlButtons();
  }

  async loadFlags(listOfCountries) {
    this.arrayOfFlags = [];

    listOfCountries.forEach((el) => {
      const image = new Image();
      image.src = el.flag;
      this.arrayOfFlags[el.name] = image;
    });
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
    return this.tableDataButton.textContent.split(" ")[0];
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
      confirmed: el.totalConfirmed,
      recovered: el.totalRecovered,
      death: el.totalDeath,
    }
      : {
        confirmed: el.todayConfirmed,
        recovered: el.todayRecovered,
        death: el.todayDeath,
      };

    if (shouldGetInfoInPercentes(mode)) {
      console.log("делим");
      console.log(el);
      tableData.confirmed = (tableData.confirmed / el.population) * 100000;
      tableData.recovered = (tableData.recovered / el.population) * 100000;
      tableData.death = (tableData.recovered / el.population) * 100000;
    }

    this.tableDataButton.textContent = el.name.concat(" cases: ")
      .concat(tableData.confirmed)
      .concat("\n\nrecovered ")
      .concat(tableData.recovered)
      .concat("\ndeath ")
      .concat(tableData.death);

    return null;
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
      sortConfig = getDataSortFunc(mode, elA, elB);
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
        this.updateTableDataButton(null, this.currenMode[newModeIndex]);
        this.filterButtonsUsingCountryName(this.filter);
      } else {
        this.setcontrolPanelDataText(this.currenMode[curModeIndex - 1]);
        this.updateCountryListButtons(this.currenMode[curModeIndex - 1]);
        this.updateTableDataButton(null, this.currenMode[curModeIndex - 1]);
        this.filterButtonsUsingCountryName(this.filter);
      }
    });
  }

  activateRightArrowClick() {
    this.rArrow.addEventListener("click", () => {
      const curModeIndex = this.currenMode.indexOf(this.getcontrolPanelDataText());
      if (curModeIndex === this.currenMode.length - 1) {
        this.setcontrolPanelDataText(this.currenMode[0]);
        this.updateCountryListButtons(this.currenMode[0]);
        this.updateTableDataButton(null, this.currenMode[0]);
        this.filterButtonsUsingCountryName(this.filter);
      } else {
        this.setcontrolPanelDataText(this.currenMode[curModeIndex + 1]);
        this.updateCountryListButtons(this.currenMode[curModeIndex + 1]);
        this.updateTableDataButton(null, this.currenMode[curModeIndex + 1]);
        this.filterButtonsUsingCountryName(this.filter);
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
        this.filterButtonsUsingCountryName(this.filter);
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
        this.filterButtonsUsingCountryName(this.filter);
      }
    });
  }

  filterButtonsUsingCountryName(name = "") {
    this.filter = name;
    const filteredCountrieNames = this.listOfCountries.filter((el) => {
      const curSubString = el.name.substring(0, name.length);
      return name === curSubString;
    });
    console.log("Отфильтровали страны");
    console.log(filteredCountrieNames);

    const filteredButtons = this.countryListButtons.filter((el) => filteredCountrieNames
      .filter((el2) => el.textContent.indexOf(el2.name) > -1).length > 0);

    console.log("Отфильтровали кнопки");
    console.log(filteredButtons);
    this.countryListButtons.forEach((el) => {
      if (!filteredButtons.includes(el)) {
        el.classList.add("display-none");
      } else {
        el.classList.remove("display-none");
      }
    });
  }
}

export default DataLinked;

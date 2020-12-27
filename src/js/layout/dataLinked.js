import { createElement as createEl, configurateButton } from "../utils/elementsUtils";

export function getDataSortFunc(currentControlPanelDataText, elA, elB) {
  switch (currentControlPanelDataText) {
    case "totalCases": {
      return elA ? [elB.totalConfirmed - elA.totalConfirmed, "cases", "totalConfirmed"] : ["cases", "totalConfirmed"];
    }
    case "totalDeaths": {
      return elA ? [elB.totalDeath - elA.totalDeath, "deaths", "totalDeath"] : ["deaths", "totalDeath"];
    }
    case "totalRecovered": {
      return elA ? [elB.totalRecovered - elA.totalRecovered, "revoc", "totalRecovered"] : ["revoc", "totalRecovered"];
    }
    case "totalCasesPer100": {
      return elA ? [(elB.totalConfirmed / elB.population) * 100000
        - (elA.totalConfirmed / elA.population) * 100000, "cases", "totalConfirmed"] : ["cases", "totalConfirmed"];
    }
    case "totalDeathPer100": {
      return elA ? [(elB.totalDeath / elB.population) * 100000
        - (elA.totalDeath / elA.population) * 100000, "cases", "totalDeath"] : ["deaths", "totalDeath"];
    }
    case "totalRecoveredPer100": {
      return elA ? [(elB.totalRecovered / elB.population) * 100000
        - (elA.totalRecovered / elA.population) * 100000, "cases", "totalRecovered"] : ["revoc", "totalRecovered"];
    }

    case "todayCases": {
      return elA ? [elB.todayConfirmed - elA.todayConfirmed, "cases", "todayConfirmed"] : ["cases", "todayConfirmed"];
    }
    case "todayDeaths": {
      return elA ? [elB.todayDeath - elA.todayDeath, "deaths", "todayDeath"] : ["deaths", "todayDeath"];
    }
    case "todayRecovered": {
      return elA ? [elB.todayRecovered - elA.todayRecovered, "cases", "todayRecovered"] : ["revoc", "todayRecovered"];
    }
    case "todayCasesPer100": {
      return elA ? [(elB.todayConfirmed / elB.population) * 100000
        - (elA.todayConfirmed / elA.population) * 100000, "cases", "todayConfirmed"] : ["cases", "todayConfirmed"];
    }
    case "todayDeathPer100": {
      return elA ? [(elB.todayDeath / elB.population) * 100000
        - (elA.todayDeath / elA.population) * 100000, "cases", "todayDeath"] : ["deaths", "todayDeath"];
    }
    case "todayRecoveredPer100": {
      return elA ? [(elB.todayRecovered / elB.population) * 100000
        - (elA.todayRecovered / elA.population) * 100000, "cases", "todayRecovered"] : ["revoc", "todayRecovered"];
    }

    default: {
      break;
    }
  }
  return null;
}

export function shouldGetInfoInPercentes(mode) {
  return mode.indexOf("Per") > -1;
}

export function itIsTodayData(mode) {
  return mode.indexOf("today") > -1;
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
        countryButton.appendChild(flag);
      }

      this.countryListButtons.push(countryButton);
      this.divListOfCountries.appendChild(countryButton);

      countryButton.addEventListener("click", () => {
        this.countryButtonClick(el, sortConfig, this.currenMode[0]);
        this.updateChart(this.currenMode[0]);
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
    this.controlPanelData = createEl("div", "flex text covid_table-control_panel-data");
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
    const leftArrow = configurateButton("", "lArrow");
    this.activateLeftArrowClick(leftArrow);
    return leftArrow;
  }

  getRArrow() {
    const rightArrow = configurateButton("", "rArrow");
    this.activateRightArrowClick(rightArrow);
    return rightArrow;
  }

  getControlPanelData() {
    return this.controlPanelData;
  }

  getTotalBtn() {
    const totalBtn = configurateButton("total", "");
    this.activateTotalButton(totalBtn);
    return totalBtn;
  }

  getTodayBtn() {
    const todayBtn = configurateButton("today", "");
    this.activateTodayButton(todayBtn);
    return todayBtn;
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
        this.updateChart(mode);
      });
    });
  }

  toogleLeftRightArrow(index) {
    this.setcontrolPanelDataText(this.currenMode[index]);
    this.updateCountryListButtons(this.currenMode[index]);
    this.updateTableDataButton(null, this.currenMode[index]);
    this.filterButtonsUsingCountryName(this.filter);
    this.updateMapMarkers(this.currenMode[index]);
    this.updateChart(this.currenMode[index]);
  }

  activateArrow(correctCondition, valTrueCondition, valFalseCondition) {
    const curModeIndex = this.currenMode.indexOf(this.getcontrolPanelDataText());
    if (curModeIndex === correctCondition) {
      this.toogleLeftRightArrow(valTrueCondition);
    } else {
      this.toogleLeftRightArrow(curModeIndex + valFalseCondition);
    }
  }

  activateLeftArrowClick(leftArrow) {
    leftArrow.addEventListener("click", () => {
      this.activateArrow(0, this.currenMode.length - 1, -1);
    });
  }

  activateRightArrowClick(rightArrow) {
    rightArrow.addEventListener("click", () => {
      this.activateArrow(this.currenMode.length - 1, 0, 1);
    });
  }

  toogleTotalTodayButtons() {
    const curModeIndex = this.currenMode.indexOf(this.getcontrolPanelDataText());
    if (this.currenMode !== this.dataTypesArrayTotal) {
      this.currenMode = this.dataTypesArrayTotal;
    } else {
      this.currenMode = this.dataTypesArrayToday;
    }

    this.setcontrolPanelDataText(this.currenMode[curModeIndex]);
    this.updateCountryListButtons(this.currenMode[curModeIndex]);
    this.updateTableDataButton(null, this.currenMode[curModeIndex]);
    this.filterButtonsUsingCountryName(this.filter);
    this.updateMapMarkers(this.currenMode[curModeIndex]);
    this.updateChart(this.currenMode[curModeIndex]);
  }

  activateTotalButton(totalBtn) {
    totalBtn.addEventListener("click", () => {
      if (this.currenMode !== this.dataTypesArrayTotal) {
        this.toogleTotalTodayButtons();
      }
    });
  }

  activateTodayButton(todayBtn) {
    todayBtn.addEventListener("click", () => {
      if (this.currenMode !== this.dataTypesArrayToday) {
        this.toogleTotalTodayButtons();
      }
    });
  }

  filterButtonsUsingCountryName(name = "") {
    this.filter = name;
    const filteredCountrieNames = this.listOfCountries.filter((el) => {
      const curSubString = el.name.substring(0, name.length);
      return name === curSubString;
    });

    const filteredButtons = this.countryListButtons.filter((el) => filteredCountrieNames
      .filter((el2) => el.textContent.indexOf(el2.name) > -1).length > 0);

    this.countryListButtons.forEach((el) => {
      if (!filteredButtons.includes(el)) {
        el.classList.add("display-none");
      } else {
        el.classList.remove("display-none");
      }
    });
  }

  setMap(mapObj) {
    this.map = mapObj;
  }

  updateMapMarkers(cpd) {
    const itIsPercent = shouldGetInfoInPercentes(cpd);
    this.map.updateAllMarkers(cpd, itIsPercent);
    this.map.updateLegend(itIsPercent);
  }

  setChart(chartObj) {
    this.chart = chartObj;
  }

  updateChart(cpd) {
    const name = this.getNameFromTable();
    const countryObj = this.getCountryByName(name);
    this.chart.updateChart(cpd, countryObj.name, countryObj);
  }
}

export default DataLinked;

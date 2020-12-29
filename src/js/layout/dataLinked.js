import {
  createElement as createEl, configurateButton, setElementOrder, setElementInnerText,
} from "../utils/elementsUtils";

import {
  getDataSortFunc, shouldGetInfoInPercentes, decorCountryAddLinkToButton,
} from "../utils/dataLinkedUtils";

export class DataLinked {
  constructor() {
    this.dataTypesArrayTotal = ["totalCases", "totalDeaths", "totalRecovered",
      "totalCasesPer100", "totalDeathPer100", "totalRecoveredPer100"];

    this.dataTypesArrayToday = ["todayCases", "todayDeaths", "todayRecovered",
      "todayCasesPer100", "todayDeathPer100", "todayRecoveredPer100"];
    this.currenMode = this.dataTypesArrayTotal;
    this.isOpen = false;
  }

  async configurateData(data) {
    const worldCountry = await data.getCountryWorld();
    const worldTotalCases = worldCountry.totalConfirmed;

    this.globalCasesTitle = createEl("p", "text");
    this.TextCasesTextContent = createEl("p", "text");
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

    this.divListOfCountries = createEl("div", "flex flex_wrap countries_button_container");
    this.listOfCountries.forEach((el, index) => {
      const countryButton = configurateButton("", "country_button");
      const pTag = createEl("div", "", countryButton);
      setElementInnerText(pTag, el.name.concat(" ")
        .concat(sortConfig[1])
        .concat(" ")
        .concat(el[sortConfig[2]]));

      if (el.name !== "World" && el.flag) {
        const flag = new Image();
        flag.classList.add("flag_img");
        flag.src = el.flag;
        flag.loading = "lazy";
        countryButton.appendChild(flag);
      }

      setElementOrder(countryButton, index);
      decorCountryAddLinkToButton(el, countryButton, pTag);
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
    this.controlPanelDataClones = [];
    this.totalTodayButtons = [];
    this.controlPanelData = createEl("div",
      "flex just_cont-center align_items-center text text-panel covid_table-control_panel-data");
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

  getCountryByISO2(iso2) {
    for (let i = 0; i < this.listOfCountries.length; i += 1) {
      const curCountry = this.listOfCountries[i];
      if (curCountry.iso2 === iso2) {
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

    this.tableDataButton.innerHTML = el.name.concat(" cases: ")
      .concat(tableData.confirmed)
      .concat("</br>recovered ")
      .concat(tableData.recovered)
      .concat("</br>death ")
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
    const leftArrow = configurateButton("", "lArrow control_button");
    this.activateLeftArrowClick(leftArrow);
    return leftArrow;
  }

  getRArrow() {
    const rightArrow = configurateButton("", "rArrow control_button");
    this.activateRightArrowClick(rightArrow);
    return rightArrow;
  }

  getControlPanelData() {
    return this.controlPanelData;
  }

  getControlPanelDataClone() {
    const clone = this.controlPanelData.cloneNode(true);
    this.controlPanelDataClones.push(clone);
    return clone;
  }

  getTodayBtn(additionalClasses) {
    const todayTotalSwitchBtn = configurateButton("Today", "control_button ".concat(additionalClasses));
    this.totalTodayButtons.push(todayTotalSwitchBtn);
    this.activateTodayButton(todayTotalSwitchBtn);
    return todayTotalSwitchBtn;
  }

  setcontrolPanelDataText(newText) {
    this.controlPanelData.textContent = newText;
    /* eslint-disable no-param-reassign */
    this.controlPanelDataClones.forEach((el) => {
      el.textContent = newText;
    });
    /* eslint-enable no-param-reassign */
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
    this.listOfCountries.forEach((el, index) => {
      setElementOrder(el.linkToCountryButton, index);
      let newData = shouldGetInfoInPercentes(mode) ? (el[sortConfig[2]] / el.population) * 100000 : el[sortConfig[2]];
      if (Number.isNaN(newData)) {
        newData = "not find";
      }
      const newText = el.name.concat(" ")
        .concat(sortConfig[1])
        .concat(" ")
        .concat(newData);

      setElementInnerText(el.linkCountryButtonTextDiv, newText);
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

  activateTodayButton(todayBtn) {
    todayBtn.addEventListener("click", () => {
      if (this.currenMode !== this.dataTypesArrayToday) {
        this.totalTodayButtons.forEach((el) => {
          setElementInnerText(el, "Total");
        });
      } else {
        this.totalTodayButtons.forEach((el) => {
          setElementInnerText(el, "Today");
        });
      }
      this.toogleTotalTodayButtons();
    });
  }

  filterButtonsUsingCountryName(name = "") {
    this.filter = name;
    const filteredCountrieNames = this.listOfCountries.filter((el) => {
      const curSubString = el.name.substring(0, name.length);
      return name.toLowerCase() === curSubString.toLowerCase();
    });

    const filteredButtons = filteredCountrieNames.map((el) => el.linkToCountryButton);

    this.listOfCountries.forEach((el) => {
      const button = el.linkToCountryButton;
      if (!filteredButtons.includes(button)) {
        button.classList.add("display-none");
      } else {
        button.classList.remove("display-none");
      }
    });
  }

  setGlobalCasesDiv(globalCasesObj) {
    this.globalCases = globalCasesObj;
  }

  setCountryListDiv(listDiv) {
    this.countryListDiv = listDiv;
  }

  setMap(mapObj) {
    this.map = mapObj;
  }

  setTable(tableObj) {
    this.table = tableObj;
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

  getHideButton(partOfLayout) {
    const hideButton = configurateButton("open", "");

    hideButton.addEventListener("click", () => {
      this.hide(partOfLayout);
      if (!this.isOpen) {
        hideButton.innerText = "Open";
      } else {
        hideButton.innerText = "Close";
      }
    });

    return hideButton;
  }

  hide(obj) {
    this.tryHideBlock(obj, this.map);
    this.tryHideBlock(obj, this.table);
    this.tryHideBlock(obj, this.countryListDiv);
    this.tryHideBlock(obj, this.chart);
    this.isOpen = !this.isOpen;
  }

  tryHideBlock(obj, blockObj) {
    if (obj !== blockObj) {
      if (!this.isOpen) {
        blockObj.hide();
      } else {
        blockObj.show();
      }
    } else if (!this.isOpen) {
      blockObj.open(this.allButtonsActive.bind(this));
    } else {
      blockObj.close(this.allButtonsRemoveActive.bind(this));
    }
  }

  getCountryListButtons() {
    return this.listOfCountries.map((el) => el.linkToCountryButton);
  }

  allButtonsActive() {
    this.getCountryListButtons().forEach((el) => {
      el.classList.add("country_button-active");
    });
  }

  allButtonsRemoveActive() {
    this.getCountryListButtons().forEach((el) => {
      el.classList.remove("country_button-active");
    });
  }
}

export default DataLinked;

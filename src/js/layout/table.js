import { createElement as createEl, configurateButton } from "../utils/elementsUtils";

export class DashboardTable {
  constructor(parentNode, data, dataLink) {
    console.log("dashboard table not impl");
    this.table = createEl("div", "covid_table", parentNode);
    this.dataTypesArrayTotal = ["totalCases", "totalDeaths", "totalRecovered"/* , "totalCasesPer100", "totalDeathPer100", "totalRecoveredPer100" */];
    this.dataTypesArrayToday = ["todayCases", "todayDeaths", "todayRecovered"/* , "todayCasesPer100", "todayDeathPer100", "todayRecoveredPer100" */];
    this.currenMode = this.dataTypesArrayTotal;

    this.constructListOfButtons(data, dataLink);
  }

  async constructListOfButtons(data, dataLink) {
    this.listOfCountries = await data.getAllCountries();
    this.controlPanel = createEl("div", "flex covid_table-control_panel", this.table);

    this.lArrow = dataLink.getLArrow();
    this.controlPanel.appendChild(this.lArrow);

    this.controlPanelData = dataLink.getControlPanelData();
    this.controlPanel.appendChild(this.controlPanelData);

    this.totalBtn = dataLink.getTotalBtn();
    this.controlPanel.appendChild(this.totalBtn);

    this.todayBtn = dataLink.getTodayBtn();
    this.controlPanel.appendChild(this.todayBtn);

    this.rArrow = dataLink.getRArrow();
    this.controlPanel.appendChild(this.rArrow);

    this.tableDataButton = dataLink.getTableDataButton();
    this.table.appendChild(this.tableDataButton);

    this.countryListButtons = [];
    // this.updateCountryListButtons(this.currenMode[0]);

  }
}

export default DashboardTable;

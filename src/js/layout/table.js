import { createElement as createEl } from "../utils/elementsUtils";

export class DashboardTable {
  constructor(parentNode, dataLink) {
    console.log("dashboard table not impl");
    this.table = createEl("div", "covid_table", parentNode);
    this.constructListOfButtons(dataLink);
  }

  async constructListOfButtons(dataLink) {
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
  }
}

export default DashboardTable;

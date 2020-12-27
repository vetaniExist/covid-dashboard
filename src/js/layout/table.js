import { createElement as createEl } from "../utils/elementsUtils";

export class DashboardTable {
  constructor(parentNode, dataLink) {
    this.table = createEl("div", "covid_table", parentNode);
    this.constructListOfButtons(dataLink);
  }

  async constructListOfButtons(dataLink) {
    this.controlPanel = createEl("div", "flex flex_wrap covid_table-control_panel", this.table);

    this.controlPanelData = dataLink.getControlPanelData();
    this.controlPanel.appendChild(this.controlPanelData);

    this.controlPanelButtons = createEl("div", "flex covid_table-control_panel-buttons", this.controlPanel);

    this.lArrow = dataLink.getLArrow();
    this.controlPanelButtons.appendChild(this.lArrow);

    this.totalBtn = dataLink.getTotalBtn();
    this.controlPanelButtons.appendChild(this.totalBtn);

    this.todayBtn = dataLink.getTodayBtn();
    this.controlPanelButtons.appendChild(this.todayBtn);

    this.tableDataButton = dataLink.getTableDataButton();
    this.table.appendChild(this.tableDataButton);

    this.rArrow = dataLink.getRArrow();
    this.controlPanelButtons.appendChild(this.rArrow);
  }
}

export default DashboardTable;

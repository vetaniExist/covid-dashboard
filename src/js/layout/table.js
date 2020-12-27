import { createElement as createEl } from "../utils/elementsUtils";

export class DashboardTable {
  constructor(parentNode, dataLink) {
    this.table = createEl("div", "covid_table", parentNode);
    this.constructListOfButtons(dataLink);
    dataLink.setTable(this);
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

    this.hideButton = dataLink.getHideButton(this);
    this.controlPanelButtons.appendChild(this.hideButton);
  }

  hide() {
    this.table.classList.add("display-none");
  }

  show() {
    this.table.classList.remove("display-none");
  }

  open() {
    this.table.classList.add("covid_table-active");
  }

  close() {
    this.table.classList.remove("covid_table-active");
  }
}

export default DashboardTable;

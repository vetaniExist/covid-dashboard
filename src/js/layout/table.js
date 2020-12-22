import { createElement as createEl } from "../utils/elementsUtils";

export class DashboardTable {
  constructor(parentNode) {
    console.log("dashboard table not impl");
    this.table = createEl("div", "covid_table", parentNode);
  }
}

export default DashboardTable;

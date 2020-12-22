import { createElement as createEl } from "../utils/elementsUtils";

export class DashboardHeader {
  constructor(parentNode) {
    this.header = createEl("div", "flex covid_header", parentNode);
  }
}

export default DashboardHeader;

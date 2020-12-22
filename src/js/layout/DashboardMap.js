import { createElement as createEl } from "../utils/elementsUtils";

export class DashboardMap {
  constructor(parentNode) {
    console.log("MapLayout not impl");
    this.map = createEl("div", "covid_map", parentNode);
  }
}

export default DashboardMap;

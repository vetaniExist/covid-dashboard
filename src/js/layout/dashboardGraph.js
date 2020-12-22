import { createElement as createEl } from "../utils/elementsUtils";

export class DashboardGraph {
  constructor(parentNode) {
    console.log("Dashboard Graph not impl");
    this.graph = createEl("div", "covid_graph", parentNode);
  }
}

export default DashboardGraph;

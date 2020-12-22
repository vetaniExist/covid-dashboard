import { createElement as createEl } from "../utils/elementsUtils";

export class GlobalCases {
  constructor(parentNode) {
    console.log("GlobalCases not impl");
    this.globalCases = createEl("div", "covid_global-cases", parentNode);
  }
}

export default GlobalCases;

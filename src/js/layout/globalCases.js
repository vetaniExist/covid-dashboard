import { createElement as createEl } from "../utils/elementsUtils";

export class GlobalCases {
  constructor(parentNode, data) {
    console.log("GlobalCases not impl");
    this.globalCases = createEl("div", "covid_global-cases", parentNode);
    this.construnctDiv(data);
  }

  async construnctDiv(data) {
    const title = createEl("p", "text", this.globalCases);
    title.textContent = "Global Cases";

    this.textCases = createEl("p", "text", this.globalCases);
    this.textCases.textContent = await data.getWorldTotalCases();
  }

  getTextCasesField() {
    return this.textCases;
  }

  updateTotalCases(country) {
    this.textCases = country.getTotalCases();
  }
}

export default GlobalCases;

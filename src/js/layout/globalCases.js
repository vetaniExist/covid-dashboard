import { createElement as createEl } from "../utils/elementsUtils";

export class GlobalCases {
  constructor(parentNode, dataLink) {
    this.globalCases = createEl("div", "covid_global-cases", parentNode);
    this.construnctDiv(dataLink);
  }

  async construnctDiv(dataLink) {
    this.globalCases.appendChild(dataLink.getGlobalCasesTitle());
    dataLink.setGlobalCasesTitle("World Cases");

    this.globalCases.appendChild(dataLink.getTextCases());
  }

  getTextCasesField() {
    return this.textCases;
  }

  updateTotalCases(country) {
    this.textCases = country.getTotalCases();
  }
}

export default GlobalCases;

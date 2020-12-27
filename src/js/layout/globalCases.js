import { createElement as createEl } from "../utils/elementsUtils";

export class GlobalCases {
  constructor(parentNode, dataLink) {
    this.globalCases = createEl("div", "covid_global-cases", parentNode);
    this.construnctDiv(dataLink);
    dataLink.setGlobalCasesDiv(this);
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

  hide() {
    this.globalCases.classList.add("display-none");
  }

  show() {
    this.globalCases.classList.remove("display-none");
  }
}

export default GlobalCases;

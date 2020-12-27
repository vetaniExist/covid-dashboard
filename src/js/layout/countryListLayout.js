import { createElement as createEl } from "../utils/elementsUtils";

export class CountryList {
  constructor(parentNode) {
    this.parent = parentNode;
    this.countryList = createEl("div", "flex flex_wrap covid_country_list", this.parent);
    this.filter = "";
  }

  async constructListOfButtons(dataLink) {
    this.inputField = createEl("input", "input_search-field", this.countryList);
    this.countryList.appendChild(dataLink.getDivListOfButtons());
    this.configurateControlButtons(dataLink);
    this.activateInputField(dataLink);
    dataLink.setCountryListDiv(this);
  }

  configurateControlButtons(dataLink) {
    this.controlsButtonsContainer = createEl("div", "covid_table-control_panel", this.parent);

    this.controlPanelData = dataLink.getControlPanelDataClone();

    this.controlsButtonsContainer.appendChild(this.controlPanelData);
    this.controlPanelButtons = createEl("div", "flex covid_table-control_panel-buttons", this.controlsButtonsContainer);

    this.lArrow = dataLink.getLArrow();
    this.controlPanelButtons.appendChild(this.lArrow);

    this.totalBtn = dataLink.getTotalBtn();
    this.controlPanelButtons.appendChild(this.totalBtn);

    this.todayBtn = dataLink.getTodayBtn();
    this.controlPanelButtons.appendChild(this.todayBtn);

    this.rArrow = dataLink.getRArrow();
    this.controlPanelButtons.appendChild(this.rArrow);
    
    this.hideButton = dataLink.getHideButton(this);
    this.controlPanelButtons.appendChild(this.hideButton);
  }

  activateInputField(dataLink) {
    this.inputField.addEventListener("keypress", (e) => {
      this.filter = this.inputField.value + e.key;
      dataLink.filterButtonsUsingCountryName(this.filter);
    });

    this.inputField.addEventListener("keydown", (e) => {
      if (this.filter.length && e.key === "Backspace") {
        this.filter = this.filter.substring(0, this.filter.length - 1);
        dataLink.filterButtonsUsingCountryName(this.filter);
      }
    });
  }

  hide() {
    this.parent.classList.add("display-none");
  }

  show() {
    this.parent.classList.remove("display-none");
  }
}

export default CountryList;

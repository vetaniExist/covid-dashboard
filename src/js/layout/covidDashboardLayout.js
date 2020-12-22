import { createElement as createEl } from "../utils/elementsUtils";
import { CovidData as CData } from "../entries/covidData";

import { DashboardHeader as DHeader } from "./dashboardHeader";
import { DashboardTable as Table } from "./table";
import { CountryList as DashboarList } from "./countryListLayout";
import { DashboardMap as DMap } from "./DashboardMap";
import { DashboardGraph as Graph } from "./dashboardGraph";
import { GlobalCases as GCases } from "./globalCases";

export class CovidDashboardLayout {
  constructor() {
    this.body = document.body;
    this.wrap = createEl("div", "flex flex_wrap wrapper", this.body);
    this.dHeader = new DHeader(this.wrap);
    this.mainContentBox = createEl("div", "flex covid_main-box", this.wrap);
    this.countryCasesBox = createEl("div", "flex flex_wrap country_cases-box", this.mainContentBox);
    this.map = new DMap(this.mainContentBox);
    this.tableAndGraphBox = createEl("div", "flex flex_wrap table_graph-box", this.mainContentBox);

    this.table = new Table(this.tableAndGraphBox);
    this.graph = new Graph(this.tableAndGraphBox);

    this.globalCases = new GCases(this.countryCasesBox);
    this.countryList = new DashboarList(this.countryCasesBox);

    this.data = new CData();

    this.configurateBody();
    this.configurateFooter();
  }

  configurateFooter() {
    this.footer = createEl("footer", "", this.body);
  }

  configurateBody() {
    this.body.setAttribute("class", "flex flex_wrap");
  }
}

export default CovidDashboardLayout;

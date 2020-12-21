import { createElement as createEl } from "../utils/elementsUtils";
import { CovidData as CData } from "../entries/covidData";

import { DashboardTable as Table } from "./table";
import { CountryList as DashboarList } from "./countryListLayout";
import { MapLayout as DashboardMap } from "./mapLayout";
import { DashboardGraph as Graph } from "./dashboardGraph";

export class CovidDashboardLayout {
  constructor() {
    this.body = document.body;
    this.table = new Table();
    this.countryList = new DashboarList();
    this.map = new DashboardMap();
    this.graph = new Graph();
    this.data = new CData();

    this.configurateBody();
    this.configurateFooter();
  }

  configurateFooter() {
    this.footer = createEl("footer", "", this.body);
  }

  configurateBody() {
    this.body.classList.add("flex");
  }
}

export default CovidDashboardLayout;

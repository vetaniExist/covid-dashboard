import { createElement as createEl } from "../utils/elementsUtils";
import { CovidData as CData } from "../entries/covidData";
import { DataLinked as DataLink } from "./dataLinked";

import { DashboardHeader as DHeader } from "./dashboardHeader";
import { DashboardTable as Table } from "./table";
import { CountryList as DashboarList } from "./countryListLayout";
import { DashboardMap as DMap } from "./DashboardMap";
import { DashboardGraph as Graph } from "./dashboardGraph";
import { GlobalCases as GCases } from "./globalCases";

import logoRSS from "../../assets/images/rs_school_js.svg";

export class CovidDashboardLayout {
  constructor() {
    this.configurateLayout();
  }

  async configurateLayout() {
    this.data = new CData();
    await this.data.parseData();
    this.dataLink = new DataLink();
    await this.dataLink.configurateData(this.data);

    this.body = document.body;
    this.wrap = createEl("div", "flex flex_wrap wrapper", this.body);
    this.dHeader = new DHeader(this.wrap);
    this.mainContentBox = createEl("div", "flex covid_main-box", this.wrap);
    this.countryCasesBox = createEl("div", "flex flex_wrap country_cases-box", this.mainContentBox);
    this.map = new DMap(this.mainContentBox);
    this.tableAndGraphBox = createEl("div", "flex flex_wrap table_graph-box", this.mainContentBox);

    this.table = new Table(this.tableAndGraphBox, this.data, this.dataLink);
    this.graph = new Graph(this.tableAndGraphBox);

    this.globalCases = new GCases(this.countryCasesBox, this.dataLink);
    this.countryList = new DashboarList(this.countryCasesBox);

    this.countryList.constructListOfButtons(this.dataLink);

    this.configurateBody();
    this.configurateFooter();
  }

  configurateFooter() {
    this.footer = createEl("footer", "flex", this.body);

    const authorLink = createEl("a", "link text", this.footer);
    authorLink.setAttribute("href", "https://github.com/vetaniExist");
    authorLink.text = "author";

    const yearOfCreation = createEl("span", "text", this.footer);
    yearOfCreation.textContent = "2020";

    const logoLink = createEl("a", "flex link logoLink", this.footer);
    logoLink.setAttribute("href", "https://rs.school/js/");

    const logo = createEl("img", "logoImage", logoLink);
    logo.src = logoRSS;

  }

  configurateBody() {
    this.body.setAttribute("class", "flex flex_wrap");
  }
}

export default CovidDashboardLayout;

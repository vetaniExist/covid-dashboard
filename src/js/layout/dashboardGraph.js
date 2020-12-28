import Chart from "chart.js";

import { createElement as createEl } from "../utils/elementsUtils";

import { getTimelineForCountry } from "../utils/covidAPIUtils";
import { getDataSortFunc, itIsPercentFilter, itIsTodayFilter } from "../utils/dataLinkedUtils";

async function getTimeline(currentCountryName) {
  let timeline;
  if (currentCountryName !== "World") {
    timeline = await getTimelineForCountry(currentCountryName);
    return timeline.timeline;
  }
  timeline = await getTimelineForCountry();
  return timeline;
}

function getTimelineParam(cpd) {
  const currentParam = getDataSortFunc(cpd)[0];
  if (currentParam.toLowerCase().indexOf("cases") > -1) {
    return "cases";
  }
  if (currentParam.toLowerCase().indexOf("death") > -1) {
    return "deaths";
  }
  if (currentParam.toLowerCase().indexOf("revoc") > -1) {
    return "recovered";
  }
  return null;
}

export class DashboardGraph {
  constructor(parentNode, datalink) {
    this.graph = createEl("div", "covid_graph", parentNode);
    this.createChart(datalink);
    datalink.setChart(this);
  }

  async createChart(datalink) {
    const currentCountryName = datalink.getNameFromTable();

    const timeline = await getTimeline(currentCountryName);
    const data = timeline[getTimelineParam(datalink.getcontrolPanelDataText())];

    const dates = Object.keys(data);
    const values = Object.values(data);

    this.canvas = createEl("canvas", "chart_container", this.graph);
    const ctx = this.canvas.getContext("2d");

    const chartOptions = {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "TotalCases ".concat(currentCountryName),
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: values,
          },
        ],
      },
    };

    this.chart = new Chart(ctx, chartOptions);
    this.configurateControlButtons(datalink);
  }

  async updateChart(cpd, currentCountryName, countryObj) {
    console.log("update chart");
    const timeline = await getTimeline(currentCountryName);
    const param = getTimelineParam(cpd);
    console.log(param);
    const data = timeline[param];
    console.log(data);

    let values = itIsTodayFilter(Object.values(data), cpd);
    values = itIsPercentFilter(values, cpd, countryObj);

    this.chart.config.data.datasets[0].label = cpd.concat(`(${currentCountryName})`);
    this.chart.config.data.datasets[0].data = values;
    this.chart.update();
  }

  configurateControlButtons(dataLink) {
    this.controlPanel = createEl("div", "flex flex_wrap covid_table-control_panel", this.graph);

    this.controlPanelData = dataLink.getControlPanelDataClone();
    this.controlPanel.appendChild(this.controlPanelData);

    this.controlPanelButtons = createEl("div", "flex covid_table-control_panel-buttons", this.controlPanel);

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

  hide() {
    this.graph.classList.add("display-none");
  }

  show() {
    this.graph.classList.remove("display-none");
  }

  open() {
    this.graph.classList.add("covid_table-active");
    this.canvas.classList.add("chart_container-new_limit");
    // this.canvas.style.height = "60vh";
  }

  close() {
    this.canvas.style.height = "initial";
    this.graph.classList.remove("covid_table-active");
    this.canvas.classList.remove("chart_container-new_limit");
  }
}

export default DashboardGraph;

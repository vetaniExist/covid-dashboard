import Chart from "chart.js";

import { createElement as createEl } from "../utils/elementsUtils";

import { getTimelineForCountry } from "../utils/covidAPIUtils";
import { getDataSortFunc, shouldGetInfoInPercentes, itIsTodayData } from "./dataLinked";

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

function itIsPercentFilter(data, cpd, country) {
  const inIsPercent = shouldGetInfoInPercentes(cpd);
  if (inIsPercent) {
    return data.map((el) => (el / country.population) * 100000);
  }
  return data;
}

function itIsTodayFilter(date, cpd) {
  const dateCopy = date.slice(0);
  if (itIsTodayData(getDataSortFunc(cpd)[1])) {
    const newDate = date.map((el, idx) => {
      if (idx !== 0) {
        return el - dateCopy[idx - 1];
      }
      return el;
    });
    return newDate;
  }
  return dateCopy;
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
    console.log("timeline");
    console.log(timeline);
    const data = timeline[getTimelineParam(datalink.getcontrolPanelDataText())];

    const dates = Object.keys(data);
    const values = Object.values(data);

    const canvas = createEl("canvas", "", this.graph);
    const ctx = canvas.getContext("2d");

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
  }

  async updateChart(cpd, currentCountryName, countryObj) {
    const timeline = await getTimeline(currentCountryName);
    const param = getTimelineParam(cpd);
    const data = timeline[param];

    let values = itIsTodayFilter(Object.values(data), cpd);
    values = itIsPercentFilter(values, cpd, countryObj);

    this.chart.config.data.datasets[0].label = cpd.concat(`(${currentCountryName})`);
    this.chart.config.data.datasets[0].data = values;
    this.chart.update();
  }
}

export default DashboardGraph;

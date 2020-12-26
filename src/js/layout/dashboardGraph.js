import { createElement as createEl } from "../utils/elementsUtils";

import { getTimelineForCountry } from "../utils/covidAPIUtils";

import Chart from 'chart.js';

export class DashboardGraph {
  constructor(parentNode, datalink) {
    console.log("Dashboard Graph not impl");
    this.graph = createEl("div", "covid_graph", parentNode);
    this.createChart(datalink);
  }

  async createChart(datalink) {
    console.log("createChart");
    const currentCountryName = datalink.getNameFromTable();
    console.log(currentCountryName);
    const currentCountry = datalink.getCountryByName(currentCountryName);
    console.log("currentCountry");
    console.log(currentCountry);
    let timeline;
    if (currentCountryName !== "World") {
      timeline = await getTimelineForCountry(currentCountryName);
      console.log(timeline);
    } else {
      timeline = await getTimelineForCountry();
      console.log(timeline);
    }
    const data = timeline.cases;//.map((el) => el.cases);
    const dates = Object.keys(data);
    const values = Object.values(data);

    console.log("data");
    console.log(data);

    console.log("даты")
    console.log(dates);

    console.log("значения")
    console.log(values);

    const canvas = createEl("canvas", "", this.graph);
    const ctx = canvas.getContext('2d');

    const chartOptions = {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: "TotalCases",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: values
          }
        ]
      }
    };

    const myChart = new Chart(ctx, chartOptions);
  }
}

export default DashboardGraph;

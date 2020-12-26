import { createElement as createEl } from "../utils/elementsUtils";

import { getTimelineForCountry } from "../utils/covidAPIUtils";
import { getDataSortFunc, shouldGetInfoInPercentes, itIsTodayData } from "./dataLinked";

import Chart from 'chart.js';

export class DashboardGraph {
  constructor(parentNode, datalink) {
    console.log("Dashboard Graph not impl");
    this.graph = createEl("div", "covid_graph", parentNode);
    this.createChart(datalink);
    datalink.setChart(this);
  }

  async createChart(datalink) {
    console.log("createChart");
    const currentCountryName = datalink.getNameFromTable();
    console.log(currentCountryName);

    let timeline = await this.getTimeline(currentCountryName);
    console.log("таймлайн");
    console.log(timeline);

    const data = timeline[this.getTimelineParam(datalink.getcontrolPanelDataText())];

    console.log("data");
    console.log(data);


    const dates = Object.keys(data);
    const values = Object.values(data);


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
            label: "TotalCases ".concat(currentCountryName),
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
            data: values
          }
        ]
      }
    };

    this.chart = new Chart(ctx, chartOptions);
  }

  async updateChart(cpd, currentCountryName, countryObj) {
    let timeline = await this.getTimeline(currentCountryName);
    const param = this.getTimelineParam(cpd);
    console.log("параметр ", param);
    const data = timeline[param];
    console.log(data);

    let values = this.itIsTodayFilter(Object.values(data), cpd);
    values = this.itIsPercentFilter(values, cpd, countryObj);

    this.chart.config.data.datasets[0].label = cpd;
    this.chart.config.data.datasets[0].data = values;
    this.chart.update();
  }

  itIsTodayFilter(date, cpd) {
    const dateCopy = date.slice(0);
    console.log("копия");
    console.log(dateCopy);
    if (itIsTodayData(getDataSortFunc(cpd)[1])) {
      const newDate = date.map((el, idx) => {
        console.log("index", idx)
        if (idx !== 0) {
          return el - dateCopy[idx - 1];
        }
        return el;
      })
      return newDate;
    }
    return dateCopy;
  }

  itIsPercentFilter(data, cpd, country) {
    const inIsPercent = shouldGetInfoInPercentes(cpd);
    if (inIsPercent) {
      return data.map((el) => (el / country.population) * 100000);
    } 
    return data;
  }

  async getTimeline(currentCountryName) {
    console.log("getTimeline");
    console.log(currentCountryName);
    let timeline;
    if (currentCountryName !== "World") {
      timeline = await getTimelineForCountry(currentCountryName);
      console.log(timeline);
      return timeline;
    } else {
      timeline = await getTimelineForCountry();
      console.log(timeline);
      return timeline;
    }

  }

  getTimelineParam(cpd) {
    const currentParam = getDataSortFunc(cpd)[0];
    console.log("getTimelineParam");
    console.log(currentParam);
    if (currentParam.toLowerCase().indexOf("cases") > -1) {
      console.log("возвращаем cases");
      return "cases";
    }
    if (currentParam.toLowerCase().indexOf("death") > -1) {
      return "deaths";
    }
    if (currentParam.toLowerCase().indexOf("revoc") > -1) {
      return "recovered";
    }
  }
}

export default DashboardGraph;

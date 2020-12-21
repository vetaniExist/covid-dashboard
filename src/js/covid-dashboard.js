import { CovidDashboardLayout as Layout } from "./layout/covidDashboardLayout";

console.log("hello");

class CovidDashboard {
  constructor() {
    this.layout = new Layout();
  }
}

const dashboard = new CovidDashboard();

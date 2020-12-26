import { CovidDashboardLayout as Layout } from "./layout/covidDashboardLayout";

class CovidDashboard {
  constructor() {
    this.layout = new Layout();
    this.scratch = "scratchForWebpach";
  }

  tmpScratchWebpach() {
    console.log(this.scratch);
  }
}

const dashboard = new CovidDashboard();
dashboard.tmpScratchWebpach();

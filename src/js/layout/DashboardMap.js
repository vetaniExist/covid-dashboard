import { createElement as createEl } from "../utils/elementsUtils";
import L from "../../../node_modules/leaflet/dist/leaflet";
import "../../../node_modules/leaflet/dist/leaflet.css";

import { CovidData as CData } from "../entries/covidData";

import { nominatimOSMRequest } from "../utils/mapAPIUtils"

export class DashboardMap {
  constructor(parentNode) {
    console.log("MapLayout not impl");
    this.map = createEl("div", "covid_map", parentNode);
    this.constructMap();
    this.data = new CData();
  }

  async constructMap() {
    // this.leafletMapContainer = createEl()
    await this.map.setAttribute("id", "mapid");
    const mapOptions = {
      center: [17.385044, 78.486671],
      zoom: 3,
      maxZoom: 10,
    };
    const mymap = L.map("mapid", mapOptions);// setView([51.505, -0.09], 13);
    const layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    mymap.addLayer(layer);
    mymap.on("click", (e) => {
      console.log(e.latlng)
    });

    this.countries = await this.data.getAllCountries();
    console.log(this.countries);
    const countriesName = this.countries.map((el) => el.name);

    countriesName.forEach(async (el) => {
      (nominatimOSMRequest(el));
    });
    console.log(countriesName);
  }
}

export default DashboardMap;

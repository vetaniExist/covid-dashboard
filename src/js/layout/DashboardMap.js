import { createElement as createEl } from "../utils/elementsUtils";
import L from '../../../node_modules/leaflet/dist/leaflet';
import "../../../node_modules/leaflet/dist/leaflet.css";

export class DashboardMap {
  constructor(parentNode) {
    console.log("MapLayout not impl");
    this.map = createEl("div", "covid_map", parentNode);
    this.constructMap();
  }

  async constructMap() {
    // this.leafletMapContainer = createEl()
    await this.map.setAttribute("id", "mapid");
    const mapOptions = {
      center: [17.385044, 78.486671],
      zoom: 10
    }
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    mymap.addLayer(layer);
  }
}

export default DashboardMap;

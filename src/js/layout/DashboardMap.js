import { createElement as createEl } from "../utils/elementsUtils";
import L from "../../../node_modules/leaflet/dist/leaflet";
import "../../../node_modules/leaflet/dist/leaflet.css";

import { CovidData as CData } from "../entries/covidData";

import { nominatimOSMRequest, getGeoJSON } from "../utils/mapAPIUtils"
import { geoJSON } from "leaflet";

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
      zoom: 1,
      maxZoom: 10,
      // minZoom: 1,
    };
    const mymap = L.map("mapid", mapOptions);// setView([51.505, -0.09], 13);
    const layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    mymap.addLayer(layer);
    mymap.on("click", (e) => {
      console.log(e);
      console.log(e.latlng)
    });
    let geoJSON = await getGeoJSON();


    // const arrOfCountrysCenter = [];
    const afgan = geoJSON.features[0];
    console.log(afgan);
    console.log(afgan.geometry.coordinates[0].slice());
    geoJSON.features.forEach((country, ind) => {
      if (country.geometry.type === "Polygon") {
        country.geometry.coordinates.forEach((polygon) => {
          polygon.forEach((el, index) => {
            polygon[index] = [el[1], el[0]];
          });
        });
      } else if (country.geometry.type === "MultiPolygon") {
        country.geometry.coordinates.forEach((polygons) => {
          polygons.forEach((polygon) => {
            console.log(polygon);
            polygon.forEach((el, index) => {
              console.log(index, el);
              polygon[index] = [el[1], el[0]];
            });
          });
        });
      }
      L.polygon(country.geometry.coordinates, country.properties).addTo(mymap);
    });

    // const RussiaFromGeoJSON = geoJSON.features.filter((el) => el.properties.name === "Russia")[0];
    // console.log(RussiaFromGeoJSON);

    /*     this.countries = await this.data.getAllCountries();
        console.log(this.countries.length);
        const countriesName = this.countries.map((el) => el.name);
    
        countriesName.forEach(async (el) => {
          // (nominatimOSMRequest(el));
        }); */
    // console.log(countriesName);
  }
}

export default DashboardMap;

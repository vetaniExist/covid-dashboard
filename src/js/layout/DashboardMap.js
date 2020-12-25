import { createElement as createEl } from "../utils/elementsUtils";
import L from "../../../node_modules/leaflet/dist/leaflet";
import "../../../node_modules/leaflet/dist/leaflet.css";

import { CovidData as CData } from "../entries/covidData";
import { getGeoJSON } from "../utils/mapAPIUtils";



export class DashboardMap {
  constructor(parentNode, datalinked) {
    console.log("MapLayout not impl");
    this.map = createEl("div", "covid_map", parentNode);
    this.constructMap(datalinked);
    this.data = new CData();
  }

  async constructMap(datalinked) {
    this.leafletMapContainer = createEl("div", "covid_map-container", this.map)
    await this.leafletMapContainer.setAttribute("id", "mapid");
    this.countries = await this.data.getAllCountries();
    console.log("страны");
    console.log(this.countries);
    const mapOptions = {
      center: [17.385044, 78.486671],
      zoom: 1,
      maxZoom: 10,
      // minZoom: 1,
    };
    const mymap = L.map("mapid", mapOptions);
    new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mymap);

    let geoJSON = await getGeoJSON();

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
            polygon.forEach((el, index) => {
              polygon[index] = [el[1], el[0]];
            });
          });
        });
      }
      const countryObj = this.countries.filter((el) => el.name === country.properties.name)[0];
      // console.log(countryObj.todayConfirmed, countryObj.name);
      const polygon = L.polygon(country.geometry.coordinates, country.properties).addTo(mymap);
      const center = polygon.getBounds().getCenter();
      const setting = this.getSetting(countryObj);
      L.circle(center, {
        color: setting[1],
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: setting[0],
      }).addTo(mymap);

      polygon.on("mouseover", (e) => {
        console.log(country.properties.name);
        console.log(e.latlng)
        console.log(center);
        L.popup().setLatLng(center).setContent(`<p>${country.properties.name}<br/>${datalinked.getcontrolPanelDataText()}</p>`).openOn(mymap);
      });
    });
  }

  getSetting(country) {
    if (!country) {
      console.log("return: ", 10);
      return [10.0, "white"];
    }
    if (country.totalConfirmed > 5000) {
      console.log("return: ", 30);
      return [50.0, "red"];
    }
    if (country.totalConfirmed > 1000) {
      console.log("return: ", 40);
      return [70.0, "purple"];
    }
    if (country.totalConfirmed > 500000) {
      console.log("return: ", 50);
      return [90.0, "darkgreen"];
    }
    if (country.totalConfirmed > 5000000) {
      console.log("return: ", 60);
      return [120.0,"black"];
    }
    console.log("return: ", 20);
    return [20.0, "gren"];
  }
}

export default DashboardMap;

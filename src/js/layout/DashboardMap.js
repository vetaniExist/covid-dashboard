import { createElement as createEl } from "../utils/elementsUtils";
import L from "../../../node_modules/leaflet/dist/leaflet";
import "../../../node_modules/leaflet/dist/leaflet.css";

import { CovidData as CData } from "../entries/covidData";

import { nominatimOSMRequest, getGeoJSON } from "../utils/mapAPIUtils"
import { geoJSON } from "leaflet";

import iconP from "../../../node_modules/leaflet/dist/images/marker-icon.png";
import shadow from "../../../node_modules/leaflet/dist/images/marker-shadow.png";
import { icon, Marker } from 'leaflet';



export class DashboardMap {
  constructor(parentNode) {
    console.log("MapLayout not impl");
    this.map = createEl("div", "covid_map", parentNode);
    this.constructMap();
    this.data = new CData();
    // this.popupDiv = createEl("div", "display-none flex popup_div", this.map);
  }

  async constructMap() {
    this.leafletMapContainer = createEl("div", "covid_map-container", this.map)
    await this.leafletMapContainer.setAttribute("id", "mapid");
    const mapOptions = {
      center: [17.385044, 78.486671],
      zoom: 1,
      maxZoom: 10,
      // minZoom: 1,
    };
    const mymap = L.map("mapid", mapOptions);// setView([51.505, -0.09], 13);
    const layer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    mymap.addLayer(layer);
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
            // console.log(polygon);
            polygon.forEach((el, index) => {
              // console.log(index, el);
              polygon[index] = [el[1], el[0]];
            });
          });
        });
      }
      const polygon = L.polygon(country.geometry.coordinates, country.properties).addTo(mymap);
      const center = polygon.getBounds().getCenter();
      L.circle(center, {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 50.0,
      })
        .addTo(mymap);
      polygon.on("mouseout", () => {
      });
      polygon.on("mouseover", (e) => {
        console.log(country.properties.name);
        console.log(e.latlng)
        console.log(center);
        L.popup().setLatLng(center).setContent(`<p>${country.properties.name}<br/></p>`).openOn(mymap);
        // this.popupDiv.textContent = country.properties.name;
        // this.popupDiv.classList.remove("display-nonw");
        // this.map.appendChild(this.popupDiv);
      });
    });
  }
}

export default DashboardMap;

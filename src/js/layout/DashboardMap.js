import L from "../../../node_modules/leaflet/dist/leaflet";
import "../../../node_modules/leaflet/dist/leaflet.css";

import { createElement as createEl } from "../utils/elementsUtils";

import { CovidData as CData } from "../entries/covidData";
import { getGeoJSON } from "../utils/mapAPIUtils";
import { getDataSortFunc } from "./dataLinked";

/* eslint-disable no-param-reassign */
function updateMarker(marker, value, isPercent) {
  // 100000
  //          18650454
  //          1362564
  if ((value > 250000 & !isPercent) || (value > 2.5 & isPercent)) {
    // console.log("find black");
    marker.options.color = "black";
    marker.setRadius(9.0);
    return marker;
  }
  if ((value > 100000 & !isPercent) || (value > 1.0 & isPercent)) {
    marker.options.color = "darkgreen";
    marker.setRadius(7.0);
    return marker;
  }
  if ((value > 10000 & !isPercent) || (value > 0.1 & isPercent)) {
    marker.options.color = "purple";
    marker.setRadius(5.0);
    return marker;
  }
  if ((value > 5000 & !isPercent) || (value > 0.05 & isPercent)) {
    marker.options.color = "red";
    marker.setRadius(3.0);
    console.log(marker);
    return marker;
  }

  marker.options.color = "gren";
  marker.setRadius(2.0);
  return marker;
}
/* eslint-enable no-param-reassign */

export class DashboardMap {
  constructor(parentNode, datalinked) {
    console.log("MapLayout not impl");
    this.map = createEl("div", "covid_map", parentNode);
    this.markers = [];
    this.constructMap(datalinked);
    this.data = new CData();
  }

  async constructMap(datalinked) {
    this.leafletMapContainer = createEl("div", "covid_map-container", this.map);
    await this.leafletMapContainer.setAttribute("id", "mapid");
    this.countries = await this.data.getAllCountries();

    console.log("страны");
    console.log(this.countries);

    const mymap = this.createMap();

    const geoJSON = await getGeoJSON();

    let counter = 0;
    geoJSON.features.forEach((country) => {
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
      // name = 144
      // sovereignt= 153;
      // subunit 147
      // admin 147
      // name_long= 153;
      // brk_name 143
      // name_sort 148
      // geounit 147
      // formal_en 23
      //  sovereignt  + name_long + formal_en == 163/177
      const countryObj = this.countries.filter((el) => {
        const rule1 = el.name === country.properties.sovereignt;
        const rule2 = el.name === country.properties.name_long;
        const rule3 = false || country.properties.formal_en && country.properties.formal_en.indexOf(el.name) > -1;
        if (rule1 || rule2 || rule3) {
          return el;
        }
      })[0];
      if (countryObj) {
        counter += 1;
      }

      const polygon = L.polygon(country.geometry.coordinates, country.properties).addTo(mymap);
      const center = polygon.getBounds().getCenter();
      const marker = this.createMarker(countryObj, center, datalinked);
      marker.addTo(mymap);
      this.markers.push(marker);

      polygon.on("mouseout", () => {
        mymap.closePopup();
      });

      polygon.on("mouseover", () => {
        // console.log(country.properties.name);
        // console.log(e.latlng)
        // console.log(center);
        L.popup().setLatLng(center)
          .setContent(`<p>${country.properties.name}<br/>${datalinked.getcontrolPanelDataText()}</p>`)
          .openOn(mymap);
      });
    });
    console.log("Насчитали столько стран: ", counter);
    console.log(geoJSON.features.length);
  }

  createMap() {
    const mapOptions = {
      center: [17.385044, 78.486671],
      zoom: 1,
      maxZoom: 10,
      // minZoom: 1,
    };

    const mymap = L.map("mapid", mapOptions);
    new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mymap);

    return mymap;
  }

  createMarker(country, center, datalinked) {
    const markerPropety = {
      fillColor: "#f03",
      fillOpacity: 0.5,
      color: "white",
      setColor: (newColor) => {
        this.color = newColor;
      },
    };
    const marker = L.circleMarker(center, markerPropety);
    if (!country) {
      markerPropety.setColor("white");
      marker.setRadius(1.0);
      return marker;
    }
    marker.markerCountryName = country.name;

    const cpd = datalinked.getcontrolPanelDataText();
    const currentParam = getDataSortFunc(cpd)[1];
    const inIsPercent = datalinked.shouldGetInfoInPercentes(cpd);
    let currentValue;
    if (inIsPercent) {
      currentValue = (country[currentParam] / country.population) * 100000;
    } else {
      currentValue = country[currentParam];
    }
    return updateMarker(marker, currentValue, inIsPercent);
  }

  updateAllMarkers(cpd, inIsPercent) {
    this.markers.forEach((el) => {
      if (el.markerCountryName) {
        const countryObj = this.countries.filter((country) => country.name === el.markerCountryName)[0];
        const currentParam = getDataSortFunc(cpd)[1];

        let currentValue;
        if (inIsPercent) {
          currentValue = (countryObj[currentParam] / countryObj.population) * 100000;
        } else {
          currentValue = countryObj[currentParam];
        }
        el = updateMarker(el, currentValue, inIsPercent);
      }
    });
  }
}

export default DashboardMap;

import L from "../../../node_modules/leaflet/dist/leaflet";
import "../../../node_modules/leaflet/dist/leaflet.css";

import { createElement as createEl } from "../utils/elementsUtils";

import { CovidData as CData } from "../entries/covidData";
import { getGeoJSON } from "../utils/mapAPIUtils";
import { getDataSortFunc, shouldGetInfoInPercentes } from "./dataLinked";

/* eslint-disable no-param-reassign */
function updateMarker(marker, value, isPercent) {
  if ((value > 250000 && !isPercent) || (value > 2.5 && isPercent)) {
    marker.options.color = "black";
    marker.setRadius(9.0);
    return marker;
  }
  if ((value > 100000 && !isPercent) || (value > 1.0 && isPercent)) {
    marker.options.color = "darkgreen";
    marker.setRadius(7.0);
    return marker;
  }
  if ((value > 10000 && !isPercent) || (value > 0.1 && isPercent)) {
    marker.options.color = "purple";
    marker.setRadius(5.0);
    return marker;
  }
  if ((value > 5000 && !isPercent) || (value > 0.05 && isPercent)) {
    marker.options.color = "red";
    marker.setRadius(3.0);
    return marker;
  }

  marker.options.color = "gren";
  marker.setRadius(2.0);
  return marker;
}
/* eslint-enable no-param-reassign */

function createMap() {
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

export class DashboardMap {
  constructor(parentNode, datalinked) {
    this.map = createEl("div", "covid_map", parentNode);
    this.markers = [];
    this.constructMap(datalinked);
    this.data = new CData();
    this.configurateControlButtons(datalinked);
  }

  async constructMap(datalinked) {
    this.leafletMapContainer = createEl("div", "covid_map-container", this.map);
    await this.leafletMapContainer.setAttribute("id", "mapid");
    this.countries = await this.data.getAllCountries();

    const mymap = createMap();
    this.createLegend(mymap);

    const geoJSON = await getGeoJSON();

    geoJSON.features.forEach((country) => {
      if (country.geometry.type === "Polygon") {
        country.geometry.coordinates.forEach((polygon) => {
          /* eslint-disable no-param-reassign */
          polygon.forEach((el, index) => {
            polygon[index] = [el[1], el[0]];
          });
          /* eslint-enable no-param-reassign */
        });
      } else if (country.geometry.type === "MultiPolygon") {
        country.geometry.coordinates.forEach((polygons) => {
          /* eslint-disable no-param-reassign */
          polygons.forEach((polygon) => {
            polygon.forEach((el, index) => {
              polygon[index] = [el[1], el[0]];
            });
          });
          /* eslint-enable no-param-reassign */
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
        const rule3 = false || (country.properties.formal_en && country.properties.formal_en.indexOf(el.name) > -1);
        return rule1 || rule2 || rule3;
      })[0];

      const polygon = L.polygon(country.geometry.coordinates, country.properties).addTo(mymap);
      const center = polygon.getBounds().getCenter();
      const marker = this.createMarker(countryObj, center, datalinked);
      marker.addTo(mymap);
      this.markers.push(marker);

      polygon.on("mouseout", () => {
        mymap.closePopup();
      });

      polygon.on("mouseover", () => {
        // console.log(e.latlng)
        // console.log(center);
        L.popup().setLatLng(center)
          .setContent(`<p>${country.properties.name}<br/>${datalinked.getcontrolPanelDataText()}</p>`)
          .openOn(mymap);
      });
    });
  }

  createLegend(map) {
    const legend = L.control({ position: "bottomright" });
    this.legendDiv = createEl("div", "info legend");

    legend.onAdd = () => {
      this.updateLegend();
      return this.legendDiv;
    };
    legend.addTo(map);
  }

  updateLegend(inIsPercent) {
    let grades = [250000, 100000, 10000, 5000, 0];
    const colors = ["black", "darkgreen", "purple", "red"];
    if (inIsPercent) {
      grades = grades.map((el) => el / 100000);
    }

    // loop through our density intervals and generate a label with a colored square for each interval
    this.legendDiv.innerHTML = "";
    for (let i = 0; i < grades.length; i += 1) {
      this.legendDiv.innerHTML += `<i style="background:${colors[i]}"></i> ${grades[i]}`
        .concat(`${grades[i + 1] ? "&ndash;".concat(grades[i + 1]).concat("<br>") : "+"}`);
    }
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
    const inIsPercent = shouldGetInfoInPercentes(cpd);
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
        return updateMarker(el, currentValue, inIsPercent);
      }
      return null;
    });
  }

  configurateControlButtons(dataLink) {
    this.controlsButtonsContainer = createEl("div", "flex just_cont-center covid_table-control_panel-map", this.map);

    this.controlPanelData = dataLink.getControlPanelDataClone();

    this.lArrow = dataLink.getLArrow();
    this.controlsButtonsContainer.appendChild(this.lArrow);

    this.totalBtn = dataLink.getTotalBtn("control_button-map");
    this.controlsButtonsContainer.appendChild(this.totalBtn);

    this.controlsButtonsContainer.appendChild(this.controlPanelData);

    this.todayBtn = dataLink.getTodayBtn("control_button-map");
    this.controlsButtonsContainer.appendChild(this.todayBtn);

    this.rArrow = dataLink.getRArrow();
    this.controlsButtonsContainer.appendChild(this.rArrow);

    this.hideButton = dataLink.getHideButton(this);
    this.controlsButtonsContainer.appendChild(this.hideButton);
  }

  hide() {
    this.map.classList.add("display-none");
  }

  show() {
    this.map.classList.remove("display-none");
  }
}

export default DashboardMap;

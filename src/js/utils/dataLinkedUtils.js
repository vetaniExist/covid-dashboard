export function getDataSortFunc(currentControlPanelDataText, elA, elB) {
  switch (currentControlPanelDataText) {
    case "totalCases": {
      return elA ? [elB.totalConfirmed - elA.totalConfirmed, "cases", "totalConfirmed"] : ["cases", "totalConfirmed"];
    }
    case "totalDeaths": {
      return elA ? [elB.totalDeath - elA.totalDeath, "deaths", "totalDeath"] : ["deaths", "totalDeath"];
    }
    case "totalRecovered": {
      return elA ? [elB.totalRecovered - elA.totalRecovered, "revoc", "totalRecovered"] : ["revoc", "totalRecovered"];
    }
    case "totalCasesPer100": {
      return elA ? [(elB.totalConfirmed / elB.population) * 100000
        - (elA.totalConfirmed / elA.population) * 100000, "cases", "totalConfirmed"] : ["cases", "totalConfirmed"];
    }
    case "totalDeathPer100": {
      return elA ? [(elB.totalDeath / elB.population) * 100000
        - (elA.totalDeath / elA.population) * 100000, "cases", "totalDeath"] : ["deaths", "totalDeath"];
    }
    case "totalRecoveredPer100": {
      return elA ? [(elB.totalRecovered / elB.population) * 100000
        - (elA.totalRecovered / elA.population) * 100000, "cases", "totalRecovered"] : ["revoc", "totalRecovered"];
    }

    case "todayCases": {
      return elA ? [elB.todayConfirmed - elA.todayConfirmed, "cases", "todayConfirmed"] : ["cases", "todayConfirmed"];
    }
    case "todayDeaths": {
      return elA ? [elB.todayDeath - elA.todayDeath, "deaths", "todayDeath"] : ["deaths", "todayDeath"];
    }
    case "todayRecovered": {
      return elA ? [elB.todayRecovered - elA.todayRecovered, "cases", "todayRecovered"] : ["revoc", "todayRecovered"];
    }
    case "todayCasesPer100": {
      return elA ? [(elB.todayConfirmed / elB.population) * 100000
        - (elA.todayConfirmed / elA.population) * 100000, "cases", "todayConfirmed"] : ["cases", "todayConfirmed"];
    }
    case "todayDeathPer100": {
      return elA ? [(elB.todayDeath / elB.population) * 100000
        - (elA.todayDeath / elA.population) * 100000, "cases", "todayDeath"] : ["deaths", "todayDeath"];
    }
    case "todayRecoveredPer100": {
      return elA ? [(elB.todayRecovered / elB.population) * 100000
        - (elA.todayRecovered / elA.population) * 100000, "cases", "todayRecovered"] : ["revoc", "todayRecovered"];
    }

    default: {
      break;
    }
  }
  return null;
}

export function shouldGetInfoInPercentes(mode) {
  return mode.indexOf("Per") > -1;
}

export function itIsTodayData(mode) {
  return mode.indexOf("today") > -1;
}

export function decorCountryAddLinkToButton(el, button, textDiv) {
  const countryObj = el;
  countryObj.linkToCountryButton = button;
  countryObj.linkCountryButtonTextDiv = textDiv;
}

export function itIsPercentFilter(data, cpd, country) {
  const inIsPercent = shouldGetInfoInPercentes(cpd);
  if (inIsPercent) {
    if (Array.isArray(data)) {
      return data.map((el) => (el / country.population) * 100000);
    }
    return (data / country.population) * 100000;
  }
  return data;
}

export function itIsTodayFilter(date, cpd) {
  const dateCopy = date.slice(0);
  if (itIsTodayData(getDataSortFunc(cpd)[1])) {
    const newDate = date.map((el, idx) => {
      if (idx !== 0) {
        return el - dateCopy[idx - 1];
      }
      return el;
    });
    return newDate;
  }
  return dateCopy;
}

export default getDataSortFunc;

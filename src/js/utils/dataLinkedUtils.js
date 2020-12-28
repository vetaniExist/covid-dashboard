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

export default getDataSortFunc;

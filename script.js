faresUrl =
  "https://www.ryanair.com/api/farfnd/3/oneWayFares?&departureAirportIataCode=KRK&language=pl&market=pl-pl&offset=0&outboundDepartureDateFrom=2022-02-25&outboundDepartureDateTo=2022-05-25&priceValueTo=300";
imagesUrl = "https://www.ryanair.com/de/de.farefinder.json";
// selectedCountries = ["es", "se", "de", "fr"];

async function main() {
  let faresData = await getFaresData();
  let destinationImages = await getFaresDestinationImages(faresData);
  showFares(faresData, destinationImages);
}

function getFaresData() {
  return fetch(faresUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Fare API no response");
      }
    })
    .then((data) => data.fares)
    .then((allFares) => {
      return allFares.filter(
        (fare) =>
          fare.outbound.arrivalAirport.city.countryCode == "es" ||
          fare.outbound.arrivalAirport.city.countryCode == "se" ||
          fare.outbound.arrivalAirport.city.countryCode == "de" ||
          fare.outbound.arrivalAirport.city.countryCode == "fr"
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

function getFaresDestinationImages(faresData) {
  return fetch(imagesUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("DestinationImg API no response");
      }
    })
    .then((data) => {
      let iataCodes = new Map();
      faresData.forEach((element) => {
        let iataCode = element.outbound.arrivalAirport.iataCode;
        if (data.destinationInformation[iataCode]) {
          iataCodes.set(
            iataCode,
            data.destinationInformation[iataCode].imageRegularUrl
          );
        }
      });
      return iataCodes;
    })
    .catch((error) => {
      console.log(error);
    });
}

function showFares(faresData, destinationImages) {
  faresData.forEach((fare) => {
    document.getElementById('faresCards').innerHTML +=
    `<div class="card">
    <img class="fare-img" src="https://www.ryanair.com${destinationImages.get(fare.outbound.arrivalAirport.iataCode)}" onerror="this.onerror=null; this.src='https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg'">
    <div class="text">
      ${fare.outbound.arrivalAirport.countryName} -
      ${fare.outbound.arrivalAirport.city.name} 
      ${fare.outbound.arrivalDate} 
      ${fare.outbound.price.value} 
      ${fare.outbound.price.currencySymbol}
    </div>
  </div>`
  })
}

main();

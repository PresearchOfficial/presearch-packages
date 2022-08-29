const continents = {
  'AF' : 'Africa',
  'AS' : 'Asia',
  'AN' : 'Antarctica',
  'NA' : 'North America',
  'SA' : 'South America',
  'EU' : 'Europe',
  'OC' : 'Oceania',
}

function getAirportDetails(airportCode, airports){
    const acode = airportCode.toUpperCase();
    if(!airports[acode]) return undefined;

    // configure openstreetmap iframe source
    const r = 0.3;
    const lat = airports[acode].latitude_deg;
    const lon = airports[acode].longitude_deg;
    const iframeSrc = "https://www.openstreetmap.org/export/embed.html"
      + '?layer=mapnik'
      + '&bbox=' + [lon - r/2, lat - r/4, lon + r/2, lat + r/4].join(',')
      + '&marker=' + [lat, lon].join(',')

    // return markup with data
    return `
    <div id="presearchPackage">
      <h2>${airports[acode].name}</h2>
      <div class="flexrow">
        <div class="airport-details">
            <table>
                <tr>
                    <td class="grey">Code</td>
                    <td>${(airports[acode].municipality || '') +  ' ' + acode}</td>
                </tr>
                <tr>
                    <td class="grey">City</td>
                    <td>${(airports[acode].city || '') + ', ' + (airports[acode].ctry || '')}</td>
                </tr>
                <tr>
                    <td class="grey">Continent</td>
                    <td>${continents[airports[acode].continent] || ''}</td>
                </tr>
                <tr>
                    <td class="grey">Elevation</td>
                    <td>${airports[acode].elevation_ft + ' ft' || ''}</td>
                </tr>
                <tr>
                    <td class="grey">Size</td>
                    <td>${airports[acode].type || ''}</td>
                </tr>
                <tr>
                    <td class="grey">Latitude</td>
                    <td>${airports[acode].latitude_deg || ''}</td>
                </tr>
                <tr>
                    <td class="grey">Longitude</td>
                    <td>${airports[acode].longitude_deg || ''}</td>
                </tr>
            </table>
        </div>
        <div class="airport-osm">
          <iframe 
            width="400" 
            height="300" 
            frameborder="0" 
            scrolling="no" 
            marginheight="0" 
            marginwidth="0" 
            src="${iframeSrc}" 
            style="border: 1px solid black border-radius:10px;">
          </iframe><br/><small><a href="https://www.openstreetmap.org/#map=19/21.08774/72.71053">View Larger Map</a></small>
        </div>
      </div>
    </div>
    `;
}
module.exports = {getAirportDetails};
const config = require('./config.json');
const dayjs = require('dayjs');

const Amadeus = require('amadeus');

async function getPopularDestinations(departure, airports){
    try {
        departure = departure.toUpperCase();

        // check if requested departure airport code is available
        if(!airports[departure]){
            // Check for city name in airports array
            departure = departure.toLowerCase().replace(/^./,departure[0]);
            Object.keys(airports).some(e=>{
                if(airports[e].city === departure){
                    departure = e;
                }
            })
            if(!airports[departure]) return undefined;
        }

        //get data from api
		var result = await fetchDestinations(departure);
        
		result = result.result;
        if(!result || result.meta.count < 1) return undefined;
        
        // parse destination code to city name
        var destinations = '';
        result.data.forEach(e =>{
            const src = airports[departure].city || airports[departure].municipality || airports[departure].name;
            if(airports[e.destination]){
                const dest = airports[e.destination].city || airports[e.destination].municipality || airports[e.destination].name;
                destinations += `<p>${src} to ${dest}</p>`;
            }
        })

        //return markup
        return `
        <div id="presearchPackage">
            <h3>Popular destinations form ${departure} in last month.</h3>
            <div class="flexrow popular-destinations" style="justify-content: start;flex-wrap: wrap;">
                ${destinations}
            </div>
        </div>
        `;
    }catch(err){
        console.log(err)
        return undefined;
    }    
}
async function fetchDestinations(departure, ){
    // specify for which month popular destination is required
    // taking previous month currently
    period = new dayjs().subtract(1,'month').format('YYYY-MM');

    const amadeus = new Amadeus(config.amadeus_test);
    return await amadeus.travel.analytics.airTraffic.booked.get({
        originCityCode : departure,
        period : period
    });
}

module.exports = {getPopularDestinations};
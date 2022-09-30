const config = require('./config.json');
var fs = require('fs');

const dayjs = require('dayjs');
const { duration } = require('dayjs');
dayjs.extend(duration);

const Amadeus = require('amadeus');

async function searchTrip(origin, destination, airports, airlines){
    try {

        // origin airport code
        OCODE = getFlightCode(origin, airports);
        // destination airport code
        DCODE = getFlightCode(destination, airports);

        if(!(OCODE && DCODE)) return undefined;
        
        //get data from api
		var result = await flightOffersSearch(OCODE, DCODE);
		result = result.result;
        if(!result || result.meta.count < 1) return undefined;
        
        // parse flights
        var flights = '';
        result.data.forEach(e =>{
            var airline = '';
            if(airlines.some(f => {
                    if(f.iata === e.validatingAirlineCodes[0]){
                        airline = f.name;
                        return true;
                    } 
                })
            ){
                flights += `
                <tr>
                    <td style="width: 15em;display:flex;"><img class="logos" src="data:image/png;base64,${ base64(__dirname + '/logos/' + e.validatingAirlineCodes[0] + '.png')}">${airline}</td>
                    <td>${e.itineraries[0].segments[0].departure.terminal}</td>
                    <td>${dayjs(e.itineraries[0].segments[0].departure.at).format("HH:mm a")}</td>
                    <td>${dayjs.duration(e.itineraries[0].duration).format("HH[h] mm[m]")}</td>
                    <td>${e.itineraries[0].segments.length === 1 ? 'Nonstop' : 'Connecting'}</td>
                    <td><span class="grey">from</span> $${e.price.total}</td>
                </tr><tr><td> &nbsp; </td></tr>`;
                
            }
        })
        

        const originCity = airports[OCODE].city || airports[OCODE].municipality || airports[OCODE].name;
        const destinationCity = airports[DCODE].city || airports[DCODE].municipality || airports[DCODE].name;
        //return markup
        return `
        <div id="presearchPackage">
            <h2>Flights form ${originCity} (${origin}) to ${destinationCity} (${destination}).</h2>
            <div class="flexrow popular-destinations" style="flex-wrap: wrap;">
                <input class="darkbg" value="from: ${originCity} (${origin})" disabled></input>
                <input class="darkbg" value="to: ${destinationCity} (${destination})" disabled></input>
                <input class="darkbg" value="date: ${new dayjs().add(7, 'days').format('ddd, DD MMM')}" disabled></input>
            </div>
            <div>
                <table style="font-size: 18px;width: 100%;">
                    <tr class="grey">
                        <td>Airline</td>
                        <td>Terminal</td>
                        <td>Timing</td>
                        <td>Duration</td>
                        <td>Type</td>
                        <td>Fair</td>
                    </tr><tr><td> &nbsp; </td></tr>
                    ${flights}
                </table>
            </div>
            <div class="column3 flexrow">
                <p class="grey">Showing local airport time</p>
                <p class="grey">Source: <a href="http://amadeus.com">Amadeus</a></p>
            </div>
        </div>`;
    }catch(err){
        return undefined;
    }
}

function getFlightCode(city, airports){
    var code = undefined;

    // check if requested departure airport code is available
    city = city.toUpperCase();
    if(!airports[city]){
        // Check for city name in airports array
        city = city.toLowerCase().replace(/^./,city[0]);
        Object.keys(airports).some(e=>{
            if(airports[e].city === city){
                code = e;
            }
        })
        if(!airports[code]) return undefined;
        return code;
    }
    return city;
}

async function flightOffersSearch(origin, destination, passengers = 1){
    date = new dayjs().add(7, 'days').format('YYYY-MM-DD');

    const amadeus = new Amadeus(config.amadeus_test);
    return await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: passengers,
        max: 5,
        currencyCode: 'USD'
    })
}

// function to encode file data to base64 encoded string
function base64(file) {
    if(fs.existsSync(file)){
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer.from(bitmap).toString('base64');
    }
    return 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAFC0lEQVRoge2YW2xUVRSGv3VmhtJpS1vulwBSOgXEaKQYpAgFIj5omkBLxyIqgkiNCBheFBDToMKDDypBExBpQwRqi4ACDShXgWCAECAChWIRwq0IAcrYUmbOWT4IpO2c6YVOSTTzvc3ea69//TNr77PPQIQIESJEaAHSksVzFh58DzQT6AcSB5QDy++09S/9fHZadVgqbIQWGjiQDrIFaFtv6hLwwaI5g79DRJuTc3FJWVTMLbODOBx+XyyVM1/01DQU3yIDAPM+OZBhGbIOcAbP6h5Rx7sL56UeC7U+v+hsVzHvZqnIaGAY0OXCxRscOnye3r3aq2la18vPXvMlxEdvjDNi5i9bNuZWWA0AzP304OsqFITIF1CRr9rWBD7Ky3u2EmB50fH2huXMFCQHGAk4ai84WXqFnzYfpVfP9owZ3Z/Ssqt4kjrRpUu7CpAZk3M8xUEGRmVtGahqZquSDZQ7nNbbO4ozLjbDxHQVloSaNxxypXMn95p4t9Oj8ALQJlRsTU2A4ycvk5zUkXbtouvMCfgmvexpJ/da84GB9HGbVwMTasXeRPX93Rte+gaa1sdzFh74GOTDB2IixLqdxMW6cLudGFL3B6qu9uN0GrhcjqBcIfAr5E7JScmvZehfRo5dn6C0OYrQq/YKVdlqucxpe4szzjdFYd6iQ19GRztmxsW6iHW7MAz7Lg34TZYs3UWH9rG89sqQxtIqsF4NmT/F6zlRe6JO9pFZm55XS36uPw5UKbrg16cOfUZenhWUXVXyC/8YKmJOFMSr0NGuit17yqi4Wsn4cYMQgY2bj5GYGMPwYcmhCv8LKMRgxWRvyhG7gKCvJ31syWJEZ9gFK+wzDGvqrh8ySgG+LSrtZ6gxEWUikFQ//vp1H6fPXGVwam9cTgeFxQepqLjNO9PScbWxbxsBn8ImhVX+W5Vbc3MH+0O5szUwNLsouk0g5jDQ325BVJTjzuAnO2zwJCX0BE2rn+PqNR8dO8RgiLD1l+McOXaB7KxUkh7riBmwCJgWUVFBJ261wHbQ4r+NwLrp3oG+hopu0ADA8MyNgww19nPvpBADenWLxdM3nh5doxGx7+vSU1f4cdNRRo5IYcgzfbjtu8Of567zxIDuSPBeUER8qsz2x8Sszs3oXtXUohs1AJCeWTI/yiULUpLjGZCcgDva5jlVj5s3qti++xRpQ5Lo1i2+KfqHJ+ekpDaj3iBsqyooLOtrWlZXS7GcDjGamiwh0U3W2KebLC4qXzc5OAR1DBQUnUlVy5wFOsEwxNnkyu2pFPjt3kPLjktuR9vVLZOAoBoVqVZo8ALVABbIPoHcKsPfQ1V2hApUWOD19mzxjdV2D6xadS7R76wZrcpzKGkIvYHO9eIthApUzyryuyj7A6Zse+tVz4X7AfmFp9cCWTYS5XdvVfZv7Ih8aAN25O3c6fRcSoq7/7mse/ntvFGjAqHiVVUKvi+7DHQJFtVJb+T0W9nsam0Iy23UjpWFpweYcMJm6miM4Un1esUMh04L92loTCHdblwNmRWu4qEVDYjFiKAxZc0Ur2d3OHVazYBKkIGqgBWYE26dVjGwvOhMMtCj7qjOnzrx8XPh1moVA05T6/S/wLZzpSlftIZWqxiw6rZPSY3hGJ+XJ0HvEeGg8RvaQyBoH5QVlkPz3/T229saGhEiRPifEHSZGz9zbrP+jH3UrF28sE7NrXaVeFREDESIECFChP80/wDauajzZ1527gAAAABJRU5ErkJggg==';
}
module.exports = {searchTrip};
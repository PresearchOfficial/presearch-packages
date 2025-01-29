"use strict";

const generateMapkitToken = require("../map/generateJWT");

const development = process.env.NODE_ENV === "development";

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const _triggers = [
  "map",
  "location",
  "address",
  "directions",
  "direction",
  "route",
];

async function map(query, token = generateMapkitToken()) {
  let searchLocation = "";
  for (const trigger of _triggers) {
    for (const el of [` ${trigger}`, `${trigger} `]) {
      if (query.toLowerCase().includes(el)) {
        searchLocation = query.toLowerCase().split(el).join("").trim();
        break;
      }
    }
    if (searchLocation) {
      break;
    }
  }

  if (!searchLocation) {
    return null;
  }

  return /*html*/ `
    <style>
      #mapWrapper .route-inputs {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
      }
      .dark #mapWrapper input {
        background: #333;
        color: white;
        border-color: #666;
      }

      @media only screen and (max-width:800px) {
        #mapWrapper .route-inputs {
          flex-direction: column;
        }
      }
    </style>

    <div id="mapWrapper" class="map-wrapper" style="width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;">
      <div id="map" style="width: 100%; height: 400px; border-radius: 8px; position: relative; overflow: hidden;">
        <!-- Fullscreen button: bottom-right, offset so it doesn't overlap the zoom controls -->
        <button
          id="fullscreenBtn"
          onclick="toggleFullScreen()"
          style="
            position: absolute;
            bottom: 10px;
            right: 125px;
            z-index: 1000;
            background: #F8F8F8;
            border: none;
            border-radius: 4px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0px;
            margin: 0;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          "
        >
          <span id="fullscreenIcon" style="font-size: 20px;">⤢</span>
        </button>
      </div>

      <!-- Travel info panel -->
      <div
        id="travelInfo"
        style="display: none; margin-top: 16px; border: 1px solid #ddd; padding: 8px; border-radius: 4px; justify-content: space-between; align-items: center;">
        <div>
          <div id="travelTime" style="margin-bottom: 4px; font-weight: bold;"></div>
          <div id="travelDistance"></div>
        </div>
        <button
          id="directionsButton"
          onclick="toggleFullScreen()"
          style="display: none; background: #4285f4; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">
          Directions
        </button>
      </div>

      <!-- Input fields -->
      <div id="routePanel" style="margin-top: 16px;">
        <div class="route-inputs">
          <div style="flex: 1;">
            <input type="text" id="startLocation" placeholder="Starting point" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
          </div>
          <div style="flex: 1;">
            <input type="text" id="endLocation" placeholder="Destination" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="getTransportRoute('Automobile')" style="background: #4285f4; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">
              🚗 Drive
            </button>
            <button onclick="getTransportRoute('Walking')" style="background: #4285f4; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">
              🚶 Walk
            </button>
          </div>
        </div>
      </div>

      <!-- Step-by-step directions panel -->
      <div id="directionsPanel" class="directions-panel" style="display: none; position: fixed; left: 0; top: 0; width: 300px; height: 100vh; background: white; box-shadow: 2px 0 5px rgba(0,0,0,0.1); overflow-y: auto; z-index: 1000;">
        <div style="padding: 16px; border-bottom: 1px solid #eee;">
          <!-- Back and Transport Buttons -->
          <div style="display: flex; align-items: center; margin-bottom: 24px;">
            <button onclick="toggleFullScreen()" style="background: none; border: none; cursor: pointer; margin-right: 12px;">
              ←
            </button>
            <div style="flex-grow: 1; display: flex; gap: 8px;">
              <button id="driveButton" onclick="getTransportRouteFromPanel('Automobile')" style="flex: 1; background: #4285f4; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">
                🚗 Drive
              </button>
              <button id="walkButton" onclick="getTransportRouteFromPanel('Walking')" style="flex: 1; background: white; border: 1px solid #ddd; color: #333; border-radius: 4px; padding: 8px 16px; cursor: pointer;">
                🚶 Walk
              </button>
            </div>
          </div>

          <!-- Location Inputs with Swap Button -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 8px;">
              <input type="text" id="panelStartLocation" placeholder="Starting point" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
              <input type="text" id="panelEndLocation" placeholder="Destination" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
            </div>
            <button onclick="swapLocations()" style="background: none; border: none; cursor: pointer; align-self: center;">
              ↕️
            </button>
          </div>

          <div id="routeHeader" style="font-size: 16px; font-weight: 500; margin: 16px 0 8px;"></div>
          <div id="routeTimePanel" style="color: #666; font-size: 14px;"></div>
        </div>
        <div id="routeSteps" style="padding: 16px;"></div>
      </div>

      <script>
        const logger = (msg, arg) => {
          if (${development}) {
            if (arg) {
              console.log(msg, arg);
              return;
            }
            console.log(msg);
          }
        };
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || document.querySelector('html').classList.contains('dark');
        logger("Script starting...");

        let map, directions;
        let isFullScreen = false;

        // We'll start as false; we'll update dynamically using search results:
        let isUSA = false;

        // For single location searches:
        const initialSearchLocation = "${searchLocation}";

        function loadMapkit(callback) {
          logger("Loading MapKit...");
          var script = document.createElement('script');
          script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
          script.onload = () => {
            logger("MapKit loaded successfully");
            callback();
          };
          script.onerror = function() {
            console.error('Error loading mapkit.js');
          };
          document.head.appendChild(script);
        }

        function initializeMap() {
          logger("Initializing map...");
          mapkit.init({
            authorizationCallback: function(done) {
              logger("Authorizing...");
              done("${token}");
            }
          });

          map = new mapkit.Map("map", {
            showsCompass: mapkit.FeatureVisibility.Visible,
            showsScale: mapkit.FeatureVisibility.Visible,
            showsZoomControl: true,
            colorScheme: isDarkMode ? "dark" : "light",
          });

          directions = new mapkit.Directions();

          setTimeout(() => {
            if (initialSearchLocation) {
              searchForLocation(initialSearchLocation);
            }
            document.getElementById("routePanel").style.display = "block";
          }, 10);

          logger("Map initialized");
        }

        function locationIsUSA(query) {
          return new Promise((resolve) => {
            const search = new mapkit.Search();
            search.search(query, (error, data) => {
              if (error || !data.places || data.places.length === 0) {
                return resolve(false);
              }
              const place = data.places[0];
              // Some versions of mapkit return a "countryCode", or we can check formattedAddress
              if (
                place.countryCode === "US" ||
                (place.formattedAddress && place.formattedAddress.toLowerCase().includes("usa"))
              ) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          });
        }

        function searchForLocation(query) {
          logger("Searching location:", query);
          const search = new mapkit.Search();
          search.search(query, (error, data) => {
            if (error) {
              console.error("Search error:", error);
            } else if (data.places && data.places.length > 0) {

              const firstPlace = data.places[0];
              logger("Found place:", firstPlace);

              let span = 0.05;
              if (query.toLowerCase().includes('address:')) {
                span = 0.002;
              }

              const region = new mapkit.CoordinateRegion(
                new mapkit.Coordinate(firstPlace.coordinate.latitude, firstPlace.coordinate.longitude),
                new mapkit.CoordinateSpan(span, span)
              );

              map.region = region;
              // Clear previous annotations and add only the found location
              map.removeAnnotations(map.annotations);

              for (const place of data.places.slice(0, 19)) {
                const annotation = new mapkit.MarkerAnnotation(
                  new mapkit.Coordinate(place.coordinate.latitude, place.coordinate.longitude),
                  {
                    title: place.name,
                    subtitle: place.formattedAddress,
                    glyphText: "📍"
                  }
                );
                map.addAnnotation(annotation);
              }

              // Because we have only a single place, we can check if it's in the US
              if (
                firstPlace.countryCode === "US" ||
                (firstPlace.formattedAddress && firstPlace.formattedAddress.toLowerCase().includes("usa"))
              ) {
                isUSA = true;
              } else {
                isUSA = false;
              }
            }
          });
        }

        /**
         * Format distance:
         * - If user is in the US => show miles
         * - Otherwise => show meters / kilometers
         */
        function formatDistance(meters) {
          if (isUSA) {
            // Convert to miles
            const miles = meters * 0.000621371;
            if (miles < 1) {
              // For distances under 1 mile, show 2 decimals
              return miles.toFixed(2) + ' mi';
            } else {
              // Otherwise 1 decimal
              return miles.toFixed(1) + ' mi';
            }
          } else {
            // Metric
            if (meters < 1000) {
              return Math.round(meters) + ' m';
            } else {
              const km = meters / 1000;
              return km.toFixed(1) + ' km';
            }
          }
        }

        // Format travel time => hours/minutes
        function formatTime(seconds) {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          if (hours > 0) {
            return hours + ' h ' + minutes + ' min';
          }
          return minutes + ' min';
        }

        /**
         * Show or hide fullscreen. Step-by-step directions only visible in fullscreen.
         */
        function toggleFullScreen() {
          const mapWrapper = document.getElementById("mapWrapper");
          const mapElement = document.getElementById("map");
          const directionsPanel = document.getElementById("directionsPanel");
          const routeStepsEl = document.getElementById("routeSteps");

          if (!isFullScreen) {
            // Enter fullscreen
            mapWrapper.style.position = 'fixed';
            mapWrapper.style.top = '0';
            mapWrapper.style.left = '0';
            mapWrapper.style.width = '100vw';
            mapWrapper.style.height = '100vh';
            mapWrapper.style.zIndex = '9999';
            mapElement.style.height = '100vh';
            mapElement.style.borderRadius = '0';

            // If we have directions, show them now
            if (routeStepsEl.innerHTML.trim().length > 0) {
              directionsPanel.style.display = "block";
            }
          } else {
            // Exit fullscreen
            mapWrapper.style.position = 'relative';
            mapWrapper.style.width = '100%';
            mapWrapper.style.height = 'auto';
            mapElement.style.height = '400px';
            mapElement.style.borderRadius = '8px';

            // Hide directions when not full screen
            directionsPanel.style.display = "none";
          }

          isFullScreen = !isFullScreen;
          if (map) {
            map.dispatchEvent(new Event("resize"));
          }
        }

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && isFullScreen) {
            toggleFullScreen();
          }
        });

        /**
         * Fetch route. First, we check if either startLoc or endLoc is in the US to set isUSA.
         * Then we fetch directions.
         */
        async function getTransportRoute(transportType) {
          const startLoc = document.getElementById("startLocation").value;
          const endLoc = document.getElementById("endLocation").value;
          const travelInfo = document.getElementById("travelInfo");
          const directionsButton = document.getElementById("directionsButton");

          if (!startLoc || !endLoc) {
            alert("Please enter both start and end locations.");
            travelInfo.style.display = "none";
            directionsButton.style.display = "none";
            return;
          }

          try {
            // Check if either startLoc or endLoc is in the US
            const startInUS = await locationIsUSA(startLoc);
            const endInUS   = await locationIsUSA(endLoc);
            isUSA = (startInUS || endInUS);

            // Now proceed to get directions with the correct isUSA value
            const request = {
              origin: startLoc,
              destination: endLoc,
              transportType: mapkit.Directions.Transport[transportType]
            };

            directions.route(request, (error, data) => {
              if (error) {
                console.error("Error fetching directions:", error);
                travelInfo.style.display = "none";
                directionsButton.style.display = "none";
              } else if (data && data.routes && data.routes.length > 0) {
                displayRoutes(data.routes, startLoc, endLoc, transportType);
                travelInfo.style.display = "flex";
                directionsButton.style.display = "flex";
              } else {
                console.warn("No routes found.");
                travelInfo.style.display = "none";
                directionsButton.style.display = "none";
              }
            });
          } catch (err) {
            console.error("Error determining US location:", err);
            travelInfo.style.display = "none";
            directionsButton.style.display = "none";
          }
        }

        // Called by the directions panel's "Drive/Walk" buttons
        async function getTransportRouteFromPanel(transportType) {
          const startLoc = document.getElementById("panelStartLocation").value;
          const endLoc = document.getElementById("panelEndLocation").value;

          if (!startLoc || !endLoc) {
            alert("Please enter both start and end locations.");
            return;
          }

          // Sync the input values with the main route panel
          document.getElementById("startLocation").value = startLoc;
          document.getElementById("endLocation").value = endLoc;

          // Update transport button styling
          updateTransportButtons(transportType);

          // Now call the main getTransportRoute function
          getTransportRoute(transportType);
        }

        function swapLocations() {
          const startInput = document.getElementById('panelStartLocation');
          const endInput = document.getElementById('panelEndLocation');
          const temp = startInput.value;
          startInput.value = endInput.value;
          endInput.value = temp;

          // Determine which transport type is currently active
          const driveButton = document.getElementById('driveButton');
          const walkButton = document.getElementById('walkButton');

          let transportType = 'Automobile'; // default
          if (walkButton.style.background === 'rgb(66, 133, 244)') {
            transportType = 'Walking';
          }

          // Trigger route recalculation
          getTransportRouteFromPanel(transportType);
        }

        function updateTransportButtons(transportType) {
          const driveButton = document.getElementById('driveButton');
          const walkButton = document.getElementById('walkButton');

          if (transportType === 'Automobile') {
            driveButton.style.background = '#4285f4';
            driveButton.style.color = 'white';
            walkButton.style.background = 'white';
            walkButton.style.color = '#333';
            walkButton.style.border = '1px solid #ddd';
          } else {
            walkButton.style.background = '#4285f4';
            walkButton.style.color = 'white';
            driveButton.style.background = 'white';
            driveButton.style.color = '#333';
            driveButton.style.border = '1px solid #ddd';
          }
        }

        /**
         * We fill in the directions panel but do NOT show it
         * unless the user is in fullscreen.
         */
        function displayRoutes(routes, startLoc, endLoc, transportType) {
          // Sync input values
          document.getElementById("panelStartLocation").value = startLoc;
          document.getElementById("panelEndLocation").value = endLoc;

          // Update button styles
          updateTransportButtons(transportType);

          // Remove old markers/routes
          map.removeAnnotations(map.annotations);
          map.removeOverlays(map.overlays);

          const directionsPanel = document.getElementById("directionsPanel");
          directionsPanel.style.display = "none";

          const routeHeader = document.getElementById("routeHeader");
          const routeTimePanel = document.getElementById("routeTimePanel");
          const routeStepsEl = document.getElementById("routeSteps");

          const travelInfo = document.getElementById("travelInfo");
          const travelTimeDiv = document.getElementById("travelTime");
          const travelDistanceDiv = document.getElementById("travelDistance");

          // Clear old data
          routeHeader.textContent = "";
          routeTimePanel.textContent = "";
          routeStepsEl.innerHTML = "";
          travelTimeDiv.textContent = "";
          travelDistanceDiv.textContent = "";

          // We'll just handle the first route
          const mainRoute = routes[0];

          // Draw the route's path
          const path = mainRoute.steps.flatMap(function(step) {
            return step.path.map(function(coord) {
              return new mapkit.Coordinate(coord.latitude, coord.longitude);
            });
          });

          const polyline = new mapkit.PolylineOverlay(path, {
            style: new mapkit.Style({
              lineWidth: 4,
              lineJoin: 'round',
              strokeColor: '#4285f4'
            })
          });
          map.addOverlay(polyline);

          // Add Start/End markers
          const startCoord = mainRoute.steps[0].path[0];
          const lastStep = mainRoute.steps[mainRoute.steps.length - 1];
          const endCoord = lastStep.path[lastStep.path.length - 1];

          const startMarker = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(startCoord.latitude, startCoord.longitude),
            { title: "Start", glyphText: "A" }
          );
          const endMarker = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(endCoord.latitude, endCoord.longitude),
            { title: "End", glyphText: "B" }
          );
          map.addAnnotations([startMarker, endMarker]);

          // Center map on route bounding region
          if (mainRoute.boundingRegion) {
            map.region = mainRoute.boundingRegion;
          } else {
            map.showItems([polyline, startMarker, endMarker]);
          }

          // Format time & distance
          const travelTime = formatTime(mainRoute.expectedTravelTime);
          const distanceStr = formatDistance(mainRoute.distance);
          const glyph = (transportType === 'Automobile') ? '🚗' : '🚶';

          // 1) Show time/distance below the map
          travelTimeDiv.textContent = "Time: " + travelTime + " " + glyph;
          travelDistanceDiv.textContent = "Distance: " + distanceStr;
          travelInfo.style.display = "block";

          // 2) Fill the side directions panel
          routeHeader.textContent = startLoc + " to " + endLoc;
          routeTimePanel.textContent = travelTime + " (" + distanceStr + ") via " + transportType;

          // Build step-by-step instructions
          let stepsHtml = "";
          mainRoute.steps.slice(1).forEach(function(step, i) {
            stepsHtml +=
              '<div style="padding: 12px 0; border-bottom: 1px solid #eee;">' +
                '<div style="display: flex; gap: 12px;">' +
                  '<div style="color: #666;">' + (i + 1) + '</div>' +
                  '<div>' +
                    '<div>' + step.instructions + '</div>' +
                    '<div style="color: #666; font-size: 12px; margin-top: 4px;">' +
                      formatDistance(step.distance) +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>';
          });
          routeStepsEl.innerHTML = stepsHtml;

          if (isFullScreen) {
            directionsPanel.style.display = "block";
          }
        }

        // Hide travel info panel until route is set
        const travelInfo = document.getElementById("travelInfo");
        const directionsButton = document.getElementById("directionsButton");
        if (travelInfo) travelInfo.style.display = "none";
        if (directionsButton) directionsButton.style.display = "none";

        logger("Loading map...");
        loadMapkit(() => {
          initializeMap();
        });
      </script>
    </div>
  `;
}

async function trigger(query) {
  query = query.toLowerCase();
  return _triggers.some(trigger => query.includes(` ${trigger}`) || query.includes(`${trigger} `));
}

module.exports = { map, trigger };

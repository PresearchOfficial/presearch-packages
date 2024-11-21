"use strict";

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function map(query, apiKey, geolocation, generateMapkitToken) {
  const escapedQuery = escapeHTML(query);
  const token = generateMapkitToken();

  let searchLocation = '';
  if (query.toLowerCase().includes('map of ')) {
    searchLocation = query.toLowerCase().split('map of ')[1].trim();
  } else if (query.toLowerCase().includes('location of ')) {
    searchLocation = query.toLowerCase().split('location of ')[1].trim();
  } else if (query.toLowerCase().includes('address:')) {
    searchLocation = query.toLowerCase().split('address:')[1].trim();
  } else {
    searchLocation = query.trim();
  }

  return `
    <div id="mapWrapper" class="map-wrapper" style="width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;">
      <div id="map" style="width: 100%; height: 400px; border-radius: 8px; position: relative; overflow: hidden;">
        <button id="fullscreenBtn" onclick="toggleFullScreen()" style="position: absolute; top: 10px; right: 10px; z-index: 1000; background: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
          <span id="fullscreenIcon" style="font-size: 16px;">⤢</span>
        </button>
      </div>

      <div id="routePanel" style="display: none; margin-top: 16px;">
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
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

      <div id="directionsPanel" class="directions-panel" style="display: none; position: fixed; left: 0; top: 0; width: 300px; height: 100vh; background: white; box-shadow: 2px 0 5px rgba(0,0,0,0.1); overflow-y: auto; z-index: 1000;">
        <div style="padding: 16px; border-bottom: 1px solid #eee;">
          <div id="routeHeader" style="font-size: 16px; font-weight: 500; margin-bottom: 8px;"></div>
          <div id="routeTime" style="color: #666; font-size: 14px;"></div>
        </div>
        <div id="routeSteps" style="padding: 16px;"></div>
      </div>

      <script>
        console.log("Script starting...");
        let map, directions;
        let isFullScreen = false;
        const initialSearchLocation = "${searchLocation}";

        function loadMapkit(callback) {
          console.log("Loading MapKit...");
          var script = document.createElement('script');
          script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
          script.onload = () => {
            console.log("MapKit loaded successfully");
            callback();
          };
          script.onerror = function() {
            console.error('Error loading mapkit.js');
          };
          document.head.appendChild(script);
        }

        function formatDistance(meters) {
          if (meters < 1000) {
            return Math.round(meters) + ' m';
          }
          const miles = meters * 0.000621371;
          return miles.toFixed(1) + ' mi';
        }

        function formatTime(seconds) {
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);

          if (hours > 0) {
            return hours + ' h ' + minutes + ' min';
          }
          return minutes + ' min';
        }

        function toggleFullScreen() {
          const mapWrapper = document.getElementById("mapWrapper");
          const mapElement = document.getElementById("map");
          const fullscreenIcon = document.getElementById("fullscreenIcon");

          if (!isFullScreen) {
            mapWrapper.style.position = 'fixed';
            mapWrapper.style.top = '0';
            mapWrapper.style.left = '0';
            mapWrapper.style.width = '100vw';
            mapWrapper.style.height = '100vh';
            mapWrapper.style.zIndex = '9999';
            mapElement.style.height = '100vh';
            mapElement.style.borderRadius = '0';
            fullscreenIcon.textContent = '⤓';
          } else {
            mapWrapper.style.position = 'relative';
            mapWrapper.style.width = '100%';
            mapWrapper.style.height = 'auto';
            mapElement.style.height = '400px';
            mapElement.style.borderRadius = '8px';
            fullscreenIcon.textContent = '⤢';
          }

          isFullScreen = !isFullScreen;
          if (map) {
            map.dispatchEvent(new Event('resize'));
          }
        }

        function searchLocation(query) {
          console.log("Searching location:", query);
          const search = new mapkit.Search();
          search.search(query, (error, data) => {
            if (error) {
              console.error("Search error:", error);
            } else if (data.places && data.places.length > 0) {
              const place = data.places[0];
              console.log("Found place:", place);

              let span = 0.05;
              if (query.toLowerCase().includes('address:')) {
                span = 0.002;
              }

              const region = new mapkit.CoordinateRegion(
                new mapkit.Coordinate(place.coordinate.latitude, place.coordinate.longitude),
                new mapkit.CoordinateSpan(span, span)
              );

              map.region = region;

              const annotation = new mapkit.MarkerAnnotation(
                new mapkit.Coordinate(place.coordinate.latitude, place.coordinate.longitude),
                {
                  title: place.name,
                  subtitle: place.formattedAddress,
                  glyphText: "📍"
                }
              );

              map.removeAnnotations(map.annotations);
              map.addAnnotation(annotation);
            }
          });
        }

        function initializeMap() {
          console.log("Initializing map...");
          mapkit.init({
            authorizationCallback: function(done) {
              console.log("Authorizing...");
              done("${token}");
            }
          });

          map = new mapkit.Map("map", {
            showsCompass: mapkit.FeatureVisibility.Visible,
            showsScale: mapkit.FeatureVisibility.Visible,
            showsZoomControl: true,
            region: new mapkit.CoordinateRegion(
              new mapkit.Coordinate(51.5074, -0.1278),
              new mapkit.CoordinateSpan(0.1, 0.1)
            )
          });

          directions = new mapkit.Directions();

          setTimeout(() => {
            if (initialSearchLocation) {
              searchLocation(initialSearchLocation);
            }
            document.getElementById("routePanel").style.display = "block";
          }, 500);

          console.log("Map initialized");
        }

        function getTransportRoute(transportType) {
          const startLoc = document.getElementById("startLocation").value;
          const endLoc = document.getElementById("endLocation").value;

          if (!startLoc || !endLoc) {
            alert("Please enter both start and end locations.");
            return;
          }

          if (!isFullScreen) {
            toggleFullScreen();
          }

          const request = {
            origin: startLoc,
            destination: endLoc,
            transportType: mapkit.Directions.Transport[transportType]
          };

          directions.route(request, (error, data) => {
            if (error) {
              console.error("Error fetching directions:", error);
            } else if (data && data.routes && data.routes.length > 0) {
              displayRoutes(data.routes, startLoc, endLoc, transportType);
            }
          });
        }

        function displayRoutes(routes, startLoc, endLoc, transportType) {
          map.removeAnnotations(map.annotations);
          map.removeOverlays(map.overlays);

          const directionsPanel = document.getElementById("directionsPanel");
          directionsPanel.style.display = "block";

          routes.forEach((route, index) => {
            const path = route.steps.flatMap(step =>
              step.path.map(coord => new mapkit.Coordinate(coord.latitude, coord.longitude))
            );

            const polyline = new mapkit.PolylineOverlay(path, {
              style: new mapkit.Style({
                lineWidth: 4,
                lineJoin: 'round',
                strokeColor: '#4285f4'
              })
            });
            map.addOverlay(polyline);

            if (index === 0) {
              const startCoord = route.steps[0].path[0];
              const endCoord = route.steps[route.steps.length - 1].path.slice(-1)[0];

              const startMarker = new mapkit.MarkerAnnotation(
                new mapkit.Coordinate(startCoord.latitude, startCoord.longitude),
                { title: "Start", glyphText: "A" }
              );
              const endMarker = new mapkit.MarkerAnnotation(
                new mapkit.Coordinate(endCoord.latitude, endCoord.longitude),
                { title: "End", glyphText: "B" }
              );
              map.addAnnotations([startMarker, endMarker]);

              document.getElementById("routeHeader").textContent = startLoc + " to " + endLoc;

              const travelTime = formatTime(route.expectedTravelTime);
              const distance = formatDistance(route.distance);
              document.getElementById("routeTime").textContent = travelTime + " (" + distance + ") via " + transportType;

              const stepsHtml = route.steps.map(function(step, i) {
                return '<div style="padding: 12px 0; border-bottom: 1px solid #eee;">' +
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
              }).join("");

              document.getElementById("routeSteps").innerHTML = stepsHtml;
            }
          });
        }

        console.log("Loading map...");
        loadMapkit(() => {
          initializeMap();
        });
      </script>
    </div>
  `;
}

async function trigger(query) {
  query = query.toLowerCase();
  return query.includes('map') ||
         query.includes('location') ||
         query.includes('address:') ||
         /^[a-z\s]+(?:,\s*[a-z\s]+)?$/.test(query);
}

module.exports = { map, trigger };

export function genOriginIcon(opacity = 1, scale = 1) {
  if (!window.google || !window.google.maps) {
    return null;
  }

  const startSvg = `
    M 0 0 
    m -10, 0
    a 10,10 0 1,1 20,0
    a 10,10 0 1,1 -20,0
  `;

  return {
    scale: scale,
    fillColor: '#FFFFFF',
    fillOpacity: opacity,
    strokeWeight: 3,
    strokeColor: '#FF0000',
    strokeOpacity: opacity,
    path: startSvg,
    anchor: new window.google.maps.Point(0, 0)
  };
}

export function genDestinationIcon(opacity = 1, scale = 1) {
  if (!window.google || !window.google.maps) {
    return null;
  }

  const destinationSvg = `
    M 0 0 m -10, 0 a 10,10 0 1,1 20,0 a 10,10 0 1,1 -20,0
    M 0 0 m -5, 0 a 5,5 0 1,1 10,0 a 5,5 0 1,1 -10,0
    M 0 0 m -3, 0 a 3,3 0 1,1 6,0 a 3,3 0 1,1 -6,0
    M 0 0 m -1, 0 a 1,1 0 1,1 2,0 a 1,1 0 1,1 -2,0
  `;

  return {
    scale: scale,
    fillColor: '#FFFFFF',
    fillOpacity: opacity,
    strokeWeight: 2,
    strokeColor: '#FF0000',
    strokeOpacity: opacity,
    path: destinationSvg,
    anchor: new window.google.maps.Point(0, 0)
  };
}

export function genLatLngBounds(includedPoints) {
  if (!window.google || !window.google.maps) {
    return null;
  }

  let bounds = new window.google.maps.LatLngBounds();
  includedPoints.forEach(point => {
    bounds = bounds.extend(point);
  });

  return bounds;
}

export function genMarker(
  position,
  icon = null,
  map = null,
  title = '',
  draggable = false
) {
  if (!window.google || !window.google.maps) {
    return null;
  }

  const marker = new window.google.maps.Marker({
    position: position,
    icon: icon,
    map: map,
    title: title,
    draggable: draggable
  });

  return marker;
}

export function genOriginMarker(
  position,
  opacity = 1,
  map,
  title = '',
  draggable = false
) {
  if (!window.google || !window.google.maps) {
    return null;
  }

  const icon = genOriginIcon(opacity);
  const marker = genMarker(position, icon, map, title, draggable);
  return marker;
}

export function genDestinationMarker(
  position,
  opacity = 1,
  map,
  title = '',
  draggable = false
) {
  if (!window.google || !window.google.maps) {
    return null;
  }

  const icon = genDestinationIcon(opacity);
  const marker = genMarker(position, icon, map, title, draggable);
  return marker;
}

export const travelModes = {
  FLYING: 'FLYING',
  DRIVING: 'DRIVING',
  TRANSIT: 'TRANSIT',
  WALKING: 'WALKING',
  BICYCLING: 'BICYCLING'
};

export function drawDirection(
  startPoint,
  endPoint,
  map,
  midPoints = [],
  travelMode = travelModes.FLYING
) {
  if (!window.google || !window.google.maps) {
    return null;
  }

  const promise = new Promise((resolve, reject) => {
    if (travelMode === travelModes.FLYING) {
      let path = [];
      startPoint !== midPoints[0] && path.push(startPoint);
      path = path.concat(midPoints);
      endPoint !== midPoints[midPoints.length - 1] && path.push(endPoint);

      const line = drawPolyline(midPoints, map);
      resolve(line);
    } else {
      // Prepare waypoints
      const waypoints = [];
      if (midPoints && midPoints.length > 0) {
        midPoints.forEach((point, index) => {
          if (
            (index === 0 && point === startPoint) ||
            (index === midPoints.length - 1 && point === endPoint)
          ) {
            return;
          }

          let waypointLocation = point.location;
          const waypointLat = point.lat || point.latitude;
          const waypointLng = point.lng || point.longitude;
          if (
            !waypointLocation &&
            !(waypointLat == null) &&
            !(waypointLng == null)
          ) {
            waypointLocation = { lat: waypointLat, lng: waypointLng };
          }

          if (!(waypointLocation == null)) {
            waypoints.push({
              location: waypointLocation,
              stopover: true
            });
          }
        });
      }

      //
      const directionsService = new window.google.maps.DirectionsService();

      const path = [];
      const numMaxWaypoints = 23; // 23 is the max num of waypoints according to Google Doc on April 20, 2018
      let numWaypointChunks = Math.ceil(waypoints.length / numMaxWaypoints);
      let origin = startPoint;
      while (waypoints.length > 0) {
        const waypointsChunk = waypoints.splice(0, numMaxWaypoints);
        const destination =
          waypoints.length > 0 ? waypoints.splice(0, 1)[0] : endPoint;
        destination.lat = destination.lat || destination.location.lat;
        destination.lng = destination.lng || destination.location.lng;

        const request = {
          origin: origin,
          destination: destination,
          waypoints: waypointsChunk,
          travelMode: travelMode
        };

        directionsService.route(request, (result, status) => {
          if (status == 'OK') {
            result.routes &&
              result.routes.forEach(route => {
                route.overview_path &&
                  route.overview_path.forEach(entry => {
                    path.push(entry);
                  });
              });

            numWaypointChunks--;
            if (numWaypointChunks === 0) {
              const firstEntry = path[0];
              const lastEntry = path[path.length - 1];

              (firstEntry.lat !== startPoint.lat ||
                firstEntry.lng !== startPoint.lng) &&
                path.splice(0, 0, startPoint);
              (lastEntry.at !== endPoint.lat ||
                lastEntry.lng !== endPoint.lng) &&
                path.push(endPoint);

              const line = drawPolyline(path, map);
              resolve(line);
            }
          }
        });
        origin = destination;
      }
    }
  });

  return promise;
}

export function drawPolyline(path, map, opacity = 1) {
  const line = new window.google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#2196F3',
    strokeOpacity: opacity,
    strokeWeight: 10
  });

  map && line.setMap(map);

  return line;
}

export function findDistanceRatio(lat1, lng1, lat2, lng2) {
  const lat1Rad = lat1 * Math.PI / 180;
  const lng1Rad = lng1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const lng2Rad = lng2 * Math.PI / 180;
  const haversine =
    Math.pow(Math.sin((lat2Rad - lat1Rad) / 2), 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.pow(Math.sin((lng2Rad - lng1Rad) / 2), 2);
  const ratio = Math.asin(Math.sqrt(haversine));
  return ratio;
}

export function findDistanceOnEarth(lat1, lng1, lat2, lng2) {
  const earthDiameterKm = 12742;
  const distanceRatio = distanceRatio(lat1, lng1, lat2, lng2);
  const distance = earthDiameterKm * distanceRatio;
  return distance;
}

const GoogleMapHelpers = {
  genOriginIcon,
  genDestinationIcon,
  genMarker,
  genOriginMarker,
  genDestinationMarker,
  travelModes,
  drawPolyline,
  drawDirection,
  genLatLngBounds,
  findDistanceRatio,
  findDistanceOnEarth
};

export default GoogleMapHelpers;

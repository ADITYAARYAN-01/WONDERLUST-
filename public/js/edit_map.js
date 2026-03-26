maptilersdk.config.apiKey = mapToken;

// 1. Get current coordinates from the database object we passed in EJS
const currentCoords = listing.geometry.coordinates;

const map = new maptilersdk.Map({
    container: 'map-preview',
    style: maptilersdk.MapStyle.STREETS,
    center: currentCoords,
    zoom: 13
});

// 2. Add the draggable marker at the current location
let marker = new maptilersdk.Marker({
    color: "#fe424d",
    draggable: true
})
.setLngLat(currentCoords)
.addTo(map);

function updateHiddenInputs(lngLat) {
    document.getElementById("lng-input").value = lngLat.lng;
    document.getElementById("lat-input").value = lngLat.lat;
}

// 3. Update coordinates if the user drags the marker
marker.on('dragend', () => {
    updateHiddenInputs(marker.getLngLat());
});

// 4. Update map if the user types a new location name
const locInput = document.getElementById("location-input");
locInput.addEventListener("change", async () => {
    const query = locInput.value;
    if (query.length > 3) {
        const result = await maptilersdk.geocoding.forward(query, { limit: 1 });
        if (result.features.length > 0) {
            const center = result.features[0].geometry.coordinates;
            map.flyTo({ center: center, zoom: 14 });
            marker.setLngLat(center);
            updateHiddenInputs({ lng: center[0], lat: center[1] });
        }
    }
});
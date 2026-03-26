maptilersdk.config.apiKey = mapToken;

// Initial coordinates (Default to Bhubaneswar center)
const defaultCoords = [85.8245, 20.2961];

const map = new maptilersdk.Map({
    container: 'map-preview',
    style: maptilersdk.MapStyle.STREETS,
    center: defaultCoords,
    zoom: 10
});

let marker = new maptilersdk.Marker({
    color: "#fe424d",
    draggable: true
})
.setLngLat(defaultCoords)
.addTo(map);

// Update the hidden inputs whenever the marker moves
function updateHiddenInputs(lngLat) {
    document.getElementById("lng-input").value = lngLat.lng;
    document.getElementById("lat-input").value = lngLat.lat;
}

// Set initial hidden values
updateHiddenInputs({lng: defaultCoords[0], lat: defaultCoords[1]});

// Event: When user stops dragging the marker
marker.on('dragend', () => {
    const lngLat = marker.getLngLat();
    updateHiddenInputs(lngLat);
});

// Event: When user types in the location box
const locInput = document.getElementById("location-input");

locInput.addEventListener("change", async () => {
    const query = locInput.value;
    if (query.length > 2) {
        try {
            const result = await maptilersdk.geocoding.forward(query, { limit: 1 });
            if (result.features.length > 0) {
                const center = result.features[0].geometry.coordinates;
                map.flyTo({ center: center, zoom: 14 });
                marker.setLngLat(center);
                updateHiddenInputs({ lng: center[0], lat: center[1] });
            }
        } catch (err) {
            console.log("Geocoding failed", err);
        }
    }
});
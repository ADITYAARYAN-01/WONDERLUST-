// Access the token and listing data from the script tag in show.ejs
maptilersdk.config.apiKey = mapToken;

// 1. Determine where the map should center
// If the listing has coordinates, use them. Otherwise, default to a general area.
const centerCoords = (listing.geometry && listing.geometry.coordinates) 
    ? listing.geometry.coordinates 
    : [77.209, 28.613]; // Default to Delhi coordinates

const map = new maptilersdk.Map({
    container: 'map', // The ID of the div in your show.ejs
    style: maptilersdk.MapStyle.STREETS,
    center: centerCoords,
    zoom: 9
});

// 2. Add a Marker if coordinates exist
if (listing.geometry && listing.geometry.coordinates) {
    new maptilersdk.Marker({ color: "#fe424d" }) // Wanderlust Red
        .setLngLat(centerCoords)
        .setPopup(
            new maptilersdk.Popup({ offset: 25 })
            .setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`)
        )
        .addTo(map);
}

// Add Geolocate control to the map.
map.addControl(
    new maptilersdk.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true // Keeps the map centered on you if you move
    })
);
const marker = new maptilersdk.Marker({ 
    color: "#fe424d", 
    draggable: true // Allow user to move the pin manually
})
.setLngLat(centerCoords)
.addTo(map);

// Log the new position when the user stops dragging
marker.on('dragend', () => {
    const lngLat = marker.getLngLat();
    console.log(`New accurate coordinates: ${lngLat.lng}, ${lngLat.lat}`);
});
// Add zoom and rotation controls to the map.
map.addControl(new maptilersdk.NavigationControl());
const App={file_name:"municipality"};

async function getData() {
    const url = "http://127.0.0.1:5500/"+App.file_name+".json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const geojson = await response.json();
        // L.geoJson(geojson, myStyle).addTo(map);
        const options_sim = { tolerance: 0.005, highQuality: false };
        const simplified = turf.simplify(geojson, options_sim);
        const options_tru = { precision: 3, coordinates: 2, mutate: true };
        const truncated = turf.truncate(simplified, options_tru);
        //console.log(JSON.stringify(truncated));
        App["json_file"]=truncated;
        L.geoJson(truncated, myStyle).addTo(map);
    } catch (error) {
        console.error(error.message);
    }
};

function downloadObjectAsJson(){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(App.json_file));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", App.file_name + ".min.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

const map = L.map('map').setView([-22.615279,-46.109619], 6);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const myStyle = {
    "color": "#ff7800",
    "weight": 0.5,
    "opacity": 0.99
};

getData();
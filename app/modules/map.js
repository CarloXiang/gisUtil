/**
 * Created by Caihm on 2017/5/10.
 */
/**
 * Created by Caihm on 2017/3/13.
 */

var map;
var view;
var s;

require([
    "dojo/parser", 'dojo/_base/lang', "esri/Map", "esri/views/MapView",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    'esri/Graphic','widgets/SearchAround',
    
    "dojo/domReady!"
], function (parser, lang, Map, MapView,
    Point,
    SimpleMarkerSymbol,
    Graphic,SearchAround) {
    parser.parse();

    // mapManager = MapManager.getInstance({     appConfig: appConfig },
    // 'mapishere'); mapManager.showMap();

    map = new Map({basemap: "streets"});
    view = new MapView({
        container: "mapishere", // Reference to the scene div created in step 5
        map: map, // Reference to the map object created before the scene
        zoom: 4, // Sets zoom level based on level of detail (LOD)
        center: [15, 65]
    });


    view.then(lang.hitch(this,function(){       
        s = new SearchAround({
            view:view,
            center:view.extent.center
        });


    }));

});

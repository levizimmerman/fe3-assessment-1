# Population without indoor toilet: A D3 datavisualization
This is a datavisualization project where population without indoor toilet is displayed per country on a map of Europe.
![preview-map.png](https://github.com/levizimmerman/fe3-assessment-1/blob/master/preview.png?raw=true)

## Live Demo
A demo can be found [here](https://levizimmerman.github.io/fe3-assessment-1/).

## Background
This project focuses on rendering a map of Europe and displaying data about the countries on that map. Futhermore a range slider is implemented to scroll through the years that are present in the data set.

### Workflow
1. First the map is rendered using [`eu.topojson`](https://github.com/levizimmerman/fe3-assessment-1/blob/master/eu.topojson) as data and [TopoJSON](https://github.com/topojson/topojson/wiki) to read the data;
2. After the map is rendered the countries countries are drawn in `<path>` elements and a `[data-country-name]` is added to identify each country;
3. Then D3 loads [toilets.json](https://github.com/levizimmerman/fe3-assessment-1/blob/master/toilets.json) and renders the data for year that has been set by default or the user;
4. A colorscale is used to render the fill of the countries;
5. A legend is appended to the SVG based on the colorscale and the range of values;
6. At last a [pub sub pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) is used to let the map and dataset react to the user input (year range slider at the bottom of the site);

### Map interaction
For this project I have implemented some possiblities for the user to interact with the map:

#### Change year
The range slider on the bottom of the website creates the possibily to view data from different years. The slider is an element that is outside the drawn SVG rendered by D3. That is why I chose to use a [pub sub pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) for this input. This also helps with the scalibilty of the datavisualization. The slider has an `input` listener and passes the new value to the renderData function to draw the new data on the displayed map.

#### Zoom in on country
A `click` event listener is added to each country using the [`on`](https://github.com/d3/d3-selection/blob/master/README.md#selection_on) function. When clicking on a country the [`centroid`](https://github.com/d3/d3-geo/blob/master/README.md#path_centroid) function is used to calculate the coordinates of the center of the path of the country. These coordinates are used to zoom in on the country, which is actually scaling the map in the viewbox. The zoom function automatically triggers the zoom out when clicking on the same country again.

#### Mouse over country
A `mouseover` and `mouseleave` event listener is added to each country using the [`on`](https://github.com/d3/d3-selection/blob/master/README.md#selection_on) function. When hovering over a country the handler function `showCountryName()` will handle the mouseover event. This function uses the [`mouse`](https://github.com/d3/d3-selection/blob/master/README.md#mouse) of D3 to get the coordinates of the cursor. These coordinates are used to position the country label next to cursor when hovering over a country's path.


## Data
* [`eu.topojson`](https://github.com/levizimmerman/fe3-assessment-1/blob/master/eu.topojson) - Europe map data;
```json
{  
   "type":"Topology",
   "objects":{  
      "europe":{  
         "type":"GeometryCollection",
         "geometries":[  
            {  
               "type":"Polygon",
               "properties":{  
                  "iso_n3":"008",
                  "name":"Albania",
                  "iso_a3":"ALB"
               },
               "arcs":[  
                  [  
                     0,
                     1,
                     2,
                     3,
                     4
                  ]
               ]
            },
          
```
* [`toilets.json`](https://github.com/levizimmerman/fe3-assessment-1/blob/master/toilets.json) - Indoor toilet data;
```json
[
  {
    "2005": 1.5,
    "2006": 0.9,
    "2007": 1.5,
    "2008": 1.5,
    "2009": 1.3,
    "2010": 1.2,
    "2011": 1.2,
    "2012": 1,
    "2013": 1,
    "2014": 1,
    "2015": 1,
    "2016": 0.9,
    "code": "AT",
    "country": "Austria"
  }
]
```

## Features
### D3
* [geoMercator](https://github.com/d3/d3-geo/blob/master/README.md#geoMercator) - the spherical Mercator projection.
* [geoPath](https://github.com/d3/d3-geo/blob/master/README.md#geoPath) - create a new geographic path generator.
* [selectAll](https://github.com/d3/d3-selection/blob/master/README.md#selectAll) - select multiple elements from the document.
* [select](https://github.com/d3/d3-selection/blob/master/README.md#selection_select) - select a descendant element for each selected element.
* [enter](https://github.com/d3/d3-selection/blob/master/README.md#selection_enter) - get the enter selection (data missing elements).
* [attr](https://github.com/d3/d3-selection/blob/master/README.md#selection_attr) - get or set an attribute.
* [append](https://github.com/d3/d3-selection/blob/master/README.md#selection_append) - create, append and select new elements.
* [json](https://github.com/d3/d3-request/blob/master/README.md#json) - get a JSON file.
* [scaleQuantile](https://github.com/d3/d3-scale/blob/master/README.md#scaleQuantile) - create a quantile quantizing linear scale.
* [domain](https://github.com/d3/d3-scale/blob/master/README.md#continuous_domain) - set the input domain.
* [range](https://github.com/d3/d3-scale/blob/master/README.md#continuous_range) - set the output range.
* [centroid](https://github.com/d3/d3-geo/blob/master/README.md#path_centroid) - Compute the projected planar centroid of a given feature.
* [classed](https://github.com/d3/d3-selection/blob/master/README.md#selection_classed) - Get, add or remove CSS classes.
* [transition](https://github.com/d3/d3-transition/blob/master/README.md#selection_transition) - Schedule a transition for the selected elements.
* [transition](https://github.com/d3/d3-transition/blob/master/README.md#transition_duration) - Specify per-element duration in milliseconds.
* [mouse](https://github.com/d3/d3-selection/blob/master/README.md#mouse) - Get the mouse position relative to a given container.
* [node](https://github.com/d3/d3-selection/blob/master/README.md#selection_node) - Returns the first (non-null) element.
* [on](https://github.com/d3/d3-selection/blob/master/README.md#selection_on) - Add or remove event listeners.

### Events
* [on](https://github.com/RIAEvangelist/event-pubsub) - Bind handler function to type of event.
* [emit](https://github.com/RIAEvangelist/event-pubsub) - Calls handler bound to type of event.

### TopoJSON
* [feature](https://github.com/topojson/topojson-client/blob/master/README.md#feature) - convert TopoJSON to GeoJSON.

## Todo
* Add responsiveness to the JS and CSS;
* Add crossbrowser fixes (only works properly in Chrome);
* Create dynamically .domain() based on the given data;
* Add Malta to the map;

## License
[MIT](https://choosealicense.com/licenses/mit/) &copy; Levi Zimmerman

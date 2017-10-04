# Population without indoor toilet: A D3 datavisualization
This is a datavisualization project where population without indoor toilet is displayed per country on a map of Europe.
![preview-map.png](https://github.com/levizimmerman/fe3-assessment-1/blob/master/preview.png?raw=true)

## Background
This project focuses on rendering a map of Europe and displaying data about the countries on that map. Futhermore a range slider is implemented to scroll through the years that are present in the data set.

### Workflow
1. First the map is rendered using [`eu.topojson`](https://github.com/levizimmerman/fe3-assessment-1/blob/master/eu.topojson) as data and [TopoJSON](https://github.com/topojson/topojson/wiki) to read the data;
2. After the map is rendered the countries countries are drawn in `<path>` elements and a `[data-country-name]` is added to identify each country;
3. Then D3 loads [toilets.json](https://github.com/levizimmerman/fe3-assessment-1/blob/master/toilets.json) and renders the data for year that has been set by default or the user;
4. A colorscale is used to render the fill of the countries;
5. A legend is appended to the SVG based on the colorscale and the range of values;
6. At last a [pub sub pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) is used to let the map and dataset react to the user input;

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

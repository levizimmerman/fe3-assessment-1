/*
 * Globals: d3, topojson, Events
 */
(function() {
  var width = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
  var height = window.innerHeight;
  var center = [10, 71];
  var scale = width / 2;
  var year = 2009;
  var projection = d3.geoMercator().scale(scale).translate([width / 2, 0]).center(center);
  var path = d3.geoPath().projection(projection);
  var svg = d3.select('#map').append('svg').attr('height', height).attr('width', width);
  var countries = svg.append('g');
  var topoFile = './eu.topojson';
  var dataFile = './toilets.json';
  var disabledColor = '#459595';
  var colors = ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a']; // Used colorbrewer: http://colorbrewer2.org/#type=sequential&scheme=RdPu&n=9
  var buckets = 5; // Number of defined groups of percentages
  var yearSelect = document.getElementById('yearSelect');
  var currentYearElement = document.getElementById('currentYear');
  
  console.log('test');

  renderMap(topoFile);

  /*
   * Subscriptions
   * Using: http://riaevangelist.github.io/event-pubsub/ as custom library
   */
  Events.on('map/done', renderData);
  Events.on('map/done', renderLegend);
  Events.on('select/year/changed', renderData);
  Events.on('select/year/changed', setYear);

  /*
   * Listeners
   */
  yearSelect.addEventListener('input', handleYearSelectChangeEvent);
  window.addEventListener('load', setYear);

  /*
   * Renders map based on a topojson file of Europe.
   * https://github.com/topojson/topojson/wiki
   */
  function renderMap(file) {
    if (!file) {
      console.error('Missing argument: file in renderMap()');
      return;
    }
    d3.json(topoFile, function(err, data) {
      if (err) {
        throw err;
      }
      countries.selectAll('.country')
        .data(topojson.feature(data, data.objects.europe).features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path)
        .attr('fill', disabledColor)
        .attr('data-country-name', getCountryNameFromFeature);
      Events.emit('map/done', {
        dataFile: dataFile,
        year: year
      });
      return;
    });
  }

  /*
   * Renders data onto created map
   */
  function renderData(params) {
    if (!params.dataFile) {
      console.error('Missing argument: params.dataFile in renderData');
      return;
    }
    var year = params.year || year;
    d3.json(params.dataFile, function(err, data) {
      if (err) {
        throw err;
      }
      data.forEach(function(row, index) {
        var countryElement = countries.select('[data-country-name="' + row.country.toLowerCase() + '"]');
        var countryColor = disabledColor;
        var colorScale = getColorScale();
        if (row[year]) {
          countryColor = colorScale(row[year]);
        }
        countryElement.attr('fill', countryColor);
      });
    });
  }

  /*
   * Renders a legend for the map
   */
  function renderLegend() {
    var colorScale = getColorScale();
    var colorScaleArray = [0].concat(colorScale.quantiles());
    var legend = svg.selectAll('.legend')
      .data(colorScaleArray, function(data, index) {
        return data;
      });

    var legendItem = legend.enter()
      .append('g')
      .attr('class', ' legend');

    legendItem.append('rect')
      .attr('x', 10)
      .attr('y', function(data, index) {
        return index * 30 + 10;
      })
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', function(data, index) {
        return colors[index];
      });

    legendItem.append('text')
      .attr('x', 40)
      .attr('y', function(data, index) {
        return index * 30 + 27;
      })
      .attr('text-anchor', 'start')
      .text(function(data, index) {
        return getLegendItemLabel(data, index, colorScaleArray);
      });
  }

  /*
   * Returns string for legend item label
   */
  function getLegendItemLabel(data, index, colorScaleArray) {
    if (typeof data !== 'number' || typeof index !== 'number' || !colorScaleArray) {
      console.error('Missing arguments in getLegendItemLabel(data, index, colorScaleArray)');
      return;
    }
    var currentValue = Math.ceil(data) + ''; // to string
    var isLastOfArray = colorScaleArray.length - 1 === index;
    var nextValue = Math.ceil(colorScaleArray[index + 1]) + ''; // to string
    var legendItemLabel = currentValue + '% - ' + nextValue + '%';
    if (isLastOfArray) {
      nextValue = '>';
      legendItemLabel = currentValue + '% >';
    }
    return legendItemLabel;
  }

  /*
   * Returns the color scale
   */
  function getColorScale() {
    return d3.scaleQuantile()
      .domain([0, buckets - 1, 50])
      .range(colors);
  }

  /*
   * Handles change in year selection
   */
  function handleYearSelectChangeEvent() {
    Events.emit('select/year/changed', {
      dataFile: dataFile,
      year: this.value
    });
  }

  function setYear() {
    year = Number(yearSelect.value);
    currentYearElement.innerText = year;
  }

  /*
   * Returns country ISO code of given data entry
   */
  function getCountryNameFromFeature(d) {
    if (!d || !d.properties || !d.properties.name) {
      return null;
    }
    return d.properties.name.toLowerCase();
  }

}).call(this);

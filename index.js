/*
 * Globals: d3, topojson, Events
 */
(function() {
  var centered;
  var width = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
  var height = window.innerHeight;
  var center = [10, 71];
  var scale = width / 1.7;
  var year = 2009;
  var projection = d3.geoMercator().scale(scale).translate([width / 2, 0]).center(center);
  var path = d3.geoPath().projection(projection);
  var svg = d3.select('#map').append('svg').attr('height', height).attr('width', width).attr('id', 'svgMap');
  var countryLabel = d3.select('#map').append('div').attr('class', 'country-name hidden');
  var countries = svg.append('g').attr('class', 'countries');
  var topoFile = './eu.topojson';
  var dataFile = './toilets.json';
  var disabledColor = '#459595';
  var colors = ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a']; // Used colorbrewer: http://colorbrewer2.org/#type=sequential&scheme=RdPu&n=9
  var buckets = 5; // Number of defined groups of percentages
  var yearSelect = document.getElementById('yearSelect');
  var currentYearElement = document.getElementById('currentYear');
  var mapOffsetLeft = document.getElementById('map').offsetLeft + 15;
  var mapOffsetTop = document.getElementById('map').offsetTop + 15;

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
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', path)
        .attr('fill', disabledColor)
        .attr('id', getCountryNameFromFeature)
        .attr('data-country-name', getCountryNameFromFeature)
        // listeners
        .on('click', clickedCountry)
        .on('mousemove', showCountryName)
        .on('mouseleave', function(data, index) {
          countryLabel.classed('hidden', true); // toggle hidden class
        });

      Events.emit('map/done', {
        dataFile: dataFile,
        year: year
      });
      return;
    });
  }

  /*
   * Handles click on country path
   * https://bl.ocks.org/mbostock/2206590
   */
  function clickedCountry(data) {
    var x;
    var y;
    var k;
    if (data && centered !== data) {
      var centroid = path.centroid(data); //compute the projected planar centroid of a given feature.
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = data;
    } else { // set to original zoom level
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }
    countries.selectAll('.country')
      .classed('active', centered && function(data) {
        return data === centered;
      }); // toggle active class
    countries.transition()
      .duration(750)
      .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ') scale(' + k + ') translate(' + -x + ', ' + -y + ')')
      .style('stroke-width', 1.5 / k + 'px'); // zoom transition
  }

  /*
   * Shows label of country
   * http://bl.ocks.org/MaciejKus/61e9ff1591355b00c1c1caf31e76a668
   */
  function showCountryName(data) {
    var label = data.properties.name;
    var mouse = d3.mouse(svg.node())
      .map(function(data) {
        return parseInt(data); // returns rounded and number formatted value
      });
    countryLabel.classed('hidden', false)
      .attr('style', 'left: ' + (mouse[0] + mapOffsetLeft) + 'px; top: ' + (mouse[1] + mapOffsetTop) + 'px') // add map offset to label positioning
      .text(label);
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

(function() {
  if (window.CTSWidgets) {
    // bar chart constructor
    var AreaChart = function() {
      var areaChart = Object.create(AreaChart.prototype);

      // parse the data from the dataNode
      areaChart.parseData = function(dataNode) {
        var data = [];
        var rows = Array.from(dataNode.getElementsByClassName("row"));
        rows.forEach(function(row) {
          var children = row.children;
          data.push({
            "date": children[0].textContent,
            "value": parseFloat(children[1].textContent)
          });
        });

        return data;
      }

      // declare properties
      areaChart.propertiesSpec = {
        "yLabel"        : {type: "text",    defaultValue: "Y-axis", required: true},
        "height"        : {type: "int",     defaultValue: 500},
        "width"         : {type: "int",     defaultValue: 960},
        "fillColor"     : {type: "color",   defaultValue: "steelblue"},
        "fontSize"      : {type: "int",     defaultValue: 10},
        "fontFamily"    : {type: "text",    defaultValue: "sans-serif"},
        "marginTop"     : {type: "int",     defaultValue: 20},
        "marginBottom"  : {type: "int",     defaultValue: 20},
        "marginLeft"    : {type: "int",     defaultValue: 50},
        "marginRight"   : {type: "int",     defaultValue: 30},        
      }

      // render the widget in the container
      areaChart.render = function(container, data, properties) {
        // create the shadow DOM if one does not already exist
        var shadow = container.shadowRoot;
        if (!shadow) {
          shadow = container.createShadowRoot();
        }

        // import this widget's CSS into the shadow DOM
        shadow.innerHTML = "<style>@import '../../widgets/area-chart/area-chart.css';</style>";

        var shadowContainer = d3.select(shadow);

        var formatDate = d3.time.format("%d-%b-%y");
        data = data.map(function(d) {
          return type(d);
        });
        
        var margin = {top: properties["marginTop"], right: properties["marginRight"], bottom: properties["marginBottom"], left: properties["marginLeft"]},
            width = properties["width"] - margin.left - margin.right,
            height = properties["height"] - margin.top - margin.bottom;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var area = d3.svg.area()
            .x(function(d) { return x(d.date); })
            .y0(height)
            .y1(function(d) { return y(d.value); });

        var svg = shadowContainer.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("font-size", properties["fontSize"].toString() + "px")
            .style("font-family", properties["fontFamily"])
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)
            .style("fill", properties["fillColor"]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(properties["yLabel"]);

        function type(d) {
          d.date = formatDate.parse(d.date);
          d.value = +d.value;
          return d;
        }
      }

      return areaChart;
    }

    // attach the constructor to CTSWidgets
    var defaultName = "area-chart";
    var name = document.currentScript.dataset.prefix || defaultName;
    CTSWidgets[name] = AreaChart;
  }
  else {
    throw "CTS Widget Manager not found."
  }
})()
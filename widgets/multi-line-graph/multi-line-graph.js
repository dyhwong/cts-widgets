(function() {
  if (window.CTSWidgets) {
    // bar chart constructor
    var MultiLineGraph = function() {
      var multiLineGraph = Object.create(MultiLineGraph.prototype);

      // parse the data from the dataNode
      multiLineGraph.parseData = function(dataNode) {
        var data = [];
        var rows = Array.from(dataNode.getElementsByClassName("row"));
        rows.forEach(function(row) {
          var children = row.children;
          for (var i=1; i<children.length; i++) {
            while (data.length < i) {
              data.push([]);
            }
            data[i-1].push({
              "date": children[0].textContent,
              "value": parseFloat(children[i].textContent)
            });
          }
        });

        return data;
      }

      // declare properties
      multiLineGraph.propertiesSpec = {
        "yLabel"        : {type: "text",  className: "y-label",       defaultValue: "Y-axis"},
        "height"        : {type: "int",   className: "height",        defaultValue: 500},
        "width"         : {type: "int",   className: "width",         defaultValue: 960},
        "series"        : {type: "list",  className: "series",        defaultValue: ["series1"],  delimiter: ","},
        "lineColors"    : {type: "list",  className: "line-colors",   defaultValue: ["#98abc5", "#ff8c00"]}, delimiter: ",",
        "lineWeight"    : {type: "float", className: "line-weight",   defaultValue: 1.5},
        "fontFamily"    : {type: "text",  className: "font-family",   defaultValue: "sans-serif"},
        "fontSize"      : {type: "int",   className: "font-size",     defaultValue: 10},
        "marginTop"     : {type: "int",   className: "margin-top",    defaultValue: 20},
        "marginBottom"  : {type: "int",   className: "margin-bottom", defaultValue: 30},
        "marginLeft"    : {type: "int",   className: "margin-left",   defaultValue: 50},
        "marginRight"   : {type: "int",   className: "margin-right",  defaultValue: 80},  
      }

      // render the widget in the container
      multiLineGraph.render = function(container, data, properties) {
        // create the shadow DOM if one does not already exist
        var shadow = container.shadowRoot;
        if (!shadow) {
          shadow = container.createShadowRoot();
        }

        // import this widget's CSS into the shadow DOM
        shadow.innerHTML = "<style>@import '../../widgets/multi-line-graph/multi-line-graph.css';</style>";

        var shadowContainer = d3.select(shadow);

        var margin = {top: properties["marginTop"], right: properties["marginRight"], bottom: properties["marginBottom"], left: properties["marginLeft"]},
            width = properties["width"] - margin.left - margin.right,
            height = properties["height"] - margin.top - margin.bottom;

        var formatDate = d3.time.format("%d-%b-%y");
        data = data.map(function(d, i) {
          var series = d.map(function(dataPoint) {
            return type(dataPoint);
          });
          return {
            "name": properties["series"][i],
            "values": series
          }
        });

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

        var svg = shadowContainer.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style("font-size", properties["fontSize"].toString() + "px")
            .style("font-family", properties["fontFamily"]);

        color.domain(properties["series"]);

        x.domain(d3.extent(data[0].values, function(d) { return d.date; }));

        y.domain([
          0,
          d3.max(data, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
        ]);

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

        var series = svg.selectAll(".series")
            .data(data)
          .enter().append("g")
            .attr("class", "series");

        series.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d, i) { return properties["lineColors"][i]; })
            .style("stroke-width", properties["lineWeight"].toString() + "px");

        series.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

        function type(d) {
          d.date = formatDate.parse(d.date);
          d.value = +d.value;
          return d;
        }
      }

      return multiLineGraph;
    }

    // attach the constructor to CTSWidgets
    var defaultName = "multi-line-graph";
    var name = document.currentScript.dataset.prefix || defaultName;
    CTSWidgets[name] = MultiLineGraph;
  }
  else {
    throw "CTS Widget Manager not found."
  }
})()
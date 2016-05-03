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
              "x": children[0].textContent,
              "y": parseFloat(children[i].textContent)
            });
          }
        });

        return data;
      }

      // declare properties
      multiLineGraph.propertiesSpec = {
        "yLabel"    : {type: "text",  className: "y-label", defaultValue: "Y-axis"},
        "height"    : {type: "int",   className: "height",  defaultValue: 500},
        "width"     : {type: "int",   className: "width",   defaultValue: 960},
        "series"    : {type: "list",  className: "series",  defaultValue: ["series1"],  delimiter: ","}
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

        var margin = {top: 20, right: 80, bottom: 30, left: 50},
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
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });

        var svg = shadowContainer.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        color.domain(properties["series"]);

        x.domain(d3.extent(data[0].values, function(d) { return d.x; }));

        y.domain([
          d3.min(data, function(c) { return d3.min(c.values, function(v) { return v.y; }); }),
          d3.max(data, function(c) { return d3.max(c.values, function(v) { return v.y; }); })
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
            .style("stroke", function(d) { return color(d.name); });

        series.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.x) + "," + y(d.value.y) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

        function type(d) {
          d.x = formatDate.parse(d.x);
          d.y = +d.y;
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
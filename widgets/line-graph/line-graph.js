(function() {
  if (window.CTSWidgets) {
    // bar chart constructor
    var LineGraph = function() {
      var lineGraph = Object.create(LineGraph.prototype);

      // parse the data from the dataNode
      lineGraph.parseData = function(dataNode) {
        var data = [];
        var rows = Array.from(dataNode.getElementsByClassName("row"));
        rows.forEach(function(row) {
          var values = row.children;
          data.push({
            "key": values[0].textContent,
            "value": parseFloat(values[1].textContent)
          });
        });

        return data;
      }

      // declare properties
      lineGraph.propertiesSpec = {
        "yLabel"    : {type: "text",  className: "y-label", defaultValue: "Y-axis"},
        "height"    : {type: "int",   className: "height",  defaultValue: 500},
        "width"     : {type: "int",   className: "width",   defaultValue: 960},
      }

      // render the widget in the container
      lineGraph.render = function(container, data, properties) {
        // create the shadow DOM if one does not already exist
        var shadow = container.shadowRoot;
        if (!shadow) {
          shadow = container.createShadowRoot();
        }

        // import this widget's CSS into the shadow DOM
        shadow.innerHTML = "<style>@import '../../widgets/line-graph/line-graph.css';</style>";

        var shadowContainer = d3.select(shadow);

        var formatDate = d3.time.format("%d-%b-%y");
        data = data.map(function(d) {
          return type(d);
        });

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
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

        var line = d3.svg.line()
            .x(function(d) { return x(d.key); })
            .y(function(d) { return y(d.value); });

        var svg = shadowContainer.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function(d) { return d.key; }));
        y.domain(d3.extent(data, function(d) { return d.value; }));

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

        svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

        function type(d) {
          d.key = formatDate.parse(d.key);
          d.value = +d.value;
          return d;
        }
      }

      return lineGraph;
    }

    // attach the constructor to CTSWidgets
    var defaultName = "line-graph";
    var name = document.currentScript.dataset.prefix || defaultName;
    CTSWidgets[name] = LineGraph;
  }
  else {
    throw "CTS Widget Manager not found."
  }
})()
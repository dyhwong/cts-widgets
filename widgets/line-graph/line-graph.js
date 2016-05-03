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
          var children = row.children;
          data.push({
            "date": children[0].textContent,
            "value": parseFloat(children[1].textContent)
          });
        });

        return data;
      }

      // declare properties
      lineGraph.propertiesSpec = {
        "yLabel"        : {type: "text",  className: "y-label",       defaultValue: "Y-axis"},
        "height"        : {type: "int",   className: "height",        defaultValue: 500},
        "width"         : {type: "int",   className: "width",         defaultValue: 960},
        "lineColor"     : {type: "text",  className: "line-color",    defaultValue: "black"},
        "lineWeight"    : {type: "float", className: "line-weight",   defaultValue: 1.5},
        "fontFamily"    : {type: "text",  className: "font-family",   defaultValue: "sans-serif"},
        "fontSize"      : {type: "int",   className: "font-size",     defaultValue: 10},
        "marginTop"     : {type: "int",   className: "margin-top",    defaultValue: 20},
        "marginBottom"  : {type: "int",   className: "margin-bottom", defaultValue: 20},
        "marginLeft"    : {type: "int",   className: "margin-left",   defaultValue: 50},
        "marginRight"   : {type: "int",   className: "margin-right",  defaultValue: 30},    
      }

      // render the widget in the container
      lineGraph.render = function(container, data, properties) {
        // create the shadow DOM if one does not already exist
        var shadow = container.shadowRoot;
        if (!shadow) {
          shadow = container.createShadowRoot();
        }

        // import this widget's CSS into the shadow DOM
        shadow.innerHTML = "<style>@import 'http://treesheets.org/widgets/line-graph/line-graph.css';</style>";

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

        var line = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

        var svg = shadowContainer.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("font-size", properties["fontSize"].toString() + "px")
            .style("font-family", properties["fontFamily"])
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

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
          .attr("d", line)
          .style("stroke", properties["lineColor"])
          .style("stroke-width", properties["lineWeight"].toString() + "px");

        function type(d) {
          d.date = formatDate.parse(d.date);
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
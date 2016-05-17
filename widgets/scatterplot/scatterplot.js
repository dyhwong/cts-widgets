(function() {
  if (window.CTSWidgets) {
    // bar chart constructor
    var Scatterplot = function() {
      var scatterplot = Object.create(Scatterplot.prototype);

      // parse the data from the dataNode
      scatterplot.parseData = function(dataNode) {
        var data = [];
        var rows = Array.from(dataNode.getElementsByClassName("row"));
        rows.forEach(function(row) {
          var children = row.children;
          data.push({
            "x": parseFloat(children[0].textContent),
            "y": parseFloat(children[1].textContent)
          });
        });

        return data;
      }

      // declare properties
      scatterplot.propertiesSpec = {
        "xLabel"        : {type: "text",  defaultValue: "X-axis"},
        "yLabel"        : {type: "text",  defaultValue: "Y-axis"},
        "height"        : {type: "int",   defaultValue: 500},
        "width"         : {type: "int",   defaultValue: 960},
        "radius"        : {type: "float", defaultValue: 2},
        "color"         : {type: "color", defaultValue: "black"},
        "fontFamily"    : {type: "text",  defaultValue: "sans-serif"},
        "fontSize"      : {type: "int",   defaultValue: 10},
        "marginTop"     : {type: "int",   defaultValue: 20},
        "marginBottom"  : {type: "int",   defaultValue: 30},
        "marginLeft"    : {type: "int",   defaultValue: 40},
        "marginRight"   : {type: "int",   defaultValue: 20},  
      }

      // render the widget in the container
      scatterplot.render = function(container, data, properties) {
        // create the shadow DOM if one does not already exist
        var shadow = container.shadowRoot;
        if (!shadow) {
          shadow = container.createShadowRoot();
        }

        // import this widget's CSS into the shadow DOM
        shadow.innerHTML = "<style>@import 'http://treesheets.org/widgets/scatterplot/scatterplot.css';</style>";

        var shadowContainer = d3.select(shadow);

        data = data.map(function(d) {
          return type(d);
        });

        var margin = {top: properties["marginTop"], right: properties["marginRight"], bottom: properties["marginBottom"], left: properties["marginLeft"]},
            width = properties["width"] - margin.left - margin.right,
            height = properties["height"] - margin.top - margin.bottom;

        var x = d3.scale.linear()
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

        var svg = shadowContainer.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain([0, d3.max(data, function(d) { return d.x; })]).nice();
        y.domain([0, d3.max(data, function(d) { return d.y; })]).nice();

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(properties["xLabel"]);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(properties["yLabel"])

        svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("r", properties["radius"])
            .attr("cx", function(d) { return x(d.x); })
            .attr("cy", function(d) { return y(d.y); })
            .style("fill", properties["color"]);

        svg.selectAll(".axis")
            .style("font-size", properties["fontSize"].toString() + "px")
            .style("font-family", properties["fontFamily"]);

        function type(d) {
          d.x = +d.x
          d.y = +d.y
          return d
        }
      }

      return scatterplot;
    }

    // attach the constructor to CTSWidgets
    var defaultName = "scatterplot";
    var name = document.currentScript.dataset.prefix || defaultName;
    CTSWidgets[name] = Scatterplot;
  }
  else {
    throw "CTS Widget Manager not found."
  }
})()
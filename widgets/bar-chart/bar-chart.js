(function() {
  if (window.CTSWidgets) {
    // bar chart constructor
    var BarChart = function() {
      var barChart = Object.create(BarChart.prototype);

      // parse the data from the dataNode
      barChart.parseData = function(dataNode) {
        var data = [];
        var rows = Array.from(dataNode.getElementsByClassName("row"));
        rows.forEach(function(row) {
          var values = row.getElementsByTagName("span");
          data.push({
            "key": values[0].textContent,
            "value": parseFloat(values[1].textContent)
          });
        });

        return data;
      }

      // declare properties
      barChart.propertiesSpec = {
        "yLabel"    : {type: "text",  className: "y-label", defaultValue: "Y-axis"},
        "height"    : {type: "int",   className: "height",  defaultValue: 500},
        "width"     : {type: "int",   className: "width",   defaultValue: 960},
        "ticks"     : {type: "int",   className: "ticks",   defaultValue: 10}
      }

      // render the widget in the container
      barChart.render = function(container, data, properties) {
        // create the shadow DOM if one does not already exist
        var shadow = container.shadowRoot;
        if (!shadow) {
          shadow = container.createShadowRoot();
        }

        // import this widget's CSS into the shadow DOM
        shadow.innerHTML = "<style>@import '../../widgets/bar-chart/bar-chart.css';</style>";

        var shadowContainer = d3.select(shadow);

        var yLabel = properties["yLabel"];
        var ticks = properties["ticks"];

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = properties["width"] - margin.left - margin.right,
            height = properties["height"] - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(ticks);

        var svg = shadowContainer.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) { return d.key; }));
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
            .text(yLabel);

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.key); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

        function type(d) {
          d.value = +d.value;
          return d;
        }
      }

      return barChart;
    }

    // attach the constructor to CTSWidgets
    var defaultName = "bar-chart";
    var name = document.currentScript.dataset.prefix || defaultName;
    CTSWidgets[name] = BarChart;
  }
  else {
    throw "CTS Widget Manager not found."
  }
})()
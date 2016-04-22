(function() {
  if (window.CTSWidgets) {
    // bar chart constructor
    var BarChart = function(containerNode, dataNode, optionsNode) {
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

      // parse the options from the optionsNode
      barChart.parseOptions = function(optionsNode) {
        var options = {};

        var yLabelNodes = optionsNode.getElementsByClassName("y-label");
        var yLabel = yLabelNodes.length > 0 ? yLabelNodes[0].textContent : "Y-axis";
        options["yLabel"] = yLabel;

        var heightNodes = optionsNode.getElementsByClassName("height");
        var height = heightNodes.length > 0 ? parseFloat(heightNodes[0].textContent) : 500;
        options["height"] = height;

        var widthNodes = optionsNode.getElementsByClassName("width");
        var width = widthNodes.length > 0 ? parseFloat(widthNodes[0].textContent) : 960;
        options["width"] = width;

        var ticksNodes = optionsNode.getElementsByClassName("ticks");
        var ticks = ticksNodes.length > 0 ? parseFloat(ticksNodes[0].textContent) : 10;
        options["ticks"] = ticks;
        
        return options
      }

      // render the widget in the container
      barChart.render = function(container, data, options) {
        var shadow = container.createShadowRoot();

        shadow.innerHTML += "<style>@import './bar-chart.css';</style>";

        var container = d3.select(shadow);

        var yLabel = options["yLabel"];
        var ticks = options["ticks"];

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = options["width"] - margin.left - margin.right,
            height = options["height"] - margin.top - margin.bottom;

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

        var svg = container.append("svg")
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

      // initialization script
      var container = containerNode;
      var data = barChart.parseData(dataNode);
      var options = barChart.parseOptions(optionsNode);

      barChart.render(container, data, options);
    }

    // attach the constructor to CTSWidgets
    var defaultName = "bar-chart";
    CTSWidgets[defaultName] = BarChart;
  }
  else {
    throw "CTS Widget Manager not found."
  }
})()
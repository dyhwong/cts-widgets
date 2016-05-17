(function() {
  if (window.CTSWidgets) {
    // bar chart constructor
    var GroupedBarChart = function() {
      var groupedBarChart = Object.create(GroupedBarChart.prototype);

      // parse the data from the dataNode
      groupedBarChart.parseData = function(dataNode) {
        var data = [];
        var seriesNames = Array.from(dataNode.getElementsByClassName("header")[0].children);
        var series = [];
        for (var i=1; i<seriesNames.length; i++) {
          series.push(seriesNames[i].textContent);
        }

        var rows = Array.from(dataNode.getElementsByClassName("row"));
        rows.forEach(function(row) {
          var children = row.children;
          var values = [];
          for (var i=1; i<children.length; i++) {
            values.push({
              "series": series[i-1],
              "value": parseFloat(children[i].textContent)
            });
          }
          data.push({
            "group": children[0].textContent,
            "values": values
          });
        });

        return data;
      }

      // declare properties
      groupedBarChart.propertiesSpec = {
        "yLabel"        : {type: "text",  defaultValue: "Y-axis"},
        "height"        : {type: "int",   defaultValue: 500},
        "width"         : {type: "int",   defaultValue: 960},
        "colors"        : {type: "list",  defaultValue: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]}, delimiter: ",",
        "fontFamily"    : {type: "text",  defaultValue: "sans-serif"},
        "fontSize"      : {type: "int",   defaultValue: 10},
        "legendFontSize": {type: "int",   defaultValue: 10},
        "marginTop"     : {type: "int",   defaultValue: 20},
        "marginBottom"  : {type: "int",   defaultValue: 20},
        "marginLeft"    : {type: "int",   defaultValue: 50},
        "marginRight"   : {type: "int",   defaultValue: 30},   
      }

      // render the widget in the container
      groupedBarChart.render = function(container, data, properties) {
        // create the shadow DOM if one does not already exist
        var shadow = container.shadowRoot;
        if (!shadow) {
          shadow = container.createShadowRoot();
        }

        // import this widget's CSS into the shadow DOM
        shadow.innerHTML = "<style>@import '../../widgets/grouped-bar-chart/grouped-bar-chart.css';</style>";

        var shadowContainer = d3.select(shadow);

        var margin = {top: properties["marginTop"], right: properties["marginRight"], bottom: properties["marginBottom"], left: properties["marginLeft"]},
            width = properties["width"] - margin.left - margin.right,
            height = properties["height"] - margin.top - margin.bottom;

        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.ordinal()
            .range(properties["colors"]);

        var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        var svg = shadowContainer.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style("font-family", properties["fontFamily"]);

        var series = data[0].values.map(function(d) { return d.series; });

        x0.domain(data.map(function(d) { return d.group; }));
        x1.domain(series).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(d.values, function(d) { return d.value; }); })]);

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

        svg.selectAll(".axis")
            .style("font-size", properties["fontSize"].toString() + "px");

        var group = svg.selectAll(".group")
            .data(data)
          .enter().append("g")
            .attr("class", "group")
            .attr("transform", function(d) { return "translate(" + x0(d.group) + ",0)"; });

        group.selectAll("rect")
            .data(function(d) { return d.values; })
          .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.series); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .style("fill", function(d) { return color(d.series); });

        var legend = svg.selectAll(".legend")
            .data(series.slice())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .style("font-size", properties["legendFontSize"].toString() + "px")
            .style("font-family", properties["fontFamily"])
            .text(function(d) { return d; });
      }

      return groupedBarChart;
    }

    // attach the constructor to CTSWidgets
    var defaultName = "grouped-bar-chart";
    var name = document.currentScript.dataset.prefix || defaultName;
    CTSWidgets[name] = GroupedBarChart;
  }
  else {
    throw "CTS Widget Manager not found."
  }
})()
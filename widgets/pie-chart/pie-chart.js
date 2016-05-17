(function() {
  if (window.CTSWidgets) {
    // pie chart constructor
    var PieChart = function() {
      var pieChart = Object.create(PieChart.prototype);

      // parse the data from the dataNode
      pieChart.parseData = function(dataNode) {
        var data = [];
        var rows = Array.from(dataNode.getElementsByClassName("row"));
        rows.forEach(function(row) {
          var children = row.children;
          data.push({
            "key": children[0].textContent,
            "value": parseFloat(children[1].textContent)
          });
        });

        return data;
      }

      // declare properties
      pieChart.propertiesSpec = {
        "height"        : {type: "int",   defaultValue: 500},
        "width"         : {type: "int",   defaultValue: 960},
        "fontFamily"    : {type: "text",  defaultValue: "sans-serif"},
        "fontSize"      : {type: "int",   defaultValue: 10},
        "colors"        : {type: "list",  defaultValue: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]}, delimiter: ",",
      }

      // render the widget in the container
      pieChart.render = function(container, data, properties) {
        // create the shadow DOM if one does not already exist
        var shadow = container.shadowRoot;
        if (!shadow) {
          shadow = container.createShadowRoot();
        }

        var shadowContainer = d3.select(shadow);

        var width = properties["width"],
            height = properties["height"],
            radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
            .range(properties["colors"]);

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        var svg = shadowContainer.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
          .attr("class", "arc");

        g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.key); });

        g.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .style("font-size", properties["fontSize"].toString() + "px")
          .style("font-family", properties["fontFamily"])
          .text(function(d) { return d.data.key; });

        function type(d) {
          d.value = +d.value;
          return d;
        }
      }

      return pieChart;
    }

    // attach the constructor to CTSWidgets
    var defaultName = "pie-chart";
    var name = document.currentScript.dataset.prefix || defaultName;
    CTSWidgets[name] = PieChart;
  }
  else {
    throw "CTS Widget Manager not found."
  }
})()
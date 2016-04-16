(function() {
  if (window.CTSWidgets) {

    var BarChart = function(containerNode, dataNode, optionsNode) {
      var barChart = Object.create(BarChart.prototype);

      console.log('initialized a bar chart');

      barChart.parseHTML = function() {

      }

      barChart.render = function() {

      }

      return barChart;
    }

    var defaultName = "bar-chart";

    CTSWidgets[defaultName] = BarChart;
  }
  else {
    throw "CTS Widget Manager not found."
  }
})()
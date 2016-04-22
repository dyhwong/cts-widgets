var CTSWidgets = {};

window.onload = function() {
  // loop through all possible widgets
  for (var widget in CTSWidgets) {
    // all DOM elements with matching class name
    var containers = Array.from(document.getElementsByClassName(widget)); // convert NodeList to Array
    containers.forEach(function(containerNode) {
      // determine the class names for their data and options nodes
      var dataNodes = document.getElementsByClassName(containerNode.dataset["ctswidgetsData"]); 
      var optionsNodes = document.getElementsByClassName(containerNode.dataset["ctswidgetsOptions"]);

      var dataNode = dataNodes[0];
      var optionsNode = optionsNodes[0];

      // check that data and options exist before initialization
      if (dataNodes.length > 0 && optionsNodes.length > 0) {
        CTSWidgets[widget](containerNode, dataNode, optionsNode);
      }
      else {
        // if user did not define a class name for the data node
        if (typeof containerNode.dataset["ctswidgetsData"] === "undefined") {
          console.error("Missing a data node class name for the \"" + widget + "\" widget.");
          return;
        }

        // if user did not define a class name for the options node
        if (typeof containerNode.dataset["ctswidgetsOptions"] == "undefined") {
          console.error("Missing an options node class name for the \"" + widget + "\" widget.");
          return;
        }

        // if the widget manager can't find a data node, notify the user
        if (dataNodes.length == 0) {
          console.error("Could not find data node with class name \"" + containerNode.dataset["ctswidgetsData"] + "\" for the \"" + widget + "\" widget.");
          return;
        }

        // if the widget manager can't find an options node, notify the user
        if (optionsNodes.length == 0) {
          console.error("Could not find options node with class name \"" + containerNode.dataset["ctswidgetsOptions"] + "\" for the \"" + widget + "\" widget.");
          return;
        }
      }
    });
  }
}
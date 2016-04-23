var CTSWidgets = {};

window.onload = function() {
  var init = function() {
    // loop through all possible widgets
    for (var widgetName in CTSWidgets) {
      // all DOM elements with matching class name
      var containers = Array.from(document.getElementsByClassName(widgetName)); // convert NodeList to Array
      containers.forEach(function(containerNode) {
        // determine the class names for their data and options nodes
        var dataNodes = document.getElementsByClassName(containerNode.dataset["ctswidgetsData"]); 
        var optionsNodes = document.getElementsByClassName(containerNode.dataset["ctswidgetsOptions"]);

        var dataNode = dataNodes[0];
        var optionsNode = optionsNodes[0];

        // check that data and options exist before initialization
        if (dataNodes.length > 0 && optionsNodes.length > 0) {
          var widget = CTSWidgets[widgetName](containerNode, dataNode, optionsNode);

          // widget initialization script
          var container = containerNode;
          var data = widget.parseData(dataNode);
          var options = widget.parseOptions(optionsNode);
          widget.render(container, data, options);

          // initialize mutation observer for the data node
          var dataObserver = new MutationObserver(function(mutations) {
            data = widget.parseData(dataNode);
            widget.render(container, data, options);
          });
          dataObserver.observe(dataNode, {childList: true, attributes: true, subtree: true});

          // initialize mutation observer for the options node
          var optionsObserver = new MutationObserver(function(mutations) {
            options = widget.parseOptions(optionsNode);
            widget.render(container, data, options);
          });
          optionsObserver.observe(optionsNode, {childList: true, attributes: true, subtree: true});
        }
        else {
          // if user did not define a class name for the data node
          if (typeof containerNode.dataset["ctswidgetsData"] === "undefined") {
            console.error("Missing a data node class name for the \"" + widgetName + "\" widget.");
            return;
          }

          // if user did not define a class name for the options node
          if (typeof containerNode.dataset["ctswidgetsOptions"] == "undefined") {
            console.error("Missing an options node class name for the \"" + widgetName + "\" widget.");
            return;
          }

          // if the widget manager can't find a data node, notify the user
          if (dataNodes.length == 0) {
            console.error("Could not find data node with class name \"" + containerNode.dataset["ctswidgetsData"] + "\" for the \"" + widgetName + "\" widget.");
            return;
          }

          // if the widget manager can't find an options node, notify the user
          if (optionsNodes.length == 0) {
            console.error("Could not find options node with class name \"" + containerNode.dataset["ctswidgetsOptions"] + "\" for the \"" + widgetName + "\" widget.");
            return;
          }
        }
      });
    }
  }

  // if CTS was imported, wait for the treesheet to finish running before initing
  if (window.CTS) {
    CTS.loaded.then(function() {
      CTS.on('cts-received-graft', init);
    });
  }
  else {
    init();
  }
}
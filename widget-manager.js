var CTSWidgets = {};

window.onload = function() {
  var init = function() {
    // loop through all possible widgets
    for (var widgetName in CTSWidgets) {
      // all DOM elements with matching class name
      var containers = Array.from(document.getElementsByClassName(widgetName)); // convert NodeList to Array
      containers.forEach(function(containerNode) {
        // determine the class names for their data and properties nodes
        var dataName = containerNode.dataset["ctswidgetsData"] || (widgetName + "-data");
        var propertiesName = containerNode.dataset["ctswidgetsProperties"] || (widgetName + "-properties");

        var dataNodes = document.getElementsByClassName(dataName);
        var propertiesNodes = document.getElementsByClassName(propertiesName);;

        var dataNode = dataNodes[0];
        var propertiesNode = propertiesNodes[0];

        // check that data and properties exist before initialization
        if (dataNodes.length > 0 && propertiesNodes.length > 0) {
          var widget = CTSWidgets[widgetName](containerNode, dataNode, propertiesNode);

          // widget initialization script
          var container = containerNode;
          var data = widget.parseData(dataNode);
          var properties = widget.parseProperties(propertiesNode);
          widget.render(container, data, properties);

          // initialize mutation observer for the data node
          var dataObserver = new MutationObserver(function(mutations) {
            data = widget.parseData(dataNode);
            widget.render(container, data, properties);
          });
          dataObserver.observe(dataNode, {childList: true, attributes: true, subtree: true});

          // initialize mutation observer for the properties node
          var propertiesObserver = new MutationObserver(function(mutations) {
            properties = widget.parseProperties(propertiesNode);
            widget.render(container, data, properties);
          });
          propertiesObserver.observe(propertiesNode, {childList: true, attributes: true, subtree: true});
        }
        else {
          // if the widget manager can't find a data node, notify the user
          if (dataNodes.length == 0) {
            console.error("Could not find data node with class name \"" + dataName + "\" for the \"" + widgetName + "\" widget.");
            return;
          }

          // if the widget manager can't find an properties node, notify the user
          if (propertiesNodes.length == 0) {
            console.error("Could not find properties node with class name \"" + propertiesName + "\" for the \"" + widgetName + "\" widget.");
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
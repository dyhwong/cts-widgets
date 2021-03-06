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
        var propertiesNodes = document.getElementsByClassName(propertiesName);

        var dataNode = dataNodes[0];
        var propertiesNode = propertiesNodes[0];

        // check that data and properties exist before initialization
        if (dataNodes.length > 0 && propertiesNodes.length > 0) {
          var widget = CTSWidgets[widgetName]();

          // widget initialization script
          var container = containerNode;
          var data = widget.parseData(dataNode);
          var properties = parseProperties(propertiesNode, widget.propertiesSpec);
          widget.render(container, data, properties);

          // initialize mutation observer for the data node
          var dataObserver = new MutationObserver(function(mutations) {
            data = widget.parseData(dataNode);
            widget.render(container, data, properties);
          });
          dataObserver.observe(dataNode, {childList: true, attributes: true, subtree: true, characterData: true});

          // initialize mutation observer for the properties node
          var propertiesObserver = new MutationObserver(function(mutations) {
            properties = parseProperties(propertiesNode, widget.propertiesSpec);
            widget.render(container, data, properties);
          });
          propertiesObserver.observe(propertiesNode, {childList: true, attributes: true, subtree: true, characterData: true});
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

  var parseProperties = function(propertiesNode, propertiesSpec) {
    var properties = {};
    for (var property in propertiesSpec) {
      var spec = propertiesSpec[property];
      var className = camelCaseToHyphenated(property);
      var nodes = propertiesNode.getElementsByClassName(className);

      // check if the property is required and whether any nodes for it exist
      if (spec.required && nodes.length === 0) {
        console.error("Could not find value for property \"" + property + "\" ")
      }
      else {
        // type cast the user-submitted value
        switch (spec.type) {
          case "color":
            properties[property] = nodes.length > 0 && isValidColor(nodes[0].textContent) ? nodes[0].textContent : spec.defaultValue;
            break;
          case "int":
            properties[property] = nodes.length > 0 ? parseInt(nodes[0].textContent) : spec.defaultValue;
            break;
          case "float":
            properties[property] = nodes.length > 0 ? parseFloat(nodes[0].textContent) : spec.defaultValue;
            break;
          case "text":
            properties[property] = nodes.length > 0 ? nodes[0].textContent : spec.defaultValue;
            break;
          case "list":
            if (nodes.length == 0) {
              properties[property] = spec.defaultValue;
            } else {
              var delimiter = spec.delimiter || ",";
              var content = nodes[0].textContent.split(delimiter);
              properties[property] = content;
            }
            break;
          default:
            properties[property] = nodes.length > 0 ? nodes[0].textContent : spec.defaultValue;
        }
      }
    }

    return properties;
  }

  // convert a camel case string to a hyphen-separated string
  var camelCaseToHyphenated = function(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // check if a string is a valid CSS color property value
  var isValidColor = function(color) {
    var p = document.createElement("p");
    p.style.color = color;
    if (p.style.color !== color) {
      console.error("color \"" + color + "\" is not a valid color.");
    }
    return p.style.color === color && color.length !== 0;
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
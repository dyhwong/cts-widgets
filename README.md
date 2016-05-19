# cts-widgets

Declarative data visualizations using just HTML. Documentation can be found [here](http://treesheets.org/widgets/).

To get a quick demo up, go to the root directory of this repository and start a webserver (you can use `python -m SimpleHTTPServer` if you have Python installed). Then, navigate to `localhost:8000/tests/basic` and you should see a bar chart appear on the page.

`widget-manager.js` handles most of the initialization code for widgets. It parses prefixes for each widget, sets up mutation observers, and handles errors with user-submitted HTML.

The `widgets` directory contains the code for widgets - mainly the HTML parser, the render function, an HTML template, widget CSS, and the properties spec.

The `examples` directory contains code and documentation pages for the website. Before moving them to the S3 bucket, merge master into the deploy branch. The deploy branch contains the proper pathnames for file imports (using the treesheets URL).

The `tests` directory contains sample testing code for each of the current widgets.

The `user-study` directory contains sample tasks for a user study but you can largely ignore it.

Most of the widget rendering code was based off the examples from the [D3 gallery](https://github.com/d3/d3/wiki/Gallery). Credit goes to their respective creators.

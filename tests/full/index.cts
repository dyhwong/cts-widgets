@html bar-chart relative(../../widgets/bar-chart/bar-chart-template.html);

.bar-graph-data :graft bar-chart | .data-container;

bar-chart | .data :are .bar-graph-data;
bar-chart | .data .row span:nth-child(1) :is .bar-graph-data span:nth-child(1);
bar-chart | .data .row span:nth-child(2) :is .bar-graph-data span:nth-child(2);


.bar-graph-properties :graft bar-chart | .properties-container;

bar-chart | .height :is .height;
bar-chart | .width :is .width;
bar-chart | .ticks :is .ticks;
bar-chart | .y-label :is .y-label;
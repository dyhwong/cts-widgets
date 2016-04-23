@html bar-chart relative(../widgets/bar-chart/bar-chart-template.html);

.bar-chart-data :graft bar-chart | .data-container;

bar-chart | .data :are .bar-chart-data;
bar-chart | .data .row span:nth-child(1) :is .bar-chart-data span:nth-child(1);
bar-chart | .data .row span:nth-child(2) :is .bar-chart-data span:nth-child(2);


.bar-chart-options :graft bar-chart | .options-container;

bar-chart | .height :is .height;
bar-chart | .width :is .width;
bar-chart | .ticks :is .ticks;
bar-chart | .y-label :is .y-label;
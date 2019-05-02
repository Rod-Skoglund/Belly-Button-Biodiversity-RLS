//################################################################################
// Applcation: Belly Button Biodiversity
// Author: Rod Skoglund
// File: App.js
// Description: Provides the JavaScript code to build charts, graphs and tables 
//              and respond to hover and option selection events.
//################################################################################

// *******************************************************************************
// Function that builds the metadata panel
// *******************************************************************************
function buildMetadata(sample) {

  // Using `d3.json`, fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){
    // Using d3, select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Using `.html(""), clear any existing metadata
    sample_metadata.html("");

    // Using `Object.entries`, add each key and value pair to the panel
    // Inside the loop, use d3 to append new tags for each key-value in the 
    //    metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
    });
  })
    // BONUS: Build the Gauge Chart - not included at this time.
    // buildGauge(data.WFREQ);
};

// *******************************************************************************
// Function to build the Bubble and Pie Charts
// *******************************************************************************
function buildCharts(sample) {

  // Using `d3.json`, fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {

    // Build a Bubble Chart using the sample data
    var x_values = data.otu_ids;
    var y_values = data.sample_values;
    var m_size = data.sample_values;
    var m_colors = data.otu_ids; 
    var t_values = data.otu_labels;

    var trace1 = {
      x: x_values,
      y: y_values,
      text: t_values,
      mode: 'markers',
      marker: {
        color: m_colors,
        size: m_size
      } 
    };
  
    var data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot('bubble', data, layout);
   

    // Build a Pie Chart
    // Using slice(), grab the top 10 sample_values, otu_ids, and labels (10 each).
    d3.json(url).then(function(data) {  
      var pie_values = data.sample_values.slice(0,10);
      var pie_labels = data.otu_ids.slice(0,10);
      var pie_hover = data.otu_labels.slice(0,10);

      var data = [{
        values: pie_values,
        labels: pie_labels,
        hovertext: pie_hover,
        type: 'pie'
      }];

      Plotly.newPlot('pie', data);

    });
  });   
}

// *******************************************************************************
// Function to build the initial page from defaults including the drop down 
//    options and using the first item in the list for the Pie and Bubble charts.
// *******************************************************************************
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// *******************************************************************************
// Function to respond to selections from the drop down (sample) list and calling 
//    functions to build the Metadata, Pie and Bubble charts using the selection.
// *******************************************************************************
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// *******************************************************************************
// Call the function to initialize the dashboard
// *******************************************************************************
init();

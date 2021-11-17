function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(sampleNames);

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let sampleArrayObjs = sampleArray.filter(sampleObj => sampleObj.id == sample);
    var metadata = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(metadata.wfreq)
    //  5. Create a variable that holds the first sample in the array.
    let firstSampleObj = sampleArrayObjs[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = firstSampleObj.otu_ids;
    let otuLabels = firstSampleObj.otu_labels;
    let sampleValues = firstSampleObj.sample_values;
    
        // 7. Create the yticks for the bar chart.
    var yticks = [];
    otuIds.slice(0, 10).forEach(otuId => yticks.push("OTU "+ otuId));

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x:sampleValues.slice(0,10).reverse(),
      y:yticks.reverse(),
      text:otuLabels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacteria Cultures Found",
      x:{title:"No. of bacteria"},
      y:{title:"Bacteria"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      colorscale: "Greys",
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: sampleValues
      }
    }];

        // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacterial Culture per sample',
      xaxis:{title:"OTU ID"},
      yaxis:{title:"Sample Value"},
      hovermode:"closest",
      height: 500, 
      width: 1000
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // create washing data variable
    var washing_frequency = metadata.wfreq;
    console.log(washing_frequency);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washing_frequency,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b> Belly Button Washing Frequency</b> <br> # of Scrubs per</br>" },
      gauge: {
        axis: { range: [null, 10], tickwidth: 2, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "firebrick" },
          { range: [2, 4], color: "darkorange" },
          { range: [4, 6], color: "greenyellow" },
          { range: [6, 8], color: "lightseagreen" },
          { range: [8, 10], color: "dodgerblue" }
        ],
        threshold: {
          value: washing_frequency,
        }
      },
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500, height: 300, margin: { t: 0, b: 0 },
      font: { color: "black" }
    };;

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

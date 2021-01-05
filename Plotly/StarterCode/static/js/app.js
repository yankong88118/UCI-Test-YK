//get data from json
function buildMetadata(sample){
        d3.json("samples.json").then(function(data) {
                // get sample data
                var metadata= data.metadata;
                var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
                var result= resultsarray[0];
                // data hold in html
                var panel=d3.select("#sample-metadata");
                panel.html("");
                //create data list
                Object.entries(result).forEach(([key, value]) => {
                        var dataList = list.append("li");
                        dataList.text(`${key}: ${value}`);
                      });
                });
        }

function buildPlot(sample) {
    d3.json("samples.json").then(function(data) {
        // Grab values from the data json object to build the plots
        var samples= data.samples;
        var array= samples.filter(sampleobject => sampleobject.id == sample);
        var response= array[0]

        var id = response.otu_ids;
        var label = response.otu_labels;
        var value = response.sample_values;
        //create the bubble chart
        var bubbletrace = {
            x: id,
            y: value,
            text: label,
            mode: "markers",
            marker: {
                color: ids,
                size: values,
                }
        }
        var bubblelayout={
                xaxis: {
                        autorange: true,
                        type: "linear",
                        title: "OTU_ID"
                      },
                      yaxis: {
                        autorange: true,
                        type: "linear"
                      }
        }
        Plotly.plot("bubble", bubbletrace, bubblelayout);
        //array for collected data
        forTopTen=[]
        //loop
        for (i = 0; i < data.otu_ids.length; i++) {
                forTopTen.push({
                  id: data.otu_ids[i],
                  value: data.sample_values[i],
                  label: data.otu_labels[i]
                });
              };
        // Sort
        var sorted = forTopTen.sort((a, b) => b.values - a.values);
        //slice for top ten
        var topTen = forTopTen.slice(0, 10);
        //create bar chart
        var bartrace =[
                {
                  y:id,
                  x:value,
                  text:label,
                  type:"bar",
                  orientation:"h"
                }
              ];
          
              var barLayout = {
                title: "Top 10 OTUs",
              };
          
              Plotly.newPlot("bar", bartrace, barLayout);
            });
          }

function init() {
         // dropdown select
        var dropdownSelection = d3.select("#selDataset");
              
        // Use the list of sample names to populate the select options
         d3.json("samples.json").then((data) => {
                var sampleName = data.names;
                sampleName.forEach((sample) => {
                        dropdownSelection
                        .append("option")
                        .text(sample)
                        .property("value", sample);
                  });
              
        // Use the first sample for the default plots
        const firstSample = sampleName[0];
        buildMetadata(firstSample);
        buildPlot(firstSample);
                });
              }
              
              function optionChanged(newSample) {
                // Fetch new data when select new one
                buildMetadata(newSample);
                buildPlot(newSample);
              }
              
init();
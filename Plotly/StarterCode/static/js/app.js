function buildMetadata(sample) {
        d3.json("samples.json").then((data) => {
          var metadata= data.metadata;
          var metaarray= metadata.filter(sampleobject => sampleobject.id == sample);
          var result= metaarray[0]
          var panel = d3.select("#sample-metadata");
          panel.html("");
          Object.entries(result).forEach(([key, value]) => {
            panel.append("li").text(`${key}: ${value}`);
          });
        });
      }
    
    
    function buildPlots(sample) {
    
      // Grab the samples
      d3.json("samples.json").then((data) => {
        var samples= data.samples;
        console.log(samples);
        var samplearray= samples.filter(sampleobject => sampleobject.id == sample);
        console.log(samplearray);
        var sampleset= samplearray[0]
        console.log(sampleset);
        var ids = sampleset.otu_ids;
        var labels = sampleset.otu_labels;
        var values = sampleset.sample_values;
    
    
        // Create a Bubble Chart
        var bubbleTrace = [
                {
                  x: ids,
                  y: values,
                  text: labels,
                  mode: "markers",
                  marker: {
                    color: ids,
                    size: values,
                    }
                }
              ];

        var bubbleLayout = {
          xaxis: { title: "OTU ID" },
          };
    
        Plotly.plot("bubble", bubbleTrace, bubbleLayout);
    
        //  Build a bar Chart
        forTopTen=[]
        //loop through samples
        for (i = 0; i < sampleset.otu_ids.length; i++) {
                forTopTen.push({
                        id: sampleset.otu_ids[i],
                        value: sampleset.sample_values[i],
                        label: sampleset.otu_labels[i]
                        });
                      };
        // Sort
        var sorted = forTopTen.sort((a, b) => b.values - a.values);
        console.log(sorted);
        //slice for top ten
        var topTen = forTopTen.slice(0, 10);
        console.log(topTen);
        var barTrace =[
          {
            y:topTen.map(row=>`OTU ${row.id}`).reverse(),
            x:topTen.map(row=> row.value).reverse(),
            text:topTen.map(row=> row.label).reverse(),
            type:"bar",
            orientation:"h"
    
          }
        ];
    
        var barLayout = {
          title: "Top 10 OTUs",
        };
    
        Plotly.newPlot("bar", barTrace, barLayout);
      });
    }
       
     
    function init() {
      // dropdown select
      var dropdownOption = d3.select("#selDataset");
    
      // grab names for dropdown options
      d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
          dropdownOption
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    
        // Use the first sample as default plots
        const firstSample = sampleNames[0];
        buildPlots(firstSample);
        buildMetadata(firstSample);
      });
    }
    
    function optionChanged(newSample) {
      // Grab new data when it is selected
      buildPlots(newSample);
      buildMetadata(newSample);
    }
    
    init();
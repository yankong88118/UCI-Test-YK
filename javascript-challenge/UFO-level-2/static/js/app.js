// from data.js
var tableData = data;
var tbody = d3.select("tbody");
// YOUR CODE HERE!
// // Step 1: Loop Through `data` and console.log each record
data.forEach(function(ufoRecord) {
    console.log(ufoRecord);
  });

// // Step 2:  Use Arrow to append one table row `tr` for each record
data.forEach((ufoRecord) => {
  var row = tbody.append("tr");
  Object.entries(ufoRecord).forEach(([key, value]) => {
    var cell = row.append("td");
    cell.text(value);
  });
});

//search
// Select the button
var button = d3.select("#filter-btn");

// Create event handlers 
button.on("click", runEnter);
// Complete the event handler function 
function runEnter() {
    tbody.html("");    
    // Select the input element and get the raw HTML node
    var inputinfo = d3.select("#input");
  
    // Get the value property of the input element
    var inputValue = inputinfo.property("value");
  
    console.log(inputValue);
    console.log(tableData)
  
    var filteredData = tableData.filter(info => info.datetime === inputValue ||  
                                                  info.city === inputValue ||
                                                  info.state === inputValue ||
                                                  info.country === inputValue ||
                                                  info.shape === inputValue
                                        );
  
    console.log(filteredData);
    //find out search result
    filteredData.forEach((filteredInfo) => {
        var row = tbody.append("tr");
        Object.entries(filteredInfo).forEach(([key, value]) => {
          var cell = row.append("td");
          cell.text(value);
        });
      });
  
};
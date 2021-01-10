// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis="healthcare";


// function used for updating x-scale var upon click on axis label
function xScale(fullData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(fullData, d => d[chosenXAxis]) * 0.8,
      d3.max(fullData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(fullData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(fullData, d => d[chosenYAxis]) * 0.8,
        d3.max(fullData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis,newYScale,chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy",d=> newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating text group with a transition to
// new text
function renderText(textGroup, newXScale, chosenXAxis,newYScale,chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y",d=> newYScale(d[chosenYAxis]))
      .attr("text-anchor","middle");
  
    return textGroup;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup,textGroup) {

  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty";
  }
  else if(chosenXAxis === "age") {
    xlabel = "Age";
  }
  else {
      xlabel="Income"
  }
  
  var ylabel;
  if (chosenYAxis === "healthcare") {
    ylabel = "Lacks of Healthcare";
  }
  else if(chosenYAxis === "obesity") {
    ylabel = "Obesity";
  }
  else {
      ylabel="Smokes"
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([90, 90])
    .html(function(d) {
      return (`<strong>${d.abbr}</strong><br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data,this);
  })

  textGroup.call(toolTip);

  textGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(fullData, err) {
  if (err) throw err;

  // parse data
  fullData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(fullData, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(fullData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll(".stateCircle")
    .data(fullData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("class","stateCircle")
    .attr("r", 20)
    .attr("color", "pink")
    .attr("opacity", ".5");

    // append text
    var textGroup = chartGroup.selectAll(".stateText")
    .data(fullData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]*.95))
    .text(d=>(d.abbr))
    .attr("class","stateText")
    .attr("font-size","12px")
    .attr("text-anchor","middle")
    .attr("color", "grey")

  // Create group for three x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");
  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income");

 // Create group for three y-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-25, ${height / 2})`);

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", 0)
    .attr("y", -20)
    .attr("value", "healthcare") // value to grab for event listener
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("active", true)
    .text("Lacks of Healthcare");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", 0)
    .attr("y", -40)
    .attr("value", "smokes") // value to grab for event listener
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Smokese");
  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform","rotate(-90)")
    .attr("x", 0)
    .attr("y", -60)
    .attr("value", "obesity") // value to grab for event listener
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Obesity");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup, textGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(fullData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis);
        // updates text with new x values
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup,textGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if(chosenXAxis === "age") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        else{
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
        }
      }
    });
    // y axis labels event listener
  ylabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenYAxis with value
      chosenYAxis = value;

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(fullData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis);
      // updates text with new y values
      textGroup = renderText(textGroup, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis);
      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup,textGroup);

      // changes classes to change bold text
      if (chosenYAxis === "healthcare") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if(chosenXAxis === "obesity") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        }
      else{
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });
}).catch(function(error) {
  console.log(error);
});


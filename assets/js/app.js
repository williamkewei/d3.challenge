//Function to resize chart
function responsiveChart() {

  //Clear svg area if it isn't empty, and resize if it has been replaces
  var svgArea = d3.select("#scatter").select("svg");

  if (!svgArea.empty()) {
      svgArea.remove();
  }

  //CREATE SVG WRAPPER
  //Define canvas as width and height of the browser window. NOTE: This will change on resizing!
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  //Set margins
  var margin = {
      top: 30,
      bottom: 50,
      left: 50,
      right: 200
  };

  //Set chart height and width linked to window height and width from svgWidth/svgHeight linked to window width/height.
  var chartHeight = svgHeight - margin.top - margin.bottom;
  var chartWidth = svgWidth - margin.left - margin.right;


  //APPEND SVG ELEMENT
  //into index.html at id="scatter" and height/width based on the window height/width.
  var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

  //Append group element "g" to the svg element, wrap all parts of the svg chart together.
  //Transform to place "g" element at the proper margins on the svg canvas.
  var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //READ IN SVG FILE AND EXTRACT DATA
  d3.csv("./assets/data/data.csv").then(function(censusData) {
      console.log(censusData);

      //Convert data from csv table to numbers for use in subsequent plotting/analyses
      censusData.forEach(function(data){
          data.poverty = +data.poverty;
          data.povertyMoe = +data.povertyMoe;
          data.age = +data.age;
          data.ageMoe = +data.ageMoe;
          data.income = +data.income;
          data.incomeMoe = +data.incomeMoe;
          data.healthcare = +data.healthcare;
          data.healthcareLow = +data. healthcareLow;
          data.healthcareHigh = +data.healthcareHigh;
          data.obesity = +data.obesity;
          data.obesityLow = +data.obesityLow;
          data.obesityHigh = +data.obesityHigh;
          data.smokes = +data.smokes;
          data.smokesLow = +data.smokesLow;
          data.smokesHigh = +data.smokesHigh;
      });

      //CREATE SCALE FUNCTIONS: HEALTHCARE ON X AXIS, POVERTY ON Y AXIS
      //Healthcare scale on X axis
      var yLinearScale = d3.scaleLinear()
          .domain([d3.min(censusData, d => d.healthcare) - 1, d3.max(censusData, d => d.healthcare) + 1])
          .range([chartHeight, 0]);

      //Poverty scale on Y axis
      var xLinearScale = d3.scaleLinear()
          .domain([d3.min(censusData, d => d.poverty) - 1, d3.max(censusData, d => d.poverty) + 1])
          .range([0, chartWidth]);


      //CREATE AXIS FUNCTIONS
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      //APPEND AXES TO CHART
      //Bottom axis translated down to bottom of the chart, translate down y axis by chartHeight.
      chartGroup.append("g")
          .attr("transform", `translate(0, ${chartHeight})`)
          .call(bottomAxis);

      //leftAxis is placed on left, no translate required.
      chartGroup.append("g")
          .call(leftAxis);

      //Establish a color scale for plotting obesity data by color on the graph.
      var colorScale = d3.scaleLinear()
          .domain([d3.min(censusData, d => d.obesity), d3.mean(censusData, d => d.obesity), d3.max(censusData, d => d.obesity)])
          .range(["green", "yellow", "red"]);

      
      //tool_tip implementation per David Gotz's Example (https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7) 
      var tool_tip = d3.tip()
          .attr("class", "d3-tip")
          .offset([0,50])
          .html(function(d) { return `${d.state}<hr>$${d.income}<hr>Obesity Index: ${d.obesity}, Smoking Index: ${d.smokes}`});
          

      svg.call(tool_tip);



      //CREATE CIRCLES FOR PLOTTING
      var circleGroup = chartGroup.selectAll("circle")
          .data(censusData)
          .enter()

          circleGroup
          .append("circle")
          .attr("class", "circle")
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", d => ((d.income*d.income)/110000000))
          .attr( "fill", function(d) { return colorScale(d.obesity); })
          .attr("opacity", "0.7")
          .style("stroke", "black")

      //CREATE LABELS USING ABBREVIATIONS
          circleGroup
          .append("text")
          .text(function(d){
              return d.abbr;
          })
          .attr("x", d => xLinearScale(d.poverty) - 11)
          .attr("y", d => yLinearScale(d.healthcare) + 6)
      
          .on("click", tool_tip.show)
          .on("mouseout", tool_tip.hide)

      //Create Axes Labels
      //Y axis label
      chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left +15)
          .attr("x", 0 - (chartHeight / 2))
          .attr("class", "axisText")
          .text("Healthcare Index");

      //X axis label
      chartGroup.append("text")
          .attr("y", chartHeight + margin.top + 5)
          .attr("x", chartWidth / 2)
          .attr("class", "axisText")
          .text("Poverty Index");
          

  });

};

//call responsiveChart when page loads
responsiveChart();

//call makeResponsive when page is resized
d3.select(window).on("resize", responsiveChart);